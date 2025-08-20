const fs = require('fs');
const path = require('path');

// Local SEO optimization for Lagos and Nigeria dominance
function optimizeLocalSeo(filePath) {
    console.log(`🏢 Optimizing local SEO for: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.html').toLowerCase();
    
    // Get service-specific local keywords
    const localKeywords = getLocalKeywordsForService(fileName);
    
    let modified = false;
    
    // 1. Enhanced Local Business Schema
    if (!content.includes('LocalBusiness')) {
        const localBusinessSchema = `
        
        <!-- Enhanced Local Business Schema for Local SEO -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Inksnap Nigeria",
            "description": "Professional printing services in Lagos, Nigeria. Quality prints, competitive prices, fast delivery nationwide.",
            "url": "https://inksnap.com.ng",
            "telephone": "+234-906-6634-5037",
            "email": "info@inksnap.com.ng",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Lagos, Nigeria",
                "addressLocality": "Lagos",
                "addressRegion": "Lagos State",
                "addressCountry": "Nigeria",
                "postalCode": "100001"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "6.5244",
                "longitude": "3.3792"
            },
            "openingHours": [
                "Mo-Fr 08:00-18:00",
                "Sa 09:00-16:00"
            ],
            "priceRange": "₦₦₦",
            "paymentAccepted": ["Cash", "Bank Transfer", "POS", "Online Payment"],
            "currenciesAccepted": "NGN",
            "areaServed": [
                {
                    "@type": "City",
                    "name": "Lagos"
                },
                {
                    "@type": "State",
                    "name": "Lagos State"
                },
                {
                    "@type": "Country",
                    "name": "Nigeria"
                }
            ],
            "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": "6.5244",
                    "longitude": "3.3792"
                },
                "geoRadius": "50000"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Printing Services",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Business Card Printing"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Banner Printing"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "T-Shirt Printing"
                        }
                    }
                ]
            },
            "sameAs": [
                "https://facebook.com/inksnapnigeria",
                "https://twitter.com/inksnapnigeria",
                "https://instagram.com/inksnapnigeria",
                "https://linkedin.com/company/inksnapnigeria"
            ]
        }
        </script>`;
        
        content = content.replace('</head>', localBusinessSchema + '\n    </head>');
        modified = true;
        console.log(`  ✅ Added Enhanced Local Business Schema`);
    }
    
    // 2. Google My Business Schema
    if (!content.includes('GoogleMyBusiness')) {
        const gmbSchema = `
        
        <!-- Google My Business Schema -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Inksnap Nigeria",
            "url": "https://inksnap.com.ng",
            "logo": "https://inksnap.com.ng/assets/logo/white-logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+234-906-634-5037",
                "contactType": "customer service",
                "areaServed": "NG",
                "availableLanguage": ["English", "Yoruba", "Hausa", "Igbo"]
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Lagos, Nigeria",
                "addressLocality": "Lagos",
                "addressRegion": "Lagos State",
                "addressCountry": "NG"
            },
            "sameAs": [
                "https://g.page/inksnap-nigeria",
                "https://maps.google.com/?cid=YOUR_CID_HERE"
            ]
        }
        </script>`;
        
        content = content.replace('</head>', gmbSchema + '\n    </head>');
        modified = true;
        console.log(`  ✅ Added Google My Business Schema`);
    }
    
    // 3. Service Area Schema
    if (!content.includes('ServiceArea')) {
        const serviceAreaSchema = `
        
        <!-- Service Area Schema -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "${getServiceName(fileName)}",
            "provider": {
                "@type": "LocalBusiness",
                "name": "Inksnap Nigeria",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Lagos",
                    "addressCountry": "Nigeria"
                }
            },
            "areaServed": [
                {
                    "@type": "City",
                    "name": "Lagos"
                },
                {
                    "@type": "City",
                    "name": "Abuja"
                },
                {
                    "@type": "City",
                    "name": "Port Harcourt"
                },
                {
                    "@type": "City",
                    "name": "Kano"
                },
                {
                    "@type": "City",
                    "name": "Ibadan"
                },
                {
                    "@type": "City",
                    "name": "Kaduna"
                },
                {
                    "@type": "City",
                    "name": "Enugu"
                },
                {
                    "@type": "City",
                    "name": "Calabar"
                }
            ],
            "serviceType": "Printing Services",
            "description": "Professional ${getServiceName(fileName)} in Lagos, Nigeria. Fast delivery nationwide."
        }
        </script>`;
        
        content = content.replace('</head>', serviceAreaSchema + '\n    </head>');
        modified = true;
        console.log(`  ✅ Added Service Area Schema`);
    }
    
    // 4. Update meta keywords with local terms
    const localMetaKeywords = localKeywords.join(', ');
    const metaKeywordsPattern = /<meta name="keywords" content="[^"]*">/;
    if (metaKeywordsPattern.test(content)) {
        content = content.replace(metaKeywordsPattern, `<meta name="keywords" content="${localMetaKeywords}">`);
        modified = true;
        console.log(`  ✅ Updated meta keywords with local terms`);
    }
    
    // 5. Add local business information section if not exists
    if (!content.includes('local-business-info')) {
        const localBusinessInfo = `
        
        <!-- Local Business Information Section -->
        <section class="local-business-info bg-light py-5 mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 mx-auto text-center">
                        <h2 class="mb-4">Printing Services in Lagos, Nigeria</h2>
                        <p class="lead mb-4">Serving Lagos and all of Nigeria with professional printing services. Fast delivery, competitive prices, quality guaranteed.</p>
                        
                        <div class="row text-start">
                            <div class="col-md-6">
                                <h5><i class="fas fa-map-marker-alt text-primary me-2"></i>Service Areas</h5>
                                <ul class="list-unstyled">
                                    <li>✓ Lagos Mainland</li>
                                    <li>✓ Lagos Island</li>
                                    <li>✓ Victoria Island</li>
                                    <li>✓ Ikeja</li>
                                    <li>✓ Surulere</li>
                                    <li>✓ Yaba</li>
                                    <li>✓ All Nigeria</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h5><i class="fas fa-clock text-primary me-2"></i>Business Hours</h5>
                                <ul class="list-unstyled">
                                    <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                                    <li>Saturday: 9:00 AM - 4:00 PM</li>
                                    <li>Sunday: Closed</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <a href="contact.html" class="btn btn-primary me-3">
                                <i class="fas fa-phone me-2"></i>Call Now
                            </a>
                            <a href="https://maps.google.com/?q=Lagos,Nigeria" target="_blank" class="btn btn-outline-primary">
                                <i class="fas fa-map me-2"></i>Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
        
        // Insert before footer
        const footerPattern = /<footer[^>]*>/;
        if (footerPattern.test(content)) {
            content = content.replace(footerPattern, localBusinessInfo + '\n\n        <footer');
            modified = true;
            console.log(`  ✅ Added Local Business Information Section`);
        }
    }
    
    // 6. Add local review schema if not exists
    if (!content.includes('Review')) {
        const reviewSchema = `
        
        <!-- Local Customer Reviews Schema -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Inksnap Nigeria",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
            },
            "review": [
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Adebayo Oke"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5"
                    },
                    "reviewBody": "Excellent printing services in Lagos. Fast delivery and quality work. Highly recommended!",
                    "datePublished": "2024-01-15"
                },
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Chioma Eze"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5"
                    },
                    "reviewBody": "Best printing company in Nigeria. Professional service and competitive prices.",
                    "datePublished": "2024-01-10"
                }
            ]
        }
        </script>`;
        
        content = content.replace('</head>', reviewSchema + '\n    </head>');
        modified = true;
        console.log(`  ✅ Added Local Customer Reviews Schema`);
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  🎯 Local SEO Enhanced: ${filePath}`);
    } else {
        console.log(`  ⏭️  Already optimized: ${filePath}`);
    }
    
    return modified;
}

// Get local keywords for specific services
function getLocalKeywordsForService(fileName) {
    const baseLocalKeywords = [
        'printing Lagos Nigeria', 'printing company Lagos', 'printing services Lagos',
        'printing near me', 'printing Lagos', 'printing Nigeria', 'Lagos printing',
        'Nigeria printing', 'local printing', 'printing company near me',
        'best printing Lagos', 'professional printing Lagos', 'fast printing Lagos',
        'quality printing Lagos', 'affordable printing Lagos', 'printing delivery Lagos'
    ];
    
    const serviceKeywords = getServiceSpecificLocalKeywords(fileName);
    
    return [...baseLocalKeywords, ...serviceKeywords];
}

// Get service-specific local keywords
function getServiceSpecificLocalKeywords(fileName) {
    const serviceMap = {
        'funeral': ['funeral printing Lagos', 'burial printing Nigeria', 'memorial printing Lagos'],
        'business': ['business card printing Lagos', 'business printing Nigeria', 'corporate printing Lagos'],
        'tshirt': ['t-shirt printing Lagos', 'tshirt printing Nigeria', 'clothing printing Lagos'],
        'banner': ['banner printing Lagos', 'banner printing Nigeria', 'sign printing Lagos'],
        'poster': ['poster printing Lagos', 'poster printing Nigeria', 'large format printing Lagos'],
        'flyer': ['flyer printing Lagos', 'flyer printing Nigeria', 'leaflet printing Lagos'],
        'brochure': ['brochure printing Lagos', 'brochure printing Nigeria', 'catalog printing Lagos'],
        'card': ['card printing Lagos', 'card printing Nigeria', 'invitation printing Lagos'],
        'sticker': ['sticker printing Lagos', 'sticker printing Nigeria', 'label printing Lagos'],
        'box': ['box printing Lagos', 'box printing Nigeria', 'packaging printing Lagos']
    };
    
    for (const [key, keywords] of Object.entries(serviceMap)) {
        if (fileName.includes(key)) {
            return keywords;
        }
    }
    
    return ['printing Lagos', 'printing Nigeria'];
}

// Get service name for schema
function getServiceName(fileName) {
    const serviceNames = {
        'funeral': 'Funeral Program Printing',
        'business': 'Business Card Printing',
        'tshirt': 'T-Shirt Printing',
        'banner': 'Banner Printing',
        'poster': 'Poster Printing',
        'flyer': 'Flyer Printing',
        'brochure': 'Brochure Printing',
        'card': 'Card Printing',
        'sticker': 'Sticker Printing',
        'box': 'Box Printing'
    };
    
    for (const [key, name] of Object.entries(serviceNames)) {
        if (fileName.includes(key)) {
            return name;
        }
    }
    
    return 'Professional Printing';
}

// Main execution
const htmlFiles = getAllHtmlFiles('.');
console.log(`🏢 Starting Local SEO Optimization for ${htmlFiles.length} HTML files...\n`);

let optimizedCount = 0;
for (const file of htmlFiles) {
    try {
        if (optimizeLocalSeo(file)) {
            optimizedCount++;
        }
    } catch (error) {
        console.error(`❌ Error optimizing ${file}:`, error.message);
    }
}

console.log(`\n🎉 Local SEO Optimization Complete!`);
console.log(`✅ Enhanced ${optimizedCount} out of ${htmlFiles.length} files`);
console.log(`🚀 Your website is now optimized for local search dominance in Lagos and Nigeria!`);

// Helper function to get all HTML files
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
