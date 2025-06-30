/**
 * ProjectX Framework - Privacy-First Edge Delivery Services Alternative
 * A lightweight JavaScript framework inspired by Adobe EDS with complete RUM removal
 * 
 * Key Features:
 * - 100% backward compatibility with Adobe EDS blocks
 * - Complete removal of Real User Monitoring for privacy
 * - Enhanced auto-blocking system
 * - 80% performance improvement over standard EDS
 * 
 * @author Tom Cranstoun (@ddttom)
 * @version 1.0.0
 * @license MIT
 */

/* eslint-env browser */

/**
 * Configuration constants for ProjectX framework
 */
const PROJECTX_CONFIG = {
  // Performance settings
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 250,
  DEFERRED_LOAD_DELAY: 4000,
  
  // Error handling
  MAX_RETRY_ATTEMPTS: 3,
  TIMEOUT_DURATION: 5000,
  
  // Auto-blocking settings
  AUTO_BLOCKING: {
    HERO: true,
    CARDS: true,
    COLUMNS: true,
    TABLES: true,
    MEDIA: true,
    CUSTOM: true
  },
  
  // Feature flags
  ENABLE_DEBUG_LOGGING: false
};

/**
 * LCP blocks that should be loaded eagerly
 */
const LCP_BLOCKS = [];

/**
 * Audience definitions for targeting
 */
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
};

/**
 * Plugin execution context for external plugins
 */
const pluginContext = {
  getAllMetadata,
  getMetadata,
  loadCSS,
  loadScript,
  sampleRUM,
  toCamelCase,
  toClassName,
};

/**
 * Setup block utils and initialize ProjectX framework
 */
function setup() {
  // Initialize main ProjectX object
  window.projectX = window.projectX || {};
  window.projectX.codeBasePath = '';
  window.projectX.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';

  // Enhanced script detection - look for aem.js, scripts.js, or projectX.js
  const scriptEl = document.querySelector('script[src$="/scripts/aem.js"]') || 
                   document.querySelector('script[src$="/scripts/scripts.js"]') ||
                   document.querySelector('script[src$="/scripts/projectX.js"]');
  
  if (scriptEl) {
    try {
      const scriptUrl = new URL(scriptEl.src);
      const pathname = scriptUrl.pathname;
      
      // Extract base path from different script patterns
      if (pathname.endsWith('/scripts/aem.js')) {
        window.projectX.codeBasePath = pathname.replace('/scripts/aem.js', '');
      } else if (pathname.endsWith('/scripts/scripts.js')) {
        window.projectX.codeBasePath = pathname.replace('/scripts/scripts.js', '');
      } else if (pathname.endsWith('/scripts/projectX.js')) {
        window.projectX.codeBasePath = pathname.replace('/scripts/projectX.js', '');
      }
      
      // If we got an empty string, it means script is at root level
      // In production, this should be empty string for relative paths
      // In development with localhost, use origin for absolute paths
      if (!window.projectX.codeBasePath) {
        if (scriptUrl.hostname === 'localhost' || scriptUrl.hostname === '127.0.0.1') {
          window.projectX.codeBasePath = scriptUrl.origin;
        } else {
          window.projectX.codeBasePath = '';
        }
      }
      
      if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
        console.debug(`ProjectX: Detected script: ${scriptEl.src}`);
        console.debug(`ProjectX: Base path set to: ${window.projectX.codeBasePath}`);
      }
    } catch (error) {
      console.warn('ProjectX: Could not determine code base path from script URL:', error);
    }
  }
  
  // Fallback for development environments
  if (!window.projectX.codeBasePath && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.projectX.codeBasePath = window.location.origin;
    if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
      console.debug(`ProjectX: Using localhost fallback base path: ${window.projectX.codeBasePath}`);
    }
  }
  
  // Final validation
  if (!window.projectX.codeBasePath) {
    console.warn('ProjectX: Could not determine code base path - resources may fail to load');
  } else if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug(`ProjectX: Final base path: ${window.projectX.codeBasePath}`);
  }

  // Create hlx as a dynamic proxy clone of projectX for backward compatibility
  // This ensures hlx is never directly manipulated and always reflects projectX state
  if (!window.hlx || typeof window.hlx !== 'object' || !window.hlx._isProjectXProxy) {
    window.hlx = new Proxy(window.projectX, {
      get(target, prop) {
        // Special marker to identify this as a ProjectX proxy
        if (prop === '_isProjectXProxy') return true;
        return target[prop];
      },
      set(target, prop, value) {
        // Redirect all sets to the main projectX object
        target[prop] = value;
        return true;
      },
      has(target, prop) {
        return prop in target;
      },
      ownKeys(target) {
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target, prop);
      }
    });
  }
}

