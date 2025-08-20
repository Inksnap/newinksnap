const fs = require('fs');
const path = require('path');

// Enhanced image optimization with advanced SEO
function optimizeImagesForSeo(filePath) {
    console.log(`🖼️  Optimizing images for: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.html').toLowerCase();
    
    // Get relevant keywords for the file
    const keywords = getKeywordsForFile(filePath);
    
    // Enhanced image optimization patterns
    const imageOptimizations = [
        // Main product image optimization
        {
            pattern: /<img id="mainImage"([^>]*?)src="([^"]*)"([^>]*?)>/g,
            replacement: (match, before, src, after) => {
                const imageName = path.basename(src, path.extname(src));
                const enhancedAlt = `${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary} | Professional Quality Printing`;
                const enhancedTitle = `${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary} - High Quality Digital Printing Services`;
                
                return `<img id="mainImage"${before}src="${src}"${after} alt="${enhancedAlt}" title="${enhancedTitle}" loading="lazy" decoding="async">`;
            }
        },
        
        // Thumbnail images optimization
        {
            pattern: /<img([^>]*?)class="thumbnail-image"([^>]*?)src="([^"]*)"([^>]*?)>/g,
            replacement: (match, before, classAttr, src, after) => {
                const imageName = path.basename(src, path.extname(src));
                const enhancedAlt = `${imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary} - Click to View Larger`;
                const enhancedTitle = `${imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary} - High Resolution Preview`;
                
                return `<img${before}${classAttr}src="${src}"${after} alt="${enhancedAlt}" title="${enhancedTitle}" loading="lazy" decoding="async">`;
            }
        },
        
        // Logo images optimization
        {
            pattern: /<img([^>]*?)src="([^"]*logo[^"]*)"([^>]*?)>/g,
            replacement: (match, before, src, after) => {
                const enhancedAlt = `Inksnap Logo - ${keywords.primary} - Professional Printing Company in Lagos Nigeria`;
                const enhancedTitle = `Inksnap Nigeria - ${keywords.primary} - Your Trusted Printing Partner`;
                
                return `<img${before}src="${src}"${after} alt="${enhancedAlt}" title="${enhancedTitle}" loading="lazy">`;
            }
        },
        
        // Related product images optimization
        {
            pattern: /<img([^>]*?)src="([^"]*)"([^>]*?)alt="([^"]*)"([^>]*?)>/g,
            replacement: (match, before, src, after, alt, rest) => {
                if (alt.includes('Logo') || alt.includes('thumbnail') || alt.includes('mainImage')) {
                    return match; // Skip already optimized images
                }
                
                const imageName = path.basename(src, path.extname(src));
                const enhancedAlt = `${alt} - ${keywords.primary} - Professional Printing Services`;
                const enhancedTitle = `${alt} - ${keywords.primary} - High Quality Digital Printing`;
                
                return `<img${before}src="${src}"${after}alt="${enhancedAlt}"${rest} loading="lazy" decoding="async">`;
            }
        },
        
        // Generic image optimization (catch remaining images)
        {
            pattern: /<img([^>]*?)src="([^"]*)"([^>]*?)>/g,
            replacement: (match, before, src, after) => {
                // Skip if already has alt or is already optimized
                if (match.includes('alt=') || match.includes('loading=')) {
                    return match;
                }
                
                const imageName = path.basename(src, path.extname(src));
                const enhancedAlt = `${imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary}`;
                const enhancedTitle = `${imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary} - Professional Printing`;
                
                return `<img${before}src="${src}"${after} alt="${enhancedAlt}" title="${enhancedTitle}" loading="lazy" decoding="async">`;
            }
        }
    ];
    
    // Apply all image optimizations
    let modified = false;
    for (const optimization of imageOptimizations) {
        const newContent = content.replace(optimization.pattern, optimization.replacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }
    
    // Add image schema markup for better SEO
    if (!content.includes('ImageObject')) {
        const imageSchema = `
        <!-- Image Schema Markup -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "name": "${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${keywords.primary}",
            "description": "Professional ${keywords.primary} services with high quality digital printing",
            "url": "https://inksnap.com.ng/assets/images/products/detail/${fileName}.png",
            "thumbnailUrl": "https://inksnap.com.ng/assets/images/products/detail/${fileName}-thumb.png",
            "contentUrl": "https://inksnap.com.ng/assets/images/products/detail/${fileName}.png",
            "width": "800",
            "height": "600",
            "encodingFormat": "image/png",
            "uploadDate": "2024-01-01",
            "creator": {
                "@type": "Organization",
                "name": "Inksnap Nigeria"
            },
            "license": "https://inksnap.com.ng/license",
            "acquireLicensePage": "https://inksnap.com.ng/contact"
        }
        </script>`;
        
        content = content.replace('</head>', imageSchema + '\n    </head>');
        modified = true;
    }
    
    // Add WebP format suggestions for better performance
    const webpOptimization = `
        <!-- WebP Image Optimization -->
        <style>
        .webp-support .main-product-image {
            background-image: url('assets/images/products/detail/${fileName}.webp');
        }
        .webp-support .thumbnail-image {
            background-image: url('assets/images/products/detail/${fileName}-thumb.webp');
        }
        </style>
        <script>
        // WebP support detection
        function checkWebPSupport() {
            const webp = new Image();
            webp.onload = webp.onerror = function () {
                if (webp.height === 2) {
                    document.documentElement.classList.add('webp-support');
                }
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        }
        checkWebPSupport();
        </script>`;
    
    if (!content.includes('WebP Image Optimization')) {
        content = content.replace('</head>', webpOptimization + '\n    </head>');
        modified = true;
    }
    
    // Add image performance optimization
    const performanceOptimization = `
        <!-- Image Performance Optimization -->
        <script>
        // Lazy loading enhancement
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        });
        
        // Image preloading for critical images
        function preloadImage(src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        }
        
        // Preload main product image
        preloadImage('assets/images/products/detail/${fileName}.png');
        </script>`;
    
    if (!content.includes('Image Performance Optimization')) {
        content = content.replace('</body>', performanceOptimization + '\n    </body>');
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Images optimized: ${filePath}`);
        console.log(`  🎯 Enhanced alt tags, titles, lazy loading, and schema markup added`);
    } else {
        console.log(`  ⏭️  Images already optimized: ${filePath}`);
    }
    
    return modified;
}

