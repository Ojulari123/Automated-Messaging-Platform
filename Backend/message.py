from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from tables import User, Dates, get_db
from func import auth_current_user, role_checker
from schemas import MessagePreview, EventType, CustomMessage
from datetime import date
from typing import List
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()
message_router = APIRouter()

twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
if not all([twilio_sid, twilio_token, twilio_number]):
    raise RuntimeError("Twilio credentials not set in environment")

twilio_client = Client(twilio_sid, twilio_token)

@message_router.post("/write-message", response_model=List[MessagePreview])
async def generate_message(event_type: EventType, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    today = date.today()
    messages = []

    bday_query = db.query(User).filter(extract("month", User.dob)== today.month, extract("day", User.dob)== today.day).all()
    ann_query = db.query(Dates).filter(extract("month", Dates.date)== today.month, extract("day", Dates.date)== today.day).all()
    others_query = db.query(Dates).filter(Dates.label.notin_(["birthday", "anniversary"]), extract("month", Dates.date) == today.month, extract("day", Dates.date) == today.day).all()

    if not bday_query:
        raise HTTPException(status_code=404, detail="No user has a birthday today")
    
    if not ann_query:
        raise HTTPException(status_code=404, detail="No user has a anniversary today")
    
    if not others_query:
        raise HTTPException(status_code=404, detail="No user has an event today")

    if event_type == EventType.birthday:
        for user in bday_query:
            message=f"Happy Birthday, {user.first_name}! 🎉"
            phone = user.phone_number
            # Send using Twilio 
            # twilio_client.messages.create(
            #     body=message,
            #     from_=twilio_number,
            #     to=phone
            # )
            messages.append(MessagePreview(username=user.username, first_name=user.first_name, last_name=user.last_name, message=message, event_type=event_type))
    
    elif event_type == EventType.anniversary:
        for user in ann_query:
            message=f"Happy Anniversary, {user.user.first_name}! 🎉"
            phone = user.user.phone_number
            # Send using Twilio 
            # twilio_client.messages.create(
            #     body=message,
            #     from_=twilio_number,
            #     to=phone
            # )
            messages.append(MessagePreview(username=user.user.username, message=message, event_type=event_type))
    
    elif event_type == EventType.others:
        for user in others_query:
             message=f"Happy {user.label}, {user.user.first_name}! 🎉"
             phone = user.user.phone_number
            # Send using Twilio 
            # twilio_client.messages.create(
            #     body=message,
            #     from_=twilio_number,
            #     to=phone
            # )
             messages.append(MessagePreview(username=user.user.username, message=message, event_type=event_type))

    else:
       raise HTTPException(status_code=404, detail="No message template available for this event")

    return messages

@message_router.post("/custom-message", response_model=List[CustomMessage])
async def set_custom_message(custom_message_data: CustomMessage, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)

    today = date.today()
    recipients = []

    if custom_message_data.username:
        user = db.query(User).filter(User.username == custom_message_data.username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        recipients = [user]

    else:
        if custom_message_data.event_type == EventType.birthday:
            recipients = (db.query(User).filter( extract("month", User.dob) == today.month, extract("day", User.dob) == today.day).all())

        elif custom_message_data.event_type == EventType.anniversary:
            recipients = (db.query(Dates).filter(extract("month", Dates.date) == today.month, extract("day", Dates.date) == today.day, Dates.label == "anniversary").all())

        elif custom_message_data.event_type == EventType.others:
            recipients = (db.query(Dates).filter(extract("month", Dates.date) == today.month, extract("day", Dates.date) == today.day, Dates.label.notin_(["birthday", "anniversary"])).all())
    
        else:
                raise HTTPException(status_code=400, detail="Invalid event type, enter a valid event type (birthday, anniversary, others)")
        
    if not recipients:
        raise HTTPException(status_code=404, detail="No recipients found")
    
    custom_messages = []

    for custom_messages_recipient in recipients:
        if isinstance(custom_messages_recipient, User):
            phone = custom_messages_recipient.phone_number
            username = custom_messages_recipient.username
            first_name = custom_messages_recipient.first_name
        else:
            phone = custom_messages_recipient.user.phone_number
            username = custom_messages_recipient.user.username
            first_name = custom_messages_recipient.user.first_name

        # Send using Twilio 
            # twilio_client.messages.create(
            #     body=message_template.message,
            #     from_=twilio_number,
            #     to=phone
            # )
            
        custom_messages.append(
            {
                "username": username,
                "first_name": first_name,
                "phone_number": phone,
                "event_type": custom_message_data.event_type,
                "message": custom_message_data.message,
            }
        )

    return custom_messages
