const fs = require('fs');
const path = require('path');

// Function to get all HTML files recursively
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

// Function to fix common issues in HTML files
function fixHtmlFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Remove duplicate JavaScript sections in header
    const scriptPattern = /<script>\s*\/\/ Preloader functionality[\s\S]*?<\/script>\s*<\/header>/;
    if (scriptPattern.test(content)) {
        content = content.replace(scriptPattern, '</header>');
        modified = true;
        console.log(`  - Removed duplicate JavaScript from header`);
    }
    
    // 2. Fix linter errors in JavaScript (remove extra characters)
    const linterErrorPattern = /\);,\s*100\);\s*}\s*}\s*}/;
    if (linterErrorPattern.test(content)) {
        content = content.replace(linterErrorPattern, ');');
        modified = true;
        console.log(`  - Fixed JavaScript linter errors`);
    }
    
    // 3. Add missing submit-btn class to buttons
    const buttonPattern = /<button type="submit"\s*>/g;
    if (buttonPattern.test(content)) {
        content = content.replace(buttonPattern, '<button type="submit" class="submit-btn">');
        modified = true;
        console.log(`  - Added submit-btn class to buttons`);
    }
    
    // 4. Fix currency symbols from HTML entities to Unicode
    content = content.replace(/&#8358;/g, '₦');
    modified = true;
    console.log(`  - Fixed currency symbols`);
    
    // 5. Update breadcrumb from "Current" to page title
    const breadcrumbPattern = /<span class='breadcrumb-current'>\s*Current\s*<\/span>/;
    if (breadcrumbPattern.test(content)) {
        // Extract page title from the title tag
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);
        if (titleMatch) {
            const pageTitle = titleMatch[1].trim();
            content = content.replace(breadcrumbPattern, `<span class='breadcrumb-current'>\n                            ${pageTitle}\n                        </span>`);
            modified = true;
            console.log(`  - Updated breadcrumb to page title`);
        }
    }
    
    // 6. Add thumbnail-image class to gallery images
    const thumbnailPattern = /<img([^>]*?)onclick="updateMainImage\(this\.src\)"/g;
    if (thumbnailPattern.test(content)) {
        content = content.replace(thumbnailPattern, '<img$1class="thumbnail-image" onclick="updateMainImage(this.src)"');
        modified = true;
        console.log(`  - Added thumbnail-image class to gallery images`);
    }
    
    // 7. Add loading="lazy" to main product images
    const mainImagePattern = /<img id="mainImage"([^>]*?)>/g;
    if (mainImagePattern.test(content)) {
        content = content.replace(mainImagePattern, '<img id="mainImage"$1 loading="lazy">');
        modified = true;
        console.log(`  - Added lazy loading to main images`);
    }
    
    // 8. Update footer structure to match template
    const oldFooterPattern = /<div class="footer-section">\s*<a class="navbar-brand"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/footer>/;
    if (oldFooterPattern.test(content)) {
        const newFooter = `                <div class="footer-content">
                    <div class="footer-section text-center">
                        <a class="navbar-brand d-inline-block" href="index.html">
                            <img class="navbar-brand-item light-mode-item" src="assets/logo/white-logo.png" alt="Inksnap Logo">
                            <img class="navbar-brand-item dark-mode-item" src="assets/logo/white-logo.png" alt="Inksnap Logo">
                        </a>
                        <p>Your trusted partner for all printing needs. Quality prints, competitive prices, fast delivery.</p>
                        <div class="social-icons">
                            <a href="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <a href="products.html">All Products</a>
                        <a href="services.html">Services</a>
                        <a href="quotes.html">Get Quote</a>
                        <a href="track-order.html">Track Order</a>
                        <a href="blog.html">Blog</a>
                        <a href="reseller.html">Reseller Program</a>
                        <a href="calculator.html">Price Calculator</a>
                        <a href="stores.html">Our Stores</a>
                    </div>
                    <div class="footer-section">
                        <h3>Support</h3>
                        <a href="faq.html">FAQ</a>
                        <a href="contact.html">Contact Us</a>
                        <a href="#">Help Center</a>
                        <a href="#">Returns</a>
                    </div>
                    <div class="footer-section">
                        <h3>Legal</h3>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Disclaimer</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; InkSnap 2023 - 2025. All rights reserved.</p>
                </div>`;
        
        content = content.replace(oldFooterPattern, newFooter);
        modified = true;
        console.log(`  - Updated footer structure`);
    }
    
    // 9. Add SEO meta tags if missing
    if (!content.includes('meta name="author"')) {
        const titlePattern = /<title[^>]*>([^<]+)<\/title>/;
        const titleMatch = content.match(titlePattern);
        
        if (titleMatch) {
            const pageTitle = titleMatch[1].trim();
            const seoMetaTags = `
        <!-- SEO Meta Tags -->
        <meta name="description" content="${pageTitle} - Professional printing services in Lagos, Nigeria. Quality prints, competitive prices, fast delivery nationwide.">
        <meta name="keywords" content="${pageTitle.toLowerCase()}, printing, Lagos Nigeria, custom printing, professional printing">
        <meta name="author" content="Oladipo Azeez Olaniyi">
        <meta name="creator" content="Oladipo Azeez Olaniyi">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${pageTitle}">
        <meta property="og:description" content="${pageTitle} - Professional printing services in Lagos, Nigeria. Quality prints, competitive prices, fast delivery.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://inksnap.com.ng/${path.basename(filePath)}">
        <meta property="og:image" content="https://inksnap.com.ng/assets/images/products/detail/product-1.png">
        <meta property="og:site_name" content="Inksnap Nigeria">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${pageTitle}">
        <meta name="twitter:description" content="${pageTitle} - Professional printing services in Lagos, Nigeria.">
        <meta name="twitter:image" content="https://inksnap.com.ng/assets/images/products/detail/product-1.png">
        
        <!-- Canonical URL -->
        <link rel="canonical" href="https://inksnap.com.ng/${path.basename(filePath)}">
        
        <!-- Favicon -->
        <link rel="shortcut icon" href="assets/logo/favicon.png">`;
            
            content = content.replace(titlePattern, titleMatch[0] + seoMetaTags);
            modified = true;
            console.log(`  - Added SEO meta tags`);
        }
    }
    
    // 10. Add structured data if missing
    if (!content.includes('application/ld+json')) {
        const structuredData = `
        
        <!-- Structured Data for SEO -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "${path.basename(filePath, '.html').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}",
            "description": "Professional printing services in Lagos, Nigeria. Quality prints, competitive prices, fast delivery nationwide.",
            "brand": {
                "@type": "Brand",
                "name": "Inksnap"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": "Inksnap Nigeria",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Lagos",
                    "addressCountry": "Nigeria"
                }
            },
            "offers": {
                "@type": "Offer",
                "price": "1000",
                "priceCurrency": "NGN",
                "priceValidUntil": "2024-12-31",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Inksnap Nigeria"
                }
            },
            "image": [
                "https://inksnap.com.ng/assets/images/products/detail/product-1.png"
            ],
            "category": "Printing Services",
            "author": {
                "@type": "Person",
                "name": "Oladipo Azeez Olaniyi"
            }
        }
        </script>`;
        
        content = content.replace('</head>', structuredData + '\n    </head>');
        modified = true;
        console.log(`  - Added structured data`);
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Fixed: ${filePath}`);
    } else {
        console.log(`  ⏭️  No changes needed: ${filePath}`);
    }
    
    return modified;
}

// Main execution
console.log('🔧 Starting to fix all HTML files...\n');

const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files to process.\n`);

let fixedCount = 0;
for (const file of htmlFiles) {
    try {
        if (fixHtmlFile(file)) {
            fixedCount++;
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
}

console.log(`\n🎉 Completed! Fixed ${fixedCount} out of ${htmlFiles.length} files.`);
