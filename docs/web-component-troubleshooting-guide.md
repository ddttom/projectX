# Web Component Troubleshooting Guide

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Quick Reference](#quick-reference)
3. [Diagnostic Procedures](#diagnostic-procedures)
4. [Root Cause Analysis Framework](#root-cause-analysis-framework)
5. [Solution Implementation Strategies](#solution-implementation-strategies)
6. [Verification & Testing Protocols](#verification--testing-protocols)
7. [Preventive Measures](#preventive-measures)
8. [Code Examples & Configurations](#code-examples--configurations)
9. [Error Handling & Rollback Procedures](#error-handling--rollback-procedures)
10. [Monitoring & Alerting](#monitoring--alerting)
11. [Documentation Requirements](#documentation-requirements)
12. [Appendices](#appendices)

---

## Executive Summary

This guide provides AI systems and developers with systematic procedures to diagnose, resolve, and prevent web component issues. Web components are custom HTML elements that encapsulate functionality and styling, but they can fail to render or function properly due to various technical issues.

### Common Problem Categories
- **Registration Issues**: Custom elements not defined in browser registry
- **Loading Problems**: Scripts failing to load or execute
- **Dependency Conflicts**: Version mismatches or missing dependencies
- **Timing Issues**: Components used before definition
- **Browser Compatibility**: Polyfill or feature support problems
- **Performance Issues**: Memory leaks or rendering bottlenecks

### Success Metrics
- ✅ Components render visually in browser
- ✅ Interactive functionality works as expected
- ✅ No JavaScript errors in console
- ✅ Performance within acceptable thresholds
- ✅ Cross-browser compatibility maintained

---

## Quick Reference

### Emergency Diagnostic Checklist

```bash
# 1. Check if custom elements are defined
console.log(customElements.get('component-name'));

# 2. Verify script loading
document.querySelectorAll('script[src]').forEach(s => console.log(s.src, s.readyState));

# 3. Check for JavaScript errors
console.error.length > 0 ? "Errors present" : "No errors";

# 4. Inspect DOM for unregistered elements
document.querySelectorAll(':not(:defined)');

# 5. Verify component visibility
getComputedStyle(document.querySelector('component-name')).display;
```

### Common Quick Fixes

| Problem | Quick Fix | Verification |
|---------|-----------|--------------|
| Component not visible | Check `customElements.define()` call | `customElements.get('name')` returns constructor |
| Script 404 errors | Verify file paths and server configuration | Network tab shows 200 status |
| Timing issues | Use `customElements.whenDefined()` | Promise resolves successfully |
| Style not applied | Check CSS loading and Shadow DOM | Computed styles show expected values |

---

## Diagnostic Procedures

### Phase 1: Visual Inspection

#### Step 1.1: Browser Rendering Assessment
```javascript
// Check if components are rendering
function assessComponentRendering() {
  const components = document.querySelectorAll('[class*="component"], [data-component]');
  const results = [];
  
  components.forEach(component => {
    const rect = component.getBoundingClientRect();
    const styles = getComputedStyle(component);
    
    results.push({
      element: component.tagName.toLowerCase(),
      visible: rect.width > 0 && rect.height > 0,
      display: styles.display,
      opacity: styles.opacity,
      defined: customElements.get(component.tagName.toLowerCase()) !== undefined
    });
  });
  
  return results;
}

console.table(assessComponentRendering());
```

#### Step 1.2: Custom Element Detection
```javascript
// Identify undefined custom elements
function findUndefinedElements() {
  const undefinedElements = document.querySelectorAll(':not(:defined)');
  const elementCounts = {};
  
  undefinedElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
  });
  
  return {
    count: undefinedElements.length,
    elements: elementCounts,
    firstElement: undefinedElements[0]
  };
}

console.log('Undefined Elements:', findUndefinedElements());
```

### Phase 2: Console Analysis

#### Step 2.1: JavaScript Error Detection
```javascript
// Comprehensive error logging
function analyzeConsoleErrors() {
  const errors = [];
  
  // Override console.error to capture errors
  const originalError = console.error;
  console.error = function(...args) {
    errors.push({
      timestamp: new Date().toISOString(),
      message: args.join(' '),
      stack: new Error().stack
    });
    originalError.apply(console, args);
  };
  
  // Check for existing errors in performance entries
  const navigationErrors = performance.getEntriesByType('navigation')
    .filter(entry => entry.transferSize === 0);
  
  return {
    capturedErrors: errors,
    navigationErrors: navigationErrors,
    unhandledRejections: window.unhandledRejectionCount || 0
  };
}
```

#### Step 2.2: Network Resource Validation
```javascript
// Check script and stylesheet loading
function validateNetworkResources() {
  const resources = performance.getEntriesByType('resource');
  const scripts = resources.filter(r => r.name.includes('.js'));
  const stylesheets = resources.filter(r => r.name.includes('.css'));
  
  const analysis = {
    scripts: scripts.map(s => ({
      url: s.name,
      status: s.transferSize > 0 ? 'loaded' : 'failed',
      size: s.transferSize,
      duration: s.duration
    })),
    stylesheets: stylesheets.map(s => ({
      url: s.name,
      status: s.transferSize > 0 ? 'loaded' : 'failed',
      size: s.transferSize,
      duration: s.duration
    }))
  };
  
  return analysis;
}

console.log('Network Resources:', validateNetworkResources());
```

### Phase 3: DOM Investigation

#### Step 3.1: Custom Elements Registry Audit
```javascript
// Comprehensive registry analysis
function auditCustomElementsRegistry() {
  const registeredElements = [];
  const expectedElements = [];
  
  // Find all custom element tags in DOM
  document.querySelectorAll('*').forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName.includes('-') && !expectedElements.includes(tagName)) {
      expectedElements.push(tagName);
    }
  });
  
  // Check registration status
  expectedElements.forEach(tagName => {
    const constructor = customElements.get(tagName);
    registeredElements.push({
      tagName,
      registered: !!constructor,
      constructor: constructor?.name || 'undefined',
      instances: document.querySelectorAll(tagName).length
    });
  });
  
  return {
    totalExpected: expectedElements.length,
    totalRegistered: registeredElements.filter(e => e.registered).length,
    elements: registeredElements
  };
}

console.table(auditCustomElementsRegistry().elements);
```

#### Step 3.2: Shadow DOM Analysis
```javascript
// Analyze Shadow DOM implementation
function analyzeShadowDOM() {
  const shadowHosts = [];
  
  document.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      shadowHosts.push({
        tagName: el.tagName.toLowerCase(),
        mode: el.shadowRoot.mode,
        childNodes: el.shadowRoot.childNodes.length,
        stylesheets: el.shadowRoot.adoptedStyleSheets?.length || 0
      });
    }
  });
  
  return shadowHosts;
}

console.log('Shadow DOM Analysis:', analyzeShadowDOM());
```

---

## Root Cause Analysis Framework

### Category 1: Registration Issues

#### Symptom: Custom elements appear as unknown elements
```javascript
// Diagnostic function for registration issues
function diagnoseRegistrationIssues(tagName) {
  const element = document.querySelector(tagName);
  const constructor = customElements.get(tagName);
  
  return {
    elementExists: !!element,
    isRegistered: !!constructor,
    constructorName: constructor?.name,
    elementCount: document.querySelectorAll(tagName).length,
    isDefined: element ? customElements.get(element.tagName.toLowerCase()) !== undefined : false,
    recommendations: generateRegistrationRecommendations(tagName, constructor, element)
  };
}

function generateRegistrationRecommendations(tagName, constructor, element) {
  const recommendations = [];
  
  if (!constructor) {
    recommendations.push(`Call customElements.define('${tagName}', YourComponentClass)`);
  }
  
  if (element && !constructor) {
    recommendations.push('Component used before registration - check script loading order');
  }
  
  if (constructor && element && element.constructor === HTMLElement) {
    recommendations.push('Element upgraded failed - check for constructor errors');
  }
  
  return recommendations;
}
```

#### Root Causes & Solutions

| Root Cause | Detection Method | Solution |
|------------|------------------|----------|
| Missing `customElements.define()` call | `customElements.get()` returns `undefined` | Add registration call after class definition |
| Script loading order issues | Elements exist before scripts load | Use `defer` attribute or move scripts to end of body |
| Class definition errors | Constructor throws during registration | Fix class syntax and inheritance issues |
| Duplicate registration attempts | Console shows registration errors | Check for multiple registration calls |

### Category 2: Loading Problems

#### Symptom: Scripts fail to load or execute
```javascript
// Comprehensive script loading diagnostics
function diagnoseScriptLoading() {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const analysis = [];
  
  scripts.forEach(script => {
    const resourceEntry = performance.getEntriesByName(script.src)[0];
    
    analysis.push({
      src: script.src,
      loaded: script.readyState === 'complete',
      hasError: script.onerror !== null,
      networkStatus: resourceEntry ? 'found' : 'not found',
      transferSize: resourceEntry?.transferSize || 0,
      type: script.type || 'text/javascript',
      async: script.async,
      defer: script.defer,
      crossOrigin: script.crossOrigin,
      integrity: script.integrity
    });
  });
  
  return analysis;
}

// Check for module loading issues
function diagnoseModuleLoading() {
  const moduleScripts = Array.from(document.querySelectorAll('script[type="module"]'));
  
  return moduleScripts.map(script => ({
    src: script.src || 'inline',
    noModule: document.querySelector('script[nomodule]') !== null,
    browserSupport: 'import' in document.createElement('script'),
    errors: script.onerror ? 'Has error handler' : 'No error handler'
  }));
}
```

### Category 3: Dependency Conflicts

#### Symptom: Components fail due to missing or conflicting dependencies
```javascript
// Dependency analysis framework
function analyzeDependencies() {
  const analysis = {
    polyfills: checkPolyfillStatus(),
    libraries: checkLibraryVersions(),
    conflicts: detectVersionConflicts(),
    missing: detectMissingDependencies()
  };
  
  return analysis;
}

function checkPolyfillStatus() {
  return {
    customElements: 'customElements' in window,
    shadowDOM: 'attachShadow' in Element.prototype,
    templates: 'content' in document.createElement('template'),
    esModules: 'noModule' in document.createElement('script')
  };
}

function checkLibraryVersions() {
  const libraries = {};
  
  // Check for common web component libraries
  if (window.LitElement) libraries.lit = window.LitElement.version || 'unknown';
  if (window.Stencil) libraries.stencil = window.Stencil.version || 'unknown';
  if (window.Shoelace) libraries.shoelace = window.Shoelace.version || 'unknown';
  
  return libraries;
}

function detectVersionConflicts() {
  const conflicts = [];
  
  // Check for multiple versions of same library
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const libraryVersions = {};
  
  scripts.forEach(script => {
    const src = script.src;
    const versionMatch = src.match(/@(\d+\.\d+\.\d+)/);
    
    if (versionMatch) {
      const libraryName = src.split('@')[0].split('/').pop();
      if (!libraryVersions[libraryName]) {
        libraryVersions[libraryName] = [];
      }
      libraryVersions[libraryName].push(versionMatch[1]);
    }
  });
  
  Object.entries(libraryVersions).forEach(([lib, versions]) => {
    if (versions.length > 1) {
      conflicts.push({
        library: lib,
        versions: versions,
        recommendation: 'Use single version across application'
      });
    }
  });
  
  return conflicts;
}
```

### Category 4: Timing Issues

#### Symptom: Components used before definition
```javascript
// Timing issue diagnostics
function diagnoseTimingIssues() {
  const undefinedElements = document.querySelectorAll(':not(:defined)');
  const timingAnalysis = [];
  
  undefinedElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    
    // Check if definition is pending
    customElements.whenDefined(tagName)
      .then(() => {
        console.log(`${tagName} was defined after initial check`);
      })
      .catch(error => {
        console.error(`${tagName} definition failed:`, error);
      });
    
    timingAnalysis.push({
      tagName,
      inDOM: true,
      defined: false,
      pendingDefinition: true
    });
  });
  
  return timingAnalysis;
}

// Solution: Proper timing management
function implementTimingFix(tagName, callback) {
  if (customElements.get(tagName)) {
    // Already defined
    callback();
  } else {
    // Wait for definition
    customElements.whenDefined(tagName).then(callback);
  }
}
```

---

## Solution Implementation Strategies

### Strategy 1: Component Registration Solutions

#### Manual Registration Approach
```javascript
// Comprehensive registration function
function registerWebComponent(tagName, componentClass, options = {}) {
  try {
    // Check if already registered
    if (customElements.get(tagName)) {
      console.warn(`Component ${tagName} already registered`);
      return true;
    }
    
    // Validate component class
    if (typeof componentClass !== 'function') {
      throw new Error(`Component class for ${tagName} must be a constructor function`);
    }
    
    // Register the component
    customElements.define(tagName, componentClass);
    
    // Verify registration
    const registered = customElements.get(tagName) === componentClass;
    
    if (registered) {
      console.log(`✅ Successfully registered ${tagName}`);
      
      // Optional: Upgrade existing elements
      if (options.upgradeExisting) {
        upgradeExistingElements(tagName);
      }
      
      return true;
    } else {
      throw new Error(`Registration verification failed for ${tagName}`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to register ${tagName}:`, error);
    return false;
  }
}

function upgradeExistingElements(tagName) {
  const elements = document.querySelectorAll(tagName);
  console.log(`Upgrading ${elements.length} existing ${tagName} elements`);
  
  elements.forEach(element => {
    // Force upgrade by temporarily removing and re-adding
    const parent = element.parentNode;
    const nextSibling = element.nextSibling;
    parent.removeChild(element);
    parent.insertBefore(element, nextSibling);
  });
}
```

#### Batch Registration System
```javascript
// Register multiple components with dependency management
class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.dependencies = new Map();
    this.registered = new Set();
  }
  
  add(tagName, componentClass, dependencies = []) {
    this.components.set(tagName, componentClass);
    this.dependencies.set(tagName, dependencies);
  }
  
  async registerAll() {
    const registrationOrder = this.resolveDependencyOrder();
    const results = [];
    
    for (const tagName of registrationOrder) {
      try {
        await this.registerComponent(tagName);
        results.push({ tagName, status: 'success' });
      } catch (error) {
        results.push({ tagName, status: 'failed', error: error.message });
      }
    }
    
    return results;
  }
  
  async registerComponent(tagName) {
    if (this.registered.has(tagName)) {
      return;
    }
    
    // Wait for dependencies
    const deps = this.dependencies.get(tagName) || [];
    await Promise.all(deps.map(dep => customElements.whenDefined(dep)));
    
    // Register component
    const componentClass = this.components.get(tagName);
    customElements.define(tagName, componentClass);
    this.registered.add(tagName);
    
    console.log(`✅ Registered ${tagName}`);
  }
  
  resolveDependencyOrder() {
    // Topological sort implementation
    const visited = new Set();
    const order = [];
    
    const visit = (tagName) => {
      if (visited.has(tagName)) return;
      visited.add(tagName);
      
      const deps = this.dependencies.get(tagName) || [];
      deps.forEach(dep => {
        if (this.components.has(dep)) {
          visit(dep);
        }
      });
      
      order.push(tagName);
    };
    
    this.components.forEach((_, tagName) => visit(tagName));
    return order;
  }
}

// Usage example
const registry = new ComponentRegistry();
registry.add('base-component', BaseComponent);
registry.add('advanced-component', AdvancedComponent, ['base-component']);
registry.registerAll().then(results => {
  console.log('Registration results:', results);
});
```

### Strategy 2: Script Loading Solutions

#### Dynamic Script Loading with Error Handling
```javascript
// Robust script loading utility
class ScriptLoader {
  constructor() {
    this.loadedScripts = new Set();
    this.loadingPromises = new Map();
  }
  
  async loadScript(src, options = {}) {
    // Return existing promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }
    
    // Return immediately if already loaded
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }
    
    const promise = this.createLoadPromise(src, options);
    this.loadingPromises.set(src, promise);
    
    try {
      await promise;
      this.loadedScripts.add(src);
      this.loadingPromises.delete(src);
    } catch (error) {
      this.loadingPromises.delete(src);
      throw error;
    }
  }
  
  createLoadPromise(src, options) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      
      // Configure script element
      script.src = src;
      script.type = options.type || 'text/javascript';
      if (options.async !== undefined) script.async = options.async;
      if (options.defer !== undefined) script.defer = options.defer;
      if (options.crossOrigin) script.crossOrigin = options.crossOrigin;
      if (options.integrity) script.integrity = options.integrity;
      
      // Set up event handlers
      script.onload = () => {
        console.log(`✅ Loaded script: ${src}`);
        resolve();
      };
      
      script.onerror = (error) => {
        console.error(`❌ Failed to load script: ${src}`, error);
        reject(new Error(`Script loading failed: ${src}`));
      };
      
      // Add timeout handling
      const timeout = options.timeout || 10000;
      const timeoutId = setTimeout(() => {
        script.remove();
        reject(new Error(`Script loading timeout: ${src}`));
      }, timeout);
      
      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      
      // Add to document
      document.head.appendChild(script);
    });
  }
  
  async loadMultiple(scripts) {
    const results = [];
    
    for (const script of scripts) {
      try {
        await this.loadScript(script.src, script.options);
        results.push({ src: script.src, status: 'loaded' });
      } catch (error) {
        results.push({ src: script.src, status: 'failed', error: error.message });
        
        if (script.required) {
          throw error; // Stop loading if required script fails
        }
      }
    }
    
    return results;
  }
}

// Usage example
const loader = new ScriptLoader();
await loader.loadMultiple([
  { src: '/components/base.js', required: true },
  { src: '/components/advanced.js', options: { type: 'module' } },
  { src: '/polyfills/webcomponents.js', required: false }
]);
```

#### Module Loading with Fallbacks
```javascript
// ES Module loading with fallback support
class ModuleLoader {
  static async loadWithFallback(moduleUrl, fallbackUrl) {
    try {
      // Try ES module first
      if (this.supportsModules()) {
        return await import(moduleUrl);
      } else {
        throw new Error('ES modules not supported');
      }
    } catch (error) {
      console.warn(`Module loading failed, using fallback: ${error.message}`);
      
      // Load fallback script
      await this.loadScript(fallbackUrl);
      
      // Return global object (assuming fallback creates global)
      const globalName = this.extractGlobalName(fallbackUrl);
      return window[globalName];
    }
  }
  
  static supportsModules() {
    return 'noModule' in document.createElement('script');
  }
  
  static loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  static extractGlobalName(url) {
    // Extract likely global name from URL
    const filename = url.split('/').pop().split('.')[0];
    return filename.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
}

// Usage example
try {
  const ShoelaceComponents = await ModuleLoader.loadWithFallback(
    '/components/shoelace.esm.js',
    '/components/shoelace.umd.js'
  );
  
  // Register components
  ShoelaceComponents.register();
} catch (error) {
  console.error('Failed to load components:', error);
}
```

### Strategy 3: Dependency Resolution

#### Polyfill Management
```javascript
// Comprehensive polyfill loading system
class PolyfillManager {
  static async loadRequired() {
    const polyfills = [];
    
    // Check for required features
    if (!('customElements' in window)) {
      polyfills.push('/polyfills/custom-elements.js');
    }
    
    if (!('attachShadow' in Element.prototype)) {
      polyfills.push('/polyfills/shadow-dom.js');
    }
    
    if (!('content' in document.createElement('template'))) {
      polyfills.push('/polyfills/template.js');
    }
    
    // Load polyfills sequentially
    for (const polyfill of polyfills) {
      await this.loadPolyfill(polyfill);
    }
    
    return polyfills.length;
  }
  
  static loadPolyfill(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`✅ Loaded polyfill: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`❌ Failed to load polyfill: ${src}`);
        reject(new Error(`Polyfill loading failed: ${src}`));
      };
      document.head.appendChild(script);
    });
  }
  
  static checkSupport() {
    return {
      customElements: 'customElements' in window,
      shadowDOM: 'attachShadow' in Element.prototype,
      templates: 'content' in document.createElement('template'),
      esModules: 'noModule' in document.createElement('script'),
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window
    };
  }
}

// Initialize polyfills before component loading
PolyfillManager.loadRequired().then(count => {
  console.log(`Loaded ${count} polyfills`);
  // Now safe to load components
  initializeComponents();
});
```

### Strategy 4: Fallback Strategies

#### Progressive Enhancement Approach
```javascript
// Progressive enhancement for web components
class ComponentEnhancer {
  static enhance(selector, componentClass, fallbackRenderer) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      if (customElements.get(element.tagName.toLowerCase())) {
        // Component is registered, let it handle itself
        return;
      }
      
      // Provide fallback functionality
      this.applyFallback(element, fallbackRenderer);
      
      // Upgrade when component becomes available
      customElements.whenDefined(element.tagName.toLowerCase())
        .then(() => {
          this.removeFallback(element);
        });
    });
  }
  
  static applyFallback(element, renderer) {
    element.classList.add('fallback-enhanced');
    
    if (typeof renderer === 'function') {
      renderer(element);
    } else {
      // Default fallback: make content visible
      element.style.display = 'block';
      element.style.opacity = '1';
    }
  }
  
  static removeFallback(element) {
    element.classList.remove('fallback-enhanced');
    element.style.display = '';
    element.style.opacity = '';
  }
}

// Usage example
ComponentEnhancer.enhance('sl-card', SlCard, (element) => {
  // Fallback rendering for sl-card
  element.innerHTML = `
    <div class="fallback-card">
      <div class="fallback-image">${element.querySelector('[slot="image"]')?.outerHTML || ''}</div>
      <div class="fallback-content">${element.innerHTML}</div>
    </div>
  `;
});
```

---

## Verification & Testing Protocols

### Functional Testing Framework

#### Component Functionality Tests
```javascript
// Comprehensive component testing suite
class ComponentTester {
  constructor(tagName) {
    this.tagName = tagName;
    this.tests = [];
    this.results = [];
  }
  
  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
    return this;
  }
  
  async runAll() {
    console.log(`🧪 Running tests for ${this.tagName}`);
    
    for (const test of this.tests) {
      try {
        const result = await this.runTest(test);
        this.results.push(result);
      } catch (error) {
        this.results.push({
          name: test.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return this.generateReport();
  }
  
  async runTest(test) {
    const startTime = performance.now();
    
    try {
      await test.testFunction();
      const duration = performance.now() - startTime;
      
      return {
        name: test.name,
        status: 'passed',
        duration: Math.round(duration * 100) / 100
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        name: test.name,
        status: 'failed',
        duration: Math.round(duration * 100) / 100,
        error: error.message
      };
    }
  }
  
  generateReport() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    const report = {
      component: this.tagName,
      summary: {
        total: this.results.length,
        passed,
        failed,
        successRate: Math.round((passed / this.results.length) * 100),
        totalDuration: Math.round(totalDuration * 100) / 100
      },
      details: this.results
    };
    
    console.log(`📊 Test Results for ${this.tagName}:`, report);
    return report;
  }
}

// Standard test suite for web components
function createStandardTestSuite(tagName) {
  const tester = new ComponentTester(tagName);
  
  return tester
    .addTest('Component Registration', async () => {
      const constructor = customElements.get(tagName);
      if (!constructor) {
        throw new Error(`Component ${tagName} is not registered`);
      }
    })
    
    .addTest('Element Creation', async () => {
      const element = document.createElement(tagName);
      if (element.constructor === HTMLElement) {
        throw new Error(`Element ${tagName} was not properly upgraded`);
      }
    })
    
    .addTest('DOM Insertion', async () => {
      const element = document.createElement(tagName);
      document.body.appendChild(element);
      
      // Wait for potential async initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const rect = element.getBoundingClientRect();
      document.body.removeChild(element);
      
      if (rect.width === 0 && rect.height === 0) {
        throw new Error(`Element ${tagName} has no dimensions`);
      }
    })
    
    .addTest('Attribute Handling', async () => {
      const element = document.createElement(tagName);
      element.setAttribute('test-attr', 'test-value');
      
      // Check if component handles attributes
      if (element.hasAttribute('test-attr')) {
        // Basic attribute test passed
        return;
      }
    })
    
    .addTest('Event Handling', async () => {
      const element = document.createElement(tagName);
      let eventFired = false;
      
      element.addEventListener('test-event', () => {
        eventFired = true;
      });
      
      // Dispatch test event
      element.dispatchEvent(new CustomEvent('test-event'));

errorsByComponent[tagName].push(error);
    });
    
    return {
      totalErrors: this.errorLog.length,
      errorsByComponent,
      recoveryAttempts: Object.fromEntries(this.recoveryAttempts),
      recentErrors: this.errorLog.slice(-10)
    };
  }
  
  clearErrors() {
    this.errorLog = [];
    this.recoveryAttempts.clear();
  }
}

// Global error handler setup
const componentErrorHandler = new ComponentErrorHandler();

// Register common fallback strategies
componentErrorHandler.registerFallback('sl-card', (element) => {
  element.innerHTML = `
    <div class="fallback-card" style="border: 1px solid #ddd; padding: 1rem; border-radius: 4px;">
      <div class="fallback-image">${element.querySelector('[slot="image"]')?.outerHTML || ''}</div>
      <div class="fallback-content">${element.textContent}</div>
    </div>
  `;
});

// Catch unhandled component errors
window.addEventListener('error', (event) => {
  const element = event.target;
  if (element && element.tagName && element.tagName.includes('-')) {
    componentErrorHandler.handleComponentError(
      element.tagName.toLowerCase(),
      event.error || new Error(event.message),
      element
    );
  }
});
```

### Rollback Procedures

#### Component Version Rollback
```javascript
// Component version management and rollback system
class ComponentVersionManager {
  constructor() {
    this.versions = new Map();
    this.activeVersions = new Map();
    this.rollbackQueue = [];
  }
  
  registerVersion(tagName, version, componentClass, metadata = {}) {
    if (!this.versions.has(tagName)) {
      this.versions.set(tagName, new Map());
    }
    
    const componentVersions = this.versions.get(tagName);
    componentVersions.set(version, {
      componentClass,
      metadata: {
        ...metadata,
        registeredAt: new Date().toISOString(),
        hash: this.generateHash(componentClass.toString())
      }
    });
    
    console.log(`📦 Registered ${tagName} version ${version}`);
  }
  
  activateVersion(tagName, version) {
    const componentVersions = this.versions.get(tagName);
    if (!componentVersions || !componentVersions.has(version)) {
      throw new Error(`Version ${version} not found for ${tagName}`);
    }
    
    const previousVersion = this.activeVersions.get(tagName);
    const versionData = componentVersions.get(version);
    
    try {
      // Unregister current version if exists
      if (customElements.get(tagName)) {
        this.unregisterComponent(tagName);
      }
      
      // Register new version
      customElements.define(tagName, versionData.componentClass);
      
      this.activeVersions.set(tagName, {
        version,
        previousVersion,
        activatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Activated ${tagName} version ${version}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to activate ${tagName} version ${version}:`, error);
      
      // Attempt rollback to previous version
      if (previousVersion) {
        this.rollback(tagName);
      }
      
      throw error;
    }
  }
  
  rollback(tagName) {
    const activeVersion = this.activeVersions.get(tagName);
    if (!activeVersion || !activeVersion.previousVersion) {
      throw new Error(`No previous version available for rollback: ${tagName}`);
    }
    
    const previousVersion = activeVersion.previousVersion.version;
    
    console.log(`🔄 Rolling back ${tagName} to version ${previousVersion}`);
    
    try {
      this.activateVersion(tagName, previousVersion);
      
      // Add to rollback queue for monitoring
      this.rollbackQueue.push({
        tagName,
        fromVersion: activeVersion.version,
        toVersion: previousVersion,
        rolledBackAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error(`❌ Rollback failed for ${tagName}:`, error);
      throw error;
    }
  }
  
  unregisterComponent(tagName) {
    // Note: There's no official way to unregister custom elements
    // This is a limitation of the Custom Elements API
    // We can only override with a new definition
    
    console.warn(`⚠️ Cannot truly unregister ${tagName} - will override on next registration`);
  }
  
  generateHash(content) {
    // Simple hash function for content verification
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
  
  getVersionInfo(tagName) {
    const versions = this.versions.get(tagName);
    const activeVersion = this.activeVersions.get(tagName);
    
    return {
      tagName,
      availableVersions: versions ? Array.from(versions.keys()) : [],
      activeVersion: activeVersion?.version || null,
      rollbackAvailable: activeVersion?.previousVersion !== null
    };
  }
  
  getAllVersionInfo() {
    const info = {};
    
    this.versions.forEach((_, tagName) => {
      info[tagName] = this.getVersionInfo(tagName);
    });
    
    return info;
  }
  
  getRollbackHistory() {
    return this.rollbackQueue.slice(-50); // Last 50 rollbacks
  }
}

// Usage example
const versionManager = new ComponentVersionManager();

// Register multiple versions
versionManager.registerVersion('my-component', '1.0.0', MyComponentV1);
versionManager.registerVersion('my-component', '1.1.0', MyComponentV11);
versionManager.registerVersion('my-component', '2.0.0', MyComponentV2);

// Activate latest version
try {
  versionManager.activateVersion('my-component', '2.0.0');
} catch (error) {
  console.error('Activation failed, component rolled back automatically');
}
```

---

## Documentation Requirements

### Component Documentation Standards

#### Comprehensive Component Documentation Template
```markdown
# Component Name

## Overview
Brief description of the component's purpose and functionality.

## Registration Information
- **Tag Name**: `component-name`
- **Class Name**: `ComponentName`
- **Version**: `1.0.0`
- **Dependencies**: List of required dependencies
- **Browser Support**: Minimum browser versions

## API Reference

### Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `attr-name` | `string` | `""` | Description of attribute |

### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `propertyName` | `string` | `""` | Description of property |

### Methods
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `methodName()` | `param: type` | `type` | Description of method |

### Events
| Event | Detail | Description |
|-------|--------|-------------|
| `event-name` | `{data: any}` | Description of event |

### CSS Custom Properties
| Property | Default | Description |
|----------|---------|-------------|
| `--component-color` | `#000` | Primary color |

### CSS Parts
| Part | Description |
|------|-------------|
| `part-name` | Description of styleable part |

## Usage Examples

### Basic Usage
```html
<component-name attribute="value">
  Content
</component-name>
```

### Advanced Usage
```javascript
const component = document.createElement('component-name');
component.propertyName = 'value';
component.addEventListener('event-name', handler);
document.body.appendChild(component);
```

## Troubleshooting

### Common Issues
1. **Issue**: Component not rendering
   - **Cause**: Component not registered
   - **Solution**: Ensure script is loaded and `customElements.define()` is called

2. **Issue**: Styles not applied
   - **Cause**: CSS not loaded or Shadow DOM isolation
   - **Solution**: Check CSS loading and Shadow DOM implementation

### Error Codes
| Code | Description | Solution |
|------|-------------|----------|
| `COMP_001` | Registration failed | Check class definition |
| `COMP_002` | Dependency missing | Load required dependencies |

## Performance Considerations
- Memory usage: ~X KB per instance
- Render time: ~X ms average
- Recommended maximum instances: X

## Accessibility
- ARIA roles and properties used
- Keyboard navigation support
- Screen reader compatibility

## Browser Compatibility
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Supported |
| Firefox | 63+ | ✅ Supported |
| Safari | 10.1+ | ✅ Supported |
| Edge | 79+ | ✅ Supported |

## Migration Guide
Instructions for migrating from previous versions.

## Contributing
Guidelines for contributing to this component.
```

---

## Appendices

### Appendix A: Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| Custom Elements v1 | 54+ | 63+ | 10.1+ | 79+ | ❌ |
| Shadow DOM v1 | 53+ | 63+ | 10+ | 79+ | ❌ |
| ES Modules | 61+ | 60+ | 10.1+ | 16+ | ❌ |
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 16+ | ❌ |
| Template Element | 26+ | 22+ | 8+ | 13+ | ❌ |

### Appendix B: Polyfill Recommendations

#### Essential Polyfills
```html
<!-- For older browsers -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-loader.js"></script>

<!-- For IE11 support -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2/custom-elements-es5-adapter.js"></script>
```

#### Conditional Loading
```javascript
// Load polyfills only when needed
function loadPolyfillsIfNeeded() {
  const needsPolyfills = !('customElements' in window) || 
                        !('attachShadow' in Element.prototype);
  
  if (needsPolyfills) {
    return loadScript('https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-bundle.js');
  }
  
  return Promise.resolve();
}

loadPolyfillsIfNeeded().then(() => {
  // Safe to use web components
  initializeComponents();
});
```

### Appendix C: Performance Benchmarks

#### Typical Performance Metrics
- **Component Registration**: 1-5ms per component
- **Element Creation**: 0.1-1ms per element
- **First Render**: 5-50ms depending on complexity
- **Memory Usage**: 1-10KB per component instance

#### Performance Testing Script
```javascript
// Comprehensive performance testing
async function runPerformanceTests(tagName, iterations = 1000) {
  const results = {};
  
  // Test registration time
  const regStart = performance.now();
  // Assume component is registered here
  results.registrationTime = performance.now() - regStart;
  
  // Test creation time
  const createStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    document.createElement(tagName);
  }
  results.creationTime = (performance.now() - createStart) / iterations;
  
  // Test render time
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  
  const renderStart = performance.now();
  await new Promise(resolve => requestAnimationFrame(resolve));
  results.renderTime = performance.now() - renderStart;
  
  element.remove();
  
  return results;
}
```

### Appendix D: Security Considerations

#### Content Security Policy (CSP)
```html
<!-- Recommended CSP for web components -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self';
">
```

#### XSS Prevention
```javascript
// Safe content insertion
function safeSetContent(element, content) {
  // Sanitize content before insertion
  const sanitized = DOMPurify.sanitize(content);
  element.innerHTML = sanitized;
}

// Avoid direct innerHTML with user content
// element.innerHTML = userContent; // ❌ Dangerous
// safeSetContent(element, userContent); // ✅ Safe
```

### Appendix E: Common Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Failed to construct 'CustomElement'" | Constructor error | Check class syntax and super() call |
| "CustomElement is not defined" | Component not registered | Call customElements.define() |
| "Illegal constructor" | Direct instantiation | Use document.createElement() |
| "Cannot read property of undefined" | Missing dependency | Load required scripts |
| "Script error" | CORS or syntax error | Check script loading and syntax |

---

## Conclusion

This comprehensive troubleshooting guide provides systematic procedures for diagnosing, resolving, and preventing web component issues. By following these methodologies, AI systems and developers can effectively maintain robust web component implementations.

### Key Takeaways

1. **Systematic Diagnosis**: Use the provided diagnostic procedures to identify root causes
2. **Proactive Monitoring**: Implement monitoring systems to catch issues early
3. **Graceful Degradation**: Always provide fallback strategies for component failures
4. **Documentation**: Maintain comprehensive documentation for all components
5. **Testing**: Implement thorough testing protocols for reliability

### Next Steps

1. Implement the monitoring systems in your environment
2. Create component-specific troubleshooting procedures
3. Establish error handling and rollback procedures
4. Train team members on diagnostic techniques
5. Regularly review and update troubleshooting procedures

For additional support or to report issues with this guide, please refer to the project documentation or contact the development team.

---

*Last Updated: 2025-06-23*
*Version: 1.0.0*
