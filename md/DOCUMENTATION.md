# HTML Components Documentation

A lightweight, powerful JavaScript library for building dynamic web applications using reusable HTML components. Load components from files, manage dependencies, handle events, and build complete pages programmatically.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)

## Quick Start

Get started in 5 minutes.

### 1. Include the Library

```html
<script src="https://html-components.vapp.uk/html-components.js"></script>
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
        <a href="#home" data-click="navigateTo">Home</a>
        <a href="#about" data-click="navigateTo">About</a>
    </nav>
</header>

<script>
function navigateTo(event, element) {
    event.preventDefault();
    const route = element.getAttribute('href').slice(1);
    console.log('Navigating to:', route);
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
    <div data-component="components/header.html"></div>

    <!-- Programmatic loading -->
    <div id="content"></div>

    <script src="html-components.js"></script>
    <script>
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
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Visit `http://localhost:8080` and see your components load!

## Installation

### CDN (Recommended)

```html
<script src="https://html-components.vapp.uk/html-components.js"></script>
```

### Local Installation

```bash
curl -O https://html-components.vapp.uk/html-components.js
```

## Core Concepts

### Component Loading

Components can be loaded **declaratively** (HTML attributes) or **programmatically** (JavaScript).

#### Declarative Loading

Use `data-component` to automatically load components on page load:

```html
<!-- Basic component -->
<div data-component="components/header.html"></div>

<!-- Nested components -->
<div data-component="components/layout.html">
    <div data-component="components/sidebar.html"></div>
    <div data-component="components/content.html"></div>
</div>
```

#### Programmatic Loading

Use JavaScript for dynamic loading:

```javascript
// Basic loading
HTMLComponents.loadComponent('#header', 'components/header.html');

// With props
HTMLComponents.loadComponent('#user', 'components/user.html', {
    name: 'Jane Smith',
    email: 'jane@example.com'
});

// With promise handling
HTMLComponents.loadComponent('#content', 'components/content.html')
    .then(() => console.log('Loaded!'))
    .catch(err => console.error('Failed:', err));
```

### Template System

Use `{{variable}}` syntax for dynamic content:

**user-profile.html**
```html
<div class="profile">
    <img src="{{avatar}}" alt="Avatar">
    <h2>{{name}}</h2>
    <p>{{bio}}</p>
    <span class="role">{{role}}</span>
</div>
```

**Usage**
```javascript
HTMLComponents.loadComponent('#profile', 'user-profile.html', {
    name: 'Alice Johnson',
    bio: 'Frontend Developer',
    avatar: 'images/avatar.jpg',
    role: 'Developer'
});
```

### Event Binding

Bind functions to elements using data attributes:

```html
<button data-click="handleClick">Click me</button>
<input data-input="handleInput" placeholder="Type here">
<form data-submit="handleSubmit">
    <button type="submit">Submit</button>
</form>
```

```javascript
function handleClick(event, element) {
    console.log('Clicked!', element);
}

function handleInput(event, element) {
    console.log('Value:', element.value);
}

function handleSubmit(event, element) {
    event.preventDefault();
    console.log('Form submitted');
}
```

#### Supported Events

| Event | Attribute | Description |
|-------|-----------|-------------|
| `click` | `data-click` | Mouse clicks |
| `dblclick` | `data-dblclick` | Double clicks |
| `mouseenter` | `data-mouseenter` | Mouse enters element |
| `mouseleave` | `data-mouseleave` | Mouse leaves element |
| `input` | `data-input` | Input value changes |
| `change` | `data-change` | Form element changes |
| `submit` | `data-submit` | Form submission |
| `focus` | `data-focus` | Element gains focus |
| `blur` | `data-blur` | Element loses focus |
| `keydown` | `data-keydown` | Key pressed down |
| `keyup` | `data-keyup` | Key released |

**Important:** Event handlers are bound **once per element** to prevent duplicates. The library automatically tracks which events have been bound using `data-bound-*` attributes.

### Dependency Management

