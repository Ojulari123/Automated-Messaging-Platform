from fastapi import FastAPI, WebSocket, Request, WebSocketDisconnect
from contextlib import asynccontextmanager
from fastapi.responses import HTMLResponse
import asyncio
from dataclasses import dataclass
from user import user_router
from schemas import DummyUser
from tables import get_db, User, Dates
from func import create_fake_user

dummy_user_data = DummyUser()

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db()) 
    create_fake_user(dummy_user_data, db)
    
    yield  
    
    dummy_query = db.query(User).filter(User.username == dummy_user_data.username).first()
    if dummy_query:
        db.delete(dummy_query)
        db.commit()
    

app = FastAPI(lifespan=lifespan)

@dataclass
class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections: 
            await connection.send_text(message)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

connection_manager = ConnectionManager()

app.include_router(user_router, prefix="/user", tags=["User"])