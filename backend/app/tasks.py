import os
from celery import Celery
from app.services.pipeline import run_ingestion_pipeline

# Configure Celery. In production, these URLs should come from environment variables.
# The broker is for sending tasks, the backend is for storing results/status.
celery_app = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
)

# This tells Celery to automatically look for tasks in this module.
celery_app.autodiscover_tasks()

@celery_app.task(bind=True, name="run_ingestion_task")
def run_ingestion_task(self, drive_folder_id: str):
    """
    Celery task that runs the full ingestion pipeline.
    The 'bind=True' allows us to access the task instance (`self`) to update its state.
    """
    # This callback function will be passed down to the pipeline
    # so it can report its progress back to Celery.
    def update_progress(status: str, details: str):
        self.update_state(state=status, meta={'details': details})

    # We pass the callback function to the pipeline runner.
    # The pipeline will call this function at each major step.
    run_ingestion_pipeline(drive_folder_id, update_progress)

    return {"details": "Ingestion completed successfully."}