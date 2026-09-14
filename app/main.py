from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from app.routers import users
from app.routers import dashboard
from app.routers.auth import router as auth_router
from app.routers.widgets import weather, github
#news, stocks, crypto, calendar, tasks


app = FastAPI()
app.include_router(dashboard.router)
app.include_router(weather.router)
app.include_router(users.router)
app.include_router(auth_router)
app.include_router(github.router)

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(request=request, name="login.html")

@app.get("/signup")
def signup_page(request: Request):
    return templates.TemplateResponse(request=request, name="signup.html")

@app.get("/dashboard-page")
def dashboard_page(request: Request):
    return templates.TemplateResponse(request=request, name="dashboard.html")


@app.get("/")
def title():
    return {"message": "Personal Widget Dashboard API"}

@app.get("/health")
def status():
    return {"status": "OK"}