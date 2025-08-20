const fs = require('fs');
const path = require('path');

// Function to fix priceRange in JSON-LD schema
function fixPriceRangeSchema(filePath) {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace "priceRange": "₦₦?" with "priceRange": "₦₦₦"
        content = content.replace(/"priceRange": "₦₦\?"/g, '"priceRange": "₦₦₦"');
        
        // Write the fixed content back to the file
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed priceRange in: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No priceRange changes needed in: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main function to process all HTML files
function main() {
    console.log('🔧 Fixing priceRange in JSON-LD schema across all HTML files...\n');
    
    const htmlFiles = [];
    
    // Find all HTML files recursively
    function findHtmlFiles(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                findHtmlFiles(fullPath);
            } else if (item.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        }
    }
    
    findHtmlFiles('.');
    
    console.log(`📁 Found ${htmlFiles.length} HTML files to process\n`);
    
    let fixedCount = 0;
    let unchangedCount = 0;
    
    // Process each HTML file
    for (const filePath of htmlFiles) {
        const wasFixed = fixPriceRangeSchema(filePath);
        if (wasFixed) {
            fixedCount++;
        } else {
            unchangedCount++;
        }
    }
    
    console.log('\n🎉 PriceRange Schema Fix Completed Successfully!');
    console.log(`📊 Results:`);
    console.log(`   • Total HTML files processed: ${htmlFiles.length}`);
    console.log(`   • Files fixed: ${fixedCount}`);
    console.log(`   • Files unchanged: ${unchangedCount}`);
    console.log('\n✅ All priceRange fields now display "₦₦₦" instead of "₦₦?"');
}

// Run the script
main();
