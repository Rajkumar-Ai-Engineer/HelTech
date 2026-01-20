import os 
from twilio.rest import Client 
from twilio.twiml.messaging_response import MessagingResponse
import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging
import requests
from flask import Flask,request,Response
from PIL import Image 
from io import BytesIO 
import json


from dotenv import load_dotenv
load_dotenv()

sys.path.append('c:\\Hackathons\\Thiagarajar\\main')
from HealthCare.agent.PrescriptionAgent import PrescriptionAgent
from HealthCare.agent.Assistant import Assistant_Agent 
from HealthCare.llm import llm_client
from langchain_core.messages import SystemMessage,HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

template = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant,You role is to summarize the response whatever feeds to you,Note that is medical data ,so give accurate and characters must be less than 1600"),
            ("human", "The user input:{input}")
        ]
    ) 
parser = StrOutputParser()

llm = llm_client(model_name="llama-3.3-70b-versatile")
model = template | llm | parser
def summarize_response(raw_response):
    try:
        response = model.invoke({"input": raw_response})
        return response
    except Exception as e:
        logging.error(f"error occured:{e}")
        raise HealthAIException(e,sys)

account_sid = os.environ.get("Twilio_account_sid")
auth_token = os.environ.get("Twilio_auth_token")

if not account_sid or not auth_token:
    logging.error("Twilio credientials Missing")
    raise HealthAIException("Twilio Credientials missing",sys)

app = Flask(__name__)

client = Client(account_sid,auth_token)

try:
    prescription_agent = PrescriptionAgent() 
    Assistant_agent = Assistant_Agent()
    logging.info("Agents Initialized")
except Exception as e:
    logging.error("Agents initilization Failed")
    raise HealthAIException(e,sys)

def send_prescription_response(to_number, message_text):
    """Send WhatsApp message via Twilio"""
    message = client.messages.create(
        from_="whatsapp:+14155238886",
        to=f"whatsapp:{to_number}",
        body=message_text
    )
    return message.sid

@app.route("/Whatsapp",methods=["POST"])
def whatsapp_webhook():
    """Handle Incoming Whatsapp message"""
    try:
        from_number = request.values.get("From","").replace("whatsapp:","")
        incoming_message = request.values.get("Body","").strip()
        media_url = request.values.get("MediaUrl0")
        
        logging.info(f"Received message from {from_number}: {incoming_message}")
        logging.info(f"Media URL: {media_url}")
        
        if media_url and incoming_message:
            response_text = not_neccessary(incoming_message)
            resp = MessagingResponse()
            resp.message(response_text)
            logging.info(f"Sending text response: {response_text}")
            return Response(str(resp), mimetype='text/xml') 
        elif media_url:
            send_prescription_messages(media_url, from_number)
            return Response('<Response></Response>', mimetype='text/xml')
        else:
            response_text = send_assistant_response(incoming_message,from_number)
            return Response('<Response></Response>', mimetype='text/xml')
    except Exception as e:
        logging.error(f"Error in webhook: {e}")
        resp = MessagingResponse()
        resp.message("Sorry, there was an error processing your request.")
        return Response(str(resp), mimetype='text/xml')
    
def output_formatter(raw:json):
    """Format the agent response for display"""
    med_message = ""
    try:
        if raw.startswith("```") and raw.endswith("```"):
            raw = raw.strip()
            raw = raw[3:-3].strip()
            if raw.startswith("json"):
                raw = raw.replace("json","",1)
        data = json.loads(raw)
        for i, med in enumerate(data.get('medications', []), 1):
            med_message += f"*{i}. {med.get('name', 'Unknown')}*\n\n"
            med_message += f"💊 *Dosage:* {med.get('dosage', 'Not specified')}\n"
            med_message += f"⏰ *Frequency:* {med.get('frequency', 'Not specified')}\n"
            med_message += f"📅 *Duration:* {med.get('duration', 'Not specified')}\n\n"
            med_message += f"🍽️ *Food Instructions:*\n{med.get('food_interactions', 'No specific instructions')}\n\n"
            med_message += f"⚠️ *Important Notes:*\n{med.get('recommendations', 'No additional notes')}\n\n"
            med_message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    except Exception as e:
        med_message = f"Error formatting response: {e}"
        logging.error(med_message)
        raise HealthAIException(med_message,sys)
    print(med_message)
    return med_message

def send_assistant_response(incoming_message, to_number):
    """Generate and send assistant response"""
    try:
        if not Assistant_agent:
            logging.error("AssistantAgent not available")
            client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{to_number}",
            body="Sorry, the assistant service is currently unavailable."
        )
            return 
        
        if any(word in incoming_message.lower() for word in ["hi","hello","hey","greetings"]):
            greeting = "Hello! I'm  Sirax Assistant. How can I assist you today regarding Medical ?"
            client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{to_number}",
            body=greeting
            )
            return 
        
        else:
            response = Assistant_agent.run(incoming_message)
            response = summarize_response(raw_response=response)
            logging.info(f"Assistant response: {response}")
            client.messages.create(
                from_="whatsapp:+14155238886",
                to=f"whatsapp:{to_number}",
                body=response
            )
           
            return response
            
    except Exception as e:
        logging.error(f"Error in send_assistant_response: {e}")
        raise HealthAIException(e,sys)

def send_prescription_messages(media_url,to_number):
    """Send multiple messages for each medication"""
    try:
        logging.info(f"Processing prescription image from {media_url}")
        
        if not prescription_agent:
            logging.error("PrescriptionAgent not available")
            client.messages.create(
                from_="whatsapp:+14155238886",
                to=f"whatsapp:{to_number}",
                body="Sorry, the prescription analysis service is currently unavailable."
            )
            return
        auth = (account_sid,auth_token)
        response = requests.get(media_url,auth=auth)
        response.raise_for_status()
        
        temp_path = "temp_prescription_img.png"
        with open(temp_path,"wb") as f:
            f.write(response.content)
        logging.info("Image Downloaded")
        
        result = prescription_agent.invoke(image_path=temp_path)
        logging.info(f"Agent Result:{result}")
        
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        if not result:
            logging.warning("No result from Prescription agent")
            client.messages.create(
                from_="whatsapp:+14155238886",
                to=f"whatsapp:{to_number}",
                body="Unable to analyze the prescription image. Please ensure the image is clear and try again."
            )
            return
        
        client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{to_number}",
            body="🏥 *Prescription Analysis Complete*\n\nSending details for each medication.."
            )
        logging.info(result)
        medical_message = output_formatter(result)
        client.messages.create(
            from_="whatsapp:+14155238886",
            to=f"whatsapp:{to_number}",
            body=medical_message
        )
        
    except Exception as e:
        logging.error(f"Error in send_prescription_messages: {e}")
        raise HealthAIException(e,sys)
    
    
def not_neccessary(message):
    """Handle text queries"""
    return "No Need to send both message and image together, Please send only image or only text, Thank you!"


if __name__ == "__main__":
    app.run(port=3000, debug=True, use_reloader=False)


    
    







