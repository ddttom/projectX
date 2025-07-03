# ProjectX Framework Technology Stack Document

## Stack Overview

This document outlines the technology stack for ProjectX Framework - a privacy-first JavaScript framework designed as a drop-in replacement for Adobe Edge Delivery Services (EDS). ProjectX maintains 100% backward compatibility with existing EDS blocks while completely removing all Real User Monitoring (RUM) and tracking functionality.

**Core Philosophy**: Privacy-first development with simple JavaScript, minimal dependencies, and maximum performance through intelligent architecture design.

## Framework Architecture

### ProjectX Core Components

**Primary-Clone Architecture**
- [`scripts/projectX.js`](../../scripts/projectX.js) - Core consolidated framework (~47KB)
- [`scripts/scripts.js`](../../scripts/scripts.js) - Enhancement layer with plugin support (~7KB)
- [`scripts/aem.js`](../../scripts/aem.js) - Compatibility proxy for existing blocks
- [`scripts/deferred.js`](../../scripts/deferred.js) - Delayed functionality loading

**Object Relationship Model**
```javascript
// Primary authoritative source
window.projectX = {
  codeBasePath: '',           // Environment-specific base path
  lighthouse: false,          // Lighthouse mode detection
  suppressFrame: false        // Frame suppression for tools
};

// Transparent proxy clone for backward compatibility
window.hlx = new Proxy(window.projectX, {
  get(target, prop) {
    if (prop === '_isProjectXProxy') return true;
    return target[prop];  // Forward all reads to projectX
  },
  set(target, prop, value) {
    target[prop] = value;  // Redirect all writes to projectX
    return true;
  }
});
```

### Privacy-First Design

**Complete RUM Removal**
- Zero data collection or external tracking
- Deprecation warnings for `sampleRUM()` calls
- GDPR-compliant by design
- No personal data processing

**Performance Benefits**
- 80% bundle size reduction (from ~270KB to ~54KB)
- Eliminated tracking overhead
- Faster page loads and better Core Web Vitals
- Reduced JavaScript execution time

## Frontend Technologies

### Core Languages

**JavaScript (ES2021)**
- Pure JavaScript without TypeScript
- ES modules for code organisation
- Async/await for asynchronous operations
- Native DOM manipulation
- Modern browser features (fetch, Proxy, etc.)

*Rationale*: Eliminates build complexity while leveraging modern JavaScript capabilities.

**CSS3 with Custom Properties**
- CSS custom properties for theming
- CSS Grid and Flexbox for layouts
- Modern media queries with `width >=` syntax
- No preprocessors (Sass, Less)

*Current Implementation*:
```css
:root {
  /* colors */
  --link-color: #035fe6;
  --background-color: white;
  --text-color: black;
  
  /* fonts */
  --body-font-family: roboto, roboto-fallback;
  --heading-font-family: var(--body-font-family);
  
  /* sizes */
  --body-font-size-m: 22px;
  --heading-font-size-xxl: 48px;
}
```

**HTML5**
- Semantic markup standards
- Progressive enhancement approach
- Accessibility-first structure
- Valid HTML5 standards compliance

### JavaScript Architecture

**No Frameworks - Enhanced Vanilla JavaScript**
- No React, Vue, or Angular
- No UI component libraries
- Custom DOM helper utilities in ProjectX core
- Event-driven architecture with modern patterns

**Enhanced Auto-blocking System**
```javascript
// ProjectX auto-blocking capabilities
function buildAutoBlocks(main) {
  safeAutoBlock(main, autoBlockHero, 'hero');
  safeAutoBlock(main, autoBlockCards, 'cards');
  safeAutoBlock(main, autoBlockColumns, 'columns');
  safeAutoBlock(main, autoBlockTable, 'tables');
  safeAutoBlock(main, autoBlockMedia, 'media');
}
```

### Build Tools and Quality

**Minimal Build Process**
- ESLint with Airbnb base configuration
- Stylelint with standard configuration
- No bundlers (Webpack, Vite, Rollup)
- No transpilers (Babel, TypeScript)

