Write-Host "Starting PlantCare services..."

# Start ML Service in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
"cd ml-service; `
python -m venv venv; `
.\venv\Scripts\Activate.ps1; `
pip install -r requirements.txt; `
python app.py"

# Wait a moment to let the ML service start
Start-Sleep -Seconds 5

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
"cd frontend; `
npm install; `
npm run dev"

Write-Host "Services are starting. Please wait..."
Write-Host "ML Service: http://localhost:5001"
Write-Host "Frontend: http://localhost:3000 (or the URL shown in the frontend terminal)"