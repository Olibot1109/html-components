# HTML Components - Quick Start Guide

Get up and running with HTML Components in under 10 minutes! 🚀

This guide will walk you through creating your first components, understanding the core concepts, and building a simple application.

## What You'll Learn

- How to include HTML Components in your project
- Creating and loading reusable components
- Using templates and props
- Handling events and user interactions
- Building dynamic pages

## Step 1: Set Up Your Project

### Option A: CDN (Easiest)

Create a new HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Components App</title>
</head>
<body>
    <h1>Welcome to HTML Components!</h1>

    <!-- Include the library -->
    <script src="https://html-components.vapp.uk/html-components.js"></script>
</body>
</html>
```

### Option B: Local Download

Download and include the library locally:

```bash
# Download the library
curl -O https://html-components.vapp.uk/html-components.js

# Or use wget
wget https://html-components.vapp.uk/html-components.js
```

Then include it in your HTML:

```html
<script src="html-components.js"></script>
```

## Step 2: Create Your First Component

Components are regular HTML files that can contain styles, scripts, and templates.

Create a `components` folder and add your first component:

**components/header.html**
```html
<style>
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 300;
}

.nav {
    margin-top: 1rem;
}

.nav a {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>

<header class="header">
    <h1>{{siteName}}</h1>
    <nav class="nav">
        <a href="#" data-click="navigate" data-page="home">Home</a>
        <a href="#" data-click="navigate" data-page="about">About</a>
        <a href="#" data-click="navigate" data-page="contact">Contact</a>
    </nav>
</header>

<script>
function navigate(event, element, root) {
    event.preventDefault();
    const page = element.getAttribute('data-page');
    console.log('Navigating to:', page);

    // Remove active class from all nav items
    root.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to clicked item
    element.classList.add('active');

    // Here you would typically load the new page content
    loadPage(page);
}

function loadPage(pageName) {
    // This will be implemented in Step 4
    console.log('Loading page:', pageName);
}
</script>
```

## Step 3: Load Your Component

Update your main HTML file to load the component:

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Components App</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Load header component with props -->
        <div data-component="components/header.html"
             data-site-name="My Awesome Site"></div>

        <!-- Main content area -->
        <div class="content">
            <h2>Welcome!</h2>
            <p>This is your main content area. Components will be loaded here dynamically.</p>
            <div id="dynamic-content"></div>
        </div>
    </div>

    <!-- Include HTML Components library -->
    <script src="html-components.js"></script>

    <script>
        // Your app logic will go here
        console.log('HTML Components loaded successfully!');
    </script>
</body>
</html>
```

## Step 4: Add Dynamic Content Loading

Let's create a content component and implement page navigation:

**components/content.html**
```html
<style>
.content-section {
    padding: 2rem 0;
}

.content-section h2 {
    color: #333;
    margin-bottom: 1rem;
}

.content-section p {
    color: #666;
    line-height: 1.7;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
    margin-top: 0;
    color: #333;
}

.btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background: #5a6fd8;
}

.btn-secondary {
    background: #6c757d;
}

.btn-secondary:hover {
    background: #5a6268;
}
</style>

<div class="content-section">
    <h2>{{title}}</h2>
    <p>{{description}}</p>

    <div class="feature-grid" data-show="{{showFeatures}}">
        <div class="feature-card">
            <h3>🚀 Easy to Use</h3>
            <p>Create components with just HTML, CSS, and JavaScript. No complex build tools required.</p>
        </div>

        <div class="feature-card">
            <h3>⚡ Fast Loading</h3>
            <p>Built-in caching and optimization ensure your components load quickly and efficiently.</p>
        </div>

        <div class="feature-card">
            <h3>🎨 Flexible Styling</h3>
            <p>Style components however you want. Use inline styles, external CSS files, or CSS frameworks.</p>
        </div>

        <div class="feature-card">
            <h3>🔧 Full Control</h3>
            <p>Programmatic API gives you complete control over component loading and behavior.</p>
        </div>
    </div>

    <div style="margin-top: 2rem;">
        <button class="btn" data-click="showFeatures">Show Features</button>
        <button class="btn btn-secondary" data-click="hideFeatures">Hide Features</button>
        <a href="#" class="btn" data-click="loadContactForm">Contact Us</a>
    </div>
</div>

<script>
let featuresVisible = true;

function showFeatures(event, element, root) {
    const featureGrid = root.querySelector('.feature-grid');
    featureGrid.style.display = 'grid';
    featuresVisible = true;
    console.log('Features shown');
}

function hideFeatures(event, element, root) {
    const featureGrid = root.querySelector('.feature-grid');
    featureGrid.style.display = 'none';
    featuresVisible = false;
    console.log('Features hidden');
}

function loadContactForm(event, element, root) {
    event.preventDefault();
    // Load contact form dynamically
    HTMLComponents.loadComponent('#dynamic-content', 'components/contact-form.html')
        .then(() => {
            console.log('Contact form loaded');
        })
        .catch(err => {
            console.error('Failed to load contact form:', err);
        });
}
</script>
```

Now update your main script to handle page navigation:

**index.html** (add to the script section)
```javascript
// Page definitions
const pages = {
    home: {
        title: 'Welcome to HTML Components',
        description: 'Build dynamic web applications with reusable components. Create, load, and manage HTML components with ease.',
        showFeatures: 'true'
    },
    about: {
        title: 'About HTML Components',
        description: 'HTML Components is a JavaScript library that makes it easy to build dynamic web applications using reusable HTML components. Load components from files, handle events, and manage dependencies automatically.',
        showFeatures: 'false'
    },
    contact: {
        title: 'Get in Touch',
        description: 'Have questions about HTML Components? We\'d love to hear from you!',
        showFeatures: 'false'
    }
};

// Global navigation function (accessible to components)
function loadPage(pageName) {
    const pageData = pages[pageName];
    if (pageData) {
        HTMLComponents.loadComponent('#dynamic-content', 'components/content.html', pageData)
            .then(() => {
                console.log(`Page "${pageName}" loaded successfully`);
            })
            .catch(err => {
                console.error(`Failed to load page "${pageName}":`, err);
            });
    }
}

// Load home page initially
document.addEventListener('DOMContentLoaded', function() {
    loadPage('home');
});
```

## Step 5: Add a Contact Form Component

Create a contact form component:

**components/contact-form.html**
```html
<style>
.contact-form {
    max-width: 500px;
    margin: 2rem auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

.form-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 4px;
    display: none;
}

.form-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.form-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
</style>

<div class="contact-form">
    <h3>Send us a message</h3>

    <form data-submit="submitContactForm">
        <div class="form-group">
            <label for="contact-name">Name:</label>
            <input type="text" id="contact-name" name="name" required>
        </div>

        <div class="form-group">
            <label for="contact-email">Email:</label>
            <input type="email" id="contact-email" name="email" required>
        </div>

        <div class="form-group">
            <label for="contact-message">Message:</label>
            <textarea id="contact-message" name="message" required></textarea>
        </div>

        <button type="submit" class="btn">Send Message</button>
    </form>

    <div id="form-message" class="form-message"></div>
</div>

<script>
function submitContactForm(event, element, root) {
    event.preventDefault();

    const formData = new FormData(element);
    const messageDiv = root.querySelector('#form-message');

    // Show loading state
    const submitBtn = element.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with real API call)
    setTimeout(() => {
        // Simulate success
        messageDiv.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        messageDiv.className = 'form-message success';
        messageDiv.style.display = 'block';

        // Reset form
        element.reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        console.log('Form submitted with data:', Object.fromEntries(formData));
    }, 1000);
}
</script>
```

## Step 6: Run Your Application

### Start a Local Server

HTML Components requires a local server to avoid CORS issues:

```bash
# Using Python (recommended)
python -m http.server 8080

# Using Node.js
npx http-server -p 8080 --cors

# Using PHP
php -S localhost:8080
```

### Open in Browser

Visit `http://localhost:8080` in your browser. You should see:

- A beautiful header with navigation
- Dynamic content that changes when you click nav items
- Interactive buttons that show/hide features
- A working contact form

## Project Structure

Your project should now look like this:

```
my-html-components-app/
├── index.html
├── html-components.js
├── components/
│   ├── header.html
│   ├── content.html
│   └── contact-form.html
└── styles/
    └── (optional: additional stylesheets)
```

## What You Learned

✅ **Component Creation**: How to create reusable HTML components with styles and scripts
✅ **Template System**: Using `{{variable}}` syntax for dynamic content
✅ **Event Binding**: Connecting user interactions to JavaScript functions
✅ **Dynamic Loading**: Loading components programmatically with props
✅ **Page Building**: Creating dynamic single-page applications

## Next Steps

### Explore Advanced Features

- **Page Building**: Use `HTMLComponents.buildPage()` for complex layouts
- **Caching**: Learn about file and page caching for performance
- **Conditional Loading**: Load components based on user permissions or screen size
- **Asset Management**: Automatically load CSS and JavaScript dependencies

### Build Something Amazing

Try creating:
- A blog with dynamic post loading
- An e-commerce product catalog
- A dashboard with charts and data visualization
- A portfolio with image galleries

### Get Help

- 📖 **Full Documentation**: Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed API reference
- 🐛 **Debug Mode**: Enable with `HTMLComponents.enableDebug()` for detailed logging
- 💬 **Community**: Visit the GitHub repository for examples and support

## Troubleshooting

### Components Not Loading?

1. **Check your server**: Make sure you're using a local server (not opening files directly)
2. **File paths**: Ensure component paths are correct relative to your HTML file
3. **Console errors**: Open browser dev tools and check for errors

### Events Not Working?

1. **Function scope**: Make sure event handler functions are in global scope or registered in `HTMLComponents.methods`
2. **Script loading**: Ensure scripts load before events are triggered

### Styling Issues?

1. **CSS specificity**: Component styles are scoped to the component container
2. **Load order**: CSS loads asynchronously - use media queries or load events if needed

---

**Congratulations!** 🎉 You've successfully created your first HTML Components application. The library is now ready for you to build amazing web applications with reusable, dynamic components.

Ready for more? Check out the [full documentation](DOCUMENTATION.md) to unlock advanced features!
