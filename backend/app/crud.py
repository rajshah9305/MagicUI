from sqlalchemy.orm import Session
from . import models
import uuid

def get_chat_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ChatMessage).offset(skip).limit(limit).all()

def create_chat_message(db: Session, message: models.ChatMessageCreate):
    db_message = models.ChatMessage(
        id=str(uuid.uuid4()),
        **message.dict()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
