const app = require('./app');
const currencyService = require('./services/currencyService');
const prisma = require('./prisma/client');

const PORT = process.env.PORT || 3000;

// Initialize database and start server
async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Initialize sample currency data
    await currencyService.initializeCurrencies();
    console.log('✅ Currency data initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 SOAP Service running on http://localhost:${PORT}`);
      console.log(`📄 WSDL available at http://localhost:${PORT}/wsdl`);
      console.log(`❤️  Health check at http://localhost:${PORT}/health`);
      console.log(`🌍 REST API at http://localhost:${PORT}/api/currencies`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔴 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔴 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();