// Image Update Script for Inksnap Project
// This script helps you update placeholder images in your HTML files

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    // Directory containing HTML files
    htmlDir: '.',
    // Image directory structure
    imageBasePath: 'assets/images/products',
    // File extensions to process
    extensions: ['.html'],
    // Backup original files
    createBackup: true
};

// Product image mappings
const productImageMappings = {
    'a5menu-card-printing.html': {
        main: 'menu-cards/a5-menu-card-main.jpg',
        samples: [
            'menu-cards/a5-menu-card-sample1.jpg',
            'menu-cards/a5-menu-card-sample2.jpg',
            'menu-cards/a5-menu-card-sample3.jpg'
        ],
        related: [
            'menu-cards/a4-menu-card.jpg',
            'menu-cards/table-tent.jpg',
            'menu-cards/food-packaging.jpg',
            'menu-cards/restaurant-flyer.jpg'
        ]
    },
    'tshirt-printing.html': {
        main: 'tshirts/tshirt-main.jpg',
        samples: [
            'tshirts/tshirt-sample1.jpg',
            'tshirts/tshirt-sample2.jpg',
            'tshirts/tshirt-sample3.jpg',
            'tshirts/tshirt-sample4.jpg'
        ],
        related: [
            'tshirts/hoodie.jpg',
            'tshirts/cap.jpg',
            'tshirts/bag.jpg'
        ]
    },
    'business-cards.html': {
        main: 'business-cards/business-card-main.jpg',
        samples: [
            'business-cards/business-card-sample1.jpg',
            'business-cards/business-card-sample2.jpg',
            'business-cards/business-card-sample3.jpg'
        ],
        related: [
            'flyers/flyer.jpg',
            'stickers/sticker.jpg',
            'postcards/postcard.jpg',
            'notebooks/notebook.jpg'
        ]
    }
    // Add more product mappings as needed
};

// Function to create backup
function createBackup(filePath) {
    if (!config.createBackup) return;
    
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`Created backup: ${backupPath}`);
    }
}

// Function to update placeholder images
function updatePlaceholderImages(content, productMapping) {
    let updatedContent = content;
    
    // Update main image
    if (productMapping.main) {
        const mainImagePath = `${config.imageBasePath}/${productMapping.main}`;
        updatedContent = updatedContent.replace(
            /src="\/placeholder\.svg\?height=400&width=400[^"]*"/g,
            `src="${mainImagePath}"`
        );
    }
    
    // Update sample images
    if (productMapping.samples) {
        productMapping.samples.forEach((sample, index) => {
            const samplePath = `${config.imageBasePath}/${sample}`;
            const placeholderRegex = new RegExp(
                `src="\/placeholder\.svg\\?height=100&width=100[^"]*".*?alt="[^"]*Sample\\s*${index + 1}[^"]*"`,
                'g'
            );
            updatedContent = updatedContent.replace(
                placeholderRegex,
                `src="${samplePath}"`
            );
        });
    }
    
    // Update related product images
    if (productMapping.related) {
        productMapping.related.forEach((related, index) => {
            const relatedPath = `${config.imageBasePath}/${related}`;
            const placeholderRegex = new RegExp(
                `src="\/placeholder\.svg\\?height=200&width=280[^"]*".*?alt="[^"]*"`,
                'g'
            );
            // This is a simplified replacement - you might need to adjust based on your HTML structure
            updatedContent = updatedContent.replace(
                placeholderRegex,
                `src="${relatedPath}"`
            );
        });
    }
    
    return updatedContent;
}

// Function to process a single HTML file
function processHtmlFile(filePath) {
    const fileName = path.basename(filePath);
    const productMapping = productImageMappings[fileName];
    
    if (!productMapping) {
        console.log(`No mapping found for ${fileName}, skipping...`);
        return;
    }
    
    try {
        // Create backup
        createBackup(filePath);
        
        // Read file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update images
        const updatedContent = updatePlaceholderImages(content, productMapping);
        
        // Write updated content
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated images in: ${fileName}`);
        } else {
            console.log(`No changes needed for: ${fileName}`);
        }
        
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error.message);
    }
}

// Function to find HTML files
function findHtmlFiles(dir) {
    const files = [];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const itemPath = path.join(currentDir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                scanDirectory(itemPath);
            } else if (stat.isFile() && config.extensions.includes(path.extname(item))) {
                files.push(itemPath);
            }
        }
    }
    
    scanDirectory(dir);
    return files;
}

// Main execution
function main() {
    console.log('Starting image update process...');
    console.log('=====================================');
    
    const htmlFiles = findHtmlFiles(config.htmlDir);
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    let processedCount = 0;
    
    for (const filePath of htmlFiles) {
        const fileName = path.basename(filePath);
        if (productImageMappings[fileName]) {
            processHtmlFile(filePath);
            processedCount++;
        }
    }
    
    console.log('=====================================');
    console.log(`Processed ${processedCount} files with image mappings`);
    console.log('Image update process completed!');
    
    console.log('\nNext steps:');
    console.log('1. Replace placeholder files with actual images');
    console.log('2. Test the updated pages in your browser');
    console.log('3. Optimize images for web use');
    console.log('4. Update alt text for better accessibility');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    updatePlaceholderImages,
    processHtmlFile,
    findHtmlFiles
}; 