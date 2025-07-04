:: filepath: c:\Users\issam\Downloads\PlantCare1\PlantCare\test-services.bat
@echo off
echo Starting ML service...
start /B python ml-service/app.py

echo Waiting for ML service to start...
timeout /t 5

echo Starting backend service...
start /B cd backend && npm start

echo Waiting for backend service to start...
timeout /t 5

echo Starting frontend service...
start /B cd frontend && npm run dev

echo All services started successfully!
echo ML service: http://localhost:5001
echo Backend service: http://localhost:3002
echo Frontend service: Check the frontend terminal for URL