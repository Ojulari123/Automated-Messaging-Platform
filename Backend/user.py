from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from tables import User, Dates
from typing import List
from schemas import UserSignUpInfo, UserResponse, Token, TokenResponse, DummyUser, StatusEnum, DatesSchema
from func import auth_user, auth_current_user, get_db, get_password_hash, create_access_token, create_refresh_token, get_user_by_username, role_checker
from datetime import datetime,timedelta
from dotenv import load_dotenv
from typing import Optional
import os

user_router = APIRouter()

load_dotenv()
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


@user_router.post("/register-member", response_model=Token)
async def add_customer_info(user: UserSignUpInfo, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Existing username")
    password_hash = get_password_hash(user.password)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    user_details = User(
        first_name=user.first_name,
        last_name=user.last_name,
        dob=user.dob,
        username=user.username,
        password=password_hash,
        phone_number=user.phone_number,
        role="user",
        status=StatusEnum.pending.value,
        date=datetime.now()
    )
    if hasattr(user, "other_dates") and user.other_dates:
        for dates in user.other_dates:
            user_details.other_dates.append(Dates(label=dates.label, date=dates.date))

    db.add(user_details)
    db.commit()
    db.refresh(user_details)
    return {"access_token": access_token, "token_type": "bearer"}

@user_router.post("/register-admin", response_model=Token)
async def add_admin_profile(text: UserSignUpInfo, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if get_user_by_username(db, text.username):
        raise HTTPException(status_code=400, detail="Existing username")
    password_hash = get_password_hash(text.password)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": text.username}, expires_delta=access_token_expires)
    admin_profile = User(
        first_name=text.first_name,
        last_name=text.last_name,
        phone_number=text.phone_number,
        dob=text.dob,
        username=text.username,
        password=password_hash,
        role="admin",
        status=StatusEnum.active.value,
        date=datetime.now()
    )
    if hasattr(user, "other_dates") and user.other_dates:
        for dates in user.other_dates:
            admin_profile.other_dates.append(Dates(label=dates.label, date=dates.date))

    db.add(admin_profile)
    db.commit()
    db.refresh(admin_profile)
    return {"access_token": access_token, "token_type": "bearer"}

@user_router.post("/auth-login", response_model=TokenResponse)
async def sign_in(user: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_auth = await auth_user(db, user.username, user.password)
    if not user_auth:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(data={"sub": user_auth.username}, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": user_auth.username}, expires_delta=refresh_token_expires)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, expires_in=ACCESS_TOKEN_EXPIRE_MINUTES)

@user_router.post("/new-members/activate", response_model=UserResponse)
async def activate_user(user_id: Optional[int] = None, username: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if user_id:
        user_to_activate = db.query(User).filter(User.id == user_id).first()
    elif username:
        user_to_activate = db.query(User).filter(User.username == username).first()
    else:
        raise HTTPException(status_code=400, detail="Provide either user_id or username")
        
    if not user_to_activate:
        raise HTTPException(status_code=404, detail="User not found")

    if user_to_activate.status != StatusEnum.pending.value:
        raise HTTPException(status_code=400, detail="User is not pending")

    user_to_activate.status = "active"
    db.commit()
    db.refresh(user_to_activate)

    for date_entry in user_to_activate.other_dates:
            if date_entry.id is None: 
                date_entry.user_id = user_to_activate.id 
                db.add(date_entry)
    db.commit()
    return user_to_activate

@user_router.post("/new-members/activate-all", response_model=List[UserResponse])
async def activate_all_pending_users(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    activate_members = db.query(User).filter(User.status == StatusEnum.pending.value).all()
    if not activate_members:
        raise HTTPException(status_code=404, detail="No pending users found")
    
    for current_status in activate_members:
        current_status.status = StatusEnum.active.value
    db.commit()

    for user_obj in activate_members:
        for date_entry in user_obj.other_dates:
            if date_entry.id is None:  
                date_entry.user_id = user_obj.id
                db.add(date_entry)
    db.commit()

    for current_status in activate_members:
        db.refresh(current_status)

    return activate_members


@user_router.post("/new-members/reject")
async def reject_user(user_id: Optional[int] = None, username: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if user_id:
        reject_user = db.query(User).filter(User.id == user_id).first()
    elif username:
        reject_user = db.query(User).filter(User.username == username).first()
    else:
        raise HTTPException(status_code=400, detail="Provide either user_id or username")

    if not reject_user:
        raise HTTPException(status_code=404, detail="User not found")

    if reject_user.status != StatusEnum.pending.value:
        raise HTTPException(status_code=400, detail="User is not pending")

    db.delete(reject_user)
    db.commit()
    return {"detail": "User rejected and deleted successfully"}

@user_router.post("/admin-members/reject-all")
async def reject_all_pending_users(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    reject_all_users = db.query(User).filter(User.status == StatusEnum.pending.value).all()

    if not reject_all_users:
        raise HTTPException(status_code=404, detail="No pending users found")
    
    for user_rej in reject_all_users:
        db.delete(user_rej)

    db.commit()
    return  {"detail": "All pending users have been rejected and deleted successfully"}

@user_router.get("/view-dates-table", response_model=List[DatesSchema])
async def view_dates_table(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    view_dates_table = db.query(Dates).all()
    return view_dates_table

@user_router.get("/query-dates-table/{user_id}", response_model=List[DatesSchema])
async def query_dates_table(user_id: int, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if not user_id:
        raise HTTPException(status_code=404, detail="Enter a User ID")
    
    dates = db.query(Dates).filter(Dates.user_id == user_id).all()
    if not dates:
        raise HTTPException(status_code=404, detail="No event(s) on this date for this User ID")
    return dates

@user_router.get("/retrieve-all-admin-members", response_model=List[UserResponse])
async def retrieve_all_admin_members(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    admin_members_list = db.query(User).filter(User.role=="admin").all()
    return admin_members_list

@user_router.get("/retrieve-admin-member/{user}", response_model=UserResponse)
async def retrieve_admin_member(user_id: Optional[int] = None, username: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if user_id:
        admin_member = db.query(User).filter(User.id == user_id).first()
    elif username:
        admin_member = db.query(User).filter(User.username == username).first()
    else:
        raise HTTPException(status_code=404, detail="Provide either user_id or username")

    if not admin_member:
        raise HTTPException(status_code=404, detail="User not found")
    
    return admin_member
    
@user_router.get("/update-members-role", response_model=UserResponse)
async def update_members_role(
    user_id: Optional[int] = None,
    username: Optional[str] = None,
    user_role: str = None,
    db: Session = Depends(get_db),
    user: User = Depends(auth_current_user)
):
    await role_checker(required_role="admin", user=user)

    if not user_id and not username:
        raise HTTPException(status_code=400, detail="Provide either user_id or username")

    if user_id:
        user_query = db.query(User).filter(User.id == user_id).first()
    elif username:
        user_query = db.query(User).filter(User.username == username).first()

    if not user_query:
        raise HTTPException(status_code=404, detail="User not found")

    if user_query.status == StatusEnum.pending.value:
        raise HTTPException(status_code=400, detail="User has to be active before being eligible to change roles")

    if user_query.role == user_role:
        raise HTTPException(status_code=400, detail="User already has this role")

    if user_role not in ("admin", "user"):
        raise HTTPException(status_code=400, detail="Invalid role: must be 'admin' or 'user'")

    user_query.role = user_role
    db.commit()
    db.refresh(user_query)

    return user_query

@user_router.get("/retrieve-members-details", response_model=List[UserResponse])
async def retrieve_customer_details(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    customer_details_list = db.query(User).filter(User.role == "user", User.status == "active").all()
    return customer_details_list

@user_router.get("/retrieve-specific-member-details", response_model=UserResponse)
async def retrieve_specific_customer_details(user_id: Optional[int] = None, username: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if user_id:
        user_query = db.query(User).filter(User.id == user_id, User.status == "active").first()
    elif username:
        user_query = db.query(User).filter(User.username == username, User.status == "active").first()
    else:
        raise HTTPException(status_code=400, detail="Provide either user_id or username")

    if not user_query:
        raise HTTPException(status_code=404, detail="User not found / User not activated")

    return user_query

@user_router.get("/retrieve-pending-members", response_model=List[UserResponse])
async def retrieve_pending_members(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    pending_member_query = db.query(User).filter(User.status == StatusEnum.pending.value).all()
    if not pending_member_query:
        raise HTTPException(status_code=404, detail="No pending users")
    return pending_member_query

@user_router.delete("/delete-a-member")
async def delete_member(user_id: Optional[int] = None, username: Optional[str] = None, db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    if user_id:
        delete_user_query = db.query(User).filter(User.id == user_id).first()
    elif username:
       delete_user_query = db.query(User).filter(User.username == username).first()
    else:
        raise HTTPException(status_code=400, detail="Provide either user_id or username")
    
    if not delete_user_query:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(delete_user_query)
    db.commit()
    return {"detail": "Member has been deleted"}

@user_router.delete("/delete-all-members")
async def delete_all_members(db: Session = Depends(get_db), user: User = Depends(auth_current_user)):
    await role_checker(required_role="admin", user=user)
    
    all_users = db.query(User).all()
    for users in all_users:
        db.delete(users) 

    db.commit()
    return {"detail": "All members have been deleted :("}