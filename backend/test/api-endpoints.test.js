const { PrismaClient } = require('@prisma/client');

async function testApiEndpoints() {
  console.log('Testing API endpoints via database queries...');
  
  try {
    const prisma = new PrismaClient();
    
    // Test user creation and retrieval
    console.log('\nTesting User API functionality:');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@hashnect.com' },
      update: {},
      create: {
        email: 'test@hashnect.com',
        fullName: 'Test User',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        verificationLevel: 1
      }
    });
    console.log(`✅ User created/retrieved: ${testUser.fullName} (ID: ${testUser.id})`);
    
    // Test hashtag creation and retrieval
    console.log('\nTesting Hashtag API functionality:');
    const testHashtag = await prisma.hashtag.upsert({
      where: { name: 'technology' },
      update: {},
      create: {
        name: 'technology',
        description: 'Technology related topics'
      }
    });
    console.log(`✅ Hashtag created/retrieved: #${testHashtag.name} (ID: ${testHashtag.id})`);
    
    // Test user-hashtag connection
    console.log('\nTesting User-Hashtag connection:');
    const userHashtag = await prisma.userHashtag.upsert({
      where: {
        userId_hashtagId: {
          userId: testUser.id,
          hashtagId: testHashtag.id
        }
      },
      update: { strength: 0.8 },
      create: {
        userId: testUser.id,
        hashtagId: testHashtag.id,
        strength: 0.8
      }
    });
    console.log(`✅ User-Hashtag connection created/updated with strength: ${userHashtag.strength}`);
    
    // Test subdomain creation
    console.log('\nTesting Subdomain API functionality:');
    const testSubdomain = await prisma.subdomain.upsert({
      where: { name: 'Tech Enthusiasts' },
      update: {},
      create: {
        name: 'Tech Enthusiasts',
        description: 'A community for technology lovers',
        isPrivate: false,
        ownerId: testUser.id
      }
    });
    console.log(`✅ Subdomain created/retrieved: ${testSubdomain.name} (ID: ${testSubdomain.id})`);
    
    // Test subdomain membership
    console.log('\nTesting Subdomain Membership:');
    const membership = await prisma.subdomainMember.upsert({
      where: {
        subdomainId_userId: {
          subdomainId: testSubdomain.id,
          userId: testUser.id
        }
      },
      update: { role: 'owner' },
      create: {
        userId: testUser.id,
        subdomainId: testSubdomain.id,
        role: 'owner'
      }
    });
    console.log(`✅ Subdomain membership created/updated with role: ${membership.role}`);
    
    // Test subscription creation - using findFirst and create/update instead of upsert
    console.log('\nTesting Subscription API functionality:');
    let testSubscription = await prisma.subscription.findFirst({
      where: { userId: testUser.id }
    });
    
    if (testSubscription) {
      testSubscription = await prisma.subscription.update({
        where: { id: testSubscription.id },
        data: { status: 'active' }
      });
      console.log(`✅ Subscription updated: ${testSubscription.planType} (Status: ${testSubscription.status})`);
    } else {
      testSubscription = await prisma.subscription.create({
        data: {
          userId: testUser.id,
          planType: 'premium',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          stripeCustomerId: 'cus_test123',
          stripeSubscriptionId: 'sub_test123'
        }
      });
      console.log(`✅ Subscription created: ${testSubscription.planType} (Status: ${testSubscription.status})`);
    }
    
    console.log('\n✅ All API endpoint tests completed successfully!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ API endpoint test failed:', error.message);
  }
}

testApiEndpoints();
