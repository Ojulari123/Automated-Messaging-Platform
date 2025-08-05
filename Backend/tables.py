from sqlalchemy import create_engine, Column, Integer, String, LargeBinary, Date, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from schemas import StatusEnum
from dotenv import load_dotenv

load_dotenv()

AMS_USER=os.getenv("AMS_USER")
AMS_PASSWORD=os.getenv("AMS_PASSWORD")
AMS_DB=os.getenv("AMS_DB")
AMS_HOST=os.getenv("AMS_HOST")
AMS_PORT = os.getenv("AMS_PORT", "5434")

db_url = f"postgresql://{AMS_USER}:{AMS_PASSWORD}@{AMS_HOST}:{AMS_PORT}/{AMS_DB}"

engine = create_engine(db_url)
Local_Session = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "user_info"
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(256),nullable=False)
    last_name = Column(String(256))
    phone_number = Column(String(15), nullable=False)
    username = Column(String(256), unique=True)
    password = Column(String(256), nullable=False)
    dob = Column(Date)
    profile_pic = Column(LargeBinary,nullable=True)
    role = Column(String(50), default="user")
    status = Column(Enum(StatusEnum), default=StatusEnum.pending, nullable=False)
    date = Column(DateTime, default=datetime.now)

    other_dates = relationship("Dates", back_populates="user", cascade="all, delete-orphan")

class Dates(Base):
    __tablename__ = "other_dates"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_info.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(256), nullable=False)  
    date = Column(Date, nullable=False)

    user = relationship("User", back_populates="other_dates")


Base.metadata.create_all(engine)

def get_db():
    db = Local_Session()
    try:
        yield db
    finally:
        db.close()