Components automatically load CSS and JavaScript dependencies:

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
</div>
```

Dependencies are loaded in parallel for optimal performance.

## API Reference

### Component Management

#### `loadComponent(selector, componentPath, props)`

Load a component into a DOM element.

```javascript
HTMLComponents.loadComponent('#header', 'components/header.html');
HTMLComponents.loadComponent('.sidebar', 'sidebar.html', { theme: 'dark' });
```

**Parameters:**
- `selector` (string): CSS selector for target element
- `componentPath` (string): Path to component HTML file
- `props` (object, optional): Template variables to replace

**Returns:** Promise that resolves when component is loaded

---

### Asset Loading

#### `loadJS(src)`

Load JavaScript files with automatic caching.

```javascript
HTMLComponents.loadJS('scripts/utils.js');
HTMLComponents.loadJS('https://cdn.example.com/library.js');
```

**Parameters:**
- `src` (string): Path to JavaScript file

**Returns:** Promise that resolves when JS is loaded and executed

**Note:** Scripts are executed using `eval` in global scope to ensure functions are available. Already-loaded scripts are skipped.

---

#### `loadCSS(href, options)`

Load CSS files with caching.

```javascript
HTMLComponents.loadCSS('styles/main.css');
HTMLComponents.loadCSS('theme.css', { 
    media: 'screen and (max-width: 768px)' 
});
```

**Parameters:**
- `href` (string): Path to CSS file
- `options` (object, optional):
  - `media` (string): Media query
  - `crossOrigin` (string): CORS setting

**Returns:** Promise that resolves when CSS is loaded

---

#### `loadImage(src, options)`

Load images with caching.

```javascript
HTMLComponents.loadImage('logo.png');
HTMLComponents.loadImage('hero.jpg', { crossOrigin: 'anonymous' });
```

**Returns:** Promise that resolves with Image object

---

#### `preloadImages(sources)`

Preload multiple images in parallel.

```javascript
HTMLComponents.preloadImages([
    'img1.jpg', 
    'img2.png', 
    'icon.svg'
]);
```

**Returns:** Promise that resolves with all results (fulfilled or rejected)

---

### Visibility Controls

#### `toggleComponent(selector, show)`

Toggle component visibility.

```javascript
HTMLComponents.toggleComponent('#sidebar');        // Toggle
HTMLComponents.toggleComponent('#modal', true);    // Show
HTMLComponents.toggleComponent('#modal', false);   // Hide
```

**Parameters:**
- `selector` (string): CSS selector
- `show` (boolean, optional): Explicit show/hide (omit to toggle)

**Returns:** Boolean (true if now visible, false if hidden)

---

#### `showComponent(selector)` / `hideComponent(selector)`

Explicit show/hide methods.

```javascript
HTMLComponents.showComponent('#welcome');
HTMLComponents.hideComponent('#loading');
```

---

### Page Building

#### `buildPage(pageDefinition, targetElement, clearTarget)`

Build complete pages from component definitions.

**Simple Array Format:**
```javascript
const page = [
    'components/header.html',
    'components/content.html',
    'components/footer.html'
];

HTMLComponents.buildPage(page, 'body', true);
```

**Advanced Object Format:**
```javascript
const page = {
    title: 'Dashboard',
    description: 'Admin dashboard',
    styles: ['styles/dashboard.css'],
    components: [
        'components/header.html',
        {
            name: 'sidebar.html',
            props: { activeItem: 'dashboard' }
        },
        {
            name: 'content.html',
            layout: {
                tag: 'main',
                class: 'main-content',
                id: 'content-area'
            }
        }
    ],
    cacheKey: 'dashboard_v1'
};

HTMLComponents.buildPage(page, 'body', true);
```

**Parameters:**
- `pageDefinition` (array|object): Components to load
- `targetElement` (string, optional): CSS selector (default: 'body')
- `clearTarget` (boolean, optional): Clear target before building (default: false)

**Returns:** Promise that resolves with build results

---

### Caching System

The library includes two independent caching systems:

#### File Cache

Caches loaded HTML, CSS, and JS file contents.

```javascript
HTMLComponents.enableFileCache();   // Enable (default)
HTMLComponents.disableFileCache();  // Disable
HTMLComponents.clearFileCache();    // Clear all cached files
```

**Benefits:**
- Eliminates redundant network requests
- Faster component loading
- Reduced server load

---

#### Page Cache

Caches fully-built page HTML.

```javascript
HTMLComponents.enablePageCache();   // Enable (default)
HTMLComponents.disablePageCache();  // Disable
HTMLComponents.clearPageCache();    // Clear cached pages
```

**Use Cases:**
- Single-page applications with navigation
- Pages that rebuild frequently
- Performance optimization

---

### Logging & Debugging

The library includes a streamlined logging system that's quiet by default.

#### Debug Mode

```javascript
HTMLComponents.enableDebug();    // Enable verbose logging
HTMLComponents.disableDebug();   // Return to normal mode
```

When debug mode is enabled, you'll see:
- Component loading progress
- Cache hits/misses
- Event binding details
- Performance timing

---

#### Log Levels

```javascript
HTMLComponents.setLogLevel('ERROR');  // Only errors
HTMLComponents.setLogLevel('WARN');   // Warnings and errors
HTMLComponents.setLogLevel('INFO');   // Normal logging (default)
HTMLComponents.setLogLevel('DEBUG');  // Verbose logging
```

---

#### Log History

```javascript
// Get all logs
const allLogs = HTMLComponents.getLogHistory();

