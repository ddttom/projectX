# Fast EDS Development: A Complete Tutorial with the Development Server

## Introduction

This tutorial demonstrates how to achieve efficient development cycles for Adobe Edge Delivery Services (EDS) blocks using our minimal Node.js development server. Designed specifically to improve AI assistant workflows, this server enables rapid iteration and testing of EDS components. We'll walk through the complete process of building, testing, and debugging EDS components using the `floating-alert` block as a real-world example.

## The Development Server: Architecture and Benefits

### Server Overview

Our development server (`server.js`) implements a **local-first, proxy-fallback** architecture that significantly improves EDS development workflows for AI assistants:</search>
</search_and_replace>

```javascript
import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const PROXY_HOST = 'https://allabout.network';
```

### Key Architecture Components

#### 1. MIME Type Detection
The server includes comprehensive MIME type support for all web assets:

```javascript
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  // ... additional types
};
```

#### 2. Local File Serving
The `serveLocalFile` function handles local asset delivery with proper headers:

```javascript
async function serveLocalFile(filePath, res) {
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
    return true;
  } catch (error) {
    console.error(`Error serving local file ${filePath}:`, error.message);
    return false;
  }
}
```

#### 3. Intelligent Proxy Fallback
When local files don't exist, the server seamlessly proxies to the remote server:

```javascript
async function proxyRequest(url, res) {
  try {
    const proxyUrl = `${PROXY_HOST}${url}`;
    console.log(`Proxying request to: ${proxyUrl}`);

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EDS-Emulation-Layer/1.0)',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    });

    // Handle both text and binary content appropriately
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const isTextContent = contentType.includes('text/')
      || contentType.includes('application/json')
      || contentType.includes('application/javascript');

    let content;
    if (isTextContent) {
      content = await response.text();
    } else {
      content = await response.arrayBuffer();
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    if (typeof content === 'string') {
      res.end(content);
    } else {
      res.end(Buffer.from(content));
    }

    return true;
  } catch (error) {
    console.error(`❌ Error proxying request for ${url}:`, error.message);
    return false;
  }
}
```

#### 4. Request Flow Logic
The main request handler implements the local-first strategy:

```javascript
async function handleRequest(req, res) {
  const url = req.url === '/' ? '/aem.html' : req.url;
  const filePath = join(__dirname, url.startsWith('/') ? url.slice(1) : url);

  console.log(`Request: ${req.method} ${url}`);

  // Try local file first
  if (await fileExists(filePath)) {
    console.log(`Serving local file: ${filePath}`);
    const served = await serveLocalFile(filePath, res);
    if (served) return;
  }

  // Fallback to proxy
  console.log(`Local file not found, attempting proxy for: ${url}`);
  const proxied = await proxyRequest(url, res);

  if (!proxied) {
    // Return 404 if both fail
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 Not Found</h1>
          <p>The requested resource <code>${url}</code> was not found locally 
          or on the proxy server.</p>
          <p>Attempted proxy URL: <code>${PROXY_HOST}${url}</code></p>
        </body>
      </html>
    `);
  }
}
```

## Complete Development Workflow: Building the Floating Alert Block

Let's walk through the complete process of building and testing an EDS block using our development server.

### Step 1: Project Setup

First, start the development server:

```bash
npm run debug
```

You'll see output like this:
```
🚀 Server running at http://localhost:3000
📁 Serving files from: /path/to/project
🔗 Proxying missing files to: https://allabout.network
📄 Main page: http://localhost:3000/aem.html
```

### Step 2: Block Structure Creation

Create the block directory structure:

```
blocks/floating-alert/
├── floating-alert.js      # Core functionality
├── floating-alert.css     # Styling
├── README.md              # Documentation
├── example.md             # Usage examples
└── test.html              # Development test file
```

### Step 3: JavaScript Implementation

The `floating-alert.js` demonstrates modern EDS patterns:

```javascript
// Configuration for the floating alert block
const FLOATING_ALERT_CONFIG = {
  STORAGE_KEY: 'floating-alert-dismissed',
  ANIMATION_DURATION: 300,
  SPARKLE_INTERVAL: 2000,
  SPARKLE_DURATION: 1000,
};

// Create sparkle effect
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-alert-sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  return sparkle;
}

