# HTML Components Documentation

A powerful JavaScript library for building dynamic web applications using reusable HTML components. Load components from files, manage dependencies, handle events, and build complete pages programmatically.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
  - [Component Loading](#component-loading)
  - [Template System](#template-system)
  - [Event Binding](#event-binding)
  - [Dependency Management](#dependency-management)
- [API Reference](#api-reference)
  - [Component Management](#component-management)
  - [Asset Loading](#asset-loading)
  - [Visibility Controls](#visibility-controls)
  - [Page Building](#page-building)
  - [Caching System](#caching-system)
  - [Logging & Debugging](#logging--debugging)
- [Advanced Features](#advanced-features)
  - [Conditional Loading](#conditional-loading)
  - [Layout System](#layout-system)
  - [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)

## Quick Start

Get started with HTML Components in 5 minutes.

### 1. Include the Library

```html
<script src="https://html-components.vapp.uk/html-components.js"></script>
```

Or download and host locally:

```bash
curl -O https://html-components.vapp.uk/html-components.js
```

### 2. Create a Component

**components/header.html**
```html
<style>
.header {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: center;
}
</style>

<header class="header">
    <h1>{{title}}</h1>
    <nav>
        <a href="#home" data-click="navigateTo" data-route="home">Home</a>
        <a href="#about" data-click="navigateTo" data-route="about">About</a>
    </nav>
</header>

<script>
function navigateTo(event, element, root) {
    const route = element.getAttribute('data-route');
    console.log('Navigating to:', route);
    // Handle navigation logic here
}
</script>
```

### 3. Load Your Component

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Declarative loading -->
    <div data-component="components/header.html"
         data-title="Welcome to My Site"></div>

    <!-- Programmatic loading -->
    <div id="content"></div>

    <script src="html-components.js"></script>
    <script>
        // Load content programmatically
        HTMLComponents.loadComponent('#content', 'components/content.html', {
            message: 'Hello from JavaScript!'
        });
    </script>
</body>
</html>
```

### 4. Run with a Local Server

```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080 --cors

# PHP
php -S localhost:8080
```

Visit `http://localhost:8080` and see your components load!

## Installation

### CDN (Recommended for Development)

```html
<script src="https://html-components.vapp.uk/html-components.js"></script>
```

### Local Installation

```bash
# Download the library
curl -O https://html-components.vapp.uk/html-components.js

# Place in your project
mkdir -p js
mv html-components.js js/
```

### NPM (Coming Soon)

```bash
npm install html-components
```

## Core Concepts

### Component Loading

Components are loaded in two ways: **declarative** (HTML attributes) and **programmatic** (JavaScript functions).

#### Declarative Loading

Use `data-component` attributes to automatically load components:

```html
<!-- Basic component -->
<div data-component="components/header.html"></div>

<!-- Component with props -->
<div data-component="components/user-card.html"
     data-user-name="John Doe"
     data-user-role="Admin"></div>

<!-- Nested components -->
<div data-component="components/layout.html">
    <div data-component="components/sidebar.html"></div>
    <div data-component="components/content.html"></div>
</div>
```

#### Programmatic Loading

Use JavaScript for dynamic loading:

```javascript
// Load into element
HTMLComponents.loadComponent('#header', 'components/header.html');

// Load with props
HTMLComponents.loadComponent('#user', 'components/user.html', {
    name: 'Jane Smith',
    email: 'jane@example.com'
});

// Handle completion
HTMLComponents.loadComponent('#content', 'components/content.html')
    .then(() => console.log('Component loaded'))
    .catch(err => console.error('Failed to load:', err));
```

### Template System

Components support template replacement using `{{variable}}` syntax:

**user-profile.html**
```html
<div class="profile">
    <img src="{{avatar}}" alt="Avatar">
    <h2>{{name}}</h2>
    <p>{{bio}}</p>
    <span class="role {{roleClass}}">{{role}}</span>
</div>
```

**JavaScript**
```javascript
HTMLComponents.loadComponent('#profile', 'user-profile.html', {
    name: 'Alice Johnson',
    bio: 'Frontend Developer',
    avatar: 'images/avatar.jpg',
    role: 'Developer',
    roleClass: 'developer-badge'
});
```

**Output**
```html
<div class="profile">
    <img src="images/avatar.jpg" alt="Avatar">
    <h2>Alice Johnson</h2>
    <p>Frontend Developer</p>
    <span class="role developer-badge">Developer</span>
</div>
```

### Event Binding

Bind JavaScript functions to HTML elements using data attributes:

```html
<button data-click="handleClick">Click me</button>
<input data-input="handleInput" placeholder="Type here">
<form data-submit="handleSubmit">
    <button type="submit">Submit</button>
</form>
```

```javascript
// Global function
function handleClick(event, element, root) {
    console.log('Button clicked!');
    console.log('Element:', element);
    console.log('Root container:', root);
}

// Component-scoped function (inside component file)
<script>
function handleInput(event, element, root) {
    console.log('Input value:', element.value);
}
</script>
```

#### Supported Events

| Event | Attribute | Description |
|-------|-----------|-------------|
| `click` | `data-click` | Mouse clicks |
| `dblclick` | `data-dblclick` | Double clicks |
| `mouseenter` | `data-mouseenter` | Mouse enter |
| `mouseleave` | `data-mouseleave` | Mouse leave |
| `input` | `data-input` | Input value changes |
| `change` | `data-change` | Form element changes |
| `submit` | `data-submit` | Form submission |
| `focus` | `data-focus` | Element focus |
| `blur` | `data-blur` | Element blur |
| `keydown` | `data-keydown` | Key press down |
| `keyup` | `data-keyup` | Key release |

### Dependency Management

Components can automatically load CSS and JavaScript dependencies:

**dashboard.html**
```html
<!-- Load CSS -->
<div data-css="styles/dashboard.css"></div>

<!-- Load JavaScript -->
<div data-js="scripts/dashboard.js"></div>

<!-- Load nested components -->
<div data-component="components/chart.html"></div>
<div data-component="components/table.html"></div>

<div class="dashboard">
    <h1>Dashboard</h1>
    <!-- Dashboard content -->
</div>
```

All dependencies are loaded automatically when the component loads.

## API Reference

### Component Management

#### loadComponent(selector, componentPath, props)

Load a component into a DOM element.

```javascript
HTMLComponents.loadComponent('#header', 'components/header.html');
HTMLComponents.loadComponent('.sidebar', 'sidebar.html', { theme: 'dark' });
```

#### replaceComponent(selector, newComponentPath)

Replace existing component content.

```javascript
HTMLComponents.replaceComponent('#content', 'components/new-content.html');
```

#### replaceComponentByPath(oldPath, newPath)

Replace component by its data-component path.

```javascript
HTMLComponents.replaceComponentByPath('components/old.html', 'components/new.html');
```

### Asset Loading

#### loadJS(src, options)

Load JavaScript files with caching.

```javascript
HTMLComponents.loadJS('scripts/utils.js');
HTMLComponents.loadJS('analytics.js', { async: true, crossOrigin: 'anonymous' });
```

#### loadCSS(href, options)

Load CSS files with caching.

```javascript
HTMLComponents.loadCSS('styles/main.css');
HTMLComponents.loadCSS('theme.css', { media: 'screen and (max-width: 768px)' });
```

#### loadImage(src, options)

Load images with caching.

```javascript
HTMLComponents.loadImage('logo.png');
HTMLComponents.loadImage('hero.jpg', { crossOrigin: 'anonymous' });
```

#### preloadImages(sources)

Preload multiple images.

```javascript
HTMLComponents.preloadImages(['img1.jpg', 'img2.png', 'icon.svg']);
```

### Visibility Controls

#### toggleComponent(selector, show)

Toggle component visibility.

```javascript
HTMLComponents.toggleComponent('#sidebar'); // Toggle current state
HTMLComponents.toggleComponent('#modal', true); // Show
HTMLComponents.toggleComponent('#modal', false); // Hide
```

#### showComponent(selector) / hideComponent(selector)

Show or hide components.

```javascript
HTMLComponents.showComponent('#welcome');
HTMLComponents.hideComponent('#loading');
```

#### isComponentVisible(selector)

Check if component is visible.

```javascript
if (HTMLComponents.isComponentVisible('#sidebar')) {
    console.log('Sidebar is visible');
}
```

#### Component Path Methods

Same visibility methods but using component paths:

```javascript
HTMLComponents.toggleComponentByPath('components/sidebar.html');
HTMLComponents.showComponentByPath('components/modal.html');
HTMLComponents.isComponentVisibleByPath('components/header.html');
```

### Page Building

#### buildPage(pageDefinition, targetElement, clearTarget, cacheOptions)

Build complete pages from component definitions.

```javascript
// Simple array format
const page = [
    'components/header.html',
    'components/content.html',
    'components/footer.html'
];

HTMLComponents.buildPage(page, 'body', true);
```

```javascript
// Advanced object format
const page = {
    title: 'Dashboard - My App',
    description: 'Admin dashboard page',
    styles: ['styles/dashboard.css', 'styles/charts.css'],
    components: [
        'components/header.html',
        {
            name: 'sidebar.html',
            props: { activeItem: 'dashboard' }
        },
        {
            name: 'content.html',
            selector: '#main-content'
        }
    ],
    cacheKey: 'dashboard_v1'
};

HTMLComponents.buildPage(page, 'body', true);
```

### Caching System

#### File Caching

```javascript
HTMLComponents.enableFileCache();   // Enable (default)
HTMLComponents.disableFileCache();  // Disable
HTMLComponents.clearFileCache();    // Clear all cached files
HTMLComponents.getFileCacheStats(); // Get cache statistics
```

#### Page Caching

```javascript
HTMLComponents.enablePageCache();   // Enable (default)
HTMLComponents.disablePageCache();  // Disable
HTMLComponents.clearPageCache();    // Clear cached pages
HTMLComponents.getPageCacheStats(); // Get cache statistics
```

### Logging & Debugging

#### Debug Control

```javascript
HTMLComponents.enableDebug();    // Enable detailed logging
HTMLComponents.disableDebug();   // Disable debug mode
HTMLComponents.setLogLevel('WARN'); // Set minimum log level
```

#### Log Inspection

```javascript
HTMLComponents.getLogHistory();      // Get all logs
HTMLComponents.getLogHistory('ERROR'); // Get only errors
HTMLComponents.getLogStats();        // Get logging statistics
HTMLComponents.clearLogHistory();    // Clear log history
```

#### Performance Timing

```javascript
HTMLComponents.startTimer('operation');
// ... do something ...
const duration = HTMLComponents.endTimer('operation');
console.log(`Operation took ${duration}ms`);
```

## Advanced Features

### Conditional Loading

Load components based on conditions:

```javascript
const page = {
    components: [
        'components/header.html',
        {
            name: 'admin-panel.html',
            condition: () => currentUser.isAdmin
        },
        {
            name: 'mobile-nav.html',
            condition: () => window.innerWidth < 768
        }
    ]
};
```

### Layout System

Create structured layouts with semantic HTML:

```javascript
{
    layout: {
        tag: 'aside',
        class: 'sidebar',
        id: 'main-sidebar',
        attrs: { 'aria-label': 'Navigation' }
    },
    children: [
        'components/nav-menu.html',
        'components/user-info.html'
    ]
}
```

### Performance Optimization

#### Caching Strategies

- **File caching**: Automatically caches loaded HTML, CSS, and JS files
- **Page caching**: Caches built page content
- **Image caching**: Caches loaded images

#### Debounced Events

Mouse events are automatically debounced to prevent performance issues.

#### Batched DOM Operations

Page building uses document fragments for efficient DOM manipulation.

## Best Practices

### Component Organization

```
my-app/
├── components/
│   ├── layout/
│   │   ├── header.html
│   │   ├── sidebar.html
│   │   └── footer.html
│   ├── ui/
│   │   ├── button.html
│   │   ├── modal.html
│   │   └── form.html
│   └── pages/
│       ├── home.html
│       ├── about.html
│       └── contact.html
├── styles/
│   ├── main.css
│   ├── components.css
│   └── themes/
├── scripts/
│   ├── utils.js
│   └── app.js
└── index.html
```

### Naming Conventions

```javascript
// Good: descriptive and consistent
function handleUserLogin(event, element, root)
function validateEmailInput(event, element, root)
function toggleNavigationMenu(event, element, root)

// Avoid: generic names
function clickHandler(event, el, root)
function func1(event, el, root)
```

### Error Handling

```javascript
function safeOperation(event, element, root) {
    try {
        const userId = element.getAttribute('data-user-id');
        if (!userId) {
            console.warn('No user ID found');
            return;
        }
        performOperation(userId);
    } catch (error) {
        console.error('Operation failed:', error);
        showErrorNotification('Something went wrong');
    }
}
```

### Performance Tips

1. **Use caching** for frequently loaded components
2. **Batch DOM operations** when possible
3. **Lazy load** non-critical components
4. **Minimize template complexity** in frequently updated components

## Troubleshooting

### Common Issues

#### CORS Errors

**Problem**: Components fail to load with CORS errors.

**Solution**: Always use a local development server:

```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080 --cors

# PHP
php -S localhost:8080
```

#### Components Not Loading

**Problem**: `data-component` attributes are ignored.

**Solution**: Ensure the library loads before components:

```html
<!-- Correct order -->
<body>
    <div data-component="header.html"></div>
    <script src="html-components.js"></script>
</body>
```

#### Event Handlers Not Working

**Problem**: `data-click` functions aren't called.

**Solution**: Check function scope and naming:

```javascript
// Global scope
window.myFunction = function(event, element, root) {
    // handler code
};

// Or register in methods
HTMLComponents.methods.myFunction = function(event, element, root) {
    // handler code
};
```

#### Cache Issues

**Problem**: Old component versions load despite changes.

**Solution**: Clear caches during development:

```javascript
HTMLComponents.clearFileCache();
HTMLComponents.clearPageCache();
HTMLComponents.reloadAll();
```

### Debug Mode

Enable debug logging for detailed information:

```javascript
HTMLComponents.enableDebug();
```

This shows:
- Component loading progress
- Cache hits/misses
- Event binding details
- Performance timing

### Visual Notifications

The library shows visual notifications for errors and warnings. Control them:

```javascript
HTMLComponents.disableNotifications(); // Turn off visual notifications
HTMLComponents.enableNotifications();  // Turn on (default)
```

## Examples

### Complete SPA Example

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My SPA</title>
</head>
<body>
    <div id="app"></div>
    <script src="html-components.js"></script>
    <script>
        // Define pages
        const pages = {
            home: ['components/header.html', 'components/home.html'],
            about: ['components/header.html', 'components/about.html'],
            contact: ['components/header.html', 'components/contact.html']
        };

        // Navigation function
        function navigate(page) {
            const pageConfig = pages[page];
            if (pageConfig) {
                HTMLComponents.buildPage(pageConfig, '#app', true);
                history.pushState({page}, '', `#${page}`);
            }
        }

        // Handle browser back/forward
        window.onpopstate = function(event) {
            if (event.state && event.state.page) {
                navigate(event.state.page);
            }
        };

        // Start with home page
        navigate('home');
    </script>
</body>
</html>
```

### Theme Switching

**theme-switcher.html**
```html
<div class="theme-switcher">
    <button data-click="setTheme" data-theme="light">Light Theme</button>
    <button data-click="setTheme" data-theme="dark">Dark Theme</button>
</div>

<script>
function setTheme(event, element, root) {
    const theme = element.getAttribute('data-theme');

    // Disable all theme CSS
    HTMLComponents.disableCSS('styles/light-theme.css');
    HTMLComponents.disableCSS('styles/dark-theme.css');

    // Enable selected theme
    HTMLComponents.enableCSS(`styles/${theme}-theme.css`);

    // Update body class
    document.body.className = `${theme}-theme`;
}
</script>
```

### Dynamic Form Handling

**contact-form.html**
```html
<form data-submit="handleSubmit">
    <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
    </div>

    <button type="submit">Send Message</button>
</form>

<div id="response" style="display: none;"></div>

<script>
function handleSubmit(event, element, root) {
    event.preventDefault();

    const formData = new FormData(element);

    // Show loading state
    const submitBtn = element.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    fetch('/api/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        HTMLComponents.showComponent('#response');
        document.getElementById('response').innerHTML =
            '<div class="success">Message sent successfully!</div>';
        element.reset();
    })
    .catch(error => {
        HTMLComponents.showComponent('#response');
        document.getElementById('response').innerHTML =
            '<div class="error">Failed to send message. Please try again.</div>';
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
</script>
```

---

For more examples and community contributions, visit the [GitHub repository](https://github.com/Olibot1107/html-components).

Need help? Check the troubleshooting section or open an issue on GitHub!
