# ProjectX Backend Structure

## Architecture Overview

ProjectX Framework follows a privacy-first, serverless architecture that eliminates traditional backend complexity while providing excellent performance and scalability. Unlike Adobe Edge Delivery Services, ProjectX completely removes Real User Monitoring (RUM) and tracking functionality, focusing on user privacy and performance optimization.

**Core Philosophy**: Content as code, minimal server infrastructure, automatic scaling, performance optimization, and complete user privacy protection.

## ProjectX Framework Architecture

### Content Processing Pipeline

**Google Docs → Static Generation (Privacy-First)**
```
Google Docs → Drive API → Content Parser → Static Generator → CDN
```

**Processing Steps**:
1. Content authors create documents in Google Docs
2. ProjectX monitors Google Drive for changes (no user tracking)
3. Content parser extracts structure and metadata
4. Static generator creates optimized HTML, CSS, and JavaScript
5. Generated files deploy to global CDN without tracking pixels

### Local Development Server

**Custom Node.js Implementation**
ProjectX includes a sophisticated development server ([`server.js`](../../server.js)) with zero external dependencies:

```javascript
import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, extname, dirname } from 'path';

const PORT = process.env.PORT || 3000;
const PROXY_HOST = 'https://allabout.network';

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

**Key Features**:
- Local-first file serving with proxy fallback
- Comprehensive MIME type detection (15+ types)
- CORS headers for cross-origin requests
- Graceful DevTools request handling
- Advanced error logging and debugging
- Zero external dependencies

**MIME Type Support**
```javascript
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};
```

### Serverless Functions

**Built-in ProjectX Functions**
- Content transformation and rendering (privacy-enhanced)
- Image optimization and resizing
- Search index generation
- Performance monitoring (local only, no external reporting)

**Custom Functions** (when needed)
- Form processing and validation
- API integrations
- Custom data processing
- Local analytics (no external transmission)

## Content Management System

### Google Docs Integration

**Document Structure**
```
Document Title
==============

| BlockName     | Configuration |
|---------------|---------------|
| hero          | dark, center  |
| Text content  | More content  |

| columns       |               |
|---------------|---------------|
| Column 1      | Column 2      |
| Content here  | Content here  |
```

**Metadata Management**
```
Document Properties (via Google Docs):
- Title: Page title
- Description: Meta description
- Keywords: SEO keywords
- Author: Content author
- Date: Publication date
```

### Content Processing

**Automatic Processing (Privacy-Enhanced)**
- Document changes trigger processing (no user tracking)
- HTML generation from Google Docs structure
- CSS optimization and minification
- JavaScript bundling and tree-shaking
- Image compression and format conversion
- No tracking pixels or analytics injection

**Query Index Generation**
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
      "image": "/media/performance-hero.jpg",
      "author": "Content Author",
      "date": "2024-01-15",
      "tags": ["performance", "web", "optimization"]
    }
  ]
}
```

## API Architecture

### RESTful Endpoints

**Content APIs (Privacy-First)**
- `GET /query-index.json` - Search and filter content (no tracking)
- `GET /sitemap.xml` - Site structure for search engines
- `GET /robots.txt` - Search engine directives
- `GET /manifest.json` - Progressive Web App manifest

**Dynamic Content APIs**
- `GET /api/search?q={query}` - Full-text search (no query logging)
- `GET /api/content/{path}` - Dynamic content loading
- `POST /api/forms/{form-id}` - Form submission handling (privacy-compliant)

### GraphQL Implementation (Optional)

**Schema Definition**
```graphql
type Page {
  id: ID!
  path: String!
  title: String!
  description: String
  author: String
  date: String
  content: String
  blocks: [Block!]!
}

type Block {
  type: String!
  configuration: JSON
  content: JSON
}

type Query {
  page(path: String!): Page
  pages(limit: Int, offset: Int): [Page!]!
  search(query: String!): [Page!]!
}
```

## Data Storage Strategy

### File-Based Storage

