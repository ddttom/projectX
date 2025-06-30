/**
 * Remove Icon Styles Block
 * 
 * This block's purpose is to override the default icon styles in EDS.
 * The block doesn't modify DOM elements but relies on its CSS file
 * to override the default icon styling through CSS specificity.
 */

export default function decorate(block) {
    // This block's primary functionality is in its CSS file
    // The JS file exists mainly to fulfill the EDS block structure requirements
    
    // Make the block invisible since it doesn't need to display any content
    block.style.display = 'none';
    
    // We could add a comment in the DOM to indicate the block is active
    const comment = document.createComment('remove-icon-styles block is active');
    block.appendChild(comment);
  }
