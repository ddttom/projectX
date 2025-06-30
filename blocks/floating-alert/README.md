# Floating Alert Block

A modern, accessible floating alert block that displays important messages in a glassmorphic modal overlay. The alert appears immediately when the page loads and can be dismissed by clicking the close button, clicking outside the modal, or pressing the Escape key.

## Features

- Immediate appearance on page load with smooth animations
- **Automatic heading processing** - extracts headings (h1-h6) as alert titles with horizontal rule separator
- Glassmorphic styling with sparkle effects
- Responsive design that works on all screen sizes
- Full keyboard navigation support
- ARIA roles for accessibility
- Persistent dismissal state using localStorage
- Support for links within the alert content
- Click outside to dismiss
- Escape key support
- Beautiful fade animations

## Usage

### Basic Alert (without heading)
| Floating Alert |
| -------------- |
| Your important message here. You can include [links](https://example.com) in the text. |

### Alert with Heading (recommended)
| Floating Alert |
| -------------- |
| ## Important Notice<br>Your important message here. You can include [links](https://example.com) in the text. |

**Note:** When you include a heading (h1-h6) in your content, it will automatically be extracted as the alert title and displayed prominently at the top, followed by a horizontal rule separator, then the remaining content.

## Configuration

### CSS Variables

The block can be customized using CSS variables:

- `--alert-bg-color`: Background color (default: rgba(255, 165, 0, 0.15))
- `--alert-border-color`: Border color (default: rgba(255, 165, 0, 0.3))
- `--alert-text-color`: Text color (default: #333)
- `--alert-shadow-color`: Shadow color (default: rgba(0, 0, 0, 0.1))
- `--alert-sparkle-color`: Sparkle effect color (default: rgba(255, 255, 255, 0.8))
- `--alert-transition-duration`: Animation duration (default: 0.3s)
- `--alert-border-radius`: Border radius (default: 12px)
- `--alert-max-width`: Maximum width (default: 600px)
- `--alert-padding`: Padding (default: 1.5rem)
- `--alert-backdrop-blur`: Blur effect (default: 10px)

## Accessibility

- Uses ARIA roles and attributes for screen readers
- Full keyboard navigation support
- Focus management within the modal
- Clear focus indicators
- Proper heading hierarchy
- Semantic HTML structure

## Behavior

1. The alert appears immediately when the page loads as a modal overlay
2. It can be dismissed by:
   - Clicking the X button in the top-right corner
   - Clicking outside the modal (on the overlay background)
   - Pressing the Escape key
3. Once dismissed, the modal content is restored to the original block location in the document
4. The dismissal state is saved in localStorage - the modal won't appear again until localStorage is cleared
5. Links within the alert are fully functional and clickable
6. Complete DOM cleanup occurs when dismissed (no leftover elements)

## Performance

- Uses CSS transforms for smooth animations
- Efficient event handling
- Minimal DOM manipulation
- Optimized sparkle effect
- No external dependencies

## Browser Compatibility

- Works in all modern browsers
- Graceful fallback for older browsers
- Supports backdrop-filter with fallback
- Responsive design for all screen sizes

## Recent Fixes & Improvements

**Version 1.3 Updates:**
- ✅ **Added heading processing** - automatically extracts headings (h1-h6) as alert titles
- ✅ **Enhanced visual hierarchy** - headings displayed prominently with horizontal rule separator
- ✅ **Improved content structure** - maintains both original content and formatted alert display
- ✅ **Fixed EDS compatibility** - proper content extraction from nested block structure
- ✅ **Enhanced debugging** - comprehensive logging for troubleshooting
- ✅ **Better HR styling** - visible horizontal rule separator with improved contrast

## Troubleshooting

1. If the alert doesn't appear:
   - Check if it was previously dismissed (clear localStorage with key 'floating-alert-dismissed')
   - Verify the block is properly placed in the document
   - Check browser console for errors

2. If dismissal methods don't work:
   - Ensure no other scripts are interfering with event propagation
   - Check that the modal overlay has the correct background styling
   - Verify keyboard events are not being blocked by other elements

3. If animations are not smooth:
   - Ensure the browser supports CSS transforms
   - Check for conflicting CSS
   - Verify no heavy scripts are running

4. If accessibility features aren't working:
   - Verify proper ARIA attributes
   - Test with screen readers
   - Check keyboard navigation</search>
</search_and_replace>

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Use a single table with one cell
2. **Optional:** Start with a heading (Heading 1-6) for the alert title
3. Include your message content below the heading
4. Add links using standard markdown syntax
5. Keep the message concise and clear

**Heading Processing:**
- If you include a heading (h1-h6), it will be automatically extracted as the alert title
- The heading will appear prominently at the top of the modal
- A horizontal rule will separate the heading from the content
- The remaining content will appear below the separator

## Suggestions

- Keep messages short and actionable
- Use links sparingly and make them descriptive
- Consider mobile users when writing content
- Test the alert with different content lengths
- Verify the alert works with your site's color scheme

## Performance Considerations

- The alert uses minimal resources with optimized DOM operations
- Animations are hardware-accelerated using CSS transforms
- Sparkle effect is optimized for performance with proper cleanup
- No external dependencies to load
- Efficient event handling with proper listener cleanup to prevent memory leaks
- Complete DOM cleanup when dismissed - no leftover elements
- Event listeners attached to document for better performance (ESC key handling)
- Minimal CSS with no duplicate rules or conflicts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS/Android)

Note: The glassmorphic effect may appear differently in older browsers, but the functionality remains intact. 