// Get specific level
const errors = HTMLComponents.getLogHistory('ERROR');

// Clear history
HTMLComponents.clearLogHistory();
```

Each log entry includes:
```javascript
{
    timestamp: "2024-01-15T10:30:00.000Z",
    level: "INFO",
    message: "Component loaded successfully",
    data: { /* optional additional data */ }
}
```

---

## Advanced Features

### Conditional Loading

Load components based on runtime conditions:

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

HTMLComponents.buildPage(page);
```

The `condition` can be:
- A function that returns a boolean
- A boolean value
- Any truthy/falsy value

---

### Layout System

Create structured layouts with custom containers:

```javascript
{
    name: 'sidebar.html',
    layout: {
        tag: 'aside',           // HTML tag (default: 'section')
        class: 'sidebar',       // CSS classes
        id: 'main-sidebar',     // Element ID
        attrs: {                // Additional attributes
            'aria-label': 'Navigation'
        }
    },
    children: [
        'components/nav-menu.html',
        'components/user-info.html'
    ]
}
```

**Shorthand:**
```javascript
{
    name: 'content.html',
    layout: 'container fluid'  // Just CSS classes
}
```

---

### Performance Optimization

#### Automatic Optimizations

1. **File Caching**: All loaded files are cached automatically
2. **Page Caching**: Built pages are cached by default
3. **Image Caching**: Loaded images are stored in memory
4. **Event Deduplication**: Events are only bound once per element
5. **Batched DOM Operations**: Uses DocumentFragment for efficient rendering

#### Manual Optimizations

```javascript
// Preload assets before they're needed
HTMLComponents.preloadImages(['hero.jpg', 'logo.png']);
HTMLComponents.loadCSS('styles/critical.css');

// Clear caches during development
HTMLComponents.clearFileCache();
HTMLComponents.clearPageCache();

// Disable caching for testing
HTMLComponents.disableFileCache();
HTMLComponents.disablePageCache();
```

---

## Best Practices

### Project Structure

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
│   │   └── card.html
│   └── pages/
│       ├── home.html
│       ├── about.html
│       └── dashboard.html
├── styles/
│   ├── main.css
│   └── components.css
├── scripts/
│   ├── app.js
│   └── utils.js
├── html-components.js
└── index.html
```

---

### Component Design

**✅ Good Component:**
```html
<!-- self-contained, reusable -->
<style scoped>
.user-card { /* component styles */ }
</style>

<div class="user-card">
    <img src="{{avatar}}" alt="{{name}}">
    <h3>{{name}}</h3>
    <p>{{bio}}</p>
</div>

<script>
// Component-specific functions
function editUser(event, element) {
    // handle edit
}
</script>
```

**❌ Avoid:**
```html
<!-- too many global dependencies -->
<div class="card">
    <div id="global-thing">{{text}}</div>
</div>
<script src="external-dependency.js"></script>
<link rel="stylesheet" href="external-styles.css">
```

---

### Event Handlers

**✅ Good:**
```javascript
function handleUserClick(event, element) {
    const userId = element.dataset.userId;
    if (!userId) {
        console.warn('No user ID found');
        return;
    }
    loadUserProfile(userId);
}
```

**❌ Avoid:**
```javascript
function click(e, el) {
    // unclear purpose, no validation
    doSomething(el.dataset.id);
}
```

---

### Error Handling

Always handle potential failures:

```javascript
HTMLComponents.loadComponent('#content', 'components/user.html')
    .then(() => {
        console.log('Component loaded successfully');
    })
    .catch(error => {
        console.error('Failed to load component:', error);
        // Show fallback UI
        document.querySelector('#content').innerHTML = 
            '<p>Failed to load content. Please refresh.</p>';
    });
```

---

## Troubleshooting

### CORS Errors

**Problem:** `Cross-Origin Request Blocked` errors

**Solution:** Use a local development server:

```bash
# Python
python -m http.server 8080

# Node.js (requires npx)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

**Why:** Browsers block `file://` protocol from loading external files for security.

---

### Components Not Loading

**Problem:** `data-component` elements stay empty

**Checklist:**
1. Is the library loaded? Check browser console for errors
2. Is the file path correct? Check network tab
3. Is a local server running? Check URL starts with `http://`
4. Are there any console errors? Enable debug mode

**Debug:**
```javascript
HTMLComponents.enableDebug();
// Reload page and check console
```

---

### Event Handlers Not Working

**Problem:** `data-click` handlers don't execute

**Common Causes:**

