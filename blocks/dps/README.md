# Dynamic Presentation System (DPS) Block

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Features
- Full-screen presentation mode
- Keyboard-based navigation
- Multiple images per slide with arrow key navigation
- Image sequence support with improved handling
- Full viewport height image support
- Presenter notes with toggle functionality
- Dedicated presenter mode for tablet viewing
- Timer with warning system
- Responsive design
- Print-friendly handout mode
- Flexible iframe support with smart URL handling
- Improved icon handling with SVG support
- Simplified iframe format for easier authoring
- Automatic Q&A slide with interactive link support

## Content Structure
| Title | Subtitle | Timer (minutes) | Content | Presenter Notes |
| :---- | :------- | :-------------- | :------ | :-------------- |
| Presentation Title | Optional subtitle | 25 | Main content | Presenter notes |
| Slide Title | Introduction text | | Bullet points | Notes for this slide |
| | | | Multiple images | Additional guidance |
| | | | SVG illustrations | Key points to cover |
| | | | iframes | Additional notes |

## Navigation
- **Arrow Keys**: Navigate between slides and within image sequences
- **Space**: Toggle timer pause/play
- **Escape**: Toggle navigation bar
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes
- **P**: Toggle enlarged presenter notes (shows only notes content)

### Image Sequence Navigation
- Use left/right arrow keys to navigate through multiple images
- Images maintain aspect ratio and use full viewport height
- Simplified transitions between images with direct display toggling
- Improved sequence container structure prevents duplicate displays
- Enhanced visibility management with display:block/none control
- Clean boundary handling at sequence beginning/end
- Reliable state management with consistent containers

### Container-Based Navigation System
- Navigation operates at the container level for improved reliability
- Each sequence item is contained in its own `.sequence-item-container`
- Containers maintain proper state for all child elements during navigation


### Icon Support
The fourth column supports icon spans with specific class names:

```html
<span class="icon icon-methods"></span>
```

Icons are automatically transformed into proper image references:
- Extracts the icon name from the class (e.g., "methods" from "icon-methods")
- Creates an image tag pointing to `/icons/[icon-name].svg`
- Sets proper alt text as "[icon-name] Illustration"
- Preserves sequence order when mixed with other content types

### Mixed Content Support
The DPS block handles various content types in any order:
- Icons, images, iframes, and SVGs in any combination
- Preserves the exact order from your original document
- Proper navigation between all content types

### iframe Support
The fourth column supports embedded iframes with flexible URL handling:

#### Supported URL Formats
1. **Simplified author-friendly format (recommended):**
```
iframe https://example.com/embed
```
This is the easiest way for authors to add iframes - just type "iframe" followed by the URL.

2. **iframe with anchor tag format:**
```
iframe <a href="https://example.com/embed">Link text</a>
```
This combines the simplified iframe keyword with Franklin's link format.

3. Standard iframe format:
```html
<iframe src="https://example.com/embed"></iframe>
```

4. Franklin link format (automatically converted):
```html
<a href="https://example.com/embed">Link</a>
```

### Presenter Notes
- Appears in bottom left third of viewport (31.25% width) by default
- Can be enlarged to 50% width with 'P' key while staying pinned to the left
- Always stays pinned to the left of the viewport
- Font size increases by 50% when enlarged for better readability
- When using the note icon, the notes are shown with slide title and bullet points

## Image Handling

### Supported Image Formats
The fourth column supports various image formats and sources:

1. **Picture Elements**
```html
<picture>
  <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
  <source type="image/webp" srcset="/path/to/image.webp">
  <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
  <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
</picture>
```

2. **Direct Images**
```html
<img src="/path/to/image.jpg" alt="Description">
```

3. **Direct Image URLs**
```
/path/to/image.jpg
```

4. **URLs in Anchor Tags (Franklin Format)**
```html
<a href="https://example.com/path/to/image.jpg">https://example.com/path/to/image.jpg</a>
```

