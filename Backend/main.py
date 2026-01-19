from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import tempfile
from typing import Optional

from HealthCare.agent.Assistant import Assistant_Agent
from HealthCare.agent.PrescriptionAgent import PrescriptionAgent
from HealthCare.exception.HealthAI import HealthAIException
import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging
import json

app = FastAPI(title="HealthAI API", description="AI-powered health assistant and prescription analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents lazily
assistant_agent = None
prescription_agent = None

def get_assistant_agent():
    global assistant_agent
    if assistant_agent is None:
        assistant_agent = Assistant_Agent()
    return assistant_agent

def get_prescription_agent():
    global prescription_agent
    if prescription_agent is None:
        prescription_agent = PrescriptionAgent()
    return prescription_agent

# Pydantic models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

class PrescriptionResponse(BaseModel):
    analysis: str
    status: str = "success"
    
def output_formatter(raw:str):
    """Format the agent response for display"""
    med_message = ""
    try:
        logging.info(f"Raw response to format: {raw[:200]}...")
        
        if not raw or raw.strip() == "":
            return "Error: Empty response from AI model"
        
        # Clean up markdown formatting
        if raw.startswith("```") and raw.endswith("```"):
            raw = raw.strip()
            raw = raw[3:-3].strip()
            if raw.startswith("json"):
                raw = raw.replace("json","",1)
        
        data = json.loads(raw)
        for i, med in enumerate(data.get('medications', []), 1):
            # Get medicine name with confidence indicator
            med_name = med.get('medicine_name', med.get('name', 'Unknown'))
            name_confidence = med.get('name_confidence', '')
            
            # Add verification indicator
            if name_confidence == 'UNVERIFIED':
                med_name += " ⚠️ (Unverified)"
            elif name_confidence == 'LOW':
                med_name += " ⚡ (Low Confidence)"
            
            med_message += f"*{i}. {med_name}*\n\n"
            
            # Show original OCR name if different
            original_name = med.get('original_ocr_name', '')
            if original_name and original_name != med.get('medicine_name', ''):
                med_message += f"📝 *OCR Text:* {original_name}\n"
            
            # Dosage and frequency (support both old and new field names)
            dosage = med.get('dosage_strength', med.get('dosage', 'Not specified'))
            frequency = med.get('frequency_per_day', med.get('frequency', 'Not specified'))
            duration = med.get('duration', 'Not specified')
            
            med_message += f"💊 *Dosage:* {dosage}\n"
            med_message += f"⏰ *Frequency:* {frequency}\n"
            med_message += f"📅 *Duration:* {duration}\n\n"
            
            # Usage instructions (new field)
            usage = med.get('usage_instructions', '')
            if usage and usage != 'UNKNOWN':
                med_message += f"📋 *How to Take:*\n{usage}\n\n"
            
            # Food guidance and interactions
            food_guidance = med.get('food_guidance', '')
            if food_guidance and food_guidance != 'UNKNOWN':
                med_message += f"🍽️ *Food Guidance:* {food_guidance}\n"
            
            food_interactions = med.get('food_interactions', 'No specific instructions')
            if food_interactions != 'No specific instructions':
                med_message += f"🍽️ *Food Instructions:*\n{food_interactions}\n\n"
            
            # Recommendations
            recommendations = med.get('recommendations', 'No additional notes')
            if recommendations != 'No additional notes':
                med_message += f"⚠️ *Important Notes:*\n{recommendations}\n\n"
            
            med_message += "----------------------------------------------\n\n"
    except Exception as e:
        med_message = f"Error formatting response: {e}"
        logging.error(med_message)
        raise HealthAIException(med_message,sys)
    print(med_message)
    return med_message

@app.get("/")
def root():
    return {"message": "Welcome to HealthAI - Your AI Health Assistant"}

@app.post("/api/assistant/chat", response_model=ChatResponse)
async def chat_with_assistant(message: ChatMessage):
    """Chat with the AI health assistant"""
    try:
        logging.info(f"Received chat message: {message.message[:50]}...")
        agent = get_assistant_agent()
        response = agent.run(message.message)
        logging.info("Chat response generated successfully")
        return ChatResponse(response=response)
    except HealthAIException as e:
        import traceback
        error_detail = f"Assistant error: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_detail)
        print(error_detail)  # Print to stdout for Docker logs
        raise HTTPException(status_code=500, detail=f"Assistant error: {str(e)}")
    except Exception as e:
        import traceback
        error_detail = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_detail)
        print(error_detail)  # Print to stdout for Docker logs
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/prescription/analyze", response_model=PrescriptionResponse)
async def analyze_prescription(file: UploadFile = File(...)):
    """Analyze prescription image using OCR and AI"""
    try:
        logging.info(f"Received prescription file: {file.filename}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Only image files are supported")
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        logging.info(f"Temp file created: {temp_file_path}")
        
        try:
            # Process prescription
            agent = get_prescription_agent()
            logging.info("Starting prescription analysis...")
            analysis = agent.invoke(temp_file_path)
            analysis = output_formatter(analysis)
            logging.info("Prescription analysis completed successfully")
            return PrescriptionResponse(analysis=analysis)
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HealthAIException as e:
        import traceback
        error_detail = f"Prescription analysis error: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_detail)
        print(error_detail)  # Print to stdout for Docker logs
        raise HTTPException(status_code=500, detail=f"Prescription analysis error: {str(e)}")
    except Exception as e:
        import traceback
        error_detail = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_detail)
        print(error_detail)  # Print to stdout for Docker logs
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "HealthAI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

