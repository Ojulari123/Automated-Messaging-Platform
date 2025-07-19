import os
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
import asyncio
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from schemas import DummyUser
from tables import get_db, User, Dates

load_dotenv()
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username.ilike(username)).first()

async def auth_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_fake_user(user: DummyUser, db: Session = Depends(get_db)) -> User:
    existing_user = db.query(User).filter(User.username == user.username).all()
    if existing_user:
        return existing_user
    
    hashed_password = get_password_hash(user.password)
    add_dummy_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        username=user.username,
        password=hashed_password,
        dob=user.dob,
        role="admin",
        date=datetime.now()
        )
    db.add(add_dummy_user)
    db.commit()
    db.refresh(add_dummy_user)

    dummy_query = db.query(User).filter(User.username == user.username).first()
    return dummy_query