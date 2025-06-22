from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import ingestion, qa
# from app.core.config import settings

app = FastAPI(
    title="Heritage Square AI API",
    description="API for interacting with the Heritage Square AI agent.",
    version="1.0.0"
)

# --- Update your CORS middleware section ---
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend-app-name.onrender.com",
    "https://codequesters-heritage-square-founda.vercel.app/",
    "https://codequestors.vercel.app/",
    "https://codequestors.vercel.app/",
    "https://codequestors-git-main-abhinav-usas-projects.vercel.app/",
    "https://codequestors-abhinav-usas-projects.vercel.app/",
    "https://codequestors-abhinav-usas-projects.vercel.app/",
    "https://codequestors-git-main-abhinav-usas-projects.vercel.app/"  # <-- Add your production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)
# --- End of CORS middleware section ---

# Include the ingestion router
app.include_router(
    ingestion.router,
    prefix="/api/v1/ingestion",
    tags=["Ingestion"]
)

# Include the QA router
app.include_router(
    qa.router,
    prefix="/api/v1/qa",
    tags=["Q&A"]
)

@app.get("/")
def read_root():
    return {"message": "Heritage Square AI API is running"}

# --- Add this new health check endpoint ---
@app.get("/health", status_code=200)
def health_check():
    """
    Simple health check endpoint for Render.
    """
    return {"status": "ok"}
