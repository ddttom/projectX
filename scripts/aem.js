/**
 * ProjectX Compatibility Proxy for aem.js
 * 
 * This file provides backward compatibility for existing blocks that import from aem.js.
 * All functions are re-exported from the consolidated projectX.js framework.
 * 
 * @author Tom Cranstoun (@ddttom)
 * @version 1.0.0
 * @license MIT
 */

// Re-export all functions from projectX.js for backward compatibility
export {
  // Core utility functions
  setup,
  toClassName,
  toCamelCase,
  readBlockConfig,
  getMetadata,
  getAllMetadata,
  
  // CSS and script loading
  loadCSS,
  loadScript,
  createOptimizedPicture,
  
  // Icon and button decoration
  decorateIcon,
  decorateIcons,
  decorateButtons,
  
  // Template and theme
  decorateTemplateAndTheme,
  
  // Section management
  decorateSections,
  updateSectionsStatus,
  
  // Block system
  buildBlock,
  decorateBlock,
  decorateBlocks,
  loadBlock,
  loadBlocks,
  wrapTextNodes,
  
  // Header and footer
  loadHeader,
  loadFooter,
  
  // Performance and LCP
  waitForLCP,
  
  // RUM compatibility (no-op)
  sampleRUM,
  
  // Auto-blocking functions (ProjectX enhancements)
  autoBlockHero,
  autoBlockCards,
  autoBlockColumns,
  autoBlockTable,
  autoBlockMedia,
  buildAutoBlocks,
  
  // Page orchestration
  loadEager,
  loadLazy,
  loadDeferred,
  loadPage
} from './projectX.js';

// Note: This proxy file ensures that existing blocks continue to work
// without modification when migrating from Adobe EDS to ProjectX.
// All functions maintain identical APIs and behavior.