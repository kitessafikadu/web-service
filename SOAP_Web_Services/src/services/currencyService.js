const prisma = require('../prisma/client');

class CurrencyService {
  constructor() {
    this.supportedCurrencies = new Set([
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'RUB', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'TRY', 'ZAR', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'LBP', 'EGP', 'ILS', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'PKR', 'BDT', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'MNT', 'UZS', 'KZT', 'AZN', 'AMD', 'GEL', 'BYN', 'MDL', 'UAH', 'RSD', 'BGN', 'RON', 'HRK', 'ISK', 'MKD', 'ALL', 'BAM', 'MZN', 'NGN', 'GHS', 'KES', 'UGX', 'TZS', 'ETB', 'MAD', 'TND', 'DZD', 'LYD', 'SDG', 'SSP', 'CDF', 'AOA', 'ZMW', 'BWP', 'SZL', 'LSL', 'NAD', 'MWK', 'RWF', 'BIF', 'DJF', 'KMF', 'SCR', 'MUR', 'MVR', 'AFN', 'IRR', 'IQD', 'SYP', 'YER', 'JMD', 'BBD', 'BZD', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'DOP', 'HTG', 'CUP', 'TTD', 'XCD', 'AWG', 'ANG', 'SRD', 'GYD', 'VES', 'BOB', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'ARS', 'BRL', 'FKP', 'GYD', 'SRD', 'VES'
    ]);
  }

  // Validate currency code
  validateCurrencyCode(code) {
    if (!code || typeof code !== 'string') {
      return { valid: false, error: 'Currency code must be a non-empty string' };
    }
    
    const upperCode = code.toUpperCase();
    if (!this.supportedCurrencies.has(upperCode)) {
      return { valid: false, error: `Unsupported currency code: ${upperCode}` };
    }
    
    return { valid: true, code: upperCode };
  }