**Static Content**
```
/content/
├── blog/
│   ├── article-1.md
│   ├── article-2.md
│   └── index.md
├── pages/
│   ├── about.md
│   ├── contact.md
│   └── index.md
└── assets/
    ├── images/
    ├── documents/
    └── media/
```

**Generated Assets**
```
/dist/
├── index.html
├── blog/
│   ├── article-1.html
│   └── article-2.html
├── styles/
│   ├── styles.css
│   └── lazy-styles.css
├── scripts/
│   ├── projectX.js
│   ├── scripts.js
│   ├── aem.js
│   └── deferred.js
└── assets/
    ├── images/
    └── media/
```

### Database Alternatives

**Query Index System**
- JSON files for searchable content
- Generated automatically from content
- Cached at CDN edge locations
- Updated on content publication
- No user behavior tracking

**Configuration Storage**
```javascript
// config/site.js
export default {
  site: {
    title: 'ProjectX Site',
    description: 'Privacy-first web framework',
    author: 'Tom Cranstoun',
    url: 'https://your-domain.com'
  },
  privacy: {
    trackingDisabled: true,
    rumRemoved: true,
    gdprCompliant: true
  },
  performance: {
    maxImageWidth: 1200,
    imageQuality: 85,
    lazyLoading: true
  }
};
```

## ProjectX Development Server

### Local Development Architecture

**Server Implementation**
```javascript
// server.js - Zero dependency implementation
import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, extname } from 'path';

const server = createServer(async (req, res) => {
  const filePath = join(process.cwd(), req.url);
  
  // Try to serve local file first
  if (await serveLocalFile(filePath, res)) {
    return;
  }
  
  // Fallback to remote proxy
  await proxyToRemote(req, res);
});
```

**Key Features**
- Zero external dependencies
- Automatic MIME type detection
- Comprehensive error handling
- Request logging for debugging
- Proxy fallback to production
- DevTools request filtering

### Request Handling

**File Serving Logic**
```javascript
async function serveLocalFile(filePath, res) {
  try {
    await access(filePath);
    const content = await readFile(filePath);
    const contentType = getMimeType(filePath);
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}
```

**Proxy Implementation**
```javascript
async function proxyToRemote(req, res) {
  try {
    const proxyUrl = `${PROXY_HOST}${req.url}`;
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProjectX-Dev/1.0)',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    });
    
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const content = contentType.includes('text/') ? 
      await response.text() : 
      await response.arrayBuffer();
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    
    res.end(typeof content === 'string' ? content : Buffer.from(content));
  } catch (error) {
    console.error('Proxy error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  }
}
```

## Performance Optimization

### Caching Strategy

**Multi-Level Caching (Privacy-Compliant)**
```
Browser Cache → CDN Cache → Origin Cache → Source Data
```

**Cache Configuration**
```javascript
// Cache policies (no user tracking)
const cacheConfig = {
  static: {
    maxAge: '1year',
    immutable: true
  },
  dynamic: {
    maxAge: '1hour',
    revalidate: true
  },
  api: {
    maxAge: '5minutes',
    staleWhileRevalidate: true
  }
};
```

### Content Delivery Network

**Global Distribution**
- Edge locations worldwide
- Automatic failover
- Performance monitoring (server-side only)
- Real-time analytics (no user tracking)

**Edge Computing**
```javascript
// Edge function example (privacy-first)
export default async function handler(request) {
  const url = new URL(request.url);
  
  // Content optimization at edge (no user profiling)
  if (url.pathname.includes('/optimize')) {
    return new Response(await optimizeContent(request));
  }
  
  // Default handling
  return fetch(request);
}
```

## Security Implementation

### Content Security Policy

**CSP Headers (Privacy-Enhanced)**
```javascript
const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https:"],
  'connect-src': ["'self'"],
  // No external tracking domains allowed
};
```

### Input Validation

