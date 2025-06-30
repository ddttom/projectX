# Using Spectrum Components in Adobe Edge Delivery Services Blocks

Adobe's Edge Delivery Services (EDS) enables document-driven web development, but you can still deliver sophisticated UI using Spectrum Web Components. This guide shows how to build a modern, image-capable card block for EDS using Spectrum components, with a focus on maintainability, accessibility, and local testability.

## Why Spectrum Components Work Well with EDS

Spectrum Web Components follow Adobe's design system and are built on web standards, making them a perfect fit for EDS. They provide:
- Professional, accessible UI out of the box
- Theming and responsive design
- Keyboard and screen reader support
- Easy integration with EDS's block-based architecture

## Building a Spectrum Card Block

A typical build structure:

`/build/spectrum-card/`
├── spectrum-card.js
├── spectrum-card.css
├── test.html
├── package.json
├── vite.config.js

### spectrum-card.js

```js
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';

const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};

export default function decorate(block) {
  const rows = Array.from(block.children);
  const imageUrl = rows[0]?.textContent.trim();
  const title = rows[1]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
  const description = rows[2]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  const buttonText = rows[3]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;

  block.textContent = '';

  const card = document.createElement('sp-card');
  card.setAttribute('heading', title);
  card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
  card.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;

  if (imageUrl) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = imageUrl;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = 'auto';
    card.appendChild(img);
  }

  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = description;

  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  footerDiv.style.display = 'flex';
  footerDiv.style.justifyContent = 'flex-end';

  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.setAttribute('size', SPECTRUM_CARD_CONFIG.BUTTON_SIZE);
  button.textContent = buttonText;
  const icon = document.createElement('sp-icon-arrow-right');
  icon.setAttribute('slot', 'icon');
  button.appendChild(icon);
  button.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('Card action clicked:', {
      title,
      description,
    });
  });
  footerDiv.appendChild(button);
  card.appendChild(descriptionDiv);
  card.appendChild(footerDiv);
  block.appendChild(card);
}
```

### Authoring Pattern

| spectrum-card |
| ------------- |
| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| Welcome Card  |
| This is a sample card description that explains the card's purpose. |
| Learn More    |

- **Row 1:** Image URL (required)
- **Row 2:** Title (required)
- **Row 3:** Description (required)
- **Row 4:** Button text (required)

### Local Testing with test.html

To test your block locally (outside EDS), use this pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Spectrum Card Test</title>
  <script type="module">
    import '@spectrum-web-components/theme/theme-light.js';
    import '@spectrum-web-components/theme/scale-medium.js';
    import '@spectrum-web-components/theme/sp-theme.js';
  </script>
  <style>
    body { background: #f5f5f5; font-family: var(--spectrum-sans-font-family-stack); }
    .test-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <sp-theme color="light" scale="medium" system="spectrum">
    <div class="test-container">
      <div class="spectrum-card block">
        <div>https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png</div>
        <div>Basic Card</div>
        <div>This is a basic card with minimal content</div>
        <div>Click Me</div>
      </div>
      <!-- More cards ... -->
    </div>
  </sp-theme>
  <script type="module">
    import decorate from './spectrum-card.js';
    document.querySelectorAll('.spectrum-card.block').forEach(decorate);
  </script>
</body>
</html>
```

This approach lets you see the real Spectrum card rendering and interactivity before deploying to EDS.

**Note:** Always set `system="spectrum"` on `<sp-theme>` to avoid console warnings and ensure explicit theme delivery.

### Vite Config

`import { defineConfig } from 'vite';`
`export default defineConfig({`
  `root: '.',`
  `server: { port: 5173, strictPort: true, open: true, host: true },`
  `build: {`
    `lib: { entry: 'spectrum-card.js', name: 'SpectrumCard', fileName: () => 'spectrum-card.js', formats: ['es'] },`
    `outDir: 'dist',`
    `rollupOptions: { external: [], output: { globals: {} } },`
    `emptyOutDir: true,`
  `},`
`});`

## EDS Integration

When deployed, EDS will automatically call your `decorate` function for each block instance. The block will support images, custom titles, descriptions, and button text, and will be fully accessible and theme-aware.

## Performance and Accessibility
- Spectrum components are tree-shaken and optimized by Vite
- All interactive elements are keyboard accessible
- Theming and responsive design are automatic

## Troubleshooting
- If you see a gray box, add an image as the fourth cell
- If cards are unstyled, ensure you are calling `decorate` manually in local tests
- For EDS, just deploy to `/blocks/spectrum-card/` and EDS will handle everything

---

| metadata |  |
| :---- | :---- |
| title | Using Spectrum Components in Adobe Edge Delivery Services Blocks |
| description | A practical guide to integrating Adobe Spectrum Web Components with EDS blocks, including build setup, deployment workflow, and real-world implementation patterns. |
| image | /path/to/feature-image.jpg |
| author | Tom Cranstoun |
| longdescription | Learn how to integrate Adobe Spectrum Web Components into Edge Delivery Services blocks. This guide covers the complete workflow from build setup to deployment, explains how EDS loads components, and provides solutions for common integration challenges. Includes practical examples, performance considerations, and troubleshooting tips for building sophisticated UI components while maintaining EDS's document-first philosophy. |