1. **Function not in global scope:**
```javascript
// ❌ Won't work (inside closure)
(function() {
    function myHandler() { }
})();

// ✅ Works (global)
function myHandler() { }

// ✅ Also works (explicit global)
window.myHandler = function() { }
```

2. **Function defined after page load:**
```html
<!-- ❌ Handler not defined yet -->
<div data-component="nav.html"></div>
<script>
function navHandler() { }
</script>

<!-- ✅ Define handlers first -->
<script>
function navHandler() { }
</script>
<div data-component="nav.html"></div>
```

3. **Typo in function name:**
```html
<!-- Function is 'handleClick' but attribute says 'handleClik' -->
<button data-click="handleClik">Click</button>
```

---

### Cache Issues

**Problem:** Changes to components don't appear

**Solution:**
```javascript
// Clear both caches
HTMLComponents.clearFileCache();
HTMLComponents.clearPageCache();

// Then hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
```

**For development:**
```javascript
// Disable caching while developing
HTMLComponents.disableFileCache();
HTMLComponents.disablePageCache();

// Re-enable for production
```

---

### Memory Issues

**Problem:** Page slows down after many component loads

**Solutions:**

1. **Clear caches periodically:**
```javascript
setInterval(() => {
    HTMLComponents.clearFileCache();
    HTMLComponents.clearPageCache();
}, 300000); // Every 5 minutes
```

2. **Limit log history:**
```javascript
HTMLComponents.clearLogHistory();
```

3. **Remove unused components:**
```javascript
const oldContent = document.querySelector('#old-content');
if (oldContent) {
    oldContent.remove();
}
```

---

## Examples

### Single Page Application

```javascript
// Define routes
const routes = {
    home: {
        title: 'Home',
        components: [
            'components/header.html',
            'components/hero.html',
            'components/features.html'
        ]
    },
    about: {
        title: 'About Us',
        components: [
            'components/header.html',
            'components/about-content.html'
        ]
    }
};

// Navigation function
function navigate(route) {
    const config = routes[route];
    if (!config) return;
    
    HTMLComponents.buildPage(config, '#app', true)
        .then(() => {
            document.title = config.title;
            history.pushState({ route }, '', `#${route}`);
        });
}

// Handle browser back/forward
window.onpopstate = (e) => {
    if (e.state?.route) navigate(e.state.route);
};

// Start
navigate('home');
```

---

### Dynamic Form with Validation

```html
<form data-submit="handleFormSubmit">
    <input type="email" name="email" data-input="validateEmail" required>
    <span class="error" id="email-error"></span>
    
    <textarea name="message" required></textarea>
    
    <button type="submit">Send</button>
</form>

<script>
function validateEmail(event, element) {
    const error = document.getElementById('email-error');
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value);
    
    error.textContent = isValid ? '' : 'Invalid email';
    error.style.display = isValid ? 'none' : 'block';
}

function handleFormSubmit(event, element) {
    event.preventDefault();
    
    const formData = new FormData(element);
    const data = Object.fromEntries(formData);
    
    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Message sent!');
        element.reset();
    })
    .catch(error => {
        alert('Failed to send message');
    });
}
</script>
```

---

### Modal System

```javascript
// modal.html component
const modalHTML = `
<div class="modal-overlay" data-click="closeModal" style="display: none;">
    <div class="modal-content" data-click="preventClose">
        <button class="close" data-click="closeModal">×</button>
        <div class="modal-body">{{content}}</div>
    </div>
</div>
`;

// Modal functions
function openModal(content) {
    HTMLComponents.loadComponent('#modal-container', 'components/modal.html', {
        content: content
    }).then(() => {
        HTMLComponents.showComponent('.modal-overlay');
    });
}

function closeModal(event, element) {
    HTMLComponents.hideComponent('.modal-overlay');
}

function preventClose(event) {
    event.stopPropagation();
}
```

---

### Lazy Loading

```javascript
// Load components when they enter viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const componentPath = element.dataset.lazyComponent;
            
            if (componentPath) {
                HTMLComponents.loadComponent(element, componentPath);
                observer.unobserve(element);
            }
        }
    });
});

// Observe lazy components
document.querySelectorAll('[data-lazy-component]').forEach(el => {
    observer.observe(el);
});
```

---

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions  
- Safari: ✅ 12+
- Mobile browsers: ✅ iOS Safari 12+, Chrome Android

**Required features:**
- Promises
- Fetch API
- ES6 syntax
- Template literals

---

## License

MIT License - Free for personal and commercial use.

---

## Contributing

Found a bug? Have a feature request? 

Visit: [github.com/Olibot1107/html-components](https://github.com/Olibot1107/html-components)

---

**Made with ❤️ for developers who love simple, powerful tools.**