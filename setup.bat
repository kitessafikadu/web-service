@echo off
echo ========================================
echo    Web Services Assignment Setup
echo ========================================
echo.

echo [1/4] Setting up RESTful Web Service...
cd RESTful-web-service
if not exist node_modules (
    echo Installing RESTful service dependencies...
    npm install
) else (
    echo RESTful service dependencies already installed.
)
cd ..

echo.
echo [2/4] Setting up SOAP Web Service...
cd SOAP-web-service
if not exist node_modules (
    echo Installing SOAP service dependencies...
    npm install
) else (
    echo SOAP service dependencies already installed.
)
cd ..

echo.
echo [3/4] Setting up environment variables...
if not exist RESTful-web-service\.env (
    if exist RESTful-web-service\env.example (
        echo Copying environment example file...
        copy RESTful-web-service\env.example RESTful-web-service\.env
        echo Please edit RESTful-web-service\.env with your database configuration.
    )
) else (
    echo Environment file already exists.
)

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Configure your database in RESTful-web-service\.env
echo 2. Run database migrations: cd RESTful-web-service && npx prisma migrate dev
echo 3. Start RESTful service: cd RESTful-web-service && npm run dev
echo 4. Start SOAP service: cd SOAP-web-service && npm start
echo 5. Import docs/postman-collection.json into Postman for testing
echo.
echo ========================================
pause
