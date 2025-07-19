from datetime import date, datetime
from pydantic import BaseModel
from typing import Optional

class UserSignUpInfo(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    username: str
    password: str
    dob: date

class DummyUser(BaseModel):
    first_name: str = "ade"
    last_name: str = "ade"
    phone_number: str = "519-999-9999"
    username: str = "ade"
    password: str = "ade"
    dob: date = date(1999, 12, 1)
    profile_pic: Optional[bytes] = None