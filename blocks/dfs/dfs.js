/**
 * Markdown FAQ Block
 * 
 * This block converts a formatted franklin table into an interactive FAQ component.
 * The block expects a table with the following columns:
 * - Category
 * - Subcategory
 * - Question
 * - Short Answer
 * - Detailed Answer
 * - Related Resources/Tags
 */

export default function decorate(block) {
    // Configuration constants
    const CONFIG = {
      // Visual & UX
      ANIMATION_DURATION: 300,
      SEARCH_DEBOUNCE: 300,
      HIGHLIGHT_SEARCH_TERMS: true,
      
      // Content
      EMPTY_MESSAGE: 'No FAQs match your search criteria.',
      DEFAULT_FILTER_TEXT: 'All Categories',
      DEFAULT_READ_MORE_TEXT: 'Read More',
      
      // Mobile
      MOBILE_BREAKPOINT: 768,
      
      // Debugging & Analytics
      DEBUG_MODE: false,
      TRACK_ANALYTICS: true
    };
    
    // Extract raw data from the table structure
    const extractFaqData = (block) => {
      const rows = Array.from(block.children);
      
      // Check if we have enough rows for a header plus data
      if (rows.length < 2) return { faqs: [], metadata: {} };
      
      // Get header row (if it exists properly formatted)
      const headerRow = rows[0].children;
      const headerTexts = Array.from(headerRow).map(cell => cell.textContent.trim());
      
      // Extract metadata table if it exists (typically at the end)
      let metadata = {};
      let lastRowIndex = rows.length - 1;
      const lastRow = rows[lastRowIndex];
      
      // Check if the last row is a metadata indicator
      if (lastRow && lastRow.textContent.includes('metadata')) {
        // Process metadata rows
        metadata = processMetadataRows(rows.slice(lastRowIndex));
        // Remove metadata rows from processing
        rows.splice(lastRowIndex);
      }
      
      // Process FAQ data rows
      const faqs = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = Array.from(row.children);
        
        // Skip rows with insufficient data
        if (cells.length < 5) continue;
        
        const faq = {
          category: cells[0].textContent.trim(),
          subcategory: cells[1].textContent.trim(),
          question: cells[2].textContent.trim(),
          shortAnswer: cells[3].textContent.trim(),
          detailedAnswer: cells[4].innerHTML,
          externalLinks: cells[5] ? extractLinks(cells[5]) : [], // Extract external links (supports multiple)
          resources: cells[6] ? cells[6].innerHTML : ''
        };
        
        faqs.push(faq);
      }
      
      return { faqs, metadata };
    };
    
    // Helper function to extract multiple links from cell content
    function extractLinks(cell) {
      // First, try to extract links from anchor tags
      const anchors = cell.querySelectorAll('a');
      if (anchors.length > 0) {
        return Array.from(anchors).map(anchor => ({
          url: anchor.href,
          text: anchor.textContent.trim() || 'Read More',
          isExternal: isExternalUrl(anchor.href)
        }));
      }
      
      // If no anchors found, try to extract URLs from text content
      const content = cell.textContent.trim();
      if (!content) return [];
      
      // Split by line breaks or commas to find multiple URLs
      const parts = content.split(/[\n,]+/).filter(part => part.trim());
      return parts.map(part => {
        const trimmed = part.trim();
        // Try to parse link text if in format "text: url"
        const textMatch = trimmed.match(/^(.*?):\s*(https?:\/\/\S+|\/\S+)$/);
        if (textMatch) {
          return {
            url: textMatch[2],
            text: textMatch[1].trim() || 'Read More',
            isExternal: isExternalUrl(textMatch[2])
          };
        } else if (trimmed.startsWith('http') || trimmed.startsWith('/')) {
          return {
            url: trimmed,
            text: 'Read More',
            isExternal: isExternalUrl(trimmed)
          };
        }
        return null;
      }).filter(link => link !== null);
    }
    
    // Check if a URL is external
    function isExternalUrl(url) {
      if (!url) return false;
      try {
        // For absolute URLs, check if the hostname is different
        if (url.startsWith('http')) {
          const urlObj = new URL(url);
          return urlObj.hostname !== window.location.hostname;
        }
        // Relative URLs are always internal
        return false;
      } catch (e) {
        // If URL parsing fails, assume it's internal
        return false;
      }
    }
    
    // Process metadata rows into an object
    const processMetadataRows = (metadataRows) => {
      const metadata = {};
      
      // Start from the row after the "metadata" header
      for (let i = 1; i < metadataRows.length; i++) {
        const row = metadataRows[i];
        const cells = Array.from(row.children);
        
        if (cells.length >= 2) {
          const key = cells[0].textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
          const value = cells[1].textContent.trim();
          metadata[key] = value;
        }
      }
      
      return metadata;
    };
    
    // Create the FAQ UI components
    const buildFaqUI = (data) => {
      const { faqs, metadata } = data;
      
      // Clear the block
      block.innerHTML = '';
      
      // Add metadata header if available
      if (metadata.title) {
        const header = document.createElement('div');
        header.className = 'faq-header';
        
        const title = document.createElement('h2');
        title.textContent = metadata.title;
        header.appendChild(title);
        
        if (metadata.version || metadata.last_updated) {
          const info = document.createElement('div');
          info.className = 'faq-meta-info';
          info.innerHTML = `
            ${metadata.version ? `<span class="faq-version">Version ${metadata.version}</span>` : ''}
            ${metadata.last_updated ? `<span class="faq-date">Updated: ${metadata.last_updated}</span>` : ''}
          `;
          header.appendChild(info);
        }
        
        block.appendChild(header);
      }
      
      // Create search and filter container
      const controls = document.createElement('div');
      controls.className = 'faq-controls';
      
      // Add search box
      const searchContainer = document.createElement('div');
      searchContainer.className = 'faq-search-container';
      
      const searchIcon = document.createElement('span');
      searchIcon.className = 'faq-search-icon';
      searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
      searchContainer.appendChild(searchIcon);
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search FAQs...';
      searchInput.className = 'faq-search';
      searchContainer.appendChild(searchInput);
      
      controls.appendChild(searchContainer);
      
      // Add category filter if we have multiple categories
      const categories = [...new Set(faqs.map(faq => faq.category))];
      if (categories.length > 1) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'faq-filter-container';
        
        const filterLabel = document.createElement('label');
        filterLabel.textContent = 'Filter by: ';
        filterLabel.htmlFor = 'faq-category-filter';
        filterContainer.appendChild(filterLabel);
        
        const filterSelect = document.createElement('select');
        filterSelect.id = 'faq-category-filter';
        filterSelect.className = 'faq-category-filter';
        
        // Add "All Categories" option
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = CONFIG.DEFAULT_FILTER_TEXT;
        filterSelect.appendChild(allOption);
        
        // Add category options
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          filterSelect.appendChild(option);
        });
        
        filterContainer.appendChild(filterSelect);
        controls.appendChild(filterContainer);
      }
      
      block.appendChild(controls);
      
      // Create FAQ container
      const faqContainer = document.createElement('div');
      faqContainer.className = 'faq-container';
      
      // Group FAQs by category
      const faqsByCategory = faqs.reduce((acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      }, {});
      
      // Create sections for each category
      Object.entries(faqsByCategory).forEach(([category, categoryFaqs]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'faq-category-section';
        categorySection.dataset.category = category;
        
        const categoryHeader = document.createElement('h3');
        categoryHeader.className = 'faq-category-header';
        categoryHeader.textContent = category;
        categorySection.appendChild(categoryHeader);
        
        // Group by subcategory if applicable
        const subcategories = [...new Set(categoryFaqs.map(faq => faq.subcategory))];
        
        subcategories.forEach(subcategory => {
          if (subcategory) {
            const subcategoryHeader = document.createElement('h4');
            subcategoryHeader.className = 'faq-subcategory-header';
            subcategoryHeader.textContent = subcategory;
            categorySection.appendChild(subcategoryHeader);
          }
          
          // Add questions for this subcategory
          const subcategoryFaqs = categoryFaqs.filter(faq => faq.subcategory === subcategory);
          
          subcategoryFaqs.forEach(faq => {
            const faqItem = createFaqItem(faq);
            categorySection.appendChild(faqItem);
          });
        });
        
        faqContainer.appendChild(categorySection);
      });
      
      block.appendChild(faqContainer);
      
      // Add empty results message (hidden by default)
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'faq-empty-message';
      emptyMessage.textContent = CONFIG.EMPTY_MESSAGE;
      emptyMessage.style.display = 'none';
      block.appendChild(emptyMessage);
      
      // Add event listeners for search and filter
      setupEventListeners(block, faqs);
    };
    
    // Create individual FAQ item
    const createFaqItem = (faq) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.dataset.question = faq.question.toLowerCase();
      faqItem.dataset.category = faq.category;
      faqItem.dataset.subcategory = faq.subcategory;
      
      // Create unique ID for ARIA attributes
      const faqId = `faq-${Math.random().toString(36).substring(2, 11)}`;
      const contentId = `content-${faqId}`;
      
      // Create question header with proper ARIA attributes
      const questionHeader = document.createElement('div');
      questionHeader.className = 'faq-question';
      questionHeader.setAttribute('role', 'button');
      questionHeader.setAttribute('id', faqId);
      questionHeader.setAttribute('aria-expanded', 'false');
      questionHeader.setAttribute('aria-controls', contentId);
      questionHeader.setAttribute('tabindex', '0');
      
      questionHeader.innerHTML = `
        <span class="faq-question-text">${faq.question}</span>
        <span class="faq-toggle-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      `;
      faqItem.appendChild(questionHeader);
      
      // Create content panel (initially hidden) with proper ARIA attributes
      const contentPanel = document.createElement('div');
      contentPanel.className = 'faq-content';
      contentPanel.setAttribute('id', contentId);
      contentPanel.setAttribute('role', 'region');
      contentPanel.setAttribute('aria-labelledby', faqId);
      contentPanel.style.display = 'none'; // Initially hidden
      
      // Add short answer if available
      if (faq.shortAnswer) {
        const shortAnswer = document.createElement('div');
        shortAnswer.className = 'faq-short-answer';
        shortAnswer.textContent = faq.shortAnswer;
        contentPanel.appendChild(shortAnswer);
      }
      
      // Add detailed answer
      const detailedAnswer = document.createElement('div');
      detailedAnswer.className = 'faq-detailed-answer';
      detailedAnswer.innerHTML = faq.detailedAnswer;
      contentPanel.appendChild(detailedAnswer);
      
      // Add external links if available
      if (faq.externalLinks && faq.externalLinks.length > 0) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'faq-external-links';
        
        faq.externalLinks.forEach(link => {
          if (!link.url) return; // Skip invalid links
          
          const linkWrapper = document.createElement('div');
          linkWrapper.className = 'faq-read-more';
          
          // Create the anchor element
          const anchor = document.createElement('a');
          anchor.href = link.url;
          anchor.className = `faq-read-more-link ${link.isExternal ? 'external-link' : 'internal-link'}`;
          anchor.textContent = link.text || 'Read More';
          
          // Add analytics data attributes
          anchor.dataset.faqQuestion = faq.question;
          anchor.dataset.faqCategory = faq.category;
          anchor.dataset.linkType = link.isExternal ? 'external' : 'internal';
          
          // Make all links open in new tabs, except fragment-only links
          if (link.url.startsWith('#')) {
            // For pure fragment IDs on the same page, don't open in new tab
            anchor.addEventListener('click', handleFragmentLinkClick);
          } else {
            // For all other links (both internal and external), open in new tab
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            
            
            anchor.setAttribute('aria-label', `${link.text} (opens in a new tab)`);
            
          }
          
          linkWrapper.appendChild(anchor);
          linksContainer.appendChild(linkWrapper);
        });
        
        contentPanel.appendChild(linksContainer);
      }
      
      // Add resources/tags if available
      if (faq.resources) {
        const resources = document.createElement('div');
        resources.className = 'faq-resources';
        resources.innerHTML = faq.resources;
        contentPanel.appendChild(resources);
      }
      
      faqItem.appendChild(contentPanel);
      
      return faqItem;
    };
    
    // Handle fragment link clicks for smooth scrolling
    function handleFragmentLinkClick(e) {
      const href = e.currentTarget.getAttribute('href');
      if (!href || !href.includes('#')) return;
      
      const fragmentId = href.substring(href.indexOf('#') + 1);
      if (!fragmentId) return;
      
      // If it's a full URL with a fragment on the same page
      if (href.indexOf('#') > 0 && !href.startsWith('/') && !href.startsWith('#')) {
        // Only handle if it's on the current page
        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname) return;
      }
      
      // Find the target element
      const targetElement = document.getElementById(fragmentId);
      if (targetElement) {
        e.preventDefault();
        
        // Scroll to element with smooth behavior
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Set focus to the target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        
        // Update URL without reload
        history.pushState(null, null, href);
      }
    }
    
    // Setup event listeners for interactive features
    const setupEventListeners = (block, faqs) => {
      // Toggle FAQ visibility on question click or keypress
      block.querySelectorAll('.faq-question').forEach(question => {
        // Click handler
        question.addEventListener('click', (e) => {
          toggleFaqItem(question);
        });
        
        // Keyboard handler for accessibility
        question.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaqItem(question);
          }
        });
      });
      
      // Analytics for external link clicks
      block.querySelectorAll('.faq-read-more-link').forEach(link => {
        link.addEventListener('click', (e) => {
          trackLinkClick(e.currentTarget);
        });
      });
      
      // Search functionality
      const searchInput = block.querySelector('.faq-search');
      let debounceTimeout;
      
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimeout);
          
          debounceTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterFaqs(block, searchTerm);
          }, CONFIG.SEARCH_DEBOUNCE);
        });
      }
      
      // Category filter
      const categoryFilter = block.querySelector('.faq-category-filter');
      
      if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
          const selectedCategory = e.target.value;
          const searchTerm = block.querySelector('.faq-search')?.value.toLowerCase().trim() || '';
          
          filterFaqs(block, searchTerm, selectedCategory);
        });
      }
    };
    
    // Toggle FAQ visibility with display:block and display:none
    function toggleFaqItem(question) {
      const faqItem = question.closest('.faq-item');
      const content = faqItem.querySelector('.faq-content');
      const icon = question.querySelector('.faq-toggle-icon svg');
      
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      if (!isExpanded) {
        // Show content with display:block
        content.style.display = 'block';
        // Rotate icon with CSS transform
        icon.style.transform = 'rotate(180deg)';
        faqItem.classList.add('faq-open');
        question.setAttribute('aria-expanded', 'true');
        
        // Announce to screen readers
        const liveRegion = document.getElementById('faq-live-region') || document.createElement('div');
        liveRegion.textContent = 'FAQ expanded';
      } else {
        // Hide content with display:none
        content.style.display = 'none';
        // Reset icon rotation
        icon.style.transform = 'rotate(0)';
        faqItem.classList.remove('faq-open');
        question.setAttribute('aria-expanded', 'false');
      }
    }
    
    // Track link clicks for analytics
    function trackLinkClick(link) {
      // Get data from attributes
      const question = link.dataset.faqQuestion || '';
      const category = link.dataset.faqCategory || '';
      const linkType = link.dataset.linkType || '';
      const url = link.href || '';
      
      // Check if dataLayer exists (Google Tag Manager)
      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'faq_link_click',
          'faq_question': question,
          'faq_category': category,
          'link_type': linkType,
          'link_url': url
        });
      }
      
      // For internal link types with fragment IDs, we should let the handler take care of it
      if (linkType === 'internal' && url.includes('#')) {
        // The handleFragmentLinkClick function will handle this
        return;
      }
      
      // Log click for debugging (remove in production)
      if (CONFIG.DEBUG_MODE) {
        // eslint-disable-next-line no-console
        console.log('FAQ link clicked:', {
          question,
          category,
          linkType,
          url
        });
      }
    }
    
    // Filter FAQs based on search term and/or category
    const filterFaqs = (block, searchTerm, category = '') => {
      const faqItems = block.querySelectorAll('.faq-item');
      const categorySections = block.querySelectorAll('.faq-category-section');
      const emptyMessage = block.querySelector('.faq-empty-message');
      
      let hasVisibleItems = false;
      
      // First, filter by category if specified
      categorySections.forEach(section => {
        if (!category || section.dataset.category === category) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
      
      // Then filter by search term
      faqItems.forEach(item => {
        const question = item.dataset.question;
        const faqCategory = item.dataset.category;
        const subcategory = item.dataset.subcategory;
        
        // Get all content including text in links and detailed answer
        const contentEl = item.querySelector('.faq-content');
        const content = contentEl.textContent.toLowerCase();
        
        // Get text from all links for searching
        const linkTexts = Array.from(item.querySelectorAll('a'))
          .map(a => `${a.textContent.toLowerCase()} ${a.href.toLowerCase()}`)
          .join(' ');
        
        // Get all content from resources section
        const resourcesEl = item.querySelector('.faq-resources');
        const resourcesContent = resourcesEl ? resourcesEl.textContent.toLowerCase() : '';
        
        // Combine all searchable content
        const searchableContent = `${question} ${content} ${faqCategory.toLowerCase()} ${subcategory.toLowerCase()} ${linkTexts} ${resourcesContent}`;
        
        // Skip items in hidden categories
        const categorySection = item.closest('.faq-category-section');
        if (categorySection.style.display === 'none') return;
        
        // Check if item matches search term
        const matchesSearch = !searchTerm || searchableContent.includes(searchTerm);
        
        if (matchesSearch) {
          item.style.display = 'block';
          hasVisibleItems = true;
          
          // If search term exists, highlight the first match
          if (searchTerm) {
            // Expand this item if it's a match and search term exists
            const content = item.querySelector('.faq-content');
            const icon = item.querySelector('.faq-toggle-icon svg');
            const question = item.querySelector('.faq-question');
            
            content.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
            item.classList.add('faq-open');
            question.setAttribute('aria-expanded', 'true');
            
            // Highlight search term if configured
            if (CONFIG.HIGHLIGHT_SEARCH_TERMS) {
              highlightSearchTerm(item, searchTerm);
            }
          }
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide empty message
      if (hasVisibleItems) {
        emptyMessage.style.display = 'none';
      } else {
        emptyMessage.style.display = 'block';
      }
      
      // Update subcategory headers visibility
      updateSubcategoryVisibility(block);
      
      // Announce results to screen readers
      announceSearchResults(hasVisibleItems, faqItems.length);
    };
    
    // Announce search results for screen readers
    function announceSearchResults(hasResults, totalItems) {
      let liveRegion = document.getElementById('faq-live-region');
      
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'faq-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
      }
      
      if (hasResults) {
        liveRegion.textContent = `Search results updated. Showing matching FAQs.`;
      } else {
        liveRegion.textContent = `No FAQs match your search criteria.`;
      }
    }
    
    // Highlight search terms in content (optional feature)
    function highlightSearchTerm(item, searchTerm) {
      if (!searchTerm) return;
      
      // Remove existing highlights
      Array.from(item.querySelectorAll('.search-highlight')).forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });
      
      // Don't highlight if search term is too short
      if (searchTerm.length < 3) return;
      
      // Text nodes to search in (question and answer)
      const contentNodes = [
        item.querySelector('.faq-question-text'),
        item.querySelector('.faq-short-answer'),
        item.querySelector('.faq-detailed-answer')
      ].filter(node => node);
      
      // Highlight function for text nodes
      function highlightInNode(node) {
        if (node.nodeType === 3) { // Text node
          const content = node.textContent.toLowerCase();
          const index = content.indexOf(searchTerm.toLowerCase());
          
          if (index >= 0) {
            const before = node.textContent.substring(0, index);
            const match = node.textContent.substring(index, index + searchTerm.length);
            const after = node.textContent.substring(index + searchTerm.length);
            
            const highlightEl = document.createElement('span');
            highlightEl.className = 'search-highlight';
            highlightEl.textContent = match;
            
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(before));
            fragment.appendChild(highlightEl);
            fragment.appendChild(document.createTextNode(after));
            
            node.parentNode.replaceChild(fragment, node);
            return true;
          }
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
          // Element node - recurse through children
          Array.from(node.childNodes).forEach(child => highlightInNode(child));
        }
        return false;
      }
      
      // Apply highlighting to nodes
      contentNodes.forEach(node => {
        if (node) highlightInNode(node);
      });
    }
    
    // Update subcategory headers visibility based on visible FAQ items
    const updateSubcategoryVisibility = (block) => {
      const subcategoryHeaders = block.querySelectorAll('.faq-subcategory-header');
      
      subcategoryHeaders.forEach(header => {
        // Check if any following faq-items (until next subcategory header) are visible
        let hasVisibleItems = false;
        let current = header.nextElementSibling;
        
        while (current && !current.classList.contains('faq-subcategory-header') && !current.classList.contains('faq-category-header')) {
          if (current.classList.contains('faq-item') && current.style.display !== 'none') {
            hasVisibleItems = true;
            break;
          }
          current = current.nextElementSibling;
        }
        
        header.style.display = hasVisibleItems ? 'block' : 'none';
      });
    };
    
    // Main initialization
    const init = () => {
      const data = extractFaqData(block);
      buildFaqUI(data);
    };
    
    // Start the block decoration process
    init();
  }
