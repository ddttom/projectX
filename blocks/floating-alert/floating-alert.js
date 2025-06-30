// version 1.3 - Added heading processing with horizontal rule separator

// Configuration for the floating alert block
const FLOATING_ALERT_CONFIG = {
  STORAGE_KEY: 'floating-alert-dismissed',
  ANIMATION_DURATION: 300,
  SPARKLE_INTERVAL: 2000,
  SPARKLE_DURATION: 1000,
};

// Create sparkle effect
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-alert-sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  return sparkle;
}

// Add sparkle animation
function addSparkleEffect(container) {
  // Store interval id for later cleanup
  const intervalId = setInterval(() => {
    const sparkle = createSparkle();
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), FLOATING_ALERT_CONFIG.SPARKLE_DURATION);
  }, FLOATING_ALERT_CONFIG.SPARKLE_INTERVAL);
  return intervalId;
}

// Dismiss the alert
function dismissAlert(overlay, originalBlock) {
  console.log('Floating Alert: Dismissing alert');
  const modal = overlay.querySelector('.floating-alert');
  if (modal && modal._sparkleIntervalId) {
    clearInterval(modal._sparkleIntervalId);
    modal._sparkleIntervalId = null;
  }
  if (modal) {
    modal.classList.add('floating-alert--dismissing');
  }
  // Remove keyboard event listener from document
  if (overlay._keyHandler) {
    document.removeEventListener('keydown', overlay._keyHandler);
    overlay._keyHandler = null;
  }
  setTimeout(() => {
    if (modal) {
      const sparkles = modal.querySelectorAll('.floating-alert-sparkle');
      sparkles.forEach((el) => el.remove());
      
      // Return the content back to the original block structure
      const contentWrapper = modal.querySelector('.floating-alert-content');
      if (contentWrapper && originalBlock) {
        console.log('Floating Alert: Restoring content to original block');
        
        // Find or recreate the EDS block structure for content restoration
        let contentTarget = originalBlock;
        
        // Check if we need to recreate the nested div structure
        const firstDiv = originalBlock.querySelector('div');
        if (firstDiv) {
          const secondDiv = firstDiv.querySelector('div');
          if (secondDiv) {
            contentTarget = secondDiv;
          } else {
            contentTarget = firstDiv;
          }
        } else {
          // Create the nested div structure if it doesn't exist
          const newFirstDiv = document.createElement('div');
          const newSecondDiv = document.createElement('div');
          newFirstDiv.appendChild(newSecondDiv);
          originalBlock.appendChild(newFirstDiv);
          contentTarget = newSecondDiv;
        }
        
        // Move all content back to the target
        while (contentWrapper.firstChild) {
          contentTarget.appendChild(contentWrapper.firstChild);
        }
      }
    }
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    localStorage.setItem(FLOATING_ALERT_CONFIG.STORAGE_KEY, 'true');
    console.log('Floating Alert: Alert dismissed and stored in localStorage');
  }, FLOATING_ALERT_CONFIG.ANIMATION_DURATION);
}

// Process content and handle headings with proper formatting
function processContentWithHeadings(contentSource) {
  const container = document.createElement('div');
  const headings = contentSource.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length > 0) {
    // Extract the first heading as the alert title
    const firstHeading = headings[0];
    const headingText = firstHeading.textContent.trim();
    
    console.log('Floating Alert: Found heading:', headingText);
    
    // Create title element
    const titleElement = document.createElement('h2');
    titleElement.className = 'floating-alert-title';
    titleElement.textContent = headingText;
    container.appendChild(titleElement);
    
    // Add horizontal rule
    const hr = document.createElement('hr');
    hr.className = 'floating-alert-separator';
    console.log('Floating Alert: Created HR element:', hr);
    container.appendChild(hr);
    console.log('Floating Alert: HR element added to container');
    
    // Clone all content and remove the first heading from the clone
    const contentClone = contentSource.cloneNode(true);
    const headingInClone = contentClone.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingInClone) {
      headingInClone.remove();
    }
    
    // Move remaining content
    while (contentClone.firstChild) {
      container.appendChild(contentClone.firstChild);
    }
  } else {
    // No headings found, move content as-is
    console.log('Floating Alert: No headings found, processing content normally');
    while (contentSource.firstChild) {
      container.appendChild(contentSource.firstChild);
    }
  }
  
  return container;
}

// Handle keyboard navigation
function handleKeyboard(event, modal, overlay, originalBlock) {
  if (event.key === 'Escape') {
    dismissAlert(overlay, originalBlock);
  } else if (event.key === 'Tab') {
    // Ensure focus stays within modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
}

// Main decorate function
export default async function decorate(block) {
  // Add debug logging
  console.log('Floating Alert: decorate function called', block);
  console.log('Floating Alert: localStorage check:', localStorage.getItem(FLOATING_ALERT_CONFIG.STORAGE_KEY));
  
  if (localStorage.getItem(FLOATING_ALERT_CONFIG.STORAGE_KEY) === 'true') {
    console.log('Floating Alert: Already dismissed, returning early');
    return;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'floating-alert-overlay';

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'floating-alert';
  modal.setAttribute('role', 'alert');
  modal.setAttribute('aria-live', 'polite');
  modal.tabIndex = 0; // Make modal focusable for accessibility

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'floating-alert-content';

  // Extract content from EDS block structure
  // EDS creates nested divs, so we need to find the actual content
  console.log('Floating Alert: Block structure before extraction:', block.innerHTML);
  
  // Find the deepest content container - EDS typically nests content in div > div structure
  let contentSource = block;
  
  // Navigate through EDS wrapper divs to find actual content
  const firstDiv = block.querySelector('div');
  if (firstDiv) {
    const secondDiv = firstDiv.querySelector('div');
    if (secondDiv && (secondDiv.children.length > 0 || secondDiv.textContent.trim())) {
      // Use the second level div as content source if it has content
      contentSource = secondDiv;
      console.log('Floating Alert: Using nested div as content source');
    } else if (firstDiv.children.length > 0 || firstDiv.textContent.trim()) {
      // Use the first level div as content source
      contentSource = firstDiv;
      console.log('Floating Alert: Using first div as content source');
    }
  }
  
  console.log('Floating Alert: Content source selected:', contentSource);
  console.log('Floating Alert: Content source innerHTML:', contentSource.innerHTML);

  // Process content and handle headings
  const processedContent = processContentWithHeadings(contentSource);
  contentWrapper.appendChild(processedContent);
  
  console.log('Floating Alert: Content processed and moved to wrapper:', contentWrapper.innerHTML);

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'floating-alert-close';
  closeButton.setAttribute('aria-label', 'Dismiss alert');
  closeButton.innerHTML = '×';
  closeButton.type = 'button';
  closeButton.addEventListener('click', () => dismissAlert(overlay, block));

  // Add elements to modal
  modal.appendChild(contentWrapper);
  modal.appendChild(closeButton);

  // Add modal to overlay
  overlay.appendChild(modal);

  // Add overlay to document
  document.body.appendChild(overlay);
  console.log('Floating Alert: Overlay added to document body');
  console.log('Floating Alert: Modal element:', modal);
  console.log('Floating Alert: Final modal content:', contentWrapper.innerHTML);

  // Add sparkle effect and store interval id for cleanup
  modal._sparkleIntervalId = addSparkleEffect(modal);
  console.log('Floating Alert: Sparkle effect added');

  // Keyboard event handler - attach to document for proper ESC key handling
  overlay._keyHandler = function (event) {
    handleKeyboard(event, modal, overlay, block);
  };
  document.addEventListener('keydown', overlay._keyHandler);
  console.log('Floating Alert: Keyboard event handler attached');

  // Focus modal for keyboard events
  modal.focus();
  console.log('Floating Alert: Modal focused');

  // Add click outside listener (on overlay)
  overlay.addEventListener('click', (event) => {
    // Check if click is on overlay itself or outside the modal
    if (event.target === overlay || !modal.contains(event.target)) {
      dismissAlert(overlay, block);
    }
  });
  console.log('Floating Alert: Click outside listener added');
  console.log('Floating Alert: Modal setup complete - should be visible now');
  
  // Additional debugging - check if modal is visible
  setTimeout(() => {
    const overlayInDOM = document.querySelector('.floating-alert-overlay');
    const modalInDOM = document.querySelector('.floating-alert');
    console.log('Floating Alert: Overlay in DOM:', overlayInDOM);
    console.log('Floating Alert: Modal in DOM:', modalInDOM);
    if (modalInDOM) {
      const computedStyle = window.getComputedStyle(modalInDOM);
      console.log('Floating Alert: Modal opacity:', computedStyle.opacity);
      console.log('Floating Alert: Modal display:', computedStyle.display);
      console.log('Floating Alert: Modal visibility:', computedStyle.visibility);
    }
  }, 100);
}

// Utility function for debugging - can be called from browser console
window.floatingAlertDebug = {
  reset: () => {
    localStorage.removeItem(FLOATING_ALERT_CONFIG.STORAGE_KEY);
    console.log('Floating Alert: localStorage cleared - refresh page to see modal again');
  },
  checkStatus: () => {
    const dismissed = localStorage.getItem(FLOATING_ALERT_CONFIG.STORAGE_KEY);
    console.log('Floating Alert: Dismissed status:', dismissed);
    return dismissed;
  },
  checkDOM: () => {
    const blocks = document.querySelectorAll('.floating-alert.block');
    const overlays = document.querySelectorAll('.floating-alert-overlay');
    const modals = document.querySelectorAll('.floating-alert');
    console.log('Floating Alert: Blocks found:', blocks.length, blocks);
    console.log('Floating Alert: Overlays found:', overlays.length, overlays);
    console.log('Floating Alert: Modals found:', modals.length, modals);
    if (blocks.length > 0) {
      console.log('Floating Alert: First block content:', blocks[0].innerHTML);
    }
  },
  forceShow: () => {
    localStorage.removeItem(FLOATING_ALERT_CONFIG.STORAGE_KEY);
    const blocks = document.querySelectorAll('.floating-alert.block');
    if (blocks.length > 0) {
      console.log('Floating Alert: Found', blocks.length, 'floating-alert blocks, re-decorating...');
      blocks.forEach(block => {
        // Clear existing overlays
        const existingOverlay = document.querySelector('.floating-alert-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
        // Re-import and run the decorate function
        import('./floating-alert.js').then(module => {
          module.default(block);
        });
      });
    } else {
      console.log('Floating Alert: No floating-alert blocks found on page');
    }
  }
};