  // Validate amount
  validateAmount(amount) {
    if (amount === null || amount === undefined) {
      return { valid: false, error: 'Amount is required' };
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return { valid: false, error: 'Amount must be a valid number' };
    }
    
    if (numAmount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    
    if (numAmount > 1000000000) { // 1 billion limit
      return { valid: false, error: 'Amount exceeds maximum limit of 1,000,000,000' };
    }
    
    return { valid: true, amount: numAmount };
  }

  // Initialize with comprehensive currency data
  async initializeCurrencies() {
    const currencies = [
      { code: 'USD', name: 'US Dollar', rateToUSD: 1.0 },
      { code: 'EUR', name: 'Euro', rateToUSD: 0.85 },
      { code: 'GBP', name: 'British Pound Sterling', rateToUSD: 0.73 },
      { code: 'JPY', name: 'Japanese Yen', rateToUSD: 110.0 },
      { code: 'CAD', name: 'Canadian Dollar', rateToUSD: 1.25 },
      { code: 'AUD', name: 'Australian Dollar', rateToUSD: 1.35 },
      { code: 'CHF', name: 'Swiss Franc', rateToUSD: 0.92 },
      { code: 'CNY', name: 'Chinese Yuan', rateToUSD: 6.45 },
      { code: 'INR', name: 'Indian Rupee', rateToUSD: 74.0 },
      { code: 'BRL', name: 'Brazilian Real', rateToUSD: 5.2 },
      { code: 'MXN', name: 'Mexican Peso', rateToUSD: 20.0 },
      { code: 'RUB', name: 'Russian Ruble', rateToUSD: 75.0 },
      { code: 'KRW', name: 'South Korean Won', rateToUSD: 1200.0 },
      { code: 'SGD', name: 'Singapore Dollar', rateToUSD: 1.35 },
      { code: 'HKD', name: 'Hong Kong Dollar', rateToUSD: 7.8 },
      { code: 'NZD', name: 'New Zealand Dollar', rateToUSD: 1.45 },
      { code: 'SEK', name: 'Swedish Krona', rateToUSD: 8.5 },
      { code: 'NOK', name: 'Norwegian Krone', rateToUSD: 8.8 },
      { code: 'DKK', name: 'Danish Krone', rateToUSD: 6.3 },
      { code: 'PLN', name: 'Polish Zloty', rateToUSD: 3.9 },
      { code: 'CZK', name: 'Czech Koruna', rateToUSD: 21.5 },
      { code: 'HUF', name: 'Hungarian Forint', rateToUSD: 300.0 },
      { code: 'TRY', name: 'Turkish Lira', rateToUSD: 8.5 },
      { code: 'ZAR', name: 'South African Rand', rateToUSD: 15.0 },
      { code: 'AED', name: 'UAE Dirham', rateToUSD: 3.67 },
      { code: 'SAR', name: 'Saudi Riyal', rateToUSD: 3.75 },
      { code: 'QAR', name: 'Qatari Riyal', rateToUSD: 3.64 },
      { code: 'KWD', name: 'Kuwaiti Dinar', rateToUSD: 0.30 },
      { code: 'BHD', name: 'Bahraini Dinar', rateToUSD: 0.38 },
      { code: 'OMR', name: 'Omani Rial', rateToUSD: 0.38 },
      { code: 'JOD', name: 'Jordanian Dinar', rateToUSD: 0.71 },
      { code: 'LBP', name: 'Lebanese Pound', rateToUSD: 1500.0 },
      { code: 'EGP', name: 'Egyptian Pound', rateToUSD: 15.7 },
      { code: 'ILS', name: 'Israeli Shekel', rateToUSD: 3.25 },
      { code: 'THB', name: 'Thai Baht', rateToUSD: 33.0 },
      { code: 'MYR', name: 'Malaysian Ringgit', rateToUSD: 4.2 },
      { code: 'IDR', name: 'Indonesian Rupiah', rateToUSD: 14500.0 },
      { code: 'PHP', name: 'Philippine Peso', rateToUSD: 50.0 },
      { code: 'VND', name: 'Vietnamese Dong', rateToUSD: 23000.0 },
      { code: 'PKR', name: 'Pakistani Rupee', rateToUSD: 160.0 },
      { code: 'BDT', name: 'Bangladeshi Taka', rateToUSD: 85.0 },
      { code: 'LKR', name: 'Sri Lankan Rupee', rateToUSD: 200.0 },
      { code: 'NPR', name: 'Nepalese Rupee', rateToUSD: 120.0 },
      { code: 'MMK', name: 'Myanmar Kyat', rateToUSD: 1800.0 },
      { code: 'KHR', name: 'Cambodian Riel', rateToUSD: 4100.0 },
      { code: 'LAK', name: 'Lao Kip', rateToUSD: 9500.0 },
      { code: 'MNT', name: 'Mongolian Tugrik', rateToUSD: 2850.0 },
      { code: 'UZS', name: 'Uzbekistani Som', rateToUSD: 10800.0 },
      { code: 'KZT', name: 'Kazakhstani Tenge', rateToUSD: 425.0 },
      { code: 'AZN', name: 'Azerbaijani Manat', rateToUSD: 1.7 },
      { code: 'AMD', name: 'Armenian Dram', rateToUSD: 520.0 },
      { code: 'GEL', name: 'Georgian Lari', rateToUSD: 3.1 },
      { code: 'BYN', name: 'Belarusian Ruble', rateToUSD: 2.6 },
      { code: 'MDL', name: 'Moldovan Leu', rateToUSD: 17.5 },
      { code: 'UAH', name: 'Ukrainian Hryvnia', rateToUSD: 27.0 },
      { code: 'RSD', name: 'Serbian Dinar', rateToUSD: 100.0 },
      { code: 'BGN', name: 'Bulgarian Lev', rateToUSD: 1.66 },
      { code: 'RON', name: 'Romanian Leu', rateToUSD: 4.2 },
      { code: 'HRK', name: 'Croatian Kuna', rateToUSD: 6.4 },
      { code: 'ISK', name: 'Icelandic Krona', rateToUSD: 130.0 },
      { code: 'MKD', name: 'Macedonian Denar', rateToUSD: 52.0 },
      { code: 'ALL', name: 'Albanian Lek', rateToUSD: 105.0 },
      { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', rateToUSD: 1.66 },
      { code: 'MZN', name: 'Mozambican Metical', rateToUSD: 64.0 },
      { code: 'NGN', name: 'Nigerian Naira', rateToUSD: 410.0 },
      { code: 'GHS', name: 'Ghanaian Cedi', rateToUSD: 6.0 },
      { code: 'KES', name: 'Kenyan Shilling', rateToUSD: 110.0 },
      { code: 'UGX', name: 'Ugandan Shilling', rateToUSD: 3500.0 },
      { code: 'TZS', name: 'Tanzanian Shilling', rateToUSD: 2300.0 },
      { code: 'ETB', name: 'Ethiopian Birr', rateToUSD: 45.0 },
      { code: 'MAD', name: 'Moroccan Dirham', rateToUSD: 9.0 },
      { code: 'TND', name: 'Tunisian Dinar', rateToUSD: 2.8 },
      { code: 'DZD', name: 'Algerian Dinar', rateToUSD: 135.0 },
      { code: 'LYD', name: 'Libyan Dinar', rateToUSD: 4.5 },
      { code: 'SDG', name: 'Sudanese Pound', rateToUSD: 55.0 },
      { code: 'SSP', name: 'South Sudanese Pound', rateToUSD: 55.0 },
      { code: 'CDF', name: 'Congolese Franc', rateToUSD: 2000.0 },
      { code: 'AOA', name: 'Angolan Kwanza', rateToUSD: 650.0 },
      { code: 'ZMW', name: 'Zambian Kwacha', rateToUSD: 18.0 },
      { code: 'BWP', name: 'Botswana Pula', rateToUSD: 11.0 },
      { code: 'SZL', name: 'Swazi Lilangeni', rateToUSD: 15.0 },
      { code: 'LSL', name: 'Lesotho Loti', rateToUSD: 15.0 },
      { code: 'NAD', name: 'Namibian Dollar', rateToUSD: 15.0 },
      { code: 'MWK', name: 'Malawian Kwacha', rateToUSD: 820.0 },
      { code: 'RWF', name: 'Rwandan Franc', rateToUSD: 1000.0 },
      { code: 'BIF', name: 'Burundian Franc', rateToUSD: 2000.0 },
      { code: 'DJF', name: 'Djiboutian Franc', rateToUSD: 178.0 },
      { code: 'KMF', name: 'Comorian Franc', rateToUSD: 450.0 },
      { code: 'SCR', name: 'Seychellois Rupee', rateToUSD: 13.5 },
      { code: 'MUR', name: 'Mauritian Rupee', rateToUSD: 42.0 },
      { code: 'MVR', name: 'Maldivian Rufiyaa', rateToUSD: 15.4 },
      { code: 'AFN', name: 'Afghan Afghani', rateToUSD: 80.0 },
      { code: 'IRR', name: 'Iranian Rial', rateToUSD: 42000.0 },
      { code: 'IQD', name: 'Iraqi Dinar', rateToUSD: 1460.0 },
      { code: 'SYP', name: 'Syrian Pound', rateToUSD: 2500.0 },
      { code: 'YER', name: 'Yemeni Rial', rateToUSD: 250.0 },
      { code: 'JMD', name: 'Jamaican Dollar', rateToUSD: 150.0 },
      { code: 'BBD', name: 'Barbadian Dollar', rateToUSD: 2.0 },
      { code: 'BZD', name: 'Belize Dollar', rateToUSD: 2.0 },
      { code: 'GTQ', name: 'Guatemalan Quetzal', rateToUSD: 7.7 },
      { code: 'HNL', name: 'Honduran Lempira', rateToUSD: 24.0 },
      { code: 'NIO', name: 'Nicaraguan Cordoba', rateToUSD: 35.0 },
      { code: 'CRC', name: 'Costa Rican Colon', rateToUSD: 620.0 },
      { code: 'PAB', name: 'Panamanian Balboa', rateToUSD: 1.0 },
      { code: 'DOP', name: 'Dominican Peso', rateToUSD: 57.0 },
      { code: 'HTG', name: 'Haitian Gourde', rateToUSD: 100.0 },
      { code: 'CUP', name: 'Cuban Peso', rateToUSD: 25.0 },
      { code: 'TTD', name: 'Trinidad and Tobago Dollar', rateToUSD: 6.8 },
      { code: 'XCD', name: 'East Caribbean Dollar', rateToUSD: 2.7 },
      { code: 'AWG', name: 'Aruban Florin', rateToUSD: 1.8 },
      { code: 'ANG', name: 'Netherlands Antillean Guilder', rateToUSD: 1.8 },
      { code: 'SRD', name: 'Surinamese Dollar', rateToUSD: 21.0 },
      { code: 'GYD', name: 'Guyanese Dollar', rateToUSD: 210.0 },
      { code: 'VES', name: 'Venezuelan Bolivar', rateToUSD: 36.0 },
      { code: 'BOB', name: 'Bolivian Boliviano', rateToUSD: 6.9 },
      { code: 'CLP', name: 'Chilean Peso', rateToUSD: 800.0 },
      { code: 'COP', name: 'Colombian Peso', rateToUSD: 3800.0 },
      { code: 'PEN', name: 'Peruvian Sol', rateToUSD: 3.7 },
      { code: 'UYU', name: 'Uruguayan Peso', rateToUSD: 43.0 },
      { code: 'PYG', name: 'Paraguayan Guarani', rateToUSD: 7000.0 },
      { code: 'ARS', name: 'Argentine Peso', rateToUSD: 100.0 }
    ];

    try {
      for (const currency of currencies) {
        await prisma.currency.upsert({
          where: { code: currency.code },
          update: currency,
          create: currency,
        });
      }

      console.log(`✅ Initialized ${currencies.length} currencies successfully`);
    } catch (error) {
      console.error('❌ Error initializing currencies:', error);
      throw error;
    }
  }

  // Convert currency with enhanced validation and logging
  async convertCurrency(fromCurrency, toCurrency, amount) {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      const fromValidation = this.validateCurrencyCode(fromCurrency);
      if (!fromValidation.valid) {
        throw new Error(fromValidation.error);
      }

      const toValidation = this.validateCurrencyCode(toCurrency);
      if (!toValidation.valid) {
        throw new Error(toValidation.error);
      }

      const amountValidation = this.validateAmount(amount);
      if (!amountValidation.valid) {
        throw new Error(amountValidation.error);
      }

      // Check if converting to same currency
      if (fromValidation.code === toValidation.code) {
        return {
          success: true,
          fromCurrency: fromValidation.code,
          toCurrency: toValidation.code,
          amount: amountValidation.amount,
          convertedAmount: amountValidation.amount,
          exchangeRate: 1.0,
          timestamp: new Date().toISOString(),
          processingTimeMs: Date.now() - startTime,
          message: 'Same currency conversion - no conversion needed'
        };
      }

      // Get both currency rates
      const fromCurrencyData = await prisma.currency.findUnique({
        where: { code: fromValidation.code }
      });

      const toCurrencyData = await prisma.currency.findUnique({
        where: { code: toValidation.code }
      });

      if (!fromCurrencyData || !toCurrencyData) {
        throw new Error('Currency data not found in database');
      }

      // Convert via USD
      const amountInUSD = amountValidation.amount / fromCurrencyData.rateToUSD;
      const result = amountInUSD * toCurrencyData.rateToUSD;
      const rateUsed = result / amountValidation.amount;

      // Log the conversion
      await prisma.conversionLog.create({
        data: {
          fromCurrency: fromValidation.code,
          toCurrency: toValidation.code,
          amount: amountValidation.amount,
          result,
          rateUsed,
        },
      });

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        fromCurrency: fromValidation.code,
        toCurrency: toValidation.code,
        amount: amountValidation.amount,
        convertedAmount: parseFloat(result.toFixed(4)),
        exchangeRate: parseFloat(rateUsed.toFixed(6)),
        timestamp: new Date().toISOString(),
        processingTimeMs: processingTime,
        fromCurrencyName: fromCurrencyData.name,
        toCurrencyName: toCurrencyData.name,
        message: `Successfully converted ${amountValidation.amount} ${fromValidation.code} to ${parseFloat(result.toFixed(4))} ${toValidation.code}`
      };
    } catch (error) {
      console.error('Currency conversion error:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  // Get all currencies
  async getAllCurrencies() {
    return await prisma.currency.findMany({
      select: {
        code: true,
        name: true,
        rateToUSD: true,
        updatedAt: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  // Update exchange rate
  async updateExchangeRate(currencyCode, newRate) {
    try {
      const updatedCurrency = await prisma.currency.update({
        where: { code: currencyCode.toUpperCase() },
        data: { rateToUSD: newRate },
      });

      return {
        success: true,
        currency: {
          code: updatedCurrency.code,
          name: updatedCurrency.name,
          newRate: updatedCurrency.rateToUSD,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Currency not found',
      };
    }
  }

  // Get all currencies with enhanced response
  async getAllCurrencies() {
    try {
      const currencies = await prisma.currency.findMany({
        select: {
          code: true,
          name: true,
          rateToUSD: true,
          updatedAt: true,
        },
        orderBy: {
          code: 'asc',
        },
      });

      return {
        success: true,
        currencies,
        count: currencies.length,
        timestamp: new Date().toISOString(),
        message: `Retrieved ${currencies.length} currencies successfully`
      };
    } catch (error) {
      console.error('Error getting currencies:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Update exchange rate with validation
  async updateExchangeRate(currencyCode, newRate) {
    try {
      const currencyValidation = this.validateCurrencyCode(currencyCode);
      if (!currencyValidation.valid) {
        throw new Error(currencyValidation.error);
      }

      if (typeof newRate !== 'number' || newRate <= 0) {
        throw new Error('New rate must be a positive number');
      }

      if (newRate > 1000000) { // Reasonable upper limit
        throw new Error('Exchange rate exceeds maximum limit of 1,000,000');
      }

      const updatedCurrency = await prisma.currency.update({
        where: { code: currencyValidation.code },
        data: { rateToUSD: newRate },
      });

      return {
        success: true,
        currency: {
          code: updatedCurrency.code,
          name: updatedCurrency.name,
          oldRate: updatedCurrency.rateToUSD,
          newRate: newRate,
          updatedAt: updatedCurrency.updatedAt
        },
        timestamp: new Date().toISOString(),
        message: `Successfully updated ${currencyValidation.code} exchange rate to ${newRate}`
      };
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      return {
        success: false,
        error: error.message.includes('Record to update not found') ? 'Currency not found' : error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get conversion history with enhanced filtering
  async getConversionHistory(limit = 10, fromCurrency = null, toCurrency = null) {
    try {
      if (limit > 100) {
        limit = 100; // Cap at 100 records
      }

      const whereClause = {};
      if (fromCurrency) {
        const fromValidation = this.validateCurrencyCode(fromCurrency);
        if (fromValidation.valid) {
          whereClause.fromCurrency = fromValidation.code;
        }
      }
      if (toCurrency) {
        const toValidation = this.validateCurrencyCode(toCurrency);
        if (toValidation.valid) {
          whereClause.toCurrency = toValidation.code;
        }
      }

      const history = await prisma.conversionLog.findMany({
        where: whereClause,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          fromCurrency: true,
          toCurrency: true,
          amount: true,
          result: true,
          rateUsed: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        history,
        count: history.length,
        filters: {
          limit,
          fromCurrency: fromCurrency || 'all',
          toCurrency: toCurrency || 'all'
        },
        timestamp: new Date().toISOString(),
        message: `Retrieved ${history.length} conversion records`
      };
    } catch (error) {
      console.error('Error getting conversion history:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get currency statistics
  async getCurrencyStatistics() {
    try {
      const totalCurrencies = await prisma.currency.count();
      const totalConversions = await prisma.conversionLog.count();
      
      const mostConvertedFrom = await prisma.conversionLog.groupBy({
        by: ['fromCurrency'],
        _count: { fromCurrency: true },
        orderBy: { _count: { fromCurrency: 'desc' } },
        take: 5
      });

      const mostConvertedTo = await prisma.conversionLog.groupBy({
        by: ['toCurrency'],
        _count: { toCurrency: true },
        orderBy: { _count: { toCurrency: 'desc' } },
        take: 5
      });

      const recentConversions = await prisma.conversionLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          fromCurrency: true,
          toCurrency: true,
          amount: true,
          result: true,
          createdAt: true
        }
      });

      return {
        success: true,
        statistics: {
          totalCurrencies,
          totalConversions,
          mostConvertedFrom: mostConvertedFrom.map(item => ({
            currency: item.fromCurrency,
            count: item._count.fromCurrency
          })),
          mostConvertedTo: mostConvertedTo.map(item => ({
            currency: item.toCurrency,
            count: item._count.toCurrency
          })),
          recentConversions
        },
        timestamp: new Date().toISOString(),
        message: 'Currency statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting currency statistics:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new CurrencyService();