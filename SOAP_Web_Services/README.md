# 🌍 Professional Currency Converter SOAP Service

A modern, professional-grade SOAP and REST API for currency conversion with comprehensive features, validation, and testing capabilities.

## 🚀 Features

### ✨ Core Features
- **SOAP Web Service** with comprehensive WSDL
- **REST API** for modern integration
- **100+ Currency Support** including major and minor currencies
- **Real-time Exchange Rates** with USD as base currency
- **Conversion History** tracking and analytics
- **Input Validation** with detailed error messages
- **Performance Monitoring** with processing time tracking
- **Comprehensive Logging** for debugging and monitoring

### 🔧 Technical Features
- **Modern Node.js** with Express.js framework
- **Prisma ORM** with SQLite database
- **SOAP 1.1/1.2** compliant service
- **RESTful API** design
- **CORS Support** for cross-origin requests
- **Error Handling** with proper HTTP status codes
- **Request/Response Logging** for monitoring
- **Graceful Shutdown** handling

## 📋 API Operations

### SOAP Operations
1. **ConvertCurrency** - Convert between currencies
2. **GetAllCurrencies** - Get all available currencies
3. **UpdateExchangeRate** - Update currency exchange rates
4. **GetConversionHistory** - Get conversion history with filtering
5. **GetCurrencyRate** - Get specific currency rate
6. **GetCurrencyStatistics** - Get usage statistics
7. **ValidateCurrencyCode** - Validate currency codes
8. **GetSupportedCurrencies** - Get list of supported currencies

### REST Endpoints
- `GET /health` - Health check
- `GET /wsdl` - WSDL document
- `GET /api/currencies` - Get all currencies
- `POST /api/convert` - Convert currency
- `PUT /api/currencies/:code/rate` - Update exchange rate
- `GET /api/conversions` - Get conversion history
- `GET /api/statistics` - Get statistics
- `GET /api/validate/:code` - Validate currency code
- `GET /api/supported` - Get supported currencies
- `GET /api/docs` - API documentation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd SOAP_Web_Services
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Create Database Tables**
   ```bash
   npx prisma db push
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Import the collection: `postman/Currency_Converter_SOAP_Service.postman_collection.json`
3. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `soapUrl`: `http://localhost:3000/wsdl`

### Test Scenarios

#### SOAP Testing
- **Convert Currency**: Test basic conversion
- **Large Amount Conversion**: Test with large amounts
- **Same Currency**: Test same currency conversion
- **Invalid Currency**: Test error handling
- **Missing Parameters**: Test validation
- **All Operations**: Test all 8 SOAP operations

#### REST Testing
- **All Endpoints**: Test all REST endpoints
- **Error Scenarios**: Test various error conditions
- **Validation**: Test input validation

## 📊 Sample Requests & Responses

### SOAP Request - Convert Currency
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cc="http://currency-converter.com/types">
  <soap:Header/>
  <soap:Body>
    <cc:ConvertCurrencyRequest>
      <cc:fromCurrency>USD</cc:fromCurrency>
      <cc:toCurrency>EUR</cc:toCurrency>
      <cc:amount>100</cc:amount>
    </cc:ConvertCurrencyRequest>
  </soap:Body>
</soap:Envelope>
```

### SOAP Response
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConvertCurrencyResponse>
      <ConversionResult>
        <success>true</success>
        <fromCurrency>USD</fromCurrency>
        <toCurrency>EUR</toCurrency>
        <amount>100</amount>
        <convertedAmount>85.0</convertedAmount>
        <exchangeRate>0.85</exchangeRate>
        <timestamp>2024-01-15T10:30:00.000Z</timestamp>
        <processingTimeMs>15</processingTimeMs>
        <fromCurrencyName>US Dollar</fromCurrencyName>
        <toCurrencyName>Euro</toCurrencyName>
        <message>Successfully converted 100 USD to 85.0 EUR</message>
      </ConversionResult>
    </ConvertCurrencyResponse>
  </soap:Body>
</soap:Envelope>
```

### REST Request - Convert Currency
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "fromCurrency": "USD",
    "toCurrency": "EUR", 
    "amount": 100
  }'
```

### REST Response
```json
{
  "success": true,
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "amount": 100,
  "convertedAmount": 85.0,
  "exchangeRate": 0.85,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "processingTimeMs": 15,
  "fromCurrencyName": "US Dollar",
  "toCurrencyName": "Euro",
  "message": "Successfully converted 100 USD to 85.0 EUR"
}
```

## 🔍 Supported Currencies

The service supports 100+ currencies including:

**Major Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, BRL, MXN, RUB, KRW, SGD, HKD, NZD

**European**: SEK, NOK, DKK, PLN, CZK, HUF, TRY, BGN, RON, HRK, ISK, MKD, ALL, BAM

**Middle East**: AED, SAR, QAR, KWD, BHD, OMR, JOD, LBP, EGP, ILS

**Asia Pacific**: THB, MYR, IDR, PHP, VND, PKR, BDT, LKR, NPR, MMK, KHR, LAK, MNT

**Africa**: ZAR, MZN, NGN, GHS, KES, UGX, TZS, ETB, MAD, TND, DZD, LYD, SDG, SSP, CDF, AOA, ZMW, BWP, SZL, LSL, NAD, MWK, RWF, BIF, DJF, KMF, SCR, MUR, MVR

**Americas**: JMD, BBD, BZD, GTQ, HNL, NIO, CRC, PAB, DOP, HTG, CUP, TTD, XCD, AWG, ANG, SRD, GYD, VES, BOB, CLP, COP, PEN, UYU, PYG, ARS

## 🚨 Error Handling

### SOAP Faults
```xml
<soap:Fault>
  <faultcode>SOAP:Sender</faultcode>
  <faultstring>Unsupported currency code: INVALID</faultstring>
</soap:Fault>
```

### REST Errors
```json
{
  "success": false,
  "error": "Unsupported currency code: INVALID",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📈 Performance & Monitoring

- **Processing Time Tracking**: All operations include processing time
- **Request Logging**: All requests are logged with timestamps
- **Response Logging**: All responses are logged for monitoring
- **Error Logging**: Comprehensive error logging for debugging

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Database
- **SQLite**: Default database for development
- **Prisma**: ORM for database operations
- **Migrations**: Automatic schema management

## 📚 API Documentation

### WSDL Location
- **URL**: `http://localhost:3000/wsdl`
- **Format**: XML WSDL 1.1

### REST API Documentation
- **URL**: `http://localhost:3000/api/docs`
- **Format**: JSON with endpoint descriptions

## 🧪 Testing

### Unit Testing
```bash
npm test
```

### Integration Testing
Use the provided Postman collection for comprehensive testing.

### Load Testing
The service is designed to handle concurrent requests efficiently.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t currency-converter .
docker run -p 3000:3000 currency-converter
```

## 📝 Logs & Monitoring

### Request Logs
```
2024-01-15T10:30:00.000Z - POST /api/convert
🔵 SOAP Request: ConvertCurrency at 2024-01-15T10:30:00.000Z
🟢 SOAP Response: ConvertCurrency at 2024-01-15T10:30:00.015Z
```

### Error Logs
```
❌ Currency conversion error: Unsupported currency code: INVALID
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api/docs`
- Review the Postman collection for examples
- Check server logs for debugging information

---

**Built with ❤️ using Node.js, Express, Prisma, and modern web standards.**
