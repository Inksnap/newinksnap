const fs = require('fs');
const path = require('path');

// Function to fix naira symbols in a file
function fixNairaSymbols(filePath) {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace all instances of ? followed by numbers with ₦ followed by numbers
        // This regex matches ? followed by numbers, commas, and decimal points
        content = content.replace(/\?([0-9,]+(?:\.\d{2})?)/g, '₦$1');
        
        // Also replace standalone ? that might be followed by numbers in different contexts
        content = content.replace(/\?(\s*[0-9,]+(?:\.\d{2})?)/g, '₦$1');
        
        // Write the fixed content back to the file
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'backend') {
            fileList = findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Main execution
function main() {
    console.log('🔍 Searching for HTML files with naira symbol issues...');
    
    const htmlFiles = findHtmlFiles('.');
    console.log(`📁 Found ${htmlFiles.length} HTML files`);
    
    let fixedCount = 0;
    let totalCount = 0;
    
    htmlFiles.forEach(filePath => {
        totalCount++;
        if (fixNairaSymbols(filePath)) {
            fixedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total HTML files processed: ${totalCount}`);
    console.log(`Files fixed: ${fixedCount}`);
    console.log(`Files unchanged: ${totalCount - fixedCount}`);
    
    if (fixedCount > 0) {
        console.log('\n🎉 Naira symbol fix completed successfully!');
    } else {
        console.log('\nℹ️  No files needed fixing.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { fixNairaSymbols, findHtmlFiles };