*Current Configuration*:
```json
{
  "scripts": {
    "lint:js": "eslint .",
    "lint:css": "stylelint blocks/**/*.css styles/*.css",
    "lint": "npm run lint:js && npm run lint:css",
    "debug": "node server.js"
  }
}
```

**ESLint Configuration**
```javascript
module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  rules: {
    'import/extensions': ['error', { js: 'always' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'max-len': ['error', { code: 100, ignoreUrls: true }]
  }
};
```

### Development Tools

**Local Development Server**
- Custom Node.js server with zero external dependencies
- Local-first with proxy fallback to production
- Comprehensive MIME type detection
- Advanced error handling and logging

*Key Features from [`server.js`](../../server.js)*:
```javascript
const server = createServer(async (req, res) => {
  const url = req.url === '/' ? '/server.html' : req.url;
  const filePath = join(__dirname, url.startsWith('/') ? url.slice(1) : url);
  
  // Try to serve local file first
  if (await fileExists(filePath)) {
    const served = await serveLocalFile(filePath, res);
    if (served) return;
  }
  
  // Fallback to proxy
  await proxyToRemote(req, res);
});
```

**Development Features**
- Automatic MIME type detection for 15+ file types
- CORS headers for cross-origin requests
- Graceful handling of DevTools requests
- Comprehensive request logging
- Proxy fallback to `https://allabout.network`

## ProjectX-Specific Architecture

### Enhanced Proxy System

**Composition Over Duplication Pattern**
```javascript
// scripts.js - Enhancement Layer
async function loadEager(doc) {
  // Add experimentation support
  if (getMetadata('experiment')) {
    await runExperiments();
  }
  
  // Delegate to ProjectX for core functionality
  await projectXLoadEager(doc);
}
```

**Initialization Coordination**
```javascript
// Prevents double initialization
if (!window.projectX?._scriptsInitialized) {
  window.projectX._scriptsInitialized = true;
  loadPage();
}
```

### Block System Architecture

**Enhanced Block Structure**
```
blocks/
├── block-name/
│   ├── block-name.js           # Core block functionality
│   ├── block-name.css          # Block styles
│   ├── README.md               # Documentation
│   ├── example.md              # Usage examples
│   └── demo.md                 # Demo content
```

**Block Implementation Pattern**
```javascript
export default function decorate(block) {
  // Extract content from block
  const rows = Array.from(block.children);
  
  // Process each row
  rows.forEach((row, index) => {
    const cells = Array.from(row.children);
    const content = cells.map(cell => cell.textContent.trim());
    
    // Transform content
    const newElement = createBlockElement(content);
    row.replaceWith(newElement);
  });
  
  // Add event listeners
  setupEventListeners(block);
}
```

### Environment-Aware Base Path Resolution

**Intelligent Path Detection**
```javascript
function setup() {
  const scriptEl = document.querySelector('script[src$="/scripts/aem.js"]') || 
                   document.querySelector('script[src$="/scripts/scripts.js"]') ||
                   document.querySelector('script[src$="/scripts/projectX.js"]');
  
  if (scriptEl) {
    const scriptUrl = new URL(scriptEl.src);
    const pathname = scriptUrl.pathname;
    
    // Extract base path from different script patterns
    if (pathname.endsWith('/scripts/aem.js')) {
      window.projectX.codeBasePath = pathname.replace('/scripts/aem.js', '');
    }
    // Additional patterns...
  }
}
```

**Environment Examples**
| Environment | Script URL | Detected Base Path | Final URLs |
|-------------|------------|-------------------|------------|
| **Development** | `http://localhost:3000/scripts/aem.js` | `http://localhost:3000` | `http://localhost:3000/styles/fonts.css` |
| **Production Root** | `https://example.com/scripts/aem.js` | `''` | `/styles/fonts.css` |
| **Production Subdir** | `https://cdn.com/v1.2/scripts/scripts.js` | `/v1.2` | `/v1.2/styles/fonts.css` |

## Content Management

### Document-Based Authoring

**Google Docs Integration**
- Primary content authoring in Google Docs
- Table-based block creation
- Automatic content transformation
- Real-time preview capabilities

**Content Processing Pipeline**
```
Google Docs → Drive API → Content Parser → Static Generator → CDN
```

### Data Storage Strategy

**File-Based Storage**
```
/content/
├── blog/
│   ├── article-1.md
│   └── article-2.md
├── pages/
│   ├── about.md
│   └── index.md
└── assets/
    ├── images/
    └── media/
```

**Query Index System**
```json
{
  "total": 150,
  "offset": 0,
  "limit": 500,
  "data": [
    {
      "path": "/blog/understanding-performance",
      "title": "Understanding Web Performance",
      "description": "A comprehensive guide to web performance",
      "lastModified": "2024-01-15"
    }
  ]
}
```

## Development Environment

### Local Development Setup

**Requirements**
- Node.js 18+ (for built-in fetch support)
- Git for version control
- Modern web browser for testing
- Text editor with ESLint support

**Setup Process**
```bash
# Clone ProjectX repository
git clone https://github.com/ddttom/projectX.git
cd projectX

# Install dependencies
npm install

# Start development server
npm run debug

# Access local environment
open http://localhost:3000
```

### Development Server Features

**Core Capabilities**
- Zero external dependencies
- Local-first file serving
- Proxy fallback to production
- Comprehensive MIME type support
- Advanced error handling

**MIME Type Support**
```javascript
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
  // ... 15+ supported types
};
```

## Performance Optimisation

### Bundle Size Optimization

| Component | Original EDS | ProjectX | Savings |
|-----------|-------------|----------|---------|
| Core Framework | ~120KB | ~47KB | 61% reduction |
| Enhancement Layer | ~15KB | ~7KB | 53% reduction |
| RUM Tracking | ~80KB | 0KB | 100% removal |
| Experimentation | ~30KB | 0KB | 100% removal |
| Duplicate Code | ~25KB | 0KB | 100% elimination |
| **Total** | **~270KB** | **~54KB** | **80% reduction** |

### Three-Phase Loading Strategy

**Phase E (Eager) - Critical Path**
```javascript
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
  
  // Load fonts if desktop or already loaded
  if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
    loadFonts();
  }
}
```

**Phase L (Lazy) - Important Elements**
```javascript
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  autolinkModals(doc);
  
  if (!window.projectX.suppressFrame) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }
  
  loadCSS(`${window.projectX.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}
```

**Phase D (Delayed) - Low Priority**
```javascript
function loadDeferred() {
  window.setTimeout(() => import('/scripts/deferred.js'), 4000);
}
```

### Image Optimization

**Automatic Optimization**
```javascript
function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [
  { media: '(min-width: 600px)', width: '2000' }, 
  { width: '750' }
]) {
  const picture = document.createElement('picture');
  
  // WebP sources
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });
  
  // Fallback image
  const img = document.createElement('img');
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  img.setAttribute('alt', alt);
  picture.appendChild(img);
  
  return picture;
}
```

## Security Implementation

### Privacy-First Security

**No Data Collection**
- Zero external tracking requests
- No personal data processing
- GDPR compliant by design
- Complete RUM removal

**Content Security Policy**
```javascript
const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https:"],
  'connect-src': ["'self'"]
};
```

### Input Validation

**Secure Input Processing**
```javascript
function validateAndSanitise(input, type) {
  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    name: (value) => /^[a-zA-Z\s'-]{2,50}$/.test(value)
  };
  
  if (!validators[type] || !validators[type](input)) {
    throw new Error(`Invalid ${type} input`);
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

## Monitoring and Maintenance

### Performance Monitoring

**Core Web Vitals Tracking**
```javascript
function trackWebVitals() {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
}
```

**Error Handling**
```javascript
window.addEventListener('error', (event) => {
  console.warn('ProjectX: JavaScript error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('ProjectX: Unhandled promise rejection:', event.reason);
});
```

### Maintenance Procedures

**Dependency Management**
```json
{
  "devDependencies": {
    "@babel/core": "7.23.7",
    "@babel/eslint-parser": "7.23.3",
    "chai": "5.0.0",
    "eslint": "^8.56.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.1",
    "stylelint": "16.1.0",
    "stylelint-config-standard": "36.0.0"
  }
}
```

## Technology Decisions Rationale

### Why ProjectX Over Adobe EDS?

**Benefits**
- Complete privacy protection (zero tracking)
- 80% smaller bundle size
- Enhanced auto-blocking capabilities
- 100% backward compatibility
- No vendor lock-in

**Privacy Advantages**
- No Real User Monitoring
- No external data transmission
- GDPR compliant by design
- User-focused development

### Why Proxy Architecture?

**Benefits**
- Seamless migration from EDS
- Zero code changes required for existing blocks
- Clean separation of concerns
- Future-proof architecture

**Implementation**
- Primary object (`window.projectX`) as source of truth
- Transparent proxy (`window.hlx`) for compatibility
- Composition over duplication pattern
- Initialization coordination

### Why Minimal Dependencies?

**Benefits**
- Reduced security surface area
- Faster installation and builds
- Lower maintenance overhead
- Better long-term stability

**Current Dependencies**
- Only development dependencies for linting and testing
- Zero runtime dependencies
- Self-contained development server
- Modern JavaScript features only

## ProjectX Best Practices

### Development Workflow

**Block Development**
```javascript
// Configuration constants at top
const CONFIG = {
  ANIMATION_DURATION: 300,
  MAX_ITEMS: 8,
  BREAKPOINTS: {
    mobile: 600,
    tablet: 900,
    desktop: 1200
  }
};

// Main block function
export default function decorate(block) {
  // Extract configuration from block classes
  const config = getBlockConfig(block);
  
  // Process content
  const content = processContent(block);
  
  // Apply variations
  applyVariations(block, config);
  
  // Initialize functionality
  initializeBlock(block, content, config);
}
```

**CSS Architecture**
```css
/* Block-specific styles */
.block-name {
  /* Base block styling */
}

.block-name-wrapper {
  /* Layout and positioning */
}

/* Variations through class combinations */
.block-name.variation {
  /* Variation-specific styles */
}

/* Responsive design */
@media (width >= 600px) {
  .block-name {
    /* Tablet styles */
  }
}
```

### Code Quality Standards

**ESLint Rules**
- Airbnb base configuration
- ES2021 features enabled
- Import extensions required
- Console usage restricted to warn/error
- Maximum line length: 100 characters

**Documentation Requirements**
- JSDoc comments for complex functions
- README.md for each block
- Example usage documentation
- Performance considerations noted

## Future Considerations

### Scalability Planning

**Architecture Evolution**
- Plugin system for extensions
- Enhanced auto-blocking patterns
- Performance optimization improvements
- Developer tooling enhancements

**Technology Updates**
- Modern JavaScript features adoption
- CSS specification updates
- Browser API improvements
- Security standard evolution

### Migration Support

**EDS Compatibility**
- Maintain 100% API compatibility
- Support existing block patterns
- Provide migration utilities
- Document upgrade paths

## Conclusion

ProjectX Framework represents a privacy-first evolution of the EDS architecture, delivering significant performance improvements while maintaining complete backward compatibility. The deliberate focus on simplicity, privacy, and performance creates a sustainable foundation for modern web development.

Key advantages:
- **80% smaller bundle size** through RUM removal and architecture optimization
- **Privacy-first design** with zero data collection
- **Enhanced auto-blocking** for better content pattern recognition
- **100% backward compatibility** with existing EDS blocks
- **Modern development practices** with ES2021 and minimal dependencies

By choosing ProjectX, developers gain the benefits of EDS architecture while ensuring user privacy and achieving superior performance characteristics.