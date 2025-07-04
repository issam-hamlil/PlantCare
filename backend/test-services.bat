@echo off
echo Starting ML service...
cd ..\ml-service
start /B python app.py

echo Waiting for ML service to start...
timeout /t 10

echo Running tests...
cd ..\backend
npx jest mlService.test.js

echo Stopping ML service...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /F /PID %%a