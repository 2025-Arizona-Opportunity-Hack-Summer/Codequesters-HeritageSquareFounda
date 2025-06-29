import os
from fastapi import APIRouter, HTTPException, status
from celery.result import AsyncResult

from app.schemas.ingestion import IngestionRequest, IngestionResponse, JobStatus
from app.core.config import DATA_PATH
from app.tasks import run_ingestion_task # Import the new Celery task

router = APIRouter()

# The in-memory job_statuses dictionary is NO LONGER NEEDED.

@router.get("/check/{folder_id}", status_code=status.HTTP_200_OK, response_model=dict)
def check_ingestion_status(folder_id: str):
    """
    Checks if a vector store exists.
    TODO: This should now check for the final artifact in Google Cloud Storage.
    """
    # For now, we keep the local check. This will be replaced with a GCS check.
    vector_store_path = DATA_PATH / folder_id
    is_ingested = os.path.exists(vector_store_path)
    return {"is_ingested": is_ingested}


@router.post("/", status_code=status.HTTP_202_ACCEPTED, response_model=IngestionResponse)
def run_ingestion_endpoint(request: IngestionRequest):
    """
    Dispatches an ingestion task to the Celery queue.
    """
    drive_folder_id = request.drive_folder_id
    if not drive_folder_id or "PASTE" in drive_folder_id:
        raise HTTPException(status_code=400, detail="A valid drive_folder_id must be provided.")

    # Dispatch the task to Celery. '.delay()' is the magic command.
    task = run_ingestion_task.delay(drive_folder_id)
    
    return {
        "message": "Ingestion process has been queued.",
        "job_id": task.id  # Celery provides the job ID
    }

@router.get("/status/{job_id}", response_model=JobStatus)
def get_ingestion_status(job_id: str):
    """
    Retrieves the status of a Celery task.
    """
    task_result = AsyncResult(job_id, app=run_ingestion_task.app)
    
    if not task_result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    details = ""
    if task_result.info and isinstance(task_result.info, dict):
        details = task_result.info.get('details', '')

    return {
        "job_id": job_id,
        "status": task_result.state,
        "details": details,
    }