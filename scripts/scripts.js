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

// Import all ProjectX functions
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
  decorateMain as projectXDecorateMain,
  loadEager as projectXLoadEager,
  loadLazy as projectXLoadLazy,
  loadDeferred as projectXLoadDeferred,
  loadPage as projectXLoadPage,
  pluginContext as basePluginContext,
  AUDIENCES as projectXAudiences,
  LCP_BLOCKS as projectXLcpBlocks,
  buildAutoBlocks
} from './projectX.js';

// Import external dependencies (maintain original imports)
import { } from '/plusplus/src/siteConfig.js';

// Configuration constants (maintain original values)
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
 * Enhanced decorateMain function with plugin hooks
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  // Use ProjectX decorateMain which includes enhanced auto-blocking
  projectXDecorateMain(main);
}

/**
 * Enhanced loadEager with experimentation support
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  window.cmsplus.debug('loadEager');
  document.documentElement.lang = 'en';
  
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

  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Enhanced loadLazy with experimentation support
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  window.cmsplus.debug('loadLazy');
  const main = doc.querySelector('main');
  await loadBlocks(main);
  autolinkModals(doc);
  
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  
  if (!window.hlx.suppressFrame) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  
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

  // RUM tracking removed - ProjectX focuses on privacy and performance
}

/**
 * Enhanced loadDelayed - imports deferred functionality directly
 */
function loadDelayed() {
  window.cmsplus.debug('loadDelayed timer start');
  // Import deferred functionality directly
  window.setTimeout(() => import('./deferred.js'), 4000);
}

/**
 * Load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Auto-link modals for modal handling
 * @param {Element} element The element to add modal auto-linking to
 */
function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');

    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      try {
        const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
        openModal(origin.href);
      } catch (error) {
        console.warn('ProjectX: Failed to load modal:', error);
      }
    }
  });
}

/**
 * Enhanced loadPage with frame suppression support
 */
async function loadPage() {
  window.cmsplus.debug('loadPage');
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle frame suppression for sidekick library
  if (urlParams.get('suppressFrame') || window.location.pathname.includes('tools/sidekick')) {
    window.hlx.suppressFrame = true;
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
  // Core functions from ProjectX
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
  
  // Enhanced functions with plugin support
  loadEager,
  loadLazy,
  loadDelayed,
  loadPage,
  
  // Utility functions
  loadFonts,
  autolinkModals,
  
  // Configuration
  LCP_BLOCKS,
  AUDIENCES,
  pluginContext
};

// Auto-start page loading (maintain original behavior)
loadPage();