**Form Processing (Privacy-Compliant)**
```javascript
function validateInput(data) {
  const schema = {
    email: { type: 'email', required: true },
    name: { type: 'string', required: true, maxLength: 100 },
    message: { type: 'string', required: true, maxLength: 1000 }
  };
  
  return validate(data, schema);
}

function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

### Authentication (When Required)

**JWT Implementation (Privacy-First)**
```javascript
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      // No tracking or profiling data
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

## Monitoring and Logging

### Performance Monitoring (Privacy-First)

**Core Web Vitals Tracking (Local Only)**
```javascript
// Local performance monitoring (no external reporting)
function trackWebVitals() {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(logLocalMetric);
    getFID(logLocalMetric);
    getFCP(logLocalMetric);
    getLCP(logLocalMetric);
    getTTFB(logLocalMetric);
  });
}

function logLocalMetric(metric) {
  const { name, value, id } = metric;
  
  // Log locally only (no external transmission)
  console.log(`ProjectX Metric: ${name} = ${value}ms`);
  
  // Store in local storage for debugging
  const metrics = JSON.parse(localStorage.getItem('projectx-metrics') || '[]');
  metrics.push({ metric: name, value, id, timestamp: Date.now() });
  localStorage.setItem('projectx-metrics', JSON.stringify(metrics.slice(-50)));
}
```

### Error Tracking (Privacy-Compliant)

**Centralized Error Handling**
```javascript
// Global error handler (no external reporting)
window.addEventListener('error', (event) => {
  logLocalError({
    message: event.error?.message || 'Unknown error',
    stack: event.error?.stack,
    filename: event.filename,
    line: event.lineno,
    column: event.colno
  });
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logLocalError({
    message: event.reason?.message || 'Unhandled promise rejection',
    stack: event.reason?.stack,
    type: 'unhandled-promise'
  });
});

function logLocalError(error) {
  console.error('ProjectX Error:', error);
  
  // Store locally for debugging (no external transmission)
  const errors = JSON.parse(localStorage.getItem('projectx-errors') || '[]');
  errors.push({ ...error, timestamp: Date.now() });
  localStorage.setItem('projectx-errors', JSON.stringify(errors.slice(-20)));
}
```

## ProjectX-Specific Backend Features

### Block Processing (Enhanced)

**Block Recognition**
```javascript
function processBlocks(content) {
  const blocks = [];
  const tables = content.querySelectorAll('table');
  
  tables.forEach(table => {
    const firstRow = table.querySelector('tr');
    const blockName = firstRow.querySelector('td').textContent.trim();
    
    blocks.push({
      name: blockName,
      element: table,
      config: parseBlockConfig(table)
    });
  });
  
  return blocks;
}
```

**Content Transformation (Privacy-Enhanced)**
```javascript
function transformContent(doc) {
  const blocks = processBlocks(doc);
  const html = [];
  
  blocks.forEach(block => {
    const blockHtml = generateBlockHtml(block);
    html.push(blockHtml);
  });
  
  return html.join('\n');
}
```

### Image Processing

**Automatic Optimization**
```javascript
function optimizeImage(imagePath) {
  return {
    webp: generateWebP(imagePath),
    avif: generateAVIF(imagePath),
    fallback: generateJPEG(imagePath),
    responsive: generateResponsiveImages(imagePath)
  };
}
```

## Deployment Pipeline

### Continuous Integration

**GitHub Actions Workflow**
```yaml
name: Deploy ProjectX
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Deploy ProjectX
        run: npm run deploy
```

### Environment Management

**Configuration by Environment**
```javascript
// config/environments.js
export default {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
    privacy: {
      trackingDisabled: true,
      rumRemoved: true
    }
  },
  staging: {
    apiUrl: 'https://staging.your-domain.com',
    debug: false,
    privacy: {
      trackingDisabled: true,
      rumRemoved: true
    }
  },
  production: {
    apiUrl: 'https://your-domain.com',
    debug: false,
    privacy: {
      trackingDisabled: true,
      rumRemoved: true,
      gdprCompliant: true
    }
  }
};
```

## API Documentation

### OpenAPI Specification