// Function to get relevant keywords for a file
function getKeywordsForFile(filePath) {
    const fileName = path.basename(filePath, '.html').toLowerCase();
    
    // Enhanced keyword mapping
    const seoKeywords = {
        'funeral': {
            primary: 'funeral printing Lagos Nigeria',
            secondary: 'funeral program printing Lagos, burial banner printing Nigeria',
            longTail: 'funeral printing Lagos Nigeria funeral program, best funeral printing company Lagos'
        },
        'poster': {
            primary: 'poster printing Lagos Nigeria',
            secondary: 'custom poster printing Lagos, large format poster printing Nigeria',
            longTail: 'poster printing Lagos Nigeria A1 A2 A3, best poster printing company Lagos'
        },
        'calendar': {
            primary: 'calendar printing Lagos Nigeria',
            secondary: 'custom calendar printing Lagos, wall calendar printing Nigeria',
            longTail: 'calendar printing Lagos Nigeria 2024, best calendar printing company Lagos'
        },
        'notebook': {
            primary: 'notebook printing Lagos Nigeria',
            secondary: 'custom notebook printing Lagos, branded notebook printing Nigeria',
            longTail: 'notebook printing Lagos Nigeria company logo, best notebook printing company Lagos'
        },
        'tshirt': {
            primary: 't-shirt printing Lagos Nigeria',
            secondary: 'custom t-shirt printing Lagos, t-shirt printing Nigeria',
            longTail: 't-shirt printing Lagos Nigeria bulk orders, best t-shirt printing company Lagos'
        },
        'business-cards': {
            primary: 'business card printing Lagos Nigeria',
            secondary: 'custom business cards Lagos, professional business card printing Nigeria',
            longTail: 'business card printing Lagos Nigeria same day delivery, best business card printing company Lagos'
        },
        'flyer': {
            primary: 'flyer printing Lagos Nigeria',
            secondary: 'custom flyer printing Lagos, professional flyer printing Nigeria',
            longTail: 'flyer printing Lagos Nigeria cheap price, best flyer printing company Lagos'
        },
        'banner': {
            primary: 'banner printing Lagos Nigeria',
            secondary: 'custom banner printing Lagos, roll up banner printing Nigeria',
            longTail: 'banner printing Lagos Nigeria same day, best banner printing company Lagos'
        },
        'sticker': {
            primary: 'sticker printing Lagos Nigeria',
            secondary: 'custom sticker printing Lagos, vinyl sticker printing Nigeria',
            longTail: 'sticker printing Lagos Nigeria same day delivery, best sticker printing company Lagos'
        },
        'brochure': {
            primary: 'brochure printing Lagos Nigeria',
            secondary: 'custom brochure printing Lagos, professional brochure printing Nigeria',
            longTail: 'brochure printing Lagos Nigeria company profile, best brochure printing company Lagos'
        },
        'mug': {
            primary: 'mug printing Lagos Nigeria',
            secondary: 'custom mug printing Lagos, branded mug printing Nigeria',
            longTail: 'mug printing Lagos Nigeria sublimation, best mug printing company Lagos'
        },
        'letterhead': {
            primary: 'letterhead printing Lagos Nigeria',
            secondary: 'custom letterhead printing Lagos, professional letterhead printing Nigeria',
            longTail: 'letterhead printing Lagos Nigeria company letterhead, best letterhead printing company Lagos'
        },
        'certificate': {
            primary: 'certificate printing Lagos Nigeria',
            secondary: 'custom certificate printing Lagos, professional certificate printing Nigeria',
            longTail: 'certificate printing Lagos Nigeria achievement certificate, best certificate printing company Lagos'
        },
        'id-card': {
            primary: 'ID card printing Lagos Nigeria',
            secondary: 'custom ID card printing Lagos, professional ID card printing Nigeria',
            longTail: 'ID card printing Lagos Nigeria employee ID card, best ID card printing company Lagos'
        },
        'badge': {
            primary: 'badge printing Lagos Nigeria',
            secondary: 'custom badge printing Lagos, name badge printing Nigeria',
            longTail: 'badge printing Lagos Nigeria employee badge, best badge printing company Lagos'
        },
        'medal': {
            primary: 'medal printing Lagos Nigeria',
            secondary: 'custom medal printing Lagos, achievement medal printing Nigeria',
            longTail: 'medal printing Lagos Nigeria commemorative medal, best medal printing company Lagos'
        },
        'vehicle': {
            primary: 'vehicle branding Lagos Nigeria',
            secondary: 'car branding Lagos, vehicle wrap printing Nigeria',
            longTail: 'vehicle branding Lagos Nigeria car wrap, best vehicle branding company Lagos'
        },
        'wedding': {
            primary: 'wedding printing Lagos Nigeria',
            secondary: 'wedding invitation printing Lagos, wedding banner printing Nigeria',
            longTail: 'wedding printing Lagos Nigeria invitation cards, best wedding printing company Lagos'
        },
        'birthday': {
            primary: 'birthday printing Lagos Nigeria',
            secondary: 'birthday banner printing Lagos, birthday invitation printing Nigeria',
            longTail: 'birthday printing Lagos Nigeria birthday banner, best birthday printing company Lagos'
        }
    };
    
    // Find matching keywords
    for (const [key, keywords] of Object.entries(seoKeywords)) {
        if (fileName.includes(key) || fileName.includes(key.replace('-', ''))) {
            return keywords;
        }
    }
    
    // Default keywords for general pages
    return {
        primary: 'printing company in Lagos Nigeria',
        secondary: 'best printing services Lagos, professional printing Nigeria, printing company near me',
        longTail: 'printing company in Lagos Nigeria with fast delivery, best printing services in Lagos Nigeria 2024'
    };
}

// Function to get all HTML files
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
console.log('🖼️  Starting Advanced Image SEO Optimization...\n');

const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files to optimize images.\n`);

let optimizedCount = 0;
for (const file of htmlFiles) {
    try {
        if (optimizeImagesForSeo(file)) {
            optimizedCount++;
        }
    } catch (error) {
        console.error(`❌ Error optimizing images in ${file}:`, error.message);
    }
}

console.log(`\n🎉 Advanced Image SEO Optimization Complete!`);
console.log(`✅ Optimized images in ${optimizedCount} out of ${htmlFiles.length} files`);
console.log(`🖼️  Enhanced features added:`);
console.log(`   • Descriptive alt tags with keywords`);
console.log(`   • Informative title attributes`);
console.log(`   • Lazy loading for all images`);
console.log(`   • Image schema markup`);
console.log(`   • WebP format suggestions`);
console.log(`   • Performance optimization`);
console.log(`📈 Expected results: Better image SEO, faster loading, higher Google rankings!`);
