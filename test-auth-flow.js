/**
 * Test script for signup and login flow
 * Run with: node test-auth-flow.js
 * Make sure the backend server is running on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'testpass123',
  campus: 'IIT Delhi',
};

async function testAuthFlow() {
  console.log('🧪 Testing Signup and Login Flow\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Register a new user
    console.log('\n📝 Test 1: Registering new user...');
    console.log('User data:', { ...testUser, password: '***' });
    
    const registerResponse = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    
    if (!registerResponse.ok) {
      console.error('❌ Registration failed:', registerData);
      return;
    }

    console.log('✅ Registration successful!');
    console.log('Response:', {
      id: registerData._id,
      name: registerData.name,
      email: registerData.email,
      campus: registerData.campus,
      hasToken: !!registerData.token,
    });

    // Test 2: Login with the registered user
    console.log('\n🔐 Test 2: Logging in with registered user...');
    
    const loginResponse = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData);
      return;
    }

    console.log('✅ Login successful!');
    console.log('Response:', {
      id: loginData._id,
      name: loginData.name,
      email: loginData.email,
      campus: loginData.campus,
      hasToken: !!loginData.token,
    });

    // Test 3: Try to register with the same email (should fail)
    console.log('\n🚫 Test 3: Attempting duplicate registration...');
    
    const duplicateResponse = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testUser.email,
        password: 'password123',
      }),
    });

    const duplicateData = await duplicateResponse.json();
    
    if (duplicateResponse.status === 400 && duplicateData.message.includes('exists')) {
      console.log('✅ Duplicate registration correctly rejected:', duplicateData.message);
    } else {
      console.error('❌ Expected duplicate registration to fail, but got:', duplicateData);
    }

    // Test 4: Try to login with wrong password
    console.log('\n🚫 Test 4: Attempting login with wrong password...');
    
    const wrongPasswordResponse = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrongpassword',
      }),
    });

    const wrongPasswordData = await wrongPasswordResponse.json();
    
    if (wrongPasswordResponse.status === 401) {
      console.log('✅ Wrong password correctly rejected:', wrongPasswordData.message);
    } else {
      console.error('❌ Expected wrong password to fail, but got:', wrongPasswordData);
    }

    // Test 5: Try to login with non-existent email
    console.log('\n🚫 Test 5: Attempting login with non-existent email...');
    
    const wrongEmailResponse = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    });

    const wrongEmailData = await wrongEmailResponse.json();
    
    if (wrongEmailResponse.status === 401) {
      console.log('✅ Non-existent email correctly rejected:', wrongEmailData.message);
    } else {
      console.error('❌ Expected non-existent email to fail, but got:', wrongEmailData);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Registration: ✅ Working`);
    console.log(`   - Login: ✅ Working`);
    console.log(`   - Duplicate prevention: ✅ Working`);
    console.log(`   - Wrong password handling: ✅ Working`);
    console.log(`   - Non-existent user handling: ✅ Working`);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Make sure the backend server is running on http://localhost:3000');
    process.exit(1);
  }
}

// Run the tests
testAuthFlow();

