# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Set environment variables to prevent Python from writing .pyc files and to buffer output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies required by the Python packages
# tesseract-ocr is needed for OCR capabilities in 'unstructured'
RUN apt-get update && apt-get install -y tesseract-ocr && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# First, copy only the requirements file to leverage Docker layer caching
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The default command will be overridden in docker-compose, but this is a good default.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]