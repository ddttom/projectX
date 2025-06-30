# Inline SVG

This block handles SVG icons and content in a standardized way, converting various input formats into a consistent structure.

## Usage

The block accepts two types of input:

1. Icon spans:
```html
<span class="icon icon-name"></span>
```

2. Direct SVG markup:
```html
<svg>...</svg>
```

## Authoring

In your Google Docs or Microsoft Word document, you can use either:

1. A two-column table with "inline-svg" and an icon span:

| inline-svg |
|------------|
| `<span class="icon icon-example"></span>` |

2. Or with direct SVG content:

| inline-svg |
|------------|
| `<svg>...</svg>` |

## Output Structure

The block standardizes all inputs into this format:
```html
<p>
  <span class="icon icon-{name}">
    <img src="/icons/{name}.svg" alt="" loading="eager">
  </span>
</p>
```

## Behavior

The JavaScript in `inline-svg.js` performs the following:

1. Checks for existing icon spans (`span[class^="icon icon-"]`)
2. If found:
   - Extracts the icon name from the class
   - Creates standardized structure with img element
3. If not found, checks for SVG content:
   - Extracts icon name from block classes or uses 'default-icon'
   - Creates standardized structure with img element
4. Sets eager loading for immediate display
5. Maintains empty alt text for decorative icons

## Styling

The block uses these CSS classes:
- `.inline-svg`: Main container styling
- `.inline-svg-wrapper`: Full-width container
- `.icon`: Icon container styling
- `.icon-{name}`: Specific icon styling

## Dependencies

- Requires SVG files to be present in the `/icons/` directory
- No external JavaScript dependencies

## Accessibility

- Uses semantic HTML structure
- Implements eager loading for immediate visual feedback
- Uses empty alt text for decorative icons
- Maintains consistent structure for predictable behavior

## Error Handling

- Logs errors for invalid or missing content
- Provides fallback handling for different input formats
- Maintains graceful degradation if icon files are missing

## Future Improvements

1. Add support for icon size variants
2. Implement lazy loading option for below-fold icons
3. Add aria-label support for meaningful icons
4. Consider adding animation support
5. Add support for icon color customization