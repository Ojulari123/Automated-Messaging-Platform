from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional


class UserSignUpInfo(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    username: str
    password: str
    dob:date
    profile_pic: Optional[str] = None

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
        "from_attributes": True,  # This replaces orm_mode in Pydantic v2
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