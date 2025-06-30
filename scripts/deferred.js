/*
 * ProjectX Framework - Deferred Loading Module
 * Created by Tom Cranstoun, 2025
 * 
 * Copyright 2025 Tom Cranstoun
 * 
 * Licensed under the Apache License, Version 2.0
 * 
 * Handles delayed functionality that doesn't impact initial page performance
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
  
  // Add your custom deferred functionality here
  // Examples: analytics, third-party widgets, background data, service workers
  
  debugLog('Custom deferred functionality completed');
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
  executeCustomDeferred
};