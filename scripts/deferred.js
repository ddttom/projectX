/**
 * ProjectX Deferred Loading Module
 * Handles delayed functionality that doesn't impact initial page performance
 * 
 * @author Tom Cranstoun (@ddttom)
 * @version 1.0.0
 * @license MIT
 */

/* eslint-env browser */

/**
 * Configuration for deferred functionality
 */
const DEFERRED_CONFIG = {
  ENABLE_DEBUG_LOGGING: false,
  CALLBACK_TIMEOUT: 10000, // 10 seconds max for any callback
};

/**
 * Debug logging utility
 * @param {string} message The message to log
 * @param {*} data Optional data to log
 */
function debugLog(message, data = null) {
  if (DEFERRED_CONFIG.ENABLE_DEBUG_LOGGING) {
    if (data) {
      console.debug(`ProjectX Deferred: ${message}`, data);
    } else {
      console.debug(`ProjectX Deferred: ${message}`);
    }
  }
}

/**
 * Execute callback with timeout protection
 * @param {Function} callback The callback function to execute
 * @param {string} name The name of the callback for debugging
 */
async function executeWithTimeout(callback, name) {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Callback timeout: ${name}`)), DEFERRED_CONFIG.CALLBACK_TIMEOUT);
    });
    
    await Promise.race([callback(), timeoutPromise]);
    debugLog(`Callback completed: ${name}`);
  } catch (error) {
    console.warn(`ProjectX Deferred: Callback failed - ${name}:`, error);
  }
}

/**
 * Main deferred functionality execution
 */
async function executeDeferred() {
  debugLog('Starting deferred execution');
  
  try {
    // Execute any registered callbacks from window.cmsplus if available
    if (window.cmsplus && window.cmsplus.callbackAfter3SecondsChain) {
      debugLog('Executing cmsplus callback chain', window.cmsplus.callbackAfter3SecondsChain.length);
      
      for (const callback of window.cmsplus.callbackAfter3SecondsChain) {
        await executeWithTimeout(callback, callback.name || 'anonymous');
      }
    }
    
    // Add any custom deferred functionality here
    await executeCustomDeferred();
    
    debugLog('Deferred execution completed');
  } catch (error) {
    console.warn('ProjectX Deferred: Execution failed:', error);
  }
}

/**
 * Custom deferred functionality
 * Add your own delayed functionality here
 */
async function executeCustomDeferred() {
  debugLog('Executing custom deferred functionality');
  
  // Example: Analytics initialization (if needed)
  // await initializeAnalytics();
  
  // Example: Third-party widget loading
  // await loadThirdPartyWidgets();
  
  // Example: Background data prefetching
  // await prefetchBackgroundData();
  
  // Example: Service worker registration
  // await registerServiceWorker();
  
  debugLog('Custom deferred functionality completed');
}

/**
 * Example: Initialize analytics (placeholder)
 */
async function initializeAnalytics() {
  debugLog('Initializing analytics (placeholder)');
  
  // Add your analytics initialization here
  // This could be Google Analytics, Adobe Analytics, etc.
  // Example:
  // if (window.gtag) {
  //   gtag('config', 'GA_MEASUREMENT_ID');
  // }
}

/**
 * Example: Load third-party widgets (placeholder)
 */
async function loadThirdPartyWidgets() {
  debugLog('Loading third-party widgets (placeholder)');
  
  // Add third-party widget loading here
  // This could be chat widgets, social media embeds, etc.
  // Example:
  // const chatWidget = document.createElement('script');
  // chatWidget.src = 'https://widget.example.com/chat.js';
  // document.head.appendChild(chatWidget);
}

/**
 * Example: Prefetch background data (placeholder)
 */
async function prefetchBackgroundData() {
  debugLog('Prefetching background data (placeholder)');
  
  // Add background data prefetching here
  // This could be API calls for data that might be needed later
  // Example:
  // try {
  //   const response = await fetch('/api/background-data');
  //   const data = await response.json();
  //   sessionStorage.setItem('prefetched-data', JSON.stringify(data));
  // } catch (error) {
  //   debugLog('Background data prefetch failed', error);
  // }
}

/**
 * Example: Register service worker (placeholder)
 */
async function registerServiceWorker() {
  debugLog('Registering service worker (placeholder)');
  
  // Add service worker registration here
  // Example:
  // if ('serviceWorker' in navigator) {
  //   try {
  //     await navigator.serviceWorker.register('/sw.js');
  //     debugLog('Service worker registered successfully');
  //   } catch (error) {
  //     debugLog('Service worker registration failed', error);
  //   }
  // }
}

/**
 * Performance monitoring for deferred operations
 */
function monitorDeferredPerformance() {
  if (window.performance && window.performance.mark) {
    performance.mark('projectx-deferred-start');
    
    // Monitor when deferred execution completes
    executeDeferred().finally(() => {
      performance.mark('projectx-deferred-end');
      performance.measure('projectx-deferred-duration', 'projectx-deferred-start', 'projectx-deferred-end');
      
      const measure = performance.getEntriesByName('projectx-deferred-duration')[0];
      if (measure) {
        debugLog(`Deferred execution took ${measure.duration.toFixed(2)}ms`);
      }
    });
  } else {
    // Fallback for browsers without performance API
    executeDeferred();
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

debugLog('Deferred module loaded');

// Start deferred execution with performance monitoring
monitorDeferredPerformance();

// ============================================================================
// EXPORTS (for potential future use)
// ============================================================================

export {
  executeDeferred,
  executeCustomDeferred,
  initializeAnalytics,
  loadThirdPartyWidgets,
  prefetchBackgroundData,
  registerServiceWorker
};