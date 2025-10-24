#!/bin/bash

echo "========================================"
echo "   Web Services Assignment Setup"
echo "========================================"
echo

echo "[1/4] Setting up RESTful Web Service..."
cd RESTful-web-service
if [ ! -d "node_modules" ]; then
    echo "Installing RESTful service dependencies..."
    npm install
else
    echo "RESTful service dependencies already installed."
fi
cd ..

echo
echo "[2/4] Setting up SOAP Web Service..."
cd SOAP-web-service
if [ ! -d "node_modules" ]; then
    echo "Installing SOAP service dependencies..."
    npm install
else
    echo "SOAP service dependencies already installed."
fi
cd ..

echo
echo "[3/4] Setting up environment variables..."
if [ ! -f "RESTful-web-service/.env" ]; then
    if [ -f "RESTful-web-service/env.example" ]; then
        echo "Copying environment example file..."
        cp RESTful-web-service/env.example RESTful-web-service/.env
        echo "Please edit RESTful-web-service/.env with your database configuration."
    fi
else
    echo "Environment file already exists."
fi

echo
echo "[4/4] Setup complete!"
echo
echo "========================================"
echo "   Next Steps:"
echo "========================================"
echo "1. Configure your database in RESTful-web-service/.env"
echo "2. Run database migrations: cd RESTful-web-service && npx prisma migrate dev"
echo "3. Start RESTful service: cd RESTful-web-service && npm run dev"
echo "4. Start SOAP service: cd SOAP-web-service && npm start"
echo "5. Import docs/postman-collection.json into Postman for testing"
echo
echo "========================================"
