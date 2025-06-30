// Spectrum Card Block: Renders a card using Adobe Spectrum Web Components
// Follows Airbnb style guide and EDS best practices

// Import Spectrum Web Components
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';

// Ensure the page is wrapped in <sp-theme> for consistent Spectrum styling
function ensureThemeContext() {
  if (!document.querySelector('sp-theme')) {
    const theme = document.createElement('sp-theme');
    theme.setAttribute('color', 'light');
    theme.setAttribute('scale', 'medium');
    theme.setAttribute('system', 'spectrum');
    // Move all body children into the theme
    while (document.body.firstChild) {
      theme.appendChild(document.body.firstChild);
    }
    document.body.appendChild(theme);
  }
}

// Inject Spectrum Card CSS into the document head (only once)
const SPECTRUM_CARD_CSS = `
.spectrum-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.spectrum-card {
  --card-padding: 1rem;
  --card-border-radius: 4px;
  --card-background: var(--spectrum-global-color-gray-50);
  --card-border-color: var(--spectrum-global-color-gray-200);
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --button-margin-top: 1rem;
}
.spectrum-card sp-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  border: 1px solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}
.spectrum-card sp-card [slot="preview"] {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
}
.spectrum-card sp-card [slot="description"] {
  padding: var(--card-padding);
  color: var(--spectrum-global-color-gray-800);
  font-size: var(--spectrum-global-dimension-font-size-100);
  line-height: var(--spectrum-global-dimension-font-line-height-100);
}
.spectrum-card sp-card [slot="footer"] {
  padding: var(--card-padding);
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--card-border-color);
}
.spectrum-card sp-card sp-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
}
.spectrum-card sp-card sp-button sp-icon-arrow-right {
  width: 18px;
  height: 18px;
}
.spectrum-card sp-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease-in-out;
}
@media (max-width: 600px) {
  .spectrum-card {
    --card-padding: 0.75rem;
  }
  .spectrum-card sp-card [slot="footer"] {
    padding: 0.75rem;
  }
  .spectrum-card sp-card sp-button {
    min-width: 100px;
  }
}
`;
function injectSpectrumCardCSS() {
  if (!document.getElementById('spectrum-card-style')) {
    const style = document.createElement('style');
    style.id = 'spectrum-card-style';
    style.textContent = SPECTRUM_CARD_CSS;
    document.head.appendChild(style);
  }
}

// Configuration constants
const CONFIG = {
  CARD_VARIANT: 'standard',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};

/**
 * Decorates the spectrum card block
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  ensureThemeContext();
  injectSpectrumCardCSS();

  // Ensure all .spectrum-card.block elements are wrapped in a .spectrum-card-grid for consistent layout
  const section = block.closest('.section') || block.parentElement;
  let grid = section.querySelector('.spectrum-card-grid');
  const cards = Array.from(section.querySelectorAll('.spectrum-card.block'));
  const hasCards = cards.length > 0;
  let hasParent = false;
  if (hasCards) {
    hasParent = !!cards[0].parentElement;
  }
  let gridIsNotParent = false;
  if (hasCards && hasParent) {
    gridIsNotParent = cards[0].parentElement !== grid;
  }
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'spectrum-card-grid';
    cards.forEach((card) => {
      grid.appendChild(card);
    });
    if (!grid.parentElement) {
      section.appendChild(grid);
    } else if (
      hasCards
      && hasParent
      && cards[0].parentElement !== grid
      && grid !== section
    ) {
      // Only insertBefore if grid is not already the parent and not already in the section
      const firstCard = cards[0];
      const parent = firstCard.parentElement;
      if (parent !== grid && parent !== null && grid !== parent) {
        parent.insertBefore(grid, firstCard);
      }
    }
  } else if (gridIsNotParent) {
    grid.appendChild(block);
  }

  // --- Card rendering logic ---
  try {
    // Get all rows from the block
    const rows = Array.from(block.children);
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] extracted rows', rows);

    // Extract content from rows
    const imagePicture = rows[0]?.querySelector('picture') || null;
    const title = rows[1]?.textContent.trim() || CONFIG.DEFAULT_TITLE;
    const description = rows[2]?.textContent.trim() || CONFIG.DEFAULT_DESCRIPTION;
    const buttonText = rows[3]?.textContent.trim() || CONFIG.DEFAULT_BUTTON_TEXT;

    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] content', {
      imagePicture,
      title,
      description,
      buttonText,
    });

    // Clear the block
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] block cleared');

    // Create card element
    const card = document.createElement('sp-card');
    card.setAttribute('heading', title);
    card.setAttribute('variant', CONFIG.CARD_VARIANT);
    card.style.maxWidth = CONFIG.MAX_WIDTH;

    // Add image if present
    if (imagePicture) {
      const picture = imagePicture.cloneNode(true);
      picture.setAttribute('slot', 'preview');
      card.appendChild(picture);
      // eslint-disable-next-line no-console
      console.debug('[spectrum-card] picture element added');
    }

    // Add description
    const descDiv = document.createElement('div');
    descDiv.setAttribute('slot', 'description');
    descDiv.textContent = description;

    // Create footer with button
    const footer = document.createElement('div');
    footer.setAttribute('slot', 'footer');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';

    // Create button
    const button = document.createElement('sp-button');
    button.setAttribute('treatment', CONFIG.BUTTON_TREATMENT);
    button.setAttribute('size', CONFIG.BUTTON_SIZE);
    button.textContent = buttonText;

    // Add arrow icon to button
    const arrowIcon = document.createElement('sp-icon-arrow-right');
    arrowIcon.setAttribute('slot', 'icon');
    button.appendChild(arrowIcon);

    // Add click handler
    button.addEventListener('click', () => {
      // eslint-disable-next-line no-console
      console.log('Card action clicked:', {
        title,
        description,
      });
    });

    // Assemble the card
    footer.appendChild(button);
    card.appendChild(descDiv);
    card.appendChild(footer);
    block.appendChild(card);
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] card appended to block');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[spectrum-card] decorate error', error);
  }
}
