const fs = require('fs');
const path = require('path');

// Function to remove prices from "You Might Like" sections in a file
function removePricesFromRelated(filePath) {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Remove price divs that contain "From ₦" or "Starting from ₦" in related products sections
        // This regex matches the entire price div structure
        content = content.replace(/<div class="price">\s*From ₦[^<]*<\/div>/g, '');
        content = content.replace(/<div class="price">\s*Starting from ₦[^<]*<\/div>/g, '');
        
        // Also remove any remaining price divs that might have different formats
        content = content.replace(/<div class="price">\s*₦[^<]*<\/div>/g, '');
        
        // Clean up any extra whitespace that might be left
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // Write the modified content back to the file
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Removed prices from: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No price changes needed: ${filePath}`);
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
    console.log('🔍 Searching for HTML files to remove prices from "You Might Like" sections...');
    
    const htmlFiles = findHtmlFiles('.');
    console.log(`📁 Found ${htmlFiles.length} HTML files`);
    
    let modifiedCount = 0;
    let totalCount = 0;
    
    htmlFiles.forEach(filePath => {
        totalCount++;
        if (removePricesFromRelated(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total HTML files processed: ${totalCount}`);
    console.log(`Files modified: ${modifiedCount}`);
    console.log(`Files unchanged: ${totalCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n🎉 Price removal from "You Might Like" sections completed successfully!');
    } else {
        console.log('\nℹ️  No files needed price removal.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { removePricesFromRelated, findHtmlFiles };
