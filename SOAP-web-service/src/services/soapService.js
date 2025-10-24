const currencyService = require('./currencyService');

// Enhanced SOAP Service definition with comprehensive operations
const currencyServiceObject = {
  CurrencyConverterService: {
    CurrencyConverterPort: {
      // Convert currency operation with enhanced validation
      ConvertCurrency: async function (args) {
        try {
          const { fromCurrency, toCurrency, amount } = args;
          
          // Basic parameter validation
          if (!fromCurrency || !toCurrency || amount === null || amount === undefined) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: 'Missing required parameters: fromCurrency, toCurrency, amount' },
                statusCode: 400
              }
            };
          }

          const result = await currencyService.convertCurrency(fromCurrency, toCurrency, amount);
          
          if (!result.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: result.error },
                statusCode: 400
              }
            };
          }

          return {
            ConversionResult: result
          };
        } catch (error) {
          // Re-throw SOAP faults as-is
          if (error.Fault) {
            throw error;
          }
          // Convert other errors to SOAP faults
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Get all currencies operation with enhanced response
      GetAllCurrencies: async function () {
        try {
          const result = await currencyService.getAllCurrencies();
          
          if (!result.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Receiver' },
                Reason: { Text: result.error },
                statusCode: 500
              }
            };
          }

          return {
            Currencies: {
              Currency: result.currencies,
              Count: result.count,
              Timestamp: result.timestamp,
              Message: result.message
            }
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Update exchange rate operation with enhanced validation
      UpdateExchangeRate: async function (args) {
        try {
          const { currencyCode, newRate } = args;
          
          if (!currencyCode || newRate === null || newRate === undefined) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: 'Missing required parameters: currencyCode, newRate' },
                statusCode: 400
              }
            };
          }

          const result = await currencyService.updateExchangeRate(currencyCode, newRate);
          
          if (!result.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: result.error },
                statusCode: 400
              }
            };
          }

          return {
            UpdateResult: result
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Get conversion history operation with filtering
      GetConversionHistory: async function (args) {
        try {
          const limit = args.limit || 10;
          const fromCurrency = args.fromCurrency || null;
          const toCurrency = args.toCurrency || null;
          
          const result = await currencyService.getConversionHistory(limit, fromCurrency, toCurrency);
          
          if (!result.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Receiver' },
                Reason: { Text: result.error },
                statusCode: 500
              }
            };
          }

          return {
            ConversionHistory: {
              Conversion: result.history,
              Count: result.count,
              Filters: result.filters,
              Timestamp: result.timestamp,
              Message: result.message
            }
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Get single currency rate operation
      GetCurrencyRate: async function (args) {
        try {
          const { currencyCode } = args;
          
          if (!currencyCode) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: 'Missing required parameter: currencyCode' },
                statusCode: 400
              }
            };
          }

          const currenciesResult = await currencyService.getAllCurrencies();
          
          if (!currenciesResult.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Receiver' },
                Reason: { Text: currenciesResult.error },
                statusCode: 500
              }
            };
          }

          const currency = currenciesResult.currencies.find(c => c.code === currencyCode.toUpperCase());
          
          if (!currency) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: `Currency not found: ${currencyCode}` },
                statusCode: 404
              }
            };
          }

          return {
            CurrencyRate: {
              ...currency,
              Timestamp: new Date().toISOString(),
              Message: `Currency rate retrieved for ${currencyCode}`
            }
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Get currency statistics operation (NEW)
      GetCurrencyStatistics: async function () {
        try {
          const result = await currencyService.getCurrencyStatistics();
          
          if (!result.success) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Receiver' },
                Reason: { Text: result.error },
                statusCode: 500
              }
            };
          }

          return {
            Statistics: result.statistics,
            Timestamp: result.timestamp,
            Message: result.message
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Validate currency code operation (NEW)
      ValidateCurrencyCode: async function (args) {
        try {
          const { currencyCode } = args;
          
          if (!currencyCode) {
            throw {
              Fault: {
                Code: { Value: 'SOAP:Sender' },
                Reason: { Text: 'Missing required parameter: currencyCode' },
                statusCode: 400
              }
            };
          }

          const validation = currencyService.validateCurrencyCode(currencyCode);
          
          return {
            ValidationResult: {
              isValid: validation.valid,
              currencyCode: validation.code || currencyCode,
              error: validation.error || null,
              timestamp: new Date().toISOString(),
              message: validation.valid ? 
                `Currency code ${validation.code} is valid` : 
                `Currency code ${currencyCode} is invalid: ${validation.error}`
            }
          };
        } catch (error) {
          if (error.Fault) {
            throw error;
          }
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      },

      // Get supported currencies operation (NEW)
      GetSupportedCurrencies: async function () {
        try {
          return {
            SupportedCurrencies: {
              currencies: Array.from(currencyService.supportedCurrencies).sort(),
              count: currencyService.supportedCurrencies.size,
              timestamp: new Date().toISOString(),
              message: `Retrieved ${currencyService.supportedCurrencies.size} supported currency codes`
            }
          };
        } catch (error) {
          throw {
            Fault: {
              Code: { Value: 'SOAP:Receiver' },
              Reason: { Text: error.message || 'Internal server error' },
              statusCode: 500
            }
          };
        }
      }
    }
  }
};

