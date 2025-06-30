
# Component Usage in EDS

Create a block in your EDS document:

## Basic Usage (uses default /slides/query-index.json)

```bash
| spectrum-card |
| :---- |
```

### Custom Query Path

```bash
| spectrum-card |
| :---- |
| /custom/query-index.json |
```

EDS automatically calls the component's `decorate` function, which fetches data from the specified query-index.json endpoint and renders interactive Spectrum cards.

## Enhanced Functionality

### Numbered Slide Badges

Each card displays a numbered badge in the top-left corner, providing visual hierarchy and slide ordering. The badges use Spectrum blue (#0265DC) with white text for optimal contrast and brand consistency.

### Immersive Modal Overlay System

Clicking "Read More" opens a full-screen immersive modal that:

- Displays full content from the corresponding `.plain.html` endpoint with stunning visual design
- Features background imagery from the card for visual impact
- Uses glassmorphism design with translucent elements and backdrop blur effects
- Includes hero-style typography with large-scale text and gradient overlays
- Provides slide number badge and close button with glassmorphism styling
- Supports multiple close methods (glassmorphism close button, click outside, ESC key)
- Adapts responsively to mobile devices with optimized typography and spacing
- Includes cross-browser compatibility with webkit prefixes for Safari support

### Content Loading

The component intelligently fetches content from EDS:

- **Card Data**: From `query-index.json` endpoints for card previews
- **Full Content**: From `.plain.html` endpoints for modal display
- **Error Handling**: Graceful fallbacks when content is unavailable
- **Loading States**: User feedback during content fetching

## Features

### Enhanced User Experience

- ✅ **Numbered Slide Badges** - Visual hierarchy indicators with Spectrum blue styling
- ✅ **Immersive Modal System** - Full-screen content display with background imagery
- ✅ **Glassmorphism Design** - Modern translucent elements with backdrop blur effects
- ✅ **Hero Typography** - Large-scale text with gradient overlays for visual impact
- ✅ **Dynamic Content Loading** - Fetches complete `.plain.html` content rendered as styled text
- ✅ **Multiple Close Methods** - Glassmorphism close button, click outside, and ESC key support
- ✅ **Cross-browser Compatibility** - Webkit prefixes for Safari support

### Technical Excellence

- ✅ **Modern JavaScript** - ES Modules, no TypeScript compilation needed
- ✅ **Spectrum Design System** - Professional Adobe UI components with icons
- ✅ **Built-in Accessibility** - Keyboard navigation, screen readers, ARIA support
- ✅ **Responsive Design** - Mobile-friendly with CSS custom properties
- ✅ **Development Tools** - Hot reload, error logging, proxy configuration
- ✅ **Performance Optimized** - Tree-shaking, minimal runtime overhead
- ✅ **Error Handling** - Graceful fallbacks for network failures and missing content
