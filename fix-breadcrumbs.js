const fs = require('fs');
const path = require('path');

// Function to fix breadcrumb text in a file
function fixBreadcrumbs(filePath) {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Find and fix breadcrumb text patterns
        // Pattern 1: "Product Name - printing company in Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - printing company in Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 2: "Product Name - printing company Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - printing company Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 3: "Product Name - calendar printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - calendar printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 4: "Product Name - poster printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - poster printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 5: "Product Name - banner printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - banner printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 6: "Product Name - flyer printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - flyer printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 7: "Product Name - business card printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - business card printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 8: "Product Name - t-shirt printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - t-shirt printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 9: "Product Name - custom printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - custom printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Pattern 10: "Product Name - promotional printing Lagos Nigeria | Inksnap"
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - promotional printing Lagos Nigeria \| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Generic pattern for any remaining long breadcrumb text
        content = content.replace(
            /<span class=['"]breadcrumb-current['"]>\s*([^-]+) - [^|]+\| Inksnap\s*<\/span>/g,
            '<span class=\'breadcrumb-current\'>\n                            $1\n                        </span>'
        );
        
        // Write the modified content back to the file
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed breadcrumbs in: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No breadcrumb changes needed: ${filePath}`);
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
    console.log('🔍 Searching for HTML files to fix breadcrumb text...');
    
    const htmlFiles = findHtmlFiles('.');
    console.log(`📁 Found ${htmlFiles.length} HTML files`);
    
    let modifiedCount = 0;
    let totalCount = 0;
    
    htmlFiles.forEach(filePath => {
        totalCount++;
        if (fixBreadcrumbs(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total HTML files processed: ${totalCount}`);
    console.log(`Files modified: ${modifiedCount}`);
    console.log(`Files unchanged: ${totalCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n🎉 Breadcrumb text fix completed successfully!');
        console.log('All breadcrumbs now show clean, concise product names.');
    } else {
        console.log('\nℹ️  No files needed breadcrumb fixing.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { fixBreadcrumbs, findHtmlFiles };
