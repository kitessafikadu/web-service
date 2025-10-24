import express from "express";
import fs from "fs";
import soap from "soap";

const app = express();
const wsdlFile = fs.readFileSync("currency-converter.wsdl", "utf8");

// Mock exchange rates
const rates = {
  USD: { 
    EUR: 0.92, GBP: 0.79, ETB: 114.5, 
    JPY: 149.2, INR: 83.1, CAD: 1.37, AUD: 1.53, CNY: 7.27 
  },
  EUR: { 
    USD: 1.09, GBP: 0.86, ETB: 124.3, 
    JPY: 162.2, INR: 90.3, CAD: 1.49, AUD: 1.67, CNY: 7.91 
  },
  GBP: { 
    USD: 1.27, EUR: 1.16, ETB: 144.5, 
    JPY: 189.4, INR: 105.4, CAD: 1.74, AUD: 1.95, CNY: 9.25 
  },
  ETB: { 
    USD: 0.0087, EUR: 0.008, GBP: 0.0069, 
    JPY: 1.3, INR: 0.73, CAD: 0.012, AUD: 0.011, CNY: 0.064 
  },
  JPY: { 
    USD: 0.0067, EUR: 0.0062, GBP: 0.0053, 
    ETB: 0.77, INR: 0.56, CAD: 0.0092, AUD: 0.0081, CNY: 0.049 
  },
  INR: { 
    USD: 0.012, EUR: 0.011, GBP: 0.0095, 
    ETB: 1.37, JPY: 1.78, CAD: 0.016, AUD: 0.014, CNY: 0.087 
  },
  CAD: { 
    USD: 0.73, EUR: 0.67, GBP: 0.57, 
    ETB: 84.2, JPY: 108.7, INR: 61.8, AUD: 1.12, CNY: 5.31 
  },
  AUD: { 
    USD: 0.65, EUR: 0.60, GBP: 0.51, 
    ETB: 75.2, JPY: 97.1, INR: 55.2, CAD: 0.89, CNY: 4.75 
  },
  CNY: { 
    USD: 0.14, EUR: 0.13, GBP: 0.11, 
    ETB: 15.8, JPY: 20.6, INR: 11.6, CAD: 0.19, AUD: 0.21 
  },
};


// SOAP service implementation
const service = {
  CurrencyConverterService: {
    CurrencyConverterPort: {
      ConvertCurrency(args) {
        const { fromCurrency, toCurrency, amount } = args;
        const rate = rates[fromCurrency]?.[toCurrency];
        if (!rate) {
          throw new Error(`Conversion rate not found for ${fromCurrency} -> ${toCurrency}`);
        }
        const result = parseFloat(amount) * rate;
        return { result };
      },
    },
  },
};

// Create SOAP server
const server = app.listen(8000, () => {
  console.log("SOAP Currency Converter running at http://localhost:8000/wsdl?wsdl");
});

soap.listen(server, "/wsdl", service, wsdlFile);
