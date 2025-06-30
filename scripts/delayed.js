/**
 * ProjectX Delayed Loading Proxy
 * 
 * This file provides backward compatibility for the original delayed.js
 * while leveraging the optimized ProjectX deferred.js functionality.
 * 
 * @author Tom Cranstoun (@ddttom)
 * @version 1.0.0
 * @license MIT
 */

// Import and execute the ProjectX deferred functionality
import './deferred.js';

// Note: This proxy file ensures that existing scripts.js continues to work
// when importing './delayed.js' while using the enhanced deferred.js implementation