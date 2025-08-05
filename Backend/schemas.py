from datetime import date, datetime
from typing import List
from enum import Enum
from pydantic import BaseModel
from typing import Optional

class OtherDateBase(BaseModel):
    label: str
    date: date

class UserSignUpInfo(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    username: str
    password: str
    dob:date
    profile_pic: Optional[str] = None
    other_dates: Optional[List[OtherDateBase]] = []  

class StatusEnum(str, Enum):
    pending = "pending"
    active = "active"

class UserResponse(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    username: str
    dob: date
    status: StatusEnum
   
    model_config = {
        "arbitrary_types_allowed": True,
        "from_attributes": True,  
    }

class DummyUser(BaseModel):
    first_name: str = "ade"
    last_name: str = "ade"
    phone_number: str = "519-999-9999"
    username: str = "ade"
    password: str = "ade"
    dob: date = date(1999, 12, 1)
    status: StatusEnum = StatusEnum.pending
    profile_pic: Optional[bytes] = None
    other_dates: Optional[List[OtherDateBase]] = [
        OtherDateBase(label="anniversary", date=date(2018, 10, 19)),
        OtherDateBase(label="graduation", date=date(2022, 6, 5)),
        OtherDateBase(label="custom", date=date(2023, 9, 1)),
    ]

class SignIn(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int

class EventType(str, Enum):
    birthday = "birthday"
    anniversary = "anniversary"
    others = "others"
    custom = "custom"

class MessagePreview(BaseModel):
    username: str
    message: str
    event_type: EventType

class DatesSchema(BaseModel):
    id: int
    user_id: int
    label: str
    date: date

    class Config:
        orm_mode = True

class CustomMessage(BaseModel):
    username: Optional[str] = None
    event_type: EventType
    message: str