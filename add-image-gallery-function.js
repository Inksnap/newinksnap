const fs = require('fs');
const path = require('path');

// Function to add image gallery functionality to a file
function addImageGalleryFunction(filePath) {
    try {
        // Read the file content
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Check if the file already has the updateMainImage function
        if (content.includes('function updateMainImage')) {
            console.log(`⏭️  Image gallery function already exists in: ${filePath}`);
            return false;
        }
        
        // Check if the file has thumbnail images with onclick="updateMainImage(this.src)"
        if (!content.includes('onclick="updateMainImage(this.src)"')) {
            console.log(`⏭️  No thumbnail gallery found in: ${filePath}`);
            return false;
        }
        
        // Find the position to insert the function (before the closing </script> tag)
        const scriptClosingIndex = content.lastIndexOf('</script>');
        if (scriptClosingIndex === -1) {
            console.log(`⏭️  No script tag found in: ${filePath}`);
            return false;
        }
        
        // The image gallery function to add
        const imageGalleryFunction = `
            // Image gallery functionality
            function updateMainImage(src) {
                const mainImage = document.getElementById('mainImage');
                if (mainImage) {
                    // Remove active class from all thumbnails
                    const allThumbnails = document.querySelectorAll('.thumbnail-image');
                    allThumbnails.forEach(thumb => thumb.classList.remove('active'));
                    
                    // Add active class to clicked thumbnail
                    const clickedThumbnail = event.target;
                    if (clickedThumbnail.classList.contains('thumbnail-image')) {
                        clickedThumbnail.classList.add('active');
                    }
                    
                    // Smooth image transition
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = src;
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            }
            
            // Initialize first thumbnail as active
            document.addEventListener('DOMContentLoaded', function() {
                const firstThumbnail = document.querySelector('.thumbnail-image');
                if (firstThumbnail) {
                    firstThumbnail.classList.add('active');
                }
            });
        `;
        
        // Insert the function before the closing script tag
        content = content.slice(0, scriptClosingIndex) + imageGalleryFunction + content.slice(scriptClosingIndex);
        
        // Write the modified content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Added image gallery function to: ${filePath}`);
        return true;
        
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
    console.log('🔍 Searching for HTML files to add image gallery functionality...');
    
    const htmlFiles = findHtmlFiles('.');
    console.log(`📁 Found ${htmlFiles.length} HTML files`);
    
    let modifiedCount = 0;
    let totalCount = 0;
    
    htmlFiles.forEach(filePath => {
        totalCount++;
        if (addImageGalleryFunction(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total HTML files processed: ${totalCount}`);
    console.log(`Files modified: ${modifiedCount}`);
    console.log(`Files unchanged: ${totalCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n🎉 Image gallery functionality added successfully!');
        console.log('Now clicking on thumbnail images will update the main image display.');
    } else {
        console.log('\nℹ️  No files needed the image gallery function.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { addImageGalleryFunction, findHtmlFiles };
