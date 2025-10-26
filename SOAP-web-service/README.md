# 💱 SOAP Currency Converter Service

A comprehensive SOAP-based web service for currency conversion built with Node.js and Express. This service demonstrates SOAP protocol implementation with WSDL service definition and XML-based communication.

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Service](#running-the-service)
- [WSDL Service Definition](#wsdl-service-definition)
- [API Usage](#api-usage)
- [Testing with Postman](#testing-with-postman)
- [Supported Currencies](#supported-currencies)

---

## 🧩 About

This SOAP web service provides real-time currency conversion between major world currencies. It implements the SOAP protocol with proper WSDL service definition, enabling automatic client generation and service discovery.

The service demonstrates enterprise-grade web service development with comprehensive error handling and XML-based message exchange.

---

## ✨ Features

- **Multi-Currency Support**: Convert between 9 major currencies
- **SOAP Protocol**: Full SOAP 1.1 implementation with proper XML envelopes
- **WSDL Service Definition**: Comprehensive service contract for client generation
- **Error Handling**: SOAP fault responses for invalid requests
- **Real-time Rates**: Mock exchange rate matrix with realistic values
- **Service Discovery**: WSDL endpoint for automatic client generation

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for HTTP server |
| **SOAP Library** | SOAP service implementation |
| **XML2JS** | XML parsing and generation |
| **Axios** | HTTP client for external requests |
| **Postman** | SOAP request testing |

---

## ⚙️ Installation

1. Navigate to the SOAP service directory:
```bash
cd SOAP-web-service
```

2. Install dependencies:
```bash
npm install
```

---

## ▶️ Running the Service

Start the SOAP server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The service will be available at:
- **Service Endpoint**: `http://localhost:8000/wsdl`
- **WSDL Definition**: `http://localhost:8000/wsdl?wsdl`

You should see:
```
SOAP Currency Converter running at http://localhost:8000/wsdl?wsdl
```

---

## 📄 WSDL Service Definition

The service provides a comprehensive WSDL file that defines:

- **Service Operations**: `ConvertCurrency`
- **Message Types**: Request and response structures
- **Data Types**: Currency codes and amount validation
- **Binding**: SOAP RPC style with HTTP transport
- **Service Location**: Endpoint URL for client connections

Access the WSDL at: `http://localhost:8000/wsdl?wsdl`

---

## 🔧 API Usage

### ConvertCurrency Operation

**Request Structure:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:ws="http://www.currencyconverter.com/wsdl">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:ConvertCurrency>
         <fromCurrency>USD</fromCurrency>
         <toCurrency>EUR</toCurrency>
         <amount>100</amount>
      </ws:ConvertCurrency>
   </soapenv:Body>
</soapenv:Envelope>
```

**Response Structure:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <tns:ConvertCurrencyResponse>
            <tns:result>92.00</tns:result>
        </tns:ConvertCurrencyResponse>
    </soap:Body>
</soap:Envelope>
```

---

## 🧪 Testing with Postman

1. **Create a new request** in Postman
2. **Set method to POST**
3. **Set URL to**: `http://localhost:8000/wsdl`
4. **Add headers**:
   - `Content-Type: text/xml; charset=utf-8`
   - `SOAPAction: "urn:ConvertCurrency"`
5. **Add XML body** with the request structure above
6. **Send request** and verify the XML response

---

## 💱 Supported Currencies

| Currency | Code | Description |
|----------|------|-------------|
| **US Dollar** | USD | United States Dollar |
| **Euro** | EUR | European Union Currency |
| **British Pound** | GBP | United Kingdom Pound |
| **Ethiopian Birr** | ETB | Ethiopian Currency |
| **Japanese Yen** | JPY | Japanese Currency |
| **Indian Rupee** | INR | Indian Currency |
| **Canadian Dollar** | CAD | Canadian Currency |
| **Australian Dollar** | AUD | Australian Currency |
| **Chinese Yuan** | CNY | Chinese Currency |

---

## 🚨 Error Handling

The service provides comprehensive error handling with SOAP fault responses:

**Invalid Currency Error:**
```xml
<soap:Fault>
    <soap:Code>
        <soap:Value>SOAP-ENV:Server</soap:Value>
    </soap:Code>
    <soap:Reason>
        <soap:Text>Error: Conversion rate not found for USD -> INVALID</soap:Text>
    </soap:Reason>
</soap:Fault>
```

---

## 🔗 Service Integration

### Client Generation
The WSDL file enables automatic client generation for various programming languages:
- **Java**: Using JAX-WS or Apache CXF
- **C#**: Using Visual Studio's "Add Service Reference"
- **Python**: Using zeep or suds libraries
- **JavaScript**: Using soap npm package

### Service Discovery
Clients can discover the service capabilities by accessing the WSDL endpoint and parsing the service definition.

---

## 📝 Example Conversions

| From | To | Amount | Result |
|------|----|---------|---------| 
| USD | EUR | 100 | 92.00 |
| EUR | GBP | 100 | 86.00 |
| USD | ETB | 100 | 11,450.00 |
| GBP | JPY | 100 | 18,940.00 |

---

## 🛠️ Development

### Project Structure
```
SOAP-web-service/
├── server.js              # Main SOAP server implementation
├── currency-converter.wsdl # WSDL service definition
├── package.json           # Dependencies and scripts
└── README.md             # This documentation
```

### Adding New Currencies
To add support for new currencies, update the `rates` object in `server.js` with the new exchange rates.

---

## 📞 Support

For questions or issues with the SOAP service, please refer to the main project documentation or contact the development team.

---

**Built with ❤️ for Web Service Development Assignment**