// Enhanced WSDL XML with comprehensive operations
const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="CurrencyConverterService"
  targetNamespace="http://currency-converter.com/wsdl"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://currency-converter.com/wsdl"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:cc="http://currency-converter.com/types">

  <types>
    <xsd:schema targetNamespace="http://currency-converter.com/types">
      
      <!-- Conversion Request -->
      <xsd:element name="ConvertCurrencyRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="fromCurrency" type="xsd:string"/>
            <xsd:element name="toCurrency" type="xsd:string"/>
            <xsd:element name="amount" type="xsd:decimal"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Conversion Response -->
      <xsd:element name="ConvertCurrencyResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="ConversionResult">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="success" type="xsd:boolean"/>
                  <xsd:element name="fromCurrency" type="xsd:string"/>
                  <xsd:element name="toCurrency" type="xsd:string"/>
                  <xsd:element name="amount" type="xsd:decimal"/>
                  <xsd:element name="convertedAmount" type="xsd:decimal"/>
                  <xsd:element name="exchangeRate" type="xsd:decimal"/>
                  <xsd:element name="timestamp" type="xsd:string"/>
                  <xsd:element name="processingTimeMs" type="xsd:integer"/>
                  <xsd:element name="fromCurrencyName" type="xsd:string"/>
                  <xsd:element name="toCurrencyName" type="xsd:string"/>
                  <xsd:element name="message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Currency Type -->
      <xsd:complexType name="Currency">
        <xsd:sequence>
          <xsd:element name="code" type="xsd:string"/>
          <xsd:element name="name" type="xsd:string"/>
          <xsd:element name="rateToUSD" type="xsd:decimal"/>
          <xsd:element name="updatedAt" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>

      <!-- Get All Currencies Response -->
      <xsd:element name="GetAllCurrenciesResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="Currencies">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="Currency" type="cc:Currency" maxOccurs="unbounded"/>
                  <xsd:element name="Count" type="xsd:integer"/>
                  <xsd:element name="Timestamp" type="xsd:string"/>
                  <xsd:element name="Message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Update Exchange Rate Request -->
      <xsd:element name="UpdateExchangeRateRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="currencyCode" type="xsd:string"/>
            <xsd:element name="newRate" type="xsd:decimal"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Update Exchange Rate Response -->
      <xsd:element name="UpdateExchangeRateResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="UpdateResult">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="success" type="xsd:boolean"/>
                  <xsd:element name="currency">
                    <xsd:complexType>
                      <xsd:sequence>
                        <xsd:element name="code" type="xsd:string"/>
                        <xsd:element name="name" type="xsd:string"/>
                        <xsd:element name="oldRate" type="xsd:decimal"/>
                        <xsd:element name="newRate" type="xsd:decimal"/>
                        <xsd:element name="updatedAt" type="xsd:string"/>
                      </xsd:sequence>
                    </xsd:complexType>
                  </xsd:element>
                  <xsd:element name="timestamp" type="xsd:string"/>
                  <xsd:element name="message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Get Conversion History Request -->
      <xsd:element name="GetConversionHistoryRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="limit" type="xsd:integer" minOccurs="0"/>
            <xsd:element name="fromCurrency" type="xsd:string" minOccurs="0"/>
            <xsd:element name="toCurrency" type="xsd:string" minOccurs="0"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Conversion Log Type -->
      <xsd:complexType name="ConversionLog">
        <xsd:sequence>
          <xsd:element name="id" type="xsd:integer"/>
          <xsd:element name="fromCurrency" type="xsd:string"/>
          <xsd:element name="toCurrency" type="xsd:string"/>
          <xsd:element name="amount" type="xsd:decimal"/>
          <xsd:element name="result" type="xsd:decimal"/>
          <xsd:element name="rateUsed" type="xsd:decimal"/>
          <xsd:element name="createdAt" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>

      <!-- Get Conversion History Response -->
      <xsd:element name="GetConversionHistoryResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="ConversionHistory">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="Conversion" type="cc:ConversionLog" maxOccurs="unbounded"/>
                  <xsd:element name="Count" type="xsd:integer"/>
                  <xsd:element name="Filters">
                    <xsd:complexType>
                      <xsd:sequence>
                        <xsd:element name="limit" type="xsd:integer"/>
                        <xsd:element name="fromCurrency" type="xsd:string"/>
                        <xsd:element name="toCurrency" type="xsd:string"/>
                      </xsd:sequence>
                    </xsd:complexType>
                  </xsd:element>
                  <xsd:element name="Timestamp" type="xsd:string"/>
                  <xsd:element name="Message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Get Currency Rate Request -->
      <xsd:element name="GetCurrencyRateRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="currencyCode" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Get Currency Rate Response -->
      <xsd:element name="GetCurrencyRateResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="CurrencyRate">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="code" type="xsd:string"/>
                  <xsd:element name="name" type="xsd:string"/>
                  <xsd:element name="rateToUSD" type="xsd:decimal"/>
                  <xsd:element name="updatedAt" type="xsd:string"/>
                  <xsd:element name="Timestamp" type="xsd:string"/>
                  <xsd:element name="Message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Get Currency Statistics Response -->
      <xsd:element name="GetCurrencyStatisticsResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="Statistics">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="totalCurrencies" type="xsd:integer"/>
                  <xsd:element name="totalConversions" type="xsd:integer"/>
                  <xsd:element name="mostConvertedFrom" maxOccurs="unbounded">
                    <xsd:complexType>
                      <xsd:sequence>
                        <xsd:element name="currency" type="xsd:string"/>
                        <xsd:element name="count" type="xsd:integer"/>
                      </xsd:sequence>
                    </xsd:complexType>
                  </xsd:element>
                  <xsd:element name="mostConvertedTo" maxOccurs="unbounded">
                    <xsd:complexType>
                      <xsd:sequence>
                        <xsd:element name="currency" type="xsd:string"/>
                        <xsd:element name="count" type="xsd:integer"/>
                      </xsd:sequence>
                    </xsd:complexType>
                  </xsd:element>
                  <xsd:element name="recentConversions" maxOccurs="unbounded">
                    <xsd:complexType>
                      <xsd:sequence>
                        <xsd:element name="fromCurrency" type="xsd:string"/>
                        <xsd:element name="toCurrency" type="xsd:string"/>
                        <xsd:element name="amount" type="xsd:decimal"/>
                        <xsd:element name="result" type="xsd:decimal"/>
                        <xsd:element name="createdAt" type="xsd:string"/>
                      </xsd:sequence>
                    </xsd:complexType>
                  </xsd:element>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
            <xsd:element name="Timestamp" type="xsd:string"/>
            <xsd:element name="Message" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Validate Currency Code Request -->
      <xsd:element name="ValidateCurrencyCodeRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="currencyCode" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Validate Currency Code Response -->
      <xsd:element name="ValidateCurrencyCodeResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="ValidationResult">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="isValid" type="xsd:boolean"/>
                  <xsd:element name="currencyCode" type="xsd:string"/>
                  <xsd:element name="error" type="xsd:string" nillable="true"/>
                  <xsd:element name="timestamp" type="xsd:string"/>
                  <xsd:element name="message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Get Supported Currencies Response -->
      <xsd:element name="GetSupportedCurrenciesResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="SupportedCurrencies">
              <xsd:complexType>
                <xsd:sequence>
                  <xsd:element name="currencies" type="xsd:string" maxOccurs="unbounded"/>
                  <xsd:element name="count" type="xsd:integer"/>
                  <xsd:element name="timestamp" type="xsd:string"/>
                  <xsd:element name="message" type="xsd:string"/>
                </xsd:sequence>
              </xsd:complexType>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Fault Type -->
      <xsd:complexType name="Fault">
        <xsd:sequence>
          <xsd:element name="faultcode" type="xsd:string"/>
          <xsd:element name="faultstring" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>
    </xsd:schema>
  </types>

  <!-- Messages -->
  <message name="ConvertCurrencyInput">
    <part name="parameters" element="cc:ConvertCurrencyRequest"/>
  </message>
  <message name="ConvertCurrencyOutput">
    <part name="parameters" element="cc:ConvertCurrencyResponse"/>
  </message>
  
  <message name="GetAllCurrenciesInput">
    <part name="parameters" element="xsd:anyType"/>
  </message>
  <message name="GetAllCurrenciesOutput">
    <part name="parameters" element="cc:GetAllCurrenciesResponse"/>
  </message>
  
  <message name="UpdateExchangeRateInput">
    <part name="parameters" element="cc:UpdateExchangeRateRequest"/>
  </message>
  <message name="UpdateExchangeRateOutput">
    <part name="parameters" element="cc:UpdateExchangeRateResponse"/>
  </message>
  
  <message name="GetConversionHistoryInput">
    <part name="parameters" element="cc:GetConversionHistoryRequest"/>
  </message>
  <message name="GetConversionHistoryOutput">
    <part name="parameters" element="cc:GetConversionHistoryResponse"/>
  </message>
  
  <message name="GetCurrencyRateInput">
    <part name="parameters" element="cc:GetCurrencyRateRequest"/>
  </message>
  <message name="GetCurrencyRateOutput">
    <part name="parameters" element="cc:GetCurrencyRateResponse"/>
  </message>
  
  <message name="GetCurrencyStatisticsInput">
    <part name="parameters" element="xsd:anyType"/>
  </message>
  <message name="GetCurrencyStatisticsOutput">
    <part name="parameters" element="cc:GetCurrencyStatisticsResponse"/>
  </message>
  
  <message name="ValidateCurrencyCodeInput">
    <part name="parameters" element="cc:ValidateCurrencyCodeRequest"/>
  </message>
  <message name="ValidateCurrencyCodeOutput">
    <part name="parameters" element="cc:ValidateCurrencyCodeResponse"/>
  </message>
  
  <message name="GetSupportedCurrenciesInput">
    <part name="parameters" element="xsd:anyType"/>
  </message>
  <message name="GetSupportedCurrenciesOutput">
    <part name="parameters" element="cc:GetSupportedCurrenciesResponse"/>
  </message>
  
  <message name="CurrencyFault">
    <part name="fault" element="cc:Fault"/>
  </message>

  <!-- Port Type -->
  <portType name="CurrencyConverterPortType">
    <operation name="ConvertCurrency">
      <input message="tns:ConvertCurrencyInput"/>
      <output message="tns:ConvertCurrencyOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="GetAllCurrencies">
      <input message="tns:GetAllCurrenciesInput"/>
      <output message="tns:GetAllCurrenciesOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="UpdateExchangeRate">
      <input message="tns:UpdateExchangeRateInput"/>
      <output message="tns:UpdateExchangeRateOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="GetConversionHistory">
      <input message="tns:GetConversionHistoryInput"/>
      <output message="tns:GetConversionHistoryOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="GetCurrencyRate">
      <input message="tns:GetCurrencyRateInput"/>
      <output message="tns:GetCurrencyRateOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="GetCurrencyStatistics">
      <input message="tns:GetCurrencyStatisticsInput"/>
      <output message="tns:GetCurrencyStatisticsOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="ValidateCurrencyCode">
      <input message="tns:ValidateCurrencyCodeInput"/>
      <output message="tns:ValidateCurrencyCodeOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
    <operation name="GetSupportedCurrencies">
      <input message="tns:GetSupportedCurrenciesInput"/>
      <output message="tns:GetSupportedCurrenciesOutput"/>
      <fault name="fault" message="tns:CurrencyFault"/>
    </operation>
  </portType>

  <!-- Binding -->
  <binding name="CurrencyConverterBinding" type="tns:CurrencyConverterPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    
    <operation name="ConvertCurrency">
      <soap:operation soapAction="http://currency-converter.com/ConvertCurrency"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="GetAllCurrencies">
      <soap:operation soapAction="http://currency-converter.com/GetAllCurrencies"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="UpdateExchangeRate">
      <soap:operation soapAction="http://currency-converter.com/UpdateExchangeRate"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="GetConversionHistory">
      <soap:operation soapAction="http://currency-converter.com/GetConversionHistory"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="GetCurrencyRate">
      <soap:operation soapAction="http://currency-converter.com/GetCurrencyRate"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="GetCurrencyStatistics">
      <soap:operation soapAction="http://currency-converter.com/GetCurrencyStatistics"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="ValidateCurrencyCode">
      <soap:operation soapAction="http://currency-converter.com/ValidateCurrencyCode"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
    
    <operation name="GetSupportedCurrencies">
      <soap:operation soapAction="http://currency-converter.com/GetSupportedCurrencies"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
      <fault name="fault">
        <soap:fault name="fault" use="literal"/>
      </fault>
    </operation>
  </binding>

  <!-- Service -->
  <service name="CurrencyConverterService">
    <port name="CurrencyConverterPort" binding="tns:CurrencyConverterBinding">
      <soap:address location="http://localhost:3000/wsdl"/>
    </port>
  </service>
</definitions>`;

module.exports = {
  currencyServiceObject,
  wsdl
};