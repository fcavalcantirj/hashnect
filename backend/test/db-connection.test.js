const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Test connection by querying the database
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    if (result && result[0] && result[0].test === 1) {
      console.log('✅ Database connection successful!');
    } else {
      console.error('❌ Database connection failed: Unexpected response');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testDatabaseConnection();
