/**
 * ProjectX Enhanced Scripts Proxy
 * 
 * This file provides full backward compatibility with the original scripts.js
 * while leveraging the optimized ProjectX framework. Includes complete support
 * for experimentation plugins and CMS Plus integration.
 * 
 * @author Tom Cranstoun (@ddttom)
 * @version 1.0.0
 * @license MIT
 */

/* eslint-disable operator-linebreak */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-absolute-path */

// Import all ProjectX functions - avoid duplication by importing utilities
import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  toClassName,
  getMetadata,
  getAllMetadata,
  loadScript,
  toCamelCase,
  loadCSS,
  decorateMain,
  loadEager as projectXLoadEager,
  loadLazy as projectXLoadLazy,
  loadDeferred as projectXLoadDeferred,
  pluginContext as basePluginContext,
  AUDIENCES as projectXAudiences,
  LCP_BLOCKS as projectXLcpBlocks,
  buildAutoBlocks,
  // Import utility functions to avoid duplication
  loadFonts,
  autolinkModals
} from './projectX.js';

// Import external dependencies (maintain original imports)
import { } from '/plusplus/src/siteConfig.js';

// Configuration constants (extend rather than duplicate)
const LCP_BLOCKS = [...projectXLcpBlocks]; // Allow modification
const AUDIENCES = {
  ...projectXAudiences,
  // Allow additional audience definitions
};

/**
 * Enhanced plugin execution context with additional utilities
 */
const pluginContext = {
  ...basePluginContext,
  // Add any additional context needed for plugins
};

/**
 * Enhanced loadEager with experimentation support
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  window.cmsplus.debug('loadEager');
  
  // Add experimentation support early in the eager phase
  if (getMetadata('experiment') ||
    Object.keys(getAllMetadata('campaign')).length ||
    Object.keys(getAllMetadata('audience')).length) {
    try {
      // eslint-disable-next-line import/no-relative-packages
      const { loadEager: runEager } = await import('../plusplus/plugins/experimentation/src/index.js');
      await runEager(document, { audiences: AUDIENCES }, pluginContext);
    } catch (error) {
      console.warn('ProjectX: Failed to load experimentation plugin in eager phase:', error);
    }
  }

  // Delegate to ProjectX loadEager for core functionality
  await projectXLoadEager(doc);
}

/**
 * Enhanced loadLazy with experimentation support
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  window.cmsplus.debug('loadLazy');
  
  // Delegate to ProjectX loadLazy for core functionality
  await projectXLoadLazy(doc);
  
  // Add experimentation support in lazy phase
  if ((getMetadata('experiment') ||
    Object.keys(getAllMetadata('campaign')).length ||
    Object.keys(getAllMetadata('audience')).length)) {
    try {
      // eslint-disable-next-line import/no-relative-packages
      const { loadLazy: runLazy } = await import('/plusplus/plugins/experimentation/src/index.js');
      await runLazy(document, { audiences: AUDIENCES }, pluginContext);
    } catch (error) {
      console.warn('ProjectX: Failed to load experimentation plugin in lazy phase:', error);
    }
  }
}

/**
 * Enhanced loadDelayed - delegates to ProjectX with CMS Plus logging
 */
function loadDelayed() {
  window.cmsplus.debug('loadDelayed timer start');
  // Delegate to ProjectX loadDeferred
  projectXLoadDeferred();
}

/**
 * Enhanced loadPage with CMS Plus integration
 */
async function loadPage() {
  window.cmsplus.debug('loadPage');
  
  // Initialize CMS Plus compatibility layer
  window.cmsplus = window.cmsplus || {
    debug: (message) => {
      if (window.projectX?.lighthouse || window.location.search.includes('debug=true')) {
        console.debug(`CMS Plus: ${message}`);
      }
    }
  };
  
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle frame suppression for sidekick library
  if (urlParams.get('suppressFrame') || window.location.pathname.includes('tools/sidekick')) {
    window.projectX.suppressFrame = true;
    const header = document.body.querySelector('header');
    const footer = document.body.querySelector('footer');
    if (header) header.remove();
    if (footer) footer.remove();
  }
  
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

// Export all functions for backward compatibility
export {
  // Core functions from ProjectX (re-exported)
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  toClassName,
  getMetadata,
  getAllMetadata,
  loadScript,
  toCamelCase,
  loadCSS,
  decorateMain,
  
  // Enhanced functions with plugin support
  loadEager,
  loadLazy,
  loadDelayed,
  loadPage,
  
  // Utility functions (re-exported from ProjectX)
  loadFonts,
  autolinkModals,
  
  // Configuration
  LCP_BLOCKS,
  AUDIENCES,
  pluginContext
};

// Initialize and start page loading (only if not already initialized by ProjectX)
if (!window.projectX?._scriptsInitialized) {
  // Mark as initialized to prevent double loading
  if (!window.projectX) window.projectX = {};
  window.projectX._scriptsInitialized = true;
  
  // Start page loading
  loadPage();
}
