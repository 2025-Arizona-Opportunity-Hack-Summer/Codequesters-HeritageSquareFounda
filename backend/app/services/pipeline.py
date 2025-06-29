import time
from datetime import datetime
from typing import Callable

from app.services.drive import get_drive_service, download_files_from_folder
from app.services.documents import sync_and_update_vector_store
from app.core.config import DATA_PATH

# The pipeline now accepts a progress_callback function
def run_ingestion_pipeline(drive_folder_id: str, progress_callback: Callable):
    """
    The main ingestion pipeline, now with progress reporting.
    """
    try:
        # --- Step 1: Initialization ---
        progress_callback("INITIALIZING", f"Starting ingestion for folder: {drive_folder_id}")

        # Create dynamic paths
        source_docs_path = DATA_PATH / drive_folder_id / "source_docs"
        vector_store_path = DATA_PATH / drive_folder_id / "vector_store"

        start_time = datetime.utcnow()

        # --- Step 2: Syncing and Updating ---
        progress_callback("SYNCING", "Syncing with Google Drive and updating vector store...")
        
        # --- USE THE ORIGINAL, WORKING LOGIC ---
        drive_service = get_drive_service()
        drive_files = download_files_from_folder(drive_service, drive_folder_id, source_docs_path)
        sync_and_update_vector_store(drive_folder_id, drive_files)

        # --- Step 3: Upload to GCS (New) ---
        progress_callback("UPLOADING", "Uploading vector store to Google Cloud Storage...")
        # TODO: Add logic here to upload the contents of vector_store_path to GCS.
        # For example: upload_folder_to_gcs(vector_store_path, f"{drive_folder_id}/vector_store")

        end_time = datetime.utcnow()
        total_time = (end_time - start_time).total_seconds()
        progress_callback("COMPLETE", "Pipeline finished successfully.")
        print(f"\n--- Ingestion Pipeline Complete ---")

    except Exception as e:
        end_time = datetime.utcnow()
        total_time = (end_time - start_time).total_seconds()
        print(f"--- ERROR in Ingestion Pipeline ---")
        print(str(e))
        progress_callback("FAILURE", str(e))
        raise
