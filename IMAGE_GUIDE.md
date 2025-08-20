# Image Management Guide for Inksnap Project

## Overview
This guide explains how to add and manage images in your Inksnap printing website project.

## Directory Structure
```
assets/
├── images/
│   ├── products/           # Product-specific images
│   │   ├── menu-cards/     # Menu card images
│   │   ├── tshirts/        # T-shirt images
│   │   ├── business-cards/ # Business card images
│   │   └── ...
│   ├── header/             # Header images
│   ├── welcome/            # Welcome section images
│   ├── background/         # Background images
│   ├── social/             # Social media images
│   └── ...
├── logo/                   # Logo files
└── icons/                  # Icon files
```

## Adding Images to Your Project

### 1. For Product Pages (like A5 Menu Cards)

#### Step 1: Create Product-Specific Directory
```bash
mkdir -p "assets/images/products/[product-name]"
```

#### Step 2: Add Your Images
Place your images in the appropriate directory with descriptive names:
- `[product]-main.jpg` - Main product image (400x400px or larger)
- `[product]-sample1.jpg` - Sample 1 thumbnail (100x100px)
- `[product]-sample2.jpg` - Sample 2 thumbnail (100x100px)
- `[product]-sample3.jpg` - Sample 3 thumbnail (100x100px)

#### Step 3: Update HTML File
Replace placeholder image paths in your HTML file:

**Before:**
```html
<img src="/placeholder.svg?height=400&width=400&text=A5+Menu+Card+Sample" alt="A5 Menu Card Printing">
```

**After:**
```html
<img src="assets/images/products/menu-cards/a5-menu-card-main.jpg" alt="A5 Menu Card Printing">
```

### 2. Image Requirements

#### Recommended Dimensions:
- **Main Product Images**: 400x400px or larger
- **Thumbnail Images**: 100x100px
- **Related Product Images**: 280x200px
- **Hero/Banner Images**: 1200x400px or larger
- **Logo Images**: 200x80px

#### File Formats:
- **JPG/JPEG**: For photographs and complex images
- **PNG**: For images with transparency
- **SVG**: For icons and simple graphics
- **WebP**: For better compression (modern browsers)

#### File Size Guidelines:
- **Thumbnails**: Under 50KB
- **Product Images**: Under 200KB
- **Hero Images**: Under 500KB
- **Banner Images**: Under 1MB

### 3. Image Optimization

#### Before Uploading:
1. **Resize** images to appropriate dimensions
2. **Compress** images to reduce file size
3. **Use descriptive filenames** (e.g., `a5-menu-card-elegant-design.jpg`)
4. **Add alt text** for accessibility

#### Tools for Optimization:
- **Online**: TinyPNG, Compressor.io, Squoosh.app
- **Desktop**: Photoshop, GIMP, Affinity Photo
- **Command Line**: ImageMagick, jpegoptim

### 4. Adding Images to Different Page Types

#### Product Detail Pages:
```html
<!-- Main product image -->
<img id="mainImage" src="assets/images/products/[product]/[product]-main.jpg" alt="Product Name">

<!-- Thumbnail gallery -->
<div class="thumbnail-gallery">
    <img src="assets/images/products/[product]/[product]-sample1.jpg" alt="Sample 1">
    <img src="assets/images/products/[product]/[product]-sample2.jpg" alt="Sample 2">
    <img src="assets/images/products/[product]/[product]-sample3.jpg" alt="Sample 3">
</div>
```

#### Related Products Section:
```html
<div class="product-grid">
    <a href="related-product.html" class="product-card">
        <img src="assets/images/products/[category]/[product].jpg" alt="Product Name">
        <div class="product-card-content">
            <h3>Product Name</h3>
            <p>Product description</p>
        </div>
    </a>
</div>
```

### 5. Common Image Types and Locations

#### Logo Images:
- **Location**: `assets/logo/`
- **Files**: `logo.png`, `logo-dark.png`, `logo-white.png`
- **Usage**: Header, footer, branding

#### Product Images:
- **Location**: `assets/images/products/[category]/`
- **Files**: Product-specific images
- **Usage**: Product pages, galleries

#### Background Images:
- **Location**: `assets/images/background/`
- **Files**: Hero backgrounds, section backgrounds
- **Usage**: Page backgrounds, decorative elements

#### Icon Images:
- **Location**: `assets/icons/`
- **Files**: UI icons, feature icons
- **Usage**: Buttons, features, navigation

### 6. Best Practices

#### File Naming:
- Use lowercase letters
- Separate words with hyphens
- Include product type and variant
- Example: `a5-menu-card-elegant-design.jpg`

#### Alt Text:
- Be descriptive and specific
- Include product name and key features
- Example: `alt="A5 Menu Card with elegant typography and food photography"`

#### Organization:
- Group related images in subdirectories
- Use consistent naming conventions
- Keep directory structure logical

#### Performance:
- Optimize images for web
- Use appropriate formats
- Consider lazy loading for large galleries
- Implement responsive images

### 7. Troubleshooting

#### Images Not Loading:
1. Check file paths are correct
2. Verify file permissions
3. Ensure file extensions match
4. Check for typos in filenames

#### Slow Loading:
1. Compress images further
2. Use WebP format where possible
3. Implement lazy loading
4. Consider CDN for large images

#### Quality Issues:
1. Use higher resolution source images
2. Avoid over-compression
3. Choose appropriate file format
4. Test on different devices

## Quick Reference

### Common Image Paths:
- Product images: `assets/images/products/[category]/`
- Logo: `assets/logo/`
- Icons: `assets/icons/`
- Backgrounds: `assets/images/background/`

### File Naming Convention:
- `[product]-main.jpg` - Main product image
- `[product]-sample[number].jpg` - Sample images
- `[product]-thumbnail.jpg` - Thumbnail version
- `[product]-hero.jpg` - Hero/banner version

### HTML Template:
```html
<img src="assets/images/products/[category]/[filename].jpg" 
     alt="Descriptive alt text" 
     style="width: 100%; height: auto; object-fit: cover;">
```

This guide should help you effectively manage images in your Inksnap project! 