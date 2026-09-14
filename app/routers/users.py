from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db

from sqlalchemy import select
from app.models import User, WidgetPreference

from app.schemas import UserCreate, UserResponse

from app.auth import password_hash

router = APIRouter(prefix="/users")


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=password_hash.hash(user.password)
    )

    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered")
    db.refresh(new_user)

    weather_preference = WidgetPreference(user_id=new_user.id, widget_name="weather", config={"city": "New York"})
    github_preference = WidgetPreference(user_id=new_user.id, widget_name="github", config={"username": ""})

    db.add(weather_preference)
    db.add(github_preference)
    db.commit()

    return new_user

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    statement = select(User)
    results = db.execute(statement)
    users = results.scalars().all()

    return users