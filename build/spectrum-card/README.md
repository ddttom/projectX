# Spectrum Card

A responsive card component built using Adobe Spectrum Web Components, providing a consistent and accessible way to display content with images, titles, descriptions, and action buttons.

## Features
- Responsive image handling with WebP/PNG/JPEG support
- Adobe Spectrum design system integration
- Accessible markup and keyboard navigation
- Responsive grid layout (auto-applied in all environments)
- Support for varying content lengths
- Special character handling
- Lazy loading of images
- **Footer and action button always visible with the 'standard' card variant**
- **Theme context is always ensured via `<sp-theme>` for consistent styling**
- **All layout and card CSS is injected from JS (no external CSS required)**

## Usage
| Spectrum Card |
| :------------ |
| Image URL     |
| Title         |
| Description   |
| Action Text   |

## Configuration
### CSS Variables
The block uses Adobe Spectrum CSS variables for theming:
- `--spectrum-global-color-gray-*`: Color palette
- `--spectrum-sans-font-family-stack`: Typography

### Variants
- The block uses the `standard` variant of `<sp-card>` by default. This ensures the footer slot and action button are always visible.
- Other variants (like `quiet`) may not display the footer or action button. Use `standard` for full functionality.

## Accessibility
- Semantic HTML structure
- Proper alt text for images
- Keyboard navigable
- Screen reader friendly
- ARIA roles and labels where needed

## Performance
- Lazy loading of images
- Responsive image optimization
- WebP format support with fallbacks
- Efficient grid layout

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports WebP with fallback to PNG/JPEG
- Responsive design works across devices

## Dependencies
- Adobe Spectrum Web Components (imported in JS)
  - @spectrum-web-components/theme
  - @spectrum-web-components/card
  - @spectrum-web-components/button
  - @spectrum-web-components/icons-workflow

## Authoring
When creating content in Google Docs or Microsoft Word:
1. Create a table with one column
2. First row should contain "Spectrum Card"
3. Subsequent rows should contain:
   - Image URL (from DAM)
   - Title text
   - Description text
   - Action button text

## Styling
The block uses Adobe Spectrum's design system for consistent styling:
- Light theme by default
- Medium scale for optimal readability
- Responsive grid layout (auto-applied)
- Card-based design with proper spacing
- **All CSS is injected from JS; no external CSS file is needed**

## Behavior
- Images load lazily for better performance
- Responsive image handling based on viewport size
- Grid layout adjusts based on available space
- Clickable action area

## Troubleshooting
Common issues and solutions:
1. **Action button not visible:**
   - Ensure the card variant is set to `standard`. The `quiet` variant does not display the footer slot.
   - Verify Spectrum Web Components are properly imported.
2. **Cards not styled or grid not applied:**
   - Ensure the JS is loaded and running; all CSS and grid layout are injected from JS.
   - Theme context is auto-injected via `<sp-theme>` if missing.
3. Images not loading
   - Verify image URLs are correct
   - Check image format support
   - Ensure proper DAM permissions
4. Layout issues
   - Check container width
   - Verify grid container settings
   - Ensure proper spacing variables
5. Theme not applying
   - Verify Spectrum dependencies are loaded
   - Check theme and scale imports
   - Ensure proper class names

## Suggestions
- Use high-quality images with proper aspect ratios
- Keep descriptions concise but informative
- Use clear, actionable button text
- Consider mobile-first design when creating content
- Test with various content lengths
- Verify accessibility with screen readers

## Performance Considerations
- Optimize images before uploading to DAM
- Use appropriate image formats (WebP with fallbacks)
- Keep descriptions concise
- Monitor lazy loading behavior
- Test grid performance with many cards

## Developer Notes
- The implementation includes debug logging (console.debug) to aid development and troubleshooting. These logs can be removed or silenced for production deployments.
