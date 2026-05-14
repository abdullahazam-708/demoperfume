const dns = require('dns').promises;

async function testMongoDBConnection() {
    console.log('🔍 Testing MongoDB Atlas Connection...\n');

    const hostname = 'cluster0.gfew68d.mongodb.net';

    console.log(`1. Testing DNS resolution for: ${hostname}`);
    try {
        const addresses = await dns.resolve(hostname);
        console.log('✅ DNS Resolution successful!');
        console.log('   IP Addresses:', addresses);
    } catch (error) {
        console.log('❌ DNS Resolution failed!');
        console.log('   Error:', error.message);
        console.log('\n💡 Possible solutions:');
        console.log('   - Check your internet connection');
        console.log('   - Try using a different DNS server (e.g., 8.8.8.8)');
        console.log('   - Check if your firewall is blocking DNS queries');
        console.log('   - Verify the cluster hostname is correct');
    }

    console.log('\n2. Your current IP address:');
    console.log('   Please visit: https://whatismyipaddress.com/');
    console.log('   Or run: curl ifconfig.me');
    console.log(`   You provided: 139.135.60.57`);

    console.log('\n3. MongoDB Atlas Network Access:');
    console.log('   ⚠️  Make sure to whitelist your IP in MongoDB Atlas:');
    console.log('   - Go to: https://cloud.mongodb.com/');
    console.log('   - Navigate to: Network Access');
    console.log('   - Click: "Add IP Address"');
    console.log('   - Add: 139.135.60.57 (or 0.0.0.0/0 for testing)');
    console.log('   - Click: "Confirm"');

    console.log('\n4. Database User Credentials:');
    console.log('   Username: robertwilliona_db_user');
    console.log('   Password: 8M0dsSL0Oj9waVh5');
    console.log('   ✅ Make sure this user exists in Database Access');
}

testMongoDBConnection();