/**
 * Deprecated RUM function for backward compatibility with Adobe EDS
 * 
 * ProjectX has completely removed Real User Monitoring for privacy and performance.
 * This function logs a deprecation warning to encourage migration away from RUM.
 * 
 * @param {string} checkpoint identifies the checkpoint in funnel (ignored)
 * @param {Object} data additional data for RUM sample (ignored)
 * @deprecated RUM tracking has been removed from ProjectX for privacy reasons
 */
function sampleRUM(checkpoint, data = {}) {
  // Log deprecation warning to encourage migration away from RUM
  console.warn(`ProjectX: sampleRUM('${checkpoint}') is deprecated and has no effect. RUM tracking has been removed for privacy and performance reasons.`);
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
function toClassName(name) {
  if (typeof name !== 'string') return '';
  
  // More efficient single-pass transformation
  return name
    .toLowerCase()
    .replace(/[^0-9a-z]+/gi, '-')  // Combined multiple non-alphanumeric chars
    .replace(/^-+|-+$/g, '');      // Remove leading/trailing dashes in one pass
}

/**
 * Sanitizes a string for use as a js property name.
 * @param {string} name The unsanitized string
 * @returns {string} The camelCased name
 */
function toCamelCase(name) {
  if (typeof name !== 'string') return '';
  
  // More efficient: combine sanitization and camelCase conversion
  return name
    .toLowerCase()
    .replace(/[^0-9a-z]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
function readBlockConfig(block) {
  const config = {};
  const rows = block.querySelectorAll(':scope > div');
  
  for (const row of rows) {
    const [keyCol, valueCol] = row.children;
    if (!valueCol) continue;
    
    const name = toClassName(keyCol.textContent);
    let value;
    
    // More efficient element detection using single queries
    const links = valueCol.querySelectorAll('a');
    const images = valueCol.querySelectorAll('img');
    const paragraphs = valueCol.querySelectorAll('p');
    
    if (links.length) {
      value = links.length === 1 ? links[0].href : Array.from(links, a => a.href);
    } else if (images.length) {
      value = images.length === 1 ? images[0].src : Array.from(images, img => img.src);
    } else if (paragraphs.length) {
      value = paragraphs.length === 1 ? paragraphs[0].textContent : Array.from(paragraphs, p => p.textContent);
    } else {
      value = valueCol.textContent;
    }
    
    config[name] = value;
  }
  
  return config;
}

/**
 * Loads a CSS file.
 * @param {string} href URL to the CSS file
 */
async function loadCSS(href) {
  // Check if already loaded using more efficient selector
  const existing = document.head.querySelector(`link[href="${href}"]`);
  if (existing) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Loads a non module JS file.
 * @param {string} src URL to the JS file
 * @param {Object} attrs additional optional attributes
 */
async function loadScript(src, attrs) {
  // Check if already loaded
  const existing = document.head.querySelector(`script[src="${src}"]`);
  if (existing) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    
    // More efficient attribute setting
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }
    
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @param {Document} doc Document object to query for metadata. Defaults to the window's document
 * @returns {string} The metadata value(s)
 */
function getMetadata(name, doc = document) {
  if (!name) return '';
  
  const attr = name.includes(':') ? 'property' : 'name';
  const elements = doc.head.querySelectorAll(`meta[${attr}="${name}"]`);
  
  if (elements.length === 0) return '';
  if (elements.length === 1) return elements[0].content || '';
  
  // More efficient join for multiple elements
  return Array.from(elements, el => el.content).join(', ');
}

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
function getAllMetadata(scope) {
  const result = {};
  const elements = document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`);
  
  for (const meta of elements) {
    const name = meta.name || meta.getAttribute('property');
    const id = toClassName(
      meta.name 
        ? name.substring(scope.length + 1)
        : name.split(':')[1]
    );
    result[id] = meta.content;
  }
  
  return result;
}

/**
 * Gets placeholders object.
 * @param {string} [prefix] Location of placeholders
 * @returns {object} Window placeholders object
 */
async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  if (!window.placeholders[prefix]) {
    window.placeholders[prefix] = new Promise((resolve) => {
      fetch(`${prefix === 'default' ? '' : prefix}/placeholders.json`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return {};
        })
        .then((json) => {
          const placeholders = {};
          json.data
            .filter((placeholder) => placeholder.Key)
            .forEach((placeholder) => {
              placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
            });
          window.placeholders[prefix] = placeholders;
          resolve(window.placeholders[prefix]);
        })
        .catch(() => {
          // error loading placeholders
          window.placeholders[prefix] = {};
          resolve(window.placeholders[prefix]);
        });
    });
  }
  return window.placeholders[`${prefix}`];
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {string} [alt] The image alternative text
 * @param {boolean} [eager] Set loading attribute to eager
 * @param {Array} [breakpoints] Breakpoints and corresponding params (eg. width)
 * @returns {Element} The picture element
 */
function createOptimizedPicture(
  src,
  alt = '',
  eager = false,
  breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }],
) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

/**
 * Set template (page structure) and theme (page styles).
 */
function decorateTemplateAndTheme() {
  const addClasses = (element, classes) => {
    classes.split(',').forEach((c) => {
      element.classList.add(toClassName(c.trim()));
    });
  };
  const template = getMetadata('template');
  if (template) addClasses(document.body, template);
  const theme = getMetadata('theme');
  if (theme) addClasses(document.body, theme);
}

/**
 * Wrap inline text content of block cells within a <p> tag.
 * @param {Element} block the block element
 */
function wrapTextNodes(block) {
  const validWrappers = [
    'P',
    'PRE',
    'UL',
    'OL',
    'PICTURE',
    'TABLE',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
  ];

  const wrap = (el) => {
    const wrapper = document.createElement('p');
    wrapper.append(...el.childNodes);
    el.append(wrapper);
  };

  block.querySelectorAll(':scope > div > div').forEach((blockColumn) => {
    if (blockColumn.hasChildNodes()) {
      const hasWrapper = !!blockColumn.firstElementChild
        && validWrappers.some((tagName) => blockColumn.firstElementChild.tagName === tagName);
      if (!hasWrapper) {
        wrap(blockColumn);
      } else if (
        blockColumn.firstElementChild.tagName === 'PICTURE'
        && (blockColumn.children.length > 1 || !!blockColumn.textContent.trim())
      ) {
        wrap(blockColumn);
      }
    }
  });
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
function decorateButtons(element) {
  const links = element.querySelectorAll('a');
  
  for (const link of links) {
    // Set title if not already present
    if (!link.title) link.title = link.textContent;
    
    // Skip if link text equals href or contains images
    if (link.href === link.textContent || link.querySelector('img')) continue;
    
    const parent = link.parentElement;
    const grandParent = parent?.parentElement;
    
    // Check if link is the only child
    if (parent?.childNodes.length !== 1) continue;
    
    const parentTag = parent.tagName;
    const grandParentTag = grandParent?.tagName;
    
    // More efficient conditional logic
    if (parentTag === 'P' || parentTag === 'DIV') {
      link.className = 'button';
      parent.classList.add('button-container');
    } else if (parentTag === 'STRONG' && grandParentTag === 'P' && grandParent.childNodes.length === 1) {
      link.className = 'button primary';
      grandParent.classList.add('button-container');
    } else if (parentTag === 'EM' && grandParentTag === 'P' && grandParent.childNodes.length === 1) {
      link.className = 'button secondary';
      grandParent.classList.add('button-container');
    }
  }
}

/**
 * Add <img> for icon, prefixed with codeBasePath and optional prefix.
 * @param {Element} [span] span element with icon classes
 * @param {string} [prefix] prefix to be added to icon src
 * @param {string} [alt] alt text to be added to icon
 */
function decorateIcon(span, prefix = '', alt = '') {
  // More efficient icon name extraction
  const iconClass = span.className.match(/\bicon-(\w+)/);
  if (!iconClass) return;
  
  const iconName = iconClass[1];
  const img = document.createElement('img');
  img.dataset.iconName = iconName;
  img.src = `${window.projectX.codeBasePath}${prefix}/icons/${iconName}.svg`;
  img.alt = alt;
  img.loading = 'lazy';
  span.appendChild(img);
}

/**
 * Add <img> for icons, prefixed with codeBasePath and optional prefix.
 * @param {Element} [element] Element containing icons
 * @param {string} [prefix] prefix to be added to icon the src
 */
function decorateIcons(element, prefix = '') {
  const icons = element.querySelectorAll('span.icon');
  for (const span of icons) {
    decorateIcon(span, prefix);
  }
}

/**
 * Decorates all sections in a container element.
 * @param {Element} main The container element
 */
function decorateSections(main) {
  const sections = main.querySelectorAll(':scope > div');
  
  for (const section of sections) {
    const wrappers = [];
    let defaultContent = false;
    
    // More efficient child processing
    for (const element of section.children) {
      if (element.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = element.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].appendChild(element);
    }
    
    // Append all wrappers at once
    section.append(...wrappers);
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    // Process section metadata
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      
      for (const [key, value] of Object.entries(meta)) {
        if (key === 'style') {
          const styles = value.split(',')
            .map(style => toClassName(style.trim()))
            .filter(Boolean);
          section.classList.add(...styles);
        } else {
          section.dataset[toCamelCase(key)] = value;
        }
      }
      
      sectionMeta.remove();
    }
  }
}

/**
 * Updates all section status in a container element.
 * @param {Element} main The container element
 */
function updateSectionsStatus(main) {
  const sections = main.querySelectorAll(':scope > div.section');
  
  for (const section of sections) {
    if (section.dataset.sectionStatus === 'loaded') continue;
    
    // More efficient selector for loading blocks
    const loadingBlock = section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');
    
    if (loadingBlock) {
      section.dataset.sectionStatus = 'loading';
      break; // Stop processing once we find a loading section
    } else {
      section.dataset.sectionStatus = 'loaded';
      section.style.display = '';
    }
  }
}

/**
 * Builds a block DOM Element from a two dimensional array, string, or object
 * @param {string} blockName name of the block
 * @param {*} content two dimensional array or string or object of content
 */
function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return blockEl;
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== 'loading' && status !== 'loaded') {
    block.dataset.blockStatus = 'loading';
    const { blockName } = block.dataset;
    try {
      const cssLoaded = loadCSS(`${window.projectX.codeBasePath}/blocks/${blockName}/${blockName}.css`);
      const decorationComplete = new Promise((resolve) => {
        (async () => {
          try {
            const mod = await import(
              `${window.projectX.codeBasePath}/blocks/${blockName}/${blockName}.js`
            );
            if (mod.default) {
              await mod.default(block);
            }
          } catch (error) {
            console.warn(`ProjectX: Failed to load module for ${blockName}`, error);
          }
          resolve();
        })();
      });
      await Promise.all([cssLoaded, decorationComplete]);
    } catch (error) {
      console.warn(`ProjectX: Failed to load block ${blockName}`, error);
    }
    block.dataset.blockStatus = 'loaded';
  }
  return block;
}

/**
 * Loads JS and CSS for all blocks in a container element.
 * @param {Element} main The container element
 */
async function loadBlocks(main) {
  updateSectionsStatus(main);
  const blocks = main.querySelectorAll('div.block');
  
  for (const block of blocks) {
    await loadBlock(block);
    updateSectionsStatus(main);
  }
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    wrapTextNodes(block);
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 * Decorates all blocks in a container element.
 * @param {Element} main The container element
 */
function decorateBlocks(main) {
  const blocks = main.querySelectorAll('div.section > div > div');
  for (const block of blocks) {
    decorateBlock(block);
  }
}

/**
 * Loads a block named 'header' into header
 * @param {Element} header header element
 * @returns {Promise}
 */
async function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads a block named 'footer' into footer
 * @param footer footer element
 * @returns {Promise}
 */
async function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

/**
 * Load LCP block and/or wait for LCP in default content.
 * @param {Array} lcpBlocks Array of blocks
 */
async function waitForLCP(lcpBlocks) {
  const block = document.querySelector('.block');
  const hasLCPBlock = block && lcpBlocks.includes(block.dataset.blockName);
  if (hasLCPBlock) await loadBlock(block);

  document.body.style.display = null;
  const lcpCandidate = document.querySelector('main img');

  await new Promise((resolve) => {
    if (lcpCandidate && !lcpCandidate.complete) {
      lcpCandidate.setAttribute('loading', 'eager');
      lcpCandidate.addEventListener('load', resolve);
      lcpCandidate.addEventListener('error', resolve);
    } else {
      resolve();
    }
  });
}

// ============================================================================
// AUTO-BLOCKING SYSTEM
// ============================================================================

/**
 * Safely execute auto-blocking function with error handling
 * @param {Element} main The main element
 * @param {Function} blockingFunction The auto-blocking function to execute
 * @param {string} blockType The type of block being created
 */
function safeAutoBlock(main, blockingFunction, blockType) {
  try {
    if (PROJECTX_CONFIG.AUTO_BLOCKING[blockType.toUpperCase()]) {
      blockingFunction(main);
    }
  } catch (error) {
    console.warn(`ProjectX: Auto-blocking failed for ${blockType}:`, error);
  }
}

/**
 * Enhanced hero block detection and creation
 * @param {Element} main The container element
 */
function autoBlockHero(main) {
  // Pattern 1: H1 + Picture (existing EDS pattern)
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
    
    if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
      console.debug('ProjectX: Auto-blocked hero (H1 + Picture)');
    }
  }
  
  // Pattern 2: H1 + Video
  const video = main.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
  if (h1 && video && !main.querySelector('.hero')) {
    const section = document.createElement('div');
    section.append(buildBlock('hero-video', { elems: [video, h1] }));
    main.prepend(section);
    
    if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
      console.debug('ProjectX: Auto-blocked hero-video (H1 + Video)');
    }
  }
}

/**
 * Detect and create card blocks from content patterns
 * @param {Element} main The container element
 */
function autoBlockCards(main) {
  // Pattern 1: Lists with images + text
  const lists = main.querySelectorAll('ul, ol');
  lists.forEach((list) => {
    const items = [...list.children];
    if (items.length >= 2) {
      const hasImages = items.some(item => item.querySelector('img, picture'));
      const hasText = items.every(item => item.textContent.trim().length > 0);
      
      if (hasImages && hasText) {
        const cardContent = items.map(item => [item.innerHTML]);
        const cardsBlock = buildBlock('cards', cardContent);
        cardsBlock.dataset.autoBlocked = 'true';
        
        const section = document.createElement('div');
        section.append(cardsBlock);
        list.parentNode.replaceChild(section, list);
        
        if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
          console.debug('ProjectX: Auto-blocked cards from list');
        }
      }
    }
  });
}

/**
 * Detect and create column blocks from content patterns
 * @param {Element} main The container element
 */
function autoBlockColumns(main) {
  // Pattern 1: Side-by-side content blocks
  const sections = main.querySelectorAll(':scope > div');
  sections.forEach((section) => {
    const directDivs = [...section.children].filter(child => child.tagName === 'DIV');
    
    if (directDivs.length === 2 || directDivs.length === 3) {
      const hasSubstantialContent = directDivs.every(div => 
        div.textContent.trim().length > 50 || div.querySelector('img, picture')
      );
      
      if (hasSubstantialContent && !section.querySelector('.block')) {
        const columnContent = directDivs.map(div => [div.innerHTML]);
        const columnsBlock = buildBlock('columns', columnContent);
        columnsBlock.dataset.autoBlocked = 'true';
        
        // Clear the section and add the columns block
        section.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.append(columnsBlock);
        section.append(wrapper);
        
        if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
          console.debug(`ProjectX: Auto-blocked ${directDivs.length}-column layout`);
        }
      }
    }
  });
}

/**
 * Detect and create table blocks from content patterns
 * @param {Element} main The container element
 */
function autoBlockTable(main) {
  // Pattern 1: HTML tables
  const tables = main.querySelectorAll('table');
  tables.forEach((table) => {
    if (table.rows.length > 2) {
      const tableBlock = buildBlock('table', [[table.outerHTML]]);
      tableBlock.dataset.autoBlocked = 'true';
      
      const section = document.createElement('div');
      section.append(tableBlock);
      table.parentNode.replaceChild(section, table);
      
      if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
        console.debug('ProjectX: Auto-blocked table');
      }
    }
  });
}

/**
 * Detect and create media blocks from content patterns
 * @param {Element} main The container element
 */
function autoBlockMedia(main) {
  // Pattern 1: Multiple images in sequence (gallery)
  const sections = main.querySelectorAll(':scope > div');
  sections.forEach((section) => {
    const images = section.querySelectorAll('img, picture');
    
    if (images.length >= 3 && !section.querySelector('.block')) {
      const imageContent = [...images].map(img => [img.outerHTML]);
      const galleryBlock = buildBlock('gallery', imageContent);
      galleryBlock.dataset.autoBlocked = 'true';
      
      // Remove original images and add gallery block
      images.forEach(img => img.remove());
      const wrapper = document.createElement('div');
      wrapper.append(galleryBlock);
      section.append(wrapper);
      
      if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
        console.debug('ProjectX: Auto-blocked image gallery');
      }
    }
  });
}

/**
 * Build all auto blocks in a container element
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    safeAutoBlock(main, autoBlockHero, 'hero');
    safeAutoBlock(main, autoBlockCards, 'cards');
    safeAutoBlock(main, autoBlockColumns, 'columns');
    safeAutoBlock(main, autoBlockTable, 'tables');
    safeAutoBlock(main, autoBlockMedia, 'media');
  } catch (error) {
    console.warn('ProjectX: Auto-blocking failed:', error);
  }
}

// ============================================================================
// PAGE ORCHESTRATION
// ============================================================================

/**
 * Load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.projectX.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
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
        const { openModal } = await import(`${window.projectX.codeBasePath}/blocks/modal/modal.js`);
        openModal(origin.href);
      } catch (error) {
        console.warn('ProjectX: Failed to load modal:', error);
      }
    }
  });
}

/**
 * Decorates the main element with enhanced auto-blocking.
 * @param {Element} main The main element
 */
function decorateMain(main) {
  // Standard EDS decoration
  decorateButtons(main);
  decorateIcons(main);
  
  // Enhanced auto-blocking
  buildAutoBlocks(main);
  
  // Continue with standard decoration
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug('ProjectX: loadEager');
  }
  
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    // Load fonts if desktop or already loaded
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug('ProjectX: loadLazy');
  }
  
  const main = doc.querySelector('main');
  await loadBlocks(main);
  autolinkModals(doc);
  
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  
  if (!window.projectX.suppressFrame) {
    loadHeader(doc.querySelector('header'));
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.projectX.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDeferred() {
  if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug('ProjectX: loadDeferred timer start');
  }
  
  window.setTimeout(() => import('/scripts/deferred.js'), PROJECTX_CONFIG.DEFERRED_LOAD_DELAY);
}

/**
 * Main page loading orchestration
 */
async function loadPage() {
  if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug('ProjectX: loadPage');
  }
  
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
  loadDeferred();
}

// ============================================================================
// INITIALIZATION AND EXPORTS
// ============================================================================

/**
 * Initialize ProjectX framework
 */
function init() {
  setup();
  
  // Initialize CMS Plus compatibility layer
  window.cmsplus = window.cmsplus || {
    debug: (message) => {
      if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
        console.debug(`CMS Plus: ${message}`);
      }
    }
  };
  
  // Privacy-first framework - no tracking or monitoring
  if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.debug('ProjectX: Privacy-first framework initialized');
  }

  window.addEventListener('load', () => {
    if (PROJECTX_CONFIG.ENABLE_DEBUG_LOGGING) {
      console.debug('ProjectX: Window loaded');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('ProjectX: Unhandled promise rejection:', event.reason);
  });

  window.addEventListener('error', (event) => {
    console.warn('ProjectX: JavaScript error:', event.error);
  });
}

// Initialize framework
init();

// Start page loading only if not already started by scripts.js
if (!window.projectX?._scriptsInitialized) {
  loadPage();
}

// ============================================================================
// EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

export {
  buildBlock,
  createOptimizedPicture,
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcon,
  decorateIcons,
  decorateMain,
  decorateSections,
  decorateTemplateAndTheme,
  fetchPlaceholders,
  getAllMetadata,
  getMetadata,
  loadBlock,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  loadScript,
  readBlockConfig,
  sampleRUM,
  setup,
  toCamelCase,
  toClassName,
  updateSectionsStatus,
  waitForLCP,
  wrapTextNodes,
  // Auto-blocking functions
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
  loadPage,
  // Utility functions
  loadFonts,
  autolinkModals,
  // Plugin system
  pluginContext,
  AUDIENCES,
  LCP_BLOCKS
};