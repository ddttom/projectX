# Code Expander Block

The Code Expander block enhances all `<pre><code>` elements on a page with syntax highlighting, copy functionality, and interactive features. It automatically detects the programming language and applies appropriate styling.

## Features

- Automatic language detection for syntax highlighting
- Copy to clipboard functionality
- Toggle between raw and formatted code views
- Download code as a file with appropriate extension
- Expand/collapse for long code blocks
- Keyboard navigation support
- Accessibility features including ARIA attributes and keyboard controls
- Info tooltip with usage instructions
- "Text" variation to display all code as plain text without syntax highlighting

## Usage

Simply add an empty code-expander block anywhere on your page:

| code-expander |
| ------------- |

The block will automatically find and enhance all `<pre><code>` elements on the page.

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Create a table with one cell containing "code-expander"
2. Add your code snippets elsewhere in the document using the standard code formatting
3. The block will automatically enhance all code blocks on the page

## Styling

The block uses CSS variables for easy customization:

```
:root {
  --code-expander-button-bg: #4a90e2;
  --code-expander-button-text: #ffffff;
  --code-expander-button-border: #3a7bc8;
  --code-expander-button-hover-bg: #3a7bc8;
  --code-expander-code-bg: #f8f8f8;
  --code-expander-code-text: #333;
  --code-expander-button-focus-outline: #4d90fe;
  --code-expander-pre-border-color: #0a0909;
  --code-expander-pre-border-width: 2px;
  --code-expander-line-number-color: #888;
  --code-expander-markdown-link-color: #0366d6;
  --code-expander-font-size-small: 0.8rem;
  --code-expander-font-size-normal: 0.9rem;
  --code-expander-font-size-large: 1rem;
}
```

## Behavior

The Code Expander block:

1. Scans the entire page for `<pre><code>` elements
2. Detects the programming language based on code content
3. Applies syntax highlighting based on the detected language
4. Adds interactive controls:
   - Copy button: Copies code to clipboard
   - View Raw/Formatted toggle: Switches between raw text and formatted view
   - Download button: Saves code as a file with appropriate extension
   - Expand/Collapse (for long code blocks): Toggles between collapsed and expanded view
   - Info button: Shows tooltip with usage instructions

## Accessibility

- All buttons have appropriate ARIA labels
- Keyboard navigation support for scrolling through code
- Focus states for all interactive elements
- Screen reader friendly structure
- Proper color contrast for syntax highlighting
- ARIA attributes for tooltips and modals

## Performance

- Lazy initialization of interactive elements
- Efficient DOM manipulation
- No external dependencies
- Minimal memory footprint
- Optimized event handling

## Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Fallbacks for older browsers that don't support clipboard API
- Responsive design works on mobile and desktop devices

## Troubleshooting

- **Code not being enhanced**: Ensure your code is wrapped in `<pre><code>` tags
- **Language detection issues**: Add a comment at the top of your code to help with language detection
- **Copy button not working**: Some browsers restrict clipboard access; check browser permissions
- **Styling conflicts**: Check for CSS that might be overriding the code-expander styles
- **Code not displaying correctly**: Ensure code is properly escaped in the HTML

## Variations

### Text Variation

Add the `text` class to the code-expander block to force all code blocks to be displayed as plain text:

| code-expander text |
| ------------------ |

This variation:
- Skips language detection
- Displays all code as plain text with a "TEXT" label
- Disables syntax highlighting
- Useful for displaying content that should not be colorized or when you want to override automatic language detection

You can also customize the block's appearance using CSS variables.
