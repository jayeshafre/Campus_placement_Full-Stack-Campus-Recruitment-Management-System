@echo off
title Campus Placement Project Runner

echo Starting Backend Server...
cd /d C:\Users\jayesh\Desktop\campus_placement\backend

:: Activate virtual environment (if not auto)
call venv\Scripts\activate

start cmd /k "echo Backend Running... && python manage.py runserver"

echo Starting Frontend Server...
cd /d C:\Users\jayesh\Desktop\campus_placement\frontend

start cmd /k "echo Frontend Running... && npm start"

echo.
echo Both servers started successfully 🚀
pause