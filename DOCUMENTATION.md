# HTML Components

Load HTML components from files and build pages dynamically.

## Table of Contents

- [Quick Start](#quick-start)
- [Component Loading](#component-loading)
- [JavaScript & CSS Loading](#javascript--css-loading)
- [Page Building](#page-building)
- [JavaScript Control](#javascript-control)
- [Notifications](#notifications)
- [Image Loading](#image-loading)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Component Files](#component-files)
- [Development](#development)

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div data-component="header.html"></div>
    <div data-component="content.html"></div>

    <script src="html-components.js"></script>
</body>
</html>
```

## Component Loading

### loadComponent(selector, componentPath)
Load a component from a file into a DOM element.

```javascript
// Load into element with ID
HTMLComponents.loadComponent('#header', 'components/header.html');

// Load into element with class
HTMLComponents.loadComponent('.sidebar', 'sidebar.html');

// Returns a Promise
HTMLComponents.loadComponent('#content', 'content.html')
    .then(() => console.log('Component loaded'))
    .catch(err => console.error('Failed to load:', err));
```

Components can automatically load nested components and CSS files.

## JavaScript & CSS Loading

### loadJS(src, options)
Load a JavaScript file with caching and error handling.

```javascript
// Basic loading
HTMLComponents.loadJS('scripts/utils.js')
    .then(() => console.log('JS loaded'))
    .catch(err => console.error('JS failed:', err));

// With options
HTMLComponents.loadJS('scripts/analytics.js', {
    async: true,                    // Load asynchronously
    crossOrigin: 'anonymous'        // For external scripts
});
```

### loadCSS(href, options)
Load a CSS file with caching and error handling.

```javascript
// Basic loading
HTMLComponents.loadCSS('styles/main.css')
    .then(() => console.log('CSS loaded'))
    .catch(err => console.error('CSS failed:', err));

// With options
HTMLComponents.loadCSS('styles/theme.css', {
    media: 'screen and (max-width: 768px)', // Conditional loading
    crossOrigin: 'anonymous'                  // For external stylesheets
});
```

## Page Building

### buildPage(pageDefinition, targetElement, clearTarget)
Build an entire page from component definitions.

```javascript
// Simple array format
const page = ['header.html', 'content.html', 'footer.html'];
HTMLComponents.buildPage(page, 'body', true);

// Enhanced object format
const page = {
    title: 'My Website',
    description: 'Page description for SEO',
    styles: ['styles/main.css', 'styles/page.css'],
    components: [
        'components/header.html',
        {
            name: 'hero-section',
            props: { title: 'Welcome' },
            css: ['hero', 'centered']
        },
        'components/footer.html'
    ]
};
HTMLComponents.buildPage(page, 'body', true);
```

### Component Definitions

Components can have props, CSS classes, IDs, and conditional loading:

```javascript
{
    name: 'hero-section',           // Component file or registered component
    props: {                        // Data passed to component
        title: 'Welcome',
        subtitle: 'Hello World'
    },
    css: ['hero', 'centered'],      // CSS classes to add
    id: 'main-hero',                // ID to set
    condition: () => window.innerWidth > 768  // Load conditionally
}
```

### Layout Sections

Create structured layouts with automatic HTML elements:

```javascript
{
    layout: 'header',               // Creates <header> element
    children: ['nav.html', 'logo.html']
}

// Or with full control
{
    layout: {
        class: 'sidebar',
        id: 'main-sidebar',
        attrs: { 'data-theme': 'dark' }
    },
    children: ['user-profile.html', 'menu.html']
}
```

## JavaScript Control

### enableJS() / disableJS() / isJSEnabled()
Control JavaScript execution globally.

```javascript
// Disable JavaScript execution
HTMLComponents.disableJS();

// Check if JS is enabled
if (HTMLComponents.isJSEnabled()) {
    console.log('JavaScript is enabled');
}

// Re-enable JavaScript execution
HTMLComponents.enableJS();
```

When disabled, scripts in components won't execute, and loadJS calls will fail.

## Notifications

### enableNotifications() / disableNotifications()
Control visual notification display.

```javascript
// Disable visual notifications
HTMLComponents.disableNotifications();

// Re-enable notifications
HTMLComponents.enableNotifications();
```

Notifications appear for errors, warnings, and important events. They auto-dismiss after 10 seconds.

## Image Loading

### loadImage(src, options)
Load a single image with caching.

```javascript
HTMLComponents.loadImage('logo.png')
    .then(img => document.body.appendChild(img))
    .catch(err => console.error('Image failed:', err));

// With options
HTMLComponents.loadImage('hero-bg.jpg', {
    crossOrigin: 'anonymous'
});
```

### preloadImages(sources)
Preload multiple images for performance.

```javascript
HTMLComponents.preloadImages([
    'hero-bg.jpg',
    'icon1.png',
    'icon2.png'
]);
```

## Caching

### File Caching
Files are automatically cached when loaded. Manage with:

```javascript
// Enable/disable file caching
HTMLComponents.enableFileCache();
HTMLComponents.disableFileCache();

// Clear all cached files
HTMLComponents.clearFileCache();

// Get cache stats
const stats = HTMLComponents.getFileCacheStats();
console.log(stats); // { enabled: true, size: 5, keys: [...] }
```

### Page Caching
Built pages are cached for performance:

```javascript
// Enable/disable page caching
HTMLComponents.enablePageCache();
HTMLComponents.disablePageCache();

// Clear cached pages
HTMLComponents.clearPageCache();

// Get page cache stats
const stats = HTMLComponents.getPageCacheStats();
```

### Manual Cache Keys
Provide explicit cache keys for control:

```javascript
const page = {
    cacheKey: 'homepage_v1', // Explicit key
    components: [...]
};
```

## Error Handling

The library provides automatic error detection and visual notifications:

- **CORS Issues**: When opening files directly in browser
- **File Not Found**: Component files that don't exist
- **Network Errors**: Connection issues
- **JavaScript Errors**: Syntax errors in component scripts

Errors appear as slide-in notifications in the top-right corner with details.

## Component Files

Components are regular HTML files that can contain scripts, styles, and nested components:

```html
<!-- components/header.html -->
<header>
    <h1>{{title}}</h1>
    <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
    </nav>

    <!-- Load nested components -->
    <div data-component="logo.html"></div>

    <!-- Load nested CSS -->
    <div data-css="header.css"></div>
</header>

<script>
    // Component logic
    console.log('Header loaded with title:', '{{title}}');

    // Add event listeners
    document.querySelector('h1').addEventListener('click', () => {
        alert('Header clicked!');
    });
</script>
```

### Template Syntax
Use `{{propName}}` for dynamic content replacement:

```html
<div class="user-card">
    <h2>{{name}}</h2>
    <p>{{description}}</p>
    <button class="{{buttonClass}}">{{buttonText}}</button>
</div>
```

## Development

### Local Server Setup
Run a local server to avoid CORS errors:

```bash
# Using Node.js
npx http-server -p 8080 --cors

# Using Python
python -m http.server 8080
```

Then open: `http://localhost:8080/your-file.html`

### File Organization
Recommended project structure:

```
my-app/
├── html-components.js
├── index.html
├── components/
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── styles/
│   └── main.css
└── scripts/
    └── utils.js
```

### Utility Functions

```javascript
// Reload all components (bypasses cache)
HTMLComponents.reloadAll();

// Clear all caches
HTMLComponents.clearComponentCache();
