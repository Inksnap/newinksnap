const fs = require('fs');

// Test schema detection for a specific file
const testFile = 'a3-paper-bag-details.html';
const content = fs.readFileSync(testFile, 'utf8');

console.log('🔍 Testing Schema Detection for:', testFile);
console.log('=====================================\n');

const checks = {
    'Local Business Schema': content.includes('"@type": "LocalBusiness"'),
    'Google My Business Schema': content.includes('"@type": "Organization"'),
    'Service Area Schema': content.includes('"@type": "Service"'),
    'Local Keywords': content.includes('printing Lagos') || content.includes('printing Nigeria'),
    'Local Business Info Section': content.includes('local-business-info'),
    'Customer Reviews Schema': content.includes('"@type": "Review"'),
    'Local Contact Info': content.includes('+234') || content.includes('Lagos, Nigeria'),
    'Service Areas Listed': content.includes('Lagos Mainland') || content.includes('Victoria Island'),
    'Business Hours': content.includes('8:00 AM - 6:00 PM') || content.includes('Monday - Friday'),
    'Local Call-to-Action': content.includes('Call Now') || content.includes('Get Directions')
};

console.log('📊 Schema Detection Results:');
console.log('============================');
Object.entries(checks).forEach(([key, value]) => {
    console.log(`${value ? '✅' : '❌'} ${key}: ${value}`);
});

const passedChecks = Object.values(checks).filter(Boolean).length;
const totalChecks = Object.keys(checks).length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`\n🏆 Overall Score: ${score}% (${passedChecks}/${totalChecks})`);

// Show actual schema content found
console.log('\n🔍 Actual Schema Content Found:');
console.log('================================');

if (content.includes('"@type": "LocalBusiness"')) {
    console.log('✅ LocalBusiness schema found');
    const matches = content.match(/"@type": "LocalBusiness"[^}]*}/g);
    if (matches) {
        console.log(`   Found ${matches.length} instances`);
    }
}

if (content.includes('"@type": "Organization"')) {
    console.log('✅ Organization schema found');
    const matches = content.match(/"@type": "Organization"[^}]*}/g);
    if (matches) {
        console.log(`   Found ${matches.length} instances`);
    }
}

if (content.includes('"@type": "Service"')) {
    console.log('✅ Service schema found');
    const matches = content.match(/"@type": "Service"[^}]*}/g);
    if (matches) {
        console.log(`   Found ${matches.length} instances`);
    }
}