// Main decorate function
export default async function decorate(block) {
  if (localStorage.getItem(FLOATING_ALERT_CONFIG.STORAGE_KEY) === 'true') {
    return;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'floating-alert-overlay';

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'floating-alert';
  modal.setAttribute('role', 'alert');
  modal.setAttribute('aria-live', 'polite');
  modal.tabIndex = 0;

  // Move block content to modal
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'floating-alert-content';
  while (block.firstChild) {
    contentWrapper.appendChild(block.firstChild);
  }

  // Create close button with accessibility
  const closeButton = document.createElement('button');
  closeButton.className = 'floating-alert-close';
  closeButton.setAttribute('aria-label', 'Dismiss alert');
  closeButton.innerHTML = '×';
  closeButton.addEventListener('click', () => dismissAlert(overlay));

  // Assemble modal
  modal.appendChild(contentWrapper);
  modal.appendChild(closeButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add interactive features
  modal._sparkleIntervalId = addSparkleEffect(modal);
  setupKeyboardHandling(modal, overlay);
  setupClickOutsideHandling(overlay, modal);
}
```

### Step 4: CSS Implementation with Modern Features

The CSS demonstrates advanced EDS styling patterns:

```css
/* Configuration variables for easy customization */
:root {
  --alert-bg-color: rgba(255, 165, 0, 0.15);
  --alert-border-color: rgba(255, 165, 0, 0.3);
  --alert-text-color: #333;
  --alert-shadow-color: rgba(0, 0, 0, 0.1);
  --alert-sparkle-color: rgba(255, 255, 255, 0.8);
  --alert-transition-duration: 0.3s;
  --alert-border-radius: 12px;
  --alert-max-width: 600px;
  --alert-padding: 1.5rem;
  --alert-backdrop-blur: 10px;
}

/* Glassmorphic modal styling */
.floating-alert {
  position: relative;
  z-index: 1000;
  background: var(--alert-bg-color);
  backdrop-filter: blur(var(--alert-backdrop-blur));
  border: 1px solid var(--alert-border-color);
  border-radius: var(--alert-border-radius);
  box-shadow: 0 8px 32px var(--alert-shadow-color);
  padding: var(--alert-padding);
  max-width: var(--alert-max-width);
  width: 90%;
  color: var(--alert-text-color);
  opacity: 0;
  animation: floating-alert-fade-in var(--alert-transition-duration) forwards;
}

/* Smooth animations */
@keyframes floating-alert-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive design */
@media (max-width: 480px) {
  .floating-alert {
    --alert-padding: 1rem;
    --alert-max-width: 90%;
  }
}
```

### Step 5: Test File Creation

The `test.html` file provides isolated testing:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Floating Alert Test</title>
    <link rel="stylesheet" href="floating-alert.css">
</head>
<body>
    <div class="test-content">
        <h1>Floating Alert Test Page</h1>
        
        <!-- EDS Block Structure (Exact Replication) -->
        <div class="floating-alert block" data-block-name="floating-alert" data-block-status="initialized">
            <div>
                <div>
                    <p>🎉 Welcome to our website! Please take a moment to review our <a href="#privacy">updated privacy policy</a>.</p>
                </div>
            </div>
        </div>

        <h2>Test Instructions</h2>
        <ol>
            <li><strong>Modal Appearance:</strong> The modal should appear immediately</li>
            <li><strong>Close Button:</strong> Click the × button</li>
            <li><strong>ESC Key:</strong> Press Escape to close</li>
            <li><strong>Click Outside:</strong> Click outside modal to dismiss</li>
        </ol>

        <button onclick="resetAlert()">Reset Alert</button>
    </div>

    <script type="module">
        import decorate from './floating-alert.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            const block = document.querySelector('.floating-alert.block');
            if (block) {
                decorate(block);
            }
        });

        window.resetAlert = function() {
            localStorage.removeItem('floating-alert-dismissed');
            alert('Alert reset! Reload to see modal again.');
        };
    </script>
</body>
</html>
```

## Development and Debug Process

### Step 1: Initial Development

1. **Start the server**: `npm run debug`
2. **Create test file**: Navigate to `http://localhost:3000/blocks/floating-alert/test.html`
3. **Observe server logs**:
   ```
   Request: GET /blocks/floating-alert/test.html
   Serving local file: /path/to/project/blocks/floating-alert/test.html
   Request: GET /blocks/floating-alert/floating-alert.css
   Serving local file: /path/to/project/blocks/floating-alert/floating-alert.css
   Request: GET /blocks/floating-alert/floating-alert.js
   Serving local file: /path/to/project/blocks/floating-alert/floating-alert.js
   ```

### Step 2: Iterative Development

The development server enables instant feedback:

1. **Make changes** to CSS or JavaScript files
2. **Refresh browser** to see changes immediately
3. **Check server logs** for any missing assets
4. **Debug issues** using browser developer tools

### Step 3: Testing Proxy Functionality

Test the proxy by accessing remote assets:

```
Request: GET /missing-asset.json
Local file not found, attempting proxy for: /missing-asset.json
Proxying request to: https://allabout.network/missing-asset.json
✅ Successfully proxied: /missing-asset.json
```

### Step 4: Debugging Common Issues

#### CSS Not Loading
**Server logs show**:
```
Request: GET /blocks/floating-alert/floating-alert.css
Error serving local file: ENOENT: no such file or directory
```
**Solution**: Check file path and ensure CSS file exists.

#### JavaScript Module Errors
**Browser console shows**: `Failed to load module script`
**Solution**: Verify ES module syntax and file paths.

#### Proxy Failures
**Server logs show**:
```
❌ Error proxying request for /asset.json: fetch failed
```
**Solution**: Check network connectivity and proxy URL configuration.

## Advanced Development Patterns

### Configuration-Driven Development

Use configuration objects for maintainable code:

```javascript
const BLOCK_CONFIG = {
  // Visual settings
  ANIMATION_DURATION: 300,
  SPARKLE_INTERVAL: 2000,
  
  // Behavior settings
  STORAGE_KEY: 'floating-alert-dismissed',
  AUTO_DISMISS_DELAY: 10000,
  
  // Content settings
  MAX_CONTENT_LENGTH: 200,
  ALLOWED_TAGS: ['a', 'strong', 'em'],
  
  // Accessibility settings
  FOCUS_TRAP: true,
  ANNOUNCE_CHANGES: true,
};
```

### Error Handling Patterns

Implement robust error handling:

```javascript
export default async function decorate(block) {
  try {
    // Main functionality
    await initializeAlert(block);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Floating Alert Error:', error);
    
    // Graceful fallback
    block.innerHTML = `
      <div class="alert-fallback">
        <p>Important message available - please check console for details.</p>
      </div>
    `;
  }
}
```

### Performance Optimization

Optimize for Core Web Vitals:

```javascript
// Lazy load non-critical features
function initializeSparkles() {
  // Only add sparkles after initial render
  requestIdleCallback(() => {
    addSparkleEffect(modal);
  });
}

// Efficient event handling
function setupEventListeners(modal, overlay) {
  // Use event delegation
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      dismissAlert(overlay);
    }
  });
  
  // Passive listeners for better performance
  document.addEventListener('keydown', handleKeyboard, { passive: false });
}
```

## Testing and Quality Assurance

### Accessibility Testing

Verify accessibility features:

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with VoiceOver/NVDA
3. **Focus Management**: Ensure focus stays within modal
4. **ARIA Attributes**: Verify proper labeling

### Cross-Browser Testing

Test across different browsers:

1. **Chrome**: Primary development browser
2. **Firefox**: Test ES module compatibility
3. **Safari**: Verify backdrop-filter support
4. **Mobile**: Test responsive behavior

### Performance Testing

Monitor performance metrics:

1. **Lighthouse**: Aim for 100/100/100/100 scores
2. **Core Web Vitals**: Monitor LCP, FID, CLS
3. **Bundle Size**: Keep JavaScript minimal
4. **Animation Performance**: Use transform/opacity only

## Production Deployment

### Build Process

EDS requires no build process:

1. **Copy files** to production server
2. **Verify paths** are correct
3. **Test functionality** in production environment
4. **Monitor performance** metrics

### Documentation

Maintain comprehensive documentation:

1. **README.md**: Technical documentation
2. **example.md**: Usage examples for authors
3. **API documentation**: For complex blocks
4. **Troubleshooting guide**: Common issues and solutions

## Conclusion

This development server and workflow provide several key advantages for AI assistants working with EDS:

### AI Assistant Benefits
- **Instant feedback**: No build process delays enable rapid iteration cycles
- **Clear debugging**: Comprehensive logging helps AI assistants understand issues quickly
- **Isolated testing**: Test individual blocks without complex setup
- **Consistent patterns**: Standardized approaches improve AI assistant effectiveness

### Development Quality Improvements
- **Modern patterns**: ES modules, async/await align with current best practices
- **Error handling**: Robust error reporting helps AI assistants identify and fix issues
- **Performance focus**: Optimized for Core Web Vitals ensures production-ready code
- **Documentation**: Clear examples and patterns improve AI assistant understanding

### Workflow Enhancements
- **Block isolation**: Independent development reduces complexity for AI assistants
- **Proxy transparency**: Clear distinction between local and remote assets
- **Consistent structure**: EDS replication ensures compatibility between test and production

### Scalability for AI Development
- **Reusable approaches**: Established patterns can be applied across projects
- **Maintainable codebase**: Clear documentation supports long-term development
- **Quality assurance**: Built-in testing patterns ensure reliable outcomes

The combination of the development server and EDS's philosophy creates an efficient development environment specifically designed to improve AI assistant workflows. This approach enables AI assistants to iterate quickly while maintaining the high standards required for production web applications.

By following these patterns and using the development server, AI assistants can build sophisticated EDS blocks efficiently and reliably, achieving consistent quality and performance that makes EDS development more accessible and effective.