5. **SVG Content**
```html
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

6. **Icon Spans**
```html
<span class="icon icon-methods"></span>
```

## Implementation

### Files

- `dps.js` - JavaScript implementation (includes embedded CSS)
- `README.md` - Documentation (this file)

### Content Structure

Content authors should structure their content as follows:

```
| DPS                |                       |            |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Presentation Title | Presentation Subtitle | 25 (timer) |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or Icon(s)     | Presenter Notes 1   |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | iframe youtube.com/xyz  | Presenter Notes 2   |
```

#### Column Definitions

1. **First column**: Slide titles
2. **Second column**: Slide introduction text or subtitle
3. **Third column**: Bullet points and plain text
   - Use document list formatting for bullet points
   - Plain text will be displayed without bullets
   - Line breaks in plain text are preserved
   - HTML formatting (like `<code>` and `<strong>`) is supported
4. **Fourth column**: Images, icons, SVG, or iframes for illustrations
   - Can contain multiple items that will be shown in sequence
   - Images use full viewport height while maintaining aspect ratio
   - Icons use the format `<span class="icon icon-name"></span>`
   - iframes use the format `iframe URL` (simplified format)
   - Navigate between images using arrow keys
   - When reaching the last item, right arrow advances to next slide
   - When on first item, left arrow goes to previous slide
5. **Fifth column**: Presenter notes
   - Private notes visible only to the presenter
   - Toggle visibility with + and - keys
   - Notes state (hidden/visible) persists across slides
   - Appears in bottom left quarter of viewport
   - Automatically updates when changing slides
   - 'P' key shows only notes content
   - Note icon shows notes with slide title and bullet points

## Usage Guide for Authors

1. Create a table in your Google Doc
2. First cell must contain "DPS"
3. Second row contains configuration:
   - Presentation title
   - Subtitle
   - Timer duration in minutes (default: 25)
4. Each subsequent row represents a slide:
   - Title (required)
   - Introduction text (optional)
   - Bullet points and plain text (use document's list formatting for bullets)
   - Icon spans, images, SVGs, or iframes (optional)
   - Presenter notes (optional)
5. For icon spans, use the format `<span class="icon icon-name"></span>`
   - Make sure the corresponding SVG file exists in the /icons/ directory
   - The icon name must match the SVG filename (without the .svg extension)
6. For iframes, use the format `iframe URL`
   - Simply type the word "iframe" followed by a space and then the URL
   - This is the easiest way to add embedded content to your slides
   - You can also use `iframe <a href="URL">Link text</a>` format

## Author-Friendly Formats

To simplify the authoring experience, DPS provides these easy-to-use formats:

### Simplified iframe
```
iframe https://example.com/embed
```
Just type "iframe" followed by the URL - no HTML tags needed!

### Icon Spans
```html
<span class="icon icon-methods"></span>
```
Use a simple span with the correct classes to reference SVG icons.

### Plain URLs
```
https://example.com/image.jpg
```
For images, you can simply paste the URL directly.

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Q&A Slide
The DPS block automatically adds a "Questions & Answers" slide at the end of every presentation. This slide features:

- A prominent "Q&A" title
- A subtitle with an optional contact link
- A circular question mark icon
- A "Thank You" message

### Interactive Link from Presentation Subtitle
The Q&A slide can display a "Contact Us" link that comes from the presentation subtitle:

- If the presentation subtitle (in the first row) contains a hyphen (" - ") followed by a URL, that URL will be used as a link in the Q&A slide
- Example: If your presentation subtitle is "Company Overview - https://example.com/contact"
  - The Q&A slide will show "Your feedback and questions are valuable - Read more about the topic at https://example.com/contact"
  - The full text "Read more about the topic at https://example.com/contact" will be a clickable link
  - The link opens in a new tab
  - This ensures the URL is visible even in printed handouts where links can't be clicked

This feature makes it easy to add contact information or references to your presentation without requiring HTML knowledge.

## Recent Improvements

The DPS Block has been completely redesigned with several significant improvements:

1. **Simplified Architecture**:
   - Completely restructured code for simplicity and reliability
   - Reduced complexity by eliminating unnecessary recursion and nested processing
   - Clearly separated concerns between parsing, building, and navigation

2. **Reliable Illustration Handling**:
   - Simplified approach to finding and processing illustrations
   - Used direct element querying instead of complex pattern matching

3. **Better Sequence Navigation**:
   - Restructured sequence containers to eliminate visibility issues
   - Simplified active/inactive state management
   - Used display:none/block instead of visibility for more reliable transitions
   - Maintained consistent sequence indexing

4. **Improved Timer Functionality**:
   - Simplified timer code for better reliability
   - Added clear visual feedback for time warnings

5. **Responsive Design**:
   - Improved mobile layout with grid restructuring
   - Better scaling of images and containers
   - Presenter notes work well on all screen sizes

6. **Cleaner CSS**:
   - CSS is now embedded in the JS file for better consistency
   - Simplified styling with better organization
   - Improved print mode for handouts

7. **Removed Sequence Item Labels**:
   - Eliminated the visual overlay that displayed item type and position
   - Cleaner visual presentation without distracting labels
   - Maintained all sequence navigation functionality