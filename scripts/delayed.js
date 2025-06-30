/*
 * ProjectX Framework - Delayed Loading Proxy
 * Modified by Tom Cranstoun, 2025
 * 
 * This file is a modified version of Adobe Edge Delivery Services (EDS)
 * Original work: Copyright Adobe Systems Incorporated
 * Modifications: Copyright 2025 Tom Cranstoun
 * 
 * Licensed under the Apache License, Version 2.0
 * 
 * This file provides backward compatibility for the original delayed.js
 * while leveraging the optimized ProjectX deferred.js functionality.
 */

// Import and execute the ProjectX deferred functionality
import './deferred.js';

// Note: This proxy file ensures that existing scripts.js continues to work
// when importing './delayed.js' while using the enhanced deferred.js implementation