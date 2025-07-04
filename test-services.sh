#!/bin/bash

echo "Starting ML service..."
cd ml-service
python app.py > ml-service.log 2>&1 &
ML_PID=$!

echo "Waiting for ML service to start..."
sleep 5

echo "Starting backend service..."
cd ../backend
npm start > backend.log 2>&1 &
BACKEND_PID=$!

echo "Waiting for backend service to start..."
sleep 5

echo "Starting frontend service..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "All services started successfully!"
echo "ML service: http://localhost:5001 (PID: $ML_PID)"
echo "Backend service: http://localhost:3002 (PID: $BACKEND_PID)"
echo "Frontend service: Check the frontend.log file for URL (PID: $FRONTEND_PID)"
echo
echo "To stop all services, run: kill $ML_PID $BACKEND_PID $FRONTEND_PID"
echo "Or use: pkill -f 'python app.py|npm start|npm run dev'" 