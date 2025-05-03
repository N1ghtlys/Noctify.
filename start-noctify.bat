@echo off
echo ===================================
echo        Starting Noctify...
echo ===================================
echo.

:: Start the backend server in a new window
echo Starting backend server...
start "Noctify Backend" cmd /k "npm run start"

:: Wait a moment for the backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

:: Start the frontend in a new window
echo Starting frontend client...
start "Noctify Frontend" cmd /k "cd client && npm start"

echo.
echo ===================================
echo Noctify is starting up!
echo.
echo Backend server: http://localhost:3001
echo Frontend client: http://localhost:3000
echo.
echo Press any key to shut down all Noctify processes...
echo ===================================
echo.
pause > nul

:: Close all windows when user presses a key
echo Shutting down Noctify...
taskkill /FI "WINDOWTITLE eq Noctify Backend*" /F
taskkill /FI "WINDOWTITLE eq Noctify Frontend*" /F
echo Noctify has been shut down.
timeout /t 2 > nul 