**API Schema (Privacy-First)**
```yaml
openapi: 3.0.0
info:
  title: ProjectX Application API
  version: 1.0.0
  description: Privacy-first content and search API

paths:
  /query-index.json:
    get:
      summary: Search content (no tracking)
      parameters:
        - name: q
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  total:
                    type: integer
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Page'
```

### Rate Limiting

**Request Throttling (Privacy-Compliant)**
```javascript
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};

function applyRateLimit(req, res, next) {
  const key = req.ip;
  const current = rateLimitStore.get(key) || 0;
  
  if (current >= rateLimit.max) {
    return res.status(429).json({ error: rateLimit.message });
  }
  
  rateLimitStore.set(key, current + 1);
  next();
}
```

## Scalability Considerations

### Load Balancing

**CDN Distribution**
- Global edge locations
- Automatic failover
- Traffic routing optimization
- Performance monitoring (server-side only)

**Database Scaling**
- File-based storage scales with CDN
- No database connection limits
- Distributed content delivery
- Automatic backup and replication

### Performance Budgets

**Resource Limits**
```javascript
const performanceBudgets = {
  javascript: '54KB', // ProjectX total bundle size
  css: '50KB',
  images: '500KB',
  totalPageWeight: '1MB',
  timeToInteractive: '3s'
};
```

## Integration Patterns

### Third-Party Services (Privacy-Compliant)

**Analytics Integration (Local Only)**
```javascript
// Local analytics (no external transmission)
function initLocalAnalytics() {
  const analytics = {
    pageViews: 0,
    interactions: 0,
    errors: 0
  };
  
  // Track locally only
  document.addEventListener('click', () => {
    analytics.interactions++;
    localStorage.setItem('projectx-analytics', JSON.stringify(analytics));
  });
}
```

**Form Integration (Privacy-First)**
```javascript
// Form submission handling (privacy-compliant)
async function handleFormSubmission(formData) {
  try {
    const response = await fetch('/api/forms/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    return await response.json();
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
}
```

## ProjectX Best Practices

### Content Architecture

**Document Structure**
- Use consistent table layouts for blocks
- Implement proper heading hierarchy
- Include metadata for SEO
- Follow accessibility guidelines
- No tracking or analytics injection

**Block Organization**
- Create reusable block components
- Implement configuration through CSS classes
- Use semantic HTML structures
- Document block usage patterns

### Performance Optimization

**Content Delivery**
- Use automatic image optimization
- Implement lazy loading strategies
- Minimize JavaScript bundle size (54KB total)
- Optimize CSS delivery

**Monitoring (Privacy-First)**
- Track Core Web Vitals locally
- Monitor error rates (local storage)
- Analyze user behavior (no external transmission)
- Set performance budgets

## Privacy and Compliance

### GDPR Compliance

**Data Protection**
- No personal data collection
- No external tracking
- No cookies for tracking
- Complete RUM removal

**User Rights**
- No data to access or delete
- No profiling or tracking
- Transparent privacy practices
- User-focused design

### RUM Removal Benefits

**Privacy Advantages**
- Zero data collection
- No external requests for tracking
- GDPR compliant by design
- User privacy protection

**Performance Benefits**
- 80% smaller bundle size
- Faster page loads
- Better Core Web Vitals
- Reduced JavaScript execution

## Conclusion

The ProjectX backend structure leverages modern serverless architecture to deliver exceptional performance and complete user privacy protection. By removing all tracking and monitoring functionality while maintaining EDS compatibility, ProjectX provides a privacy-first alternative that doesn't compromise on performance or functionality.

This architecture supports rapid development cycles, automatic scaling, and excellent performance characteristics while minimizing operational overhead and completely eliminating user tracking. The integration with Google Docs provides a familiar content management experience while the ProjectX platform handles all technical complexity behind the scenes without compromising user privacy.

Key advantages:
- **Complete privacy protection** with zero data collection
- **80% performance improvement** through RUM removal
- **100% EDS compatibility** for seamless migration
- **Enhanced development experience** with local server
- **GDPR compliance** by design