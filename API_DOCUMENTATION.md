# HealthAI API Documentation

## Overview
HealthAI provides AI-powered health assistance and prescription analysis through a FastAPI backend.

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Health Check
**GET** `/`
- **Description**: Basic health check endpoint
- **Response**: 
```json
{
  "message": "Welcome to HealthAI - Your AI Health Assistant"
}
```

### 2. API Health Check
**GET** `/api/health`
- **Description**: API service health check
- **Response**:
```json
{
  "status": "healthy",
  "service": "HealthAI API"
}
```

### 3. Chat with Assistant
**POST** `/api/assistant/chat`
- **Description**: Chat with the AI health assistant
- **Request Body**:
```json
{
  "message": "What are the side effects of aspirin?"
}
```
- **Response**:
```json
{
  "response": "Aspirin can cause several side effects including...",
  "status": "success"
}
```
- **Error Response**:
```json
{
  "detail": "Assistant error: [error message]"
}
```

### 4. Analyze Prescription
**POST** `/api/prescription/analyze`
- **Description**: Analyze prescription image using OCR and AI
- **Request**: Multipart form data with image file
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (image file)
- **Supported Formats**: JPEG, PNG, GIF, BMP
- **Response**:
```json
{
  "analysis": "Prescription Analysis:\n\nMedications Found:\n1. Medication Name - Dosage - Instructions\n...",
  "status": "success"
}
```
- **Error Response**:
```json
{
  "detail": "Prescription analysis error: [error message]"
}
```

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid file type, missing parameters)
- `500`: Internal Server Error (AI processing errors)

## CORS Configuration
The API allows requests from:
- `http://localhost:5173` (Frontend development server)

## Dependencies
- FastAPI
- Uvicorn
- Custom HealthCare agents (Assistant_Agent, PrescriptionAgent)
- Image processing and OCR capabilities
- LangChain and Groq integration

## Usage Examples

### Using curl for Assistant Chat:
```bash
curl -X POST "http://localhost:8000/api/assistant/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "What should I do for a headache?"}'
```

### Using curl for Prescription Analysis:
```bash
curl -X POST "http://localhost:8000/api/prescription/analyze" \
     -F "file=@prescription.jpg"
```

## Frontend Integration
The React frontend automatically connects to these endpoints:
- Assistant page uses `/api/assistant/chat`
- Prescription page uses `/api/prescription/analyze`