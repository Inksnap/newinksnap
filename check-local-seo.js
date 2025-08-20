const fs = require('fs');
const path = require('path');

console.log('🔍 Local SEO Performance Checker');
console.log('================================\n');

// Check if local SEO elements are properly implemented
function checkLocalSeoImplementation(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
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
        
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        const score = Math.round((passedChecks / totalChecks) * 100);
        
        return {
            fileName,
            checks,
            score,
            passedChecks,
            totalChecks
        };
    } catch (error) {
        return {
            fileName: path.basename(filePath),
            error: error.message
        };
    }
}

// Get all HTML files
function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'Price List') {
            getAllHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html') && !item.includes('index')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Main execution
const htmlFiles = getAllHtmlFiles('.');
console.log(`📊 Analyzing ${htmlFiles.length} HTML files for Local SEO implementation...\n`);

let totalScore = 0;
let filesWithErrors = 0;
const results = [];

for (const file of htmlFiles) {
    const result = checkLocalSeoImplementation(file);
    if (result.error) {
        filesWithErrors++;
        console.log(`❌ ${result.fileName}: ${result.error}`);
    } else {
        results.push(result);
        totalScore += result.score;
        
        if (result.score < 80) {
            console.log(`⚠️  ${result.fileName}: ${result.score}% (${result.passedChecks}/${result.totalChecks})`);
        } else {
            console.log(`✅ ${result.fileName}: ${result.score}% (${result.passedChecks}/${result.totalChecks})`);
        }
    }
}

console.log('\n📈 Local SEO Performance Summary:');
console.log('==================================');

if (results.length > 0) {
    const averageScore = Math.round(totalScore / results.length);
    console.log(`🏆 Overall Local SEO Score: ${averageScore}%`);
    console.log(`📁 Files Analyzed: ${results.length}`);
    console.log(`❌ Files with Errors: ${filesWithErrors}`);
    
    // Score breakdown
    const excellent = results.filter(r => r.score >= 90).length;
    const good = results.filter(r => r.score >= 80 && r.score < 90).length;
    const needsImprovement = results.filter(r => r.score < 80).length;
    
    console.log(`\n📊 Score Breakdown:`);
    console.log(`   🟢 Excellent (90%+): ${excellent} files`);
    console.log(`   🟡 Good (80-89%): ${good} files`);
    console.log(`   🔴 Needs Improvement (<80%): ${needsImprovement} files`);
    
    // Detailed analysis - Show overall status across all files
    if (results.length > 0) {
        // Calculate overall status for each check across all files
        const overallChecks = {
            'Local Business Schema': results.filter(r => r.checks['Local Business Schema']).length,
            'Google My Business Schema': results.filter(r => r.checks['Google My Business Schema']).length,
            'Service Area Schema': results.filter(r => r.checks['Service Area Schema']).length,
            'Local Keywords': results.filter(r => r.checks['Local Keywords']).length,
            'Local Business Info Section': results.filter(r => r.checks['Local Business Info Section']).length,
            'Customer Reviews Schema': results.filter(r => r.checks['Customer Reviews Schema']).length,
            'Local Contact Info': results.filter(r => r.checks['Local Contact Info']).length,
            'Service Areas Listed': results.filter(r => r.checks['Service Areas Listed']).length,
            'Business Hours': results.filter(r => r.checks['Business Hours']).length,
            'Local Call-to-Action': results.filter(r => r.checks['Local Call-to-Action']).length
        };
        
        console.log(`\n🔍 Overall Local SEO Elements Status (${results.length} files):`);
        console.log(`   📍 Local Business Schema: ${overallChecks['Local Business Schema'] > 0 ? '✅' : '❌'} (${overallChecks['Local Business Schema']}/${results.length} files)`);
        console.log(`   🏢 Google My Business Schema: ${overallChecks['Google My Business Schema'] > 0 ? '✅' : '❌'} (${overallChecks['Google My Business Schema']}/${results.length} files)`);
        console.log(`   🌍 Service Area Schema: ${overallChecks['Service Area Schema'] > 0 ? '✅' : '❌'} (${overallChecks['Service Area Schema']}/${results.length} files)`);
        console.log(`   🎯 Local Keywords: ${overallChecks['Local Keywords'] > 0 ? '✅' : '❌'} (${overallChecks['Local Keywords']}/${results.length} files)`);
        console.log(`   ℹ️  Local Business Info: ${overallChecks['Local Business Info Section'] > 0 ? '✅' : '❌'} (${overallChecks['Local Business Info Section']}/${results.length} files)`);
        console.log(`   ⭐ Customer Reviews: ${overallChecks['Customer Reviews Schema'] > 0 ? '✅' : '❌'} (${overallChecks['Customer Reviews Schema']}/${results.length} files)`);
        console.log(`   📞 Local Contact: ${overallChecks['Local Contact Info'] > 0 ? '✅' : '❌'} (${overallChecks['Local Contact Info']}/${results.length} files)`);
        console.log(`   🗺️  Service Areas: ${overallChecks['Service Areas Listed'] > 0 ? '✅' : '❌'} (${overallChecks['Service Areas Listed']}/${results.length} files)`);
        console.log(`   🕒 Business Hours: ${overallChecks['Business Hours'] > 0 ? '✅' : '❌'} (${overallChecks['Business Hours']}/${results.length} files)`);
        console.log(`   🎯 Local CTA: ${overallChecks['Local Call-to-Action'] > 0 ? '✅' : '❌'} (${overallChecks['Local Call-to-Action']}/${results.length} files)`);
    }
    
    // Recommendations
    console.log(`\n💡 Recommendations:`);
    if (averageScore >= 90) {
        console.log(`   🎉 Excellent! Your Local SEO is well-optimized.`);
        console.log(`   🚀 Focus on getting customer reviews and Google My Business optimization.`);
    } else if (averageScore >= 80) {
        console.log(`   👍 Good Local SEO implementation.`);
        console.log(`   🔧 Check files with scores below 80% for improvements.`);
    } else {
        console.log(`   ⚠️  Local SEO needs attention.`);
        console.log(`   🔧 Focus on implementing missing Local Business Schema and local keywords.`);
    }
    
    console.log(`\n🔍 Next Steps:`);
    console.log(`   1. Test the queries from 'local-seo-test-queries.txt'`);
    console.log(`   2. Check Google Search Console for local search performance`);
    console.log(`   3. Verify Google My Business listing is active`);
    console.log(`   4. Monitor local search rankings weekly`);
    
} else {
    console.log('❌ No HTML files could be analyzed.');
}

console.log(`\n📋 Detailed results saved to 'local-seo-analysis.txt'`);

// Save detailed results to file
const analysisReport = `Local SEO Analysis Report
Generated: ${new Date().toLocaleString()}

Overall Score: ${results.length > 0 ? Math.round(totalScore / results.length) : 0}%
Files Analyzed: ${results.length}
Files with Errors: ${filesWithErrors}

Detailed Results:
${results.map(r => `${r.fileName}: ${r.score}% (${r.passedChecks}/${r.totalChecks})`).join('\n')}

Recommendations:
${results.length > 0 ? 
    (Math.round(totalScore / results.length) >= 90 ? 
        '🎉 Excellent Local SEO! Focus on reviews and GMB optimization.' :
        Math.round(totalScore / results.length) >= 80 ?
        '👍 Good Local SEO. Check low-scoring files for improvements.' :
        '⚠️  Local SEO needs attention. Implement missing schema and keywords.'
    ) : 'No files analyzed.'
}

Next Steps:
1. Test local search queries
2. Check Google Search Console
3. Verify Google My Business
4. Monitor rankings weekly
`;

fs.writeFileSync('local-seo-analysis.txt', analysisReport);
console.log('✅ Analysis complete! Check your local SEO performance above.');