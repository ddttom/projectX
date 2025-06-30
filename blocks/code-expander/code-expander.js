/**
 * Code Expander Block
 * 
 * This block enhances all <pre><code> elements on the page with:
 * - Syntax highlighting based on detected language
 * - Copy to clipboard functionality
 * - Raw/formatted view toggle
 * - Download as file option
 * - Expand/collapse for long code blocks
 * - Keyboard navigation
 * 
 * Usage: Simply add an empty code-expander block anywhere on the page:
 * | code-expander |
 * | ------------- |
 * 
 * The block will automatically find and enhance all <pre><code> elements
 * while preserving the original content.
 */

// Configuration constants
const CODE_EXPANDER_CONFIG = {
  LONG_DOCUMENT_THRESHOLD: 40,
  COPY_BUTTON_RESET_DELAY: 2000,
  SCROLL_HINT_TEXT: 'scroll with arrow keys',
  COPY_TEXT: 'Copy',
  COPIED_TEXT: 'Copied!',
  VIEW_RAW_TEXT: 'View Raw',
  VIEW_FORMATTED_TEXT: 'View Formatted',
  DOWNLOAD_TEXT: 'Download',
  EXPAND_TEXT: 'Expand',
  COLLAPSE_TEXT: 'Collapse',
  CLOSE_TEXT: 'Close',
  FILENAME_PROMPT_TEXT: 'Enter filename (without extension):',
  DOWNLOAD_BUTTON_TEXT: 'Download',
  CANCEL_BUTTON_TEXT: 'Cancel',
  DEFAULT_FILENAME: 'code-snippet',
  INFO_TOOLTIP: {
    TITLE: 'Code Expander Controls',
    COPY: 'Copy: Copy the code to clipboard',
    VIEW_RAW: 'View Raw/Formatted: Toggle between raw text and formatted code view',
    DOWNLOAD: 'Download: Save the code as a file with appropriate extension',
    EXPAND: 'Expand/Collapse: Toggle between collapsed and expanded view for long code blocks',
    KEYBOARD: 'Keyboard: Use arrow keys to navigate (←→ in formatted view, ↑↓ in raw view)'
  }
};

export default async function decorate(block) {
  // Check if the block has a "text" class and set forceText accordingly
  const forceText = block.classList.contains('text');
  
  // Find all code elements in the document
  const codeElements = document.querySelectorAll('pre code');
  
  if (codeElements.length === 0) {
    // If no code elements found, log a message and exit
    // eslint-disable-next-line no-console
    console.log('Code-expander: No code elements found on the page');
    return;
  }
  
  /**
   * Detects the programming language of the provided code
   * Uses a series of heuristics to determine the most likely language
   * @param {string} code - The code to analyze
   * @returns {string} - The detected language
   */
  function detectLanguage(code) {
    // First priority: Check for shebang line (#!/bin/bash, #!/usr/bin/env bash, etc.)
    const firstLine = code.trim().split('\n')[0];
    if (firstLine.startsWith('#!')) {
      // Check for common shell interpreters
      if (firstLine.includes('/bin/bash') || 
          firstLine.includes('/bin/sh') || 
          firstLine.includes('/usr/bin/env bash') || 
          firstLine.includes('/usr/bin/env sh')) {
        return 'shell';
      }
      // Check for Python interpreters
      if (firstLine.includes('/python') || 
          firstLine.includes('/usr/bin/env python')) {
        return 'python';
      }
      return 'shell'; // Default to shell for any other shebang line
    }
    
    // Check for JavaScript comment patterns
    if (firstLine.trim().startsWith('//') || firstLine.trim().startsWith('/*')) {
      return 'javascript';
    }
    
    // Check for HTML link tag or HTML comments
    if (firstLine.trim().startsWith('<link') || firstLine.trim().startsWith('<!--')) {
      return 'html';
    }
    
    // Check for shell commands (single slash at start)
    // This detects lines that are either just a single '/' or start with '/' followed by a space
    if (firstLine.trim() === '/' || firstLine.trim().startsWith('/')) {
      return 'shell';
    }
    
    // Check for CSS selectors or at-rules
    if (firstLine.trim().startsWith('.') || firstLine.trim().startsWith('@')) {
      return 'css';
    }
    
    // Check for common Python import patterns
    if (firstLine.startsWith('import ')) {
      return 'python';
    }
    
    // Check for specific Python import patterns
    if (firstLine.includes('import os') || 
        firstLine.includes('import sys') || 
        firstLine.includes('import numpy') || 
        firstLine.includes('import pandas') || 
        firstLine.includes('import matplotlib') || 
        firstLine.includes('import tensorflow') || 
        firstLine.includes('import torch') || 
        firstLine.includes('import mlx.core as mx')) {
      return 'python';
    }
    
    if (code.trim().startsWith('"') || code.trim().startsWith("'")) {
      return 'text';
    }
    
    if (/^(ls|cd|python|conda|pip|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(code)) {
      return 'shell';
    }
  
    // Check for Python-specific patterns
    // Look for distinctive Python patterns rather than just 'import'
    if (code.includes('def ') || 
        /\bimport\s+[\w\.]+\s+as\s+\w+/.test(code) || // import X as Y pattern
        /\bfrom\s+[\w\.]+\s+import\s+/.test(code) || // from X import Y pattern
        code.includes('class ') || 
        /\bif\s+__name__\s*==\s*['"]__main__['"]/.test(code)) {
      return 'python';
    }
    
    // Check for JavaScript-specific import patterns to avoid confusion
    if (/\bimport\s+{[^}]*}\s+from\s+['"]/.test(code) || // import { X } from 'Y'
        /\bimport\s+\w+\s+from\s+['"]/.test(code)) { // import X from 'Y'
      return 'javascript';
    }
    
    if (code.includes('function') || code.includes('var') || code.includes('const')) return 'javascript';
    if (code.includes('{') && code.includes('}')) {
      if (code.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
      if (code.includes(':')) return 'json';
    }
    if (code.includes('<') && code.includes('>') && (code.includes('</') || code.includes('/>'))) return 'html';
    
    if (code.match(/^(#{1,6}\s|\*\s|-\s|\d+\.\s|\[.*\]\(.*\))/m)) return 'markdown';
    
    if (code.startsWith('$') || code.startsWith('#')) return 'shell';
    
    return 'text';
  }

  /**
   * Applies syntax highlighting to code based on the detected language
   * @param {string} code - The code to highlight
   * @param {string} language - The detected programming language
   * @returns {string} - HTML with syntax highlighting applied
   */
  function highlightSyntax(code, language) {
    const encodeHtmlEntities = (text) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const decodedCode = code;

    switch (language) {
      case 'javascript':
        return decodedCode.replace(
          /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`|\b(?:function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this|null|undefined|true|false)\b|\b\d+\b|[{}[\],;.])/g,
          match => {
            if (/^\/\//.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
            if (/^\/\*/.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
            if (/^['"`]/.test(match)) return `<span class="string">${encodeHtmlEntities(match)}</span>`;
            if (/^(function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this)$/.test(match)) return `<span class="keyword">${encodeHtmlEntities(match)}</span>`;
            if (/^(null|undefined|true|false)$/.test(match)) return `<span class="boolean">${encodeHtmlEntities(match)}</span>`;
            if (/^\d+$/.test(match)) return `<span class="number">${encodeHtmlEntities(match)}</span>`;
            if (/^[{}[\],;.]$/.test(match)) return `<span class="punctuation">${encodeHtmlEntities(match)}</span>`;
            return encodeHtmlEntities(match);
          }
        );
      case 'json':
        return decodedCode.replace(
          /(\"(?:\\.|[^\\"])*\")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          (match, string, colon, boolean) => {
            if (string) {
              return colon 
                ? `<span class="json-key">${encodeHtmlEntities(string)}</span>${encodeHtmlEntities(colon)}`
                : `<span class="json-string">${encodeHtmlEntities(string)}</span>`;
            }
            if (boolean) {
              return `<span class="json-boolean">${encodeHtmlEntities(boolean)}</span>`;
            }
            if (/^-?\d/.test(match)) {
              return `<span class="json-number">${encodeHtmlEntities(match)}</span>`;
            }
            return encodeHtmlEntities(match);
          }
        );
      case 'html':
        return decodedCode.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/(".*?")/g, '<span class="string">$1</span>')
                     .replace(/(&lt;[^\s!?/]+)/g, '<span class="tag">$1</span>')
                     .replace(/(&lt;\/[^\s!?/]+)/g, '<span class="tag">$1</span>')
                     .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
      case 'css':
        return decodedCode.replace(
          /([\w-]+\s*:)|(#[\da-f]{3,6})/gi,
          match => {
            if (/:$/.test(match)) return `<span class="property">${encodeHtmlEntities(match)}</span>`;
            return `<span class="value">${encodeHtmlEntities(match)}</span>`;
          }
        );
      case 'markdown':
        return decodedCode.replace(
          /(^#{1,6}\s.*$)|(^[*-]\s.*$)|(^>\s.*$)|(`{1,3}[^`\n]+`{1,3})|(\[.*?\]\(.*?\))/gm,
          match => {
            if (/^#{1,6}/.test(match)) return `<span class="heading">${encodeHtmlEntities(match)}</span>`;
            if (/^[*-]\s+/.test(match)) return `<span class="list-item">${encodeHtmlEntities(match)}</span>`;
            if (/^>\s+/.test(match)) return `<span class="blockquote">${encodeHtmlEntities(match)}</span>`;
            if (/`{1,3}[^`\n]+`{1,3}/.test(match)) return `<span class="code">${encodeHtmlEntities(match)}</span>`;
            if (/\[.*?\]\(.*?\)/.test(match)) return `<span class="link">${encodeHtmlEntities(match)}</span>`;
            return encodeHtmlEntities(match);
          }
        );
        
      case 'text':
        return encodeHtmlEntities(decodedCode);
      default:
        return encodeHtmlEntities(decodedCode);
    }
  }

  /**
   * Creates a modal dialog for entering a custom filename
   * @returns {Object} - The modal elements
   */
  function createFilenamePrompt() {
    const modal = document.createElement('div');
    modal.className = 'code-expander-filename-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'code-expander-filename-modal-content';
    
    const promptText = document.createElement('p');
    promptText.textContent = CODE_EXPANDER_CONFIG.FILENAME_PROMPT_TEXT;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'code-expander-filename-input';
    input.placeholder = CODE_EXPANDER_CONFIG.DEFAULT_FILENAME;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'code-expander-filename-buttons';
    
    const modalDownloadButton = document.createElement('button');
    modalDownloadButton.className = 'code-expander-filename-download';
    modalDownloadButton.textContent = CODE_EXPANDER_CONFIG.DOWNLOAD_BUTTON_TEXT;
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'code-expander-filename-cancel';
    cancelButton.textContent = CODE_EXPANDER_CONFIG.CANCEL_BUTTON_TEXT;
    
    buttonContainer.appendChild(modalDownloadButton);
    buttonContainer.appendChild(cancelButton);
    
    modalContent.appendChild(promptText);
    modalContent.appendChild(input);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    
    return { modal, input, modalDownloadButton, cancelButton };
  }

  /**
   * Creates an info tooltip with descriptions of each button
   * @returns {Object} - The tooltip elements
   */
  function createInfoTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'code-expander-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    
    const title = document.createElement('h3');
    title.textContent = CODE_EXPANDER_CONFIG.INFO_TOOLTIP.TITLE;
    tooltip.appendChild(title);
    
    const list = document.createElement('ul');
    
    // Add descriptions for each button - always include all functions
    const descriptions = [
      { key: 'COPY', condition: true },
      { key: 'VIEW_RAW', condition: true },
      { key: 'DOWNLOAD', condition: true },
      { key: 'EXPAND', condition: true },
      { key: 'KEYBOARD', condition: true }
    ];
    
    descriptions.forEach(({ key, condition }) => {
      if (condition) {
        const item = document.createElement('li');
        item.innerHTML = CODE_EXPANDER_CONFIG.INFO_TOOLTIP[key];
        list.appendChild(item);
      }
    });
    
    tooltip.appendChild(list);
    
    return tooltip;
  }

  /**
   * Downloads code as a file with the specified filename
   * @param {string} code - The code to download
   * @param {string} language - The language of the code
   * @param {string} customFilename - Optional custom filename
   */
  function downloadCode(code, language, customFilename = null) {
    // Determine file extension based on language
    let extension = '.txt';
    switch (language) {
      case 'javascript':
        extension = '.js';
        break;
      case 'html':
        extension = '.html';
        break;
      case 'css':
        extension = '.css';
        break;
      case 'json':
        extension = '.json';
        break;
      case 'python':
        extension = '.py';
        break;
      case 'shell':
        extension = '.sh';
        break;
      case 'markdown':
        extension = '.md';
        break;
      default:
        extension = '.txt';
    }
    
    // Use custom filename if provided, otherwise use default
    const filename = customFilename ? `${customFilename}${extension}` : `${CODE_EXPANDER_CONFIG.DEFAULT_FILENAME}${extension}`;
    
    // Create a blob with the code content
    const blob = new Blob([code], { type: 'text/plain' });
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    
    // Append to the body, click to trigger download, then remove
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 100);
  }

  /**
   * Shows the tooltip at the specified position
   * @param {HTMLElement} tooltip - The tooltip element
   * @param {HTMLElement} button - The button that triggered the tooltip
   */
  function showTooltip(tooltip, button) {
    // Add tooltip to document body if not already added
    if (!document.body.contains(tooltip)) {
      document.body.appendChild(tooltip);
    }
    
    tooltip.setAttribute('aria-hidden', 'false');
    tooltip.classList.add('active');
    
    // Position the tooltip relative to the viewport
    const buttonRect = button.getBoundingClientRect();
    
    // Position tooltip below the button
    tooltip.style.top = `${buttonRect.bottom + 5}px`;
    tooltip.style.left = `${buttonRect.left}px`;
    
    // Ensure tooltip doesn't go off-screen to the right
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
      tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
    }
  }

  /**
   * Hides the tooltip
   * @param {HTMLElement} tooltip - The tooltip element
   */
  function hideTooltip(tooltip) {
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.classList.remove('active');
  }

  /**
   * Checks if an element has overflow in the specified direction
   * @param {HTMLElement} element - The element to check
   * @param {string} direction - The direction to check ('horizontal' or 'vertical')
   * @returns {boolean} - Whether the element has overflow
   */
  function hasOverflow(element, direction) {
    if (direction === 'horizontal') {
      return element.scrollWidth > element.clientWidth;
    } else if (direction === 'vertical') {
      return element.scrollHeight > element.clientHeight;
    }
    return false;
  }

  /**
   * Sets up keyboard navigation for scrolling in code blocks
   * @param {HTMLElement} preElement - The pre element containing the code
   * @param {HTMLElement} rawView - The raw view element
   */
  function setupKeyboardNavigation(preElement, rawView) {
    // Add tabindex to make the elements focusable
    preElement.setAttribute('tabindex', '0');
    rawView.setAttribute('tabindex', '0');
    
    // Handle keyboard navigation in formatted view
    preElement.addEventListener('keydown', (e) => {
      // Only handle arrow keys
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      
      // Prevent default behavior (like cursor movement)
      e.preventDefault();
      
      const scrollAmount = 40; // Pixels to scroll per key press
      
      if (e.key === 'ArrowLeft') {
        preElement.scrollLeft -= scrollAmount;
      } else if (e.key === 'ArrowRight') {
        preElement.scrollLeft += scrollAmount;
      }
    });
    
    // Handle keyboard navigation in raw view
    rawView.addEventListener('keydown', (e) => {
      // Only handle arrow keys
      if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;
      
      // Prevent default behavior (like cursor movement)
      e.preventDefault();
      
      const scrollAmount = 40; // Pixels to scroll per key press
      
      if (e.key === 'ArrowUp') {
        rawView.scrollTop -= scrollAmount;
      } else if (e.key === 'ArrowDown') {
        rawView.scrollTop += scrollAmount;
      }
    });
  }

  /**
   * Creates a code expander wrapper for a code element
   * @param {HTMLElement} codeElement - The code element to process
   * @param {number} index - The index of the code element
   * @param {boolean} forceText - Whether to force the language to be "text"
   * @returns {HTMLElement} - The created wrapper element
   */
  function createCodeExpanderWrapper(codeElement, index, forceText) {
    const code = codeElement.textContent;
    // If forceText is true, set language to "text" without detection
    const language = forceText ? 'text' : detectLanguage(code);  
    const lines = code.split('\n');
    const isLongDocument = lines.length > CODE_EXPANDER_CONFIG.LONG_DOCUMENT_THRESHOLD;
    
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';
    wrapper.dataset.codeIndex = index;
    
    // Create header with buttons
    const header = document.createElement('div');
    header.className = 'code-expander-header';
    
    // Add language indicator
    const languageIndicator = document.createElement('div');
    languageIndicator.className = 'code-expander-language';
    languageIndicator.textContent = language.toUpperCase();
    header.appendChild(languageIndicator);
    
    // Add scroll hint to header (will be shown/hidden based on overflow)
    const scrollHint = document.createElement('div');
    scrollHint.className = 'code-expander-scroll-hint';
    scrollHint.textContent = CODE_EXPANDER_CONFIG.SCROLL_HINT_TEXT;
    scrollHint.style.display = 'none'; // Hide initially, will show if overflow detected
    header.appendChild(scrollHint);
    
    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'code-expander-buttons';
    
    // Add expand button to toolbar if it's a long document
    let expandButton = null;
    if (isLongDocument) {
      expandButton = document.createElement('button');
      expandButton.className = 'code-expander-expand-collapse';
      expandButton.textContent = CODE_EXPANDER_CONFIG.EXPAND_TEXT;
      buttonGroup.appendChild(expandButton);
    }
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.textContent = CODE_EXPANDER_CONFIG.COPY_TEXT;
    buttonGroup.appendChild(copyButton);
    
    // Add view raw button
    const viewRawButton = document.createElement('button');
    viewRawButton.className = 'code-expander-view-raw';
    viewRawButton.textContent = CODE_EXPANDER_CONFIG.VIEW_RAW_TEXT;
    buttonGroup.appendChild(viewRawButton);
    
    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'code-expander-download';
    downloadButton.textContent = CODE_EXPANDER_CONFIG.DOWNLOAD_TEXT;
    buttonGroup.appendChild(downloadButton);
    
    // Add info button as the last button in the group
    const infoButton = document.createElement('button');
    infoButton.className = 'code-expander-info';
    infoButton.innerHTML = '<span aria-hidden="true">?</span>';
    infoButton.setAttribute('aria-label', 'Information about code expander controls');
    buttonGroup.appendChild(infoButton);
    
    // Add button group to header
    header.appendChild(buttonGroup);
    
    // Add header to wrapper
    wrapper.appendChild(header);
    
    // Create a new pre element for the code expander
    const newPreElement = document.createElement('pre');
    newPreElement.className = `language-${language}`;
    
    // Create a new code element for the code expander
    const newCodeElement = document.createElement('code');
    newCodeElement.innerHTML = highlightSyntax(code, language);
    
    // Add the new code element to the new pre element
    newPreElement.appendChild(newCodeElement);
    
    // Add raw view container
    const rawViewContainer = document.createElement('div');
    rawViewContainer.className = 'code-expander-raw-view';
    rawViewContainer.textContent = code;
    
    // Create filename prompt modal (but don't add to DOM yet)
    const { modal, input, modalDownloadButton, cancelButton } = createFilenamePrompt();
    
    // Create tooltip but don't add it to DOM yet
    const tooltip = createInfoTooltip();
    
    if (isLongDocument) {
      newPreElement.classList.add('collapsible');
      
      // Function to toggle expansion
      const toggleExpansion = () => {
        newPreElement.classList.toggle('expanded');
        const isExpanded = newPreElement.classList.contains('expanded');
        expandButton.textContent = isExpanded ? CODE_EXPANDER_CONFIG.COLLAPSE_TEXT : CODE_EXPANDER_CONFIG.EXPAND_TEXT;
      };
      
      // Add click event listener to expand button
      expandButton.onclick = toggleExpansion;
    }
    
    // Add the new pre element to the wrapper
    wrapper.appendChild(newPreElement);
    wrapper.appendChild(rawViewContainer);
    
    // Setup keyboard navigation
    setupKeyboardNavigation(newPreElement, rawViewContainer);
    
    // Check for overflow and show scroll hint if needed
    // Use setTimeout to ensure the element is fully rendered
    setTimeout(() => {
      if (hasOverflow(newPreElement, 'horizontal')) {
        scrollHint.style.display = 'block';
      }
    }, 100);
    
    // Track tooltip state
    let isTooltipVisible = false;
    
    // Add event listener for info button click
    infoButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Toggle tooltip visibility
      if (isTooltipVisible) {
        hideTooltip(tooltip);
        isTooltipVisible = false;
      } else {
        showTooltip(tooltip, infoButton);
        isTooltipVisible = true;
      }
    });
    
    // Add mouseenter event to hide tooltip if it's already visible
    infoButton.addEventListener('mouseenter', () => {
      if (isTooltipVisible) {
        hideTooltip(tooltip);
        isTooltipVisible = false;
      }
    });
    
    // Add mouseleave event to hide tooltip when mouse leaves the info button
    infoButton.addEventListener('mouseleave', () => {
      // Small delay to allow moving to the tooltip
      setTimeout(() => {
        if (!tooltip.matches(':hover')) {
          hideTooltip(tooltip);
          isTooltipVisible = false;
        }
      }, 100);
    });
    
    // Add mouseleave event to the tooltip itself
    tooltip.addEventListener('mouseleave', () => {
      hideTooltip(tooltip);
      isTooltipVisible = false;
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
      if (isTooltipVisible && !tooltip.contains(e.target) && e.target !== infoButton) {
        hideTooltip(tooltip);
        isTooltipVisible = false;
      }
    });
    
    // Add event listener for copy button
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = CODE_EXPANDER_CONFIG.COPIED_TEXT;
        setTimeout(() => {
          copyButton.textContent = CODE_EXPANDER_CONFIG.COPY_TEXT;
        }, CODE_EXPANDER_CONFIG.COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error copying content:', err);
      }
    });
    
    // Add event listener for view raw button
    viewRawButton.addEventListener('click', () => {
      const rawView = wrapper.querySelector('.code-expander-raw-view');
      const isRawActive = rawView.classList.toggle('active');
      
      // Always set the button text based on the current state
      viewRawButton.textContent = isRawActive 
        ? CODE_EXPANDER_CONFIG.VIEW_FORMATTED_TEXT 
        : CODE_EXPANDER_CONFIG.VIEW_RAW_TEXT;
      
      // If switching to raw view, check for vertical overflow
      if (isRawActive) {
        setTimeout(() => {
          if (hasOverflow(rawView, 'vertical')) {
            scrollHint.style.display = 'block';
          }
        }, 100);
      } else {
        // If switching back to formatted view, check for horizontal overflow
        setTimeout(() => {
          if (hasOverflow(newPreElement, 'horizontal')) {
            scrollHint.style.display = 'block';
          } else {
            scrollHint.style.display = 'none';
          }
        }, 100);
      }
    });
    
    // Add event listener for download button
    downloadButton.addEventListener('click', () => {
      // Add modal to the wrapper
      wrapper.appendChild(modal);
      
      // Show the modal
      modal.style.display = 'flex';
      
      // Focus the input
      input.focus();
      
      // Handle download button click
      modalDownloadButton.onclick = () => {
        const filename = input.value.trim() || CODE_EXPANDER_CONFIG.DEFAULT_FILENAME;
        downloadCode(code, language, filename);
        modal.style.display = 'none';
        wrapper.removeChild(modal);
      };
      
      // Handle cancel button click
      cancelButton.onclick = () => {
        modal.style.display = 'none';
        wrapper.removeChild(modal);
      };
      
      // Handle Enter key press
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          modalDownloadButton.click();
        } else if (e.key === 'Escape') {
          cancelButton.click();
        }
      });
      
      // Handle click outside modal to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cancelButton.click();
        }
      });
    });
    
    return wrapper;
  }

  // Main processing logic
  // Process all code elements on the page
  Array.from(codeElements).forEach((codeElement, index) => {
    // Skip code elements that are already processed
    if (codeElement.closest('.code-expander-wrapper')) {
      return;
    }
    
    const wrapper = createCodeExpanderWrapper(codeElement, index, forceText);
    
    // Get the parent pre element
    const preElement = codeElement.parentNode;
    
    // Create a container to hold the enhanced code block
    const container = document.createElement('div');
    
    // Replace the original pre element with the container
    preElement.parentNode.replaceChild(container, preElement);
    
    // Add the wrapper to the container
    container.appendChild(wrapper);
  });
}
