const express = require('express');
const soap = require('soap');
const cors = require('cors');
const { currencyServiceObject, wsdl } = require('./services/soapService');
const currencyService = require('./services/currencyService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve WSDL
app.get('/wsdl', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(wsdl);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Currency Converter SOAP Service is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      soap: 'http://localhost:3000/wsdl',
      rest: 'http://localhost:3000/api',
      health: 'http://localhost:3000/health'
    }
  });
});

// REST API endpoints for testing and integration
app.get('/api/currencies', async (req, res) => {
  try {
    const result = await currencyService.getAllCurrencies();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Convert currency via REST
app.post('/api/convert', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    
    if (!fromCurrency || !toCurrency || amount === null || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: fromCurrency, toCurrency, amount',
        timestamp: new Date().toISOString()
      });
    }

    const result = await currencyService.convertCurrency(fromCurrency, toCurrency, amount);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Update exchange rate via REST
app.put('/api/currencies/:code/rate', async (req, res) => {
  try {
    const { code } = req.params;
    const { newRate } = req.body;
    
    if (!newRate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: newRate',
        timestamp: new Date().toISOString()
      });
    }

    const result = await currencyService.updateExchangeRate(code, newRate);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get conversion history via REST
app.get('/api/conversions', async (req, res) => {
  try {
    const { limit = 10, fromCurrency, toCurrency } = req.query;
    
    const result = await currencyService.getConversionHistory(
      parseInt(limit), 
      fromCurrency || null, 
      toCurrency || null
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get currency statistics via REST
app.get('/api/statistics', async (req, res) => {
  try {
    const result = await currencyService.getCurrencyStatistics();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Validate currency code via REST
app.get('/api/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const validation = currencyService.validateCurrencyCode(code);
    
    res.json({
      success: true,
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get supported currencies via REST
app.get('/api/supported', async (req, res) => {
  try {
    res.json({
      success: true,
      currencies: Array.from(currencyService.supportedCurrencies).sort(),
      count: currencyService.supportedCurrencies.size,
      timestamp: new Date().toISOString(),
      message: `Retrieved ${currencyService.supportedCurrencies.size} supported currency codes`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Currency Converter API Documentation',
    version: '2.0.0',
    description: 'Professional SOAP and REST API for currency conversion',
    endpoints: {
      soap: {
        wsdl: 'http://localhost:3000/wsdl',
        operations: [
          'ConvertCurrency',
          'GetAllCurrencies', 
          'UpdateExchangeRate',
          'GetConversionHistory',
          'GetCurrencyRate',
          'GetCurrencyStatistics',
          'ValidateCurrencyCode',
          'GetSupportedCurrencies'
        ]
      },
      rest: {
        'GET /api/currencies': 'Get all currencies',
        'POST /api/convert': 'Convert currency',
        'PUT /api/currencies/:code/rate': 'Update exchange rate',
        'GET /api/conversions': 'Get conversion history',
        'GET /api/statistics': 'Get currency statistics',
        'GET /api/validate/:code': 'Validate currency code',
        'GET /api/supported': 'Get supported currencies',
        'GET /api/docs': 'API documentation'
      }
    },
    examples: {
      convert: {
        method: 'POST',
        url: '/api/convert',
        body: {
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          amount: 100
        }
      },
      updateRate: {
        method: 'PUT',
        url: '/api/currencies/EUR/rate',
        body: {
          newRate: 0.85
        }
      }
    }
  });
});

// Initialize SOAP service
const soapServer = soap.listen(app, '/wsdl', currencyServiceObject, wsdl);

// Enhanced SOAP logging
soapServer.on('request', (request, methodName) => {
  console.log(`🔵 SOAP Request: ${methodName} at ${new Date().toISOString()}`);
});

soapServer.on('response', (response, methodName) => {
  console.log(`🟢 SOAP Response: ${methodName} at ${new Date().toISOString()}`);
});

soapServer.on('headers', (headers, methodName) => {
  console.log(`📋 SOAP Headers for ${methodName}:`, headers);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: {
      soap: '/wsdl',
      health: '/health',
      api: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = app;