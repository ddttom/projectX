Okay, here is the content of the `dev-README.md` file:

```markdown
# Dynamic Presentation System (DPS) Block - Developer Documentation

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Architecture Overview

The DPS block has been completely redesigned with a focus on simplicity, reliability, and maintainability. The new architecture follows a clean separation of concerns:

1.  **Content Parsing**: Extracts structured data from Google Doc table rows
2.  **Illustration Processing**: Identifies and processes different content types (images, iframes, icons, etc.)
3.  **Slide Building**: Constructs slide DOM elements with all necessary content
4.  **Navigation System**: Handles slide and sequence navigation with keyboard and button controls
5.  **Presenter Notes**: Provides a flexible presenter notes system
6.  **Timer Control**: Manages presentation timing with visual feedback

## Key Improvements in the New Architecture

### 1. Simplified Content Extraction
- Direct parsing of cell content without complex nested functions
- Clearer extraction of bullet points, illustrations, and notes
- Linear processing flow for better debugging and maintenance

### 2. Improved Illustration Handling
- Type-specific content extraction rather than generic pattern matching
- Clear priority order for content processing
- Selective deduplication to prevent duplicate content without overprocessing
- Defense against HTML quirks and common user errors

### 3. Container-Based Sequence Navigation
- Each sequence item is self-contained in its own container
- Direct display:none/block toggling instead of visibility manipulation
- Clear visual labeling of sequence position and content type
- Consistent state management during navigation

### 4. CSS Integration
- CSS is now embedded in the JavaScript for better packaging
- Simplified styling with focus on reliability and consistency
- Improved responsive design for mobile devices
- Better print mode for handouts

## Content Processing Details

### Parsing Process

1.  **Row Extraction**: Extract structured rows from the Google Doc table
2.  **Configuration Parsing**: Get title, subtitle, and timer duration from the first row
3.  **Slide Content Extraction**:
    * Title and intro text from columns 1-2
    * Bullet points from column 3
    * Illustrations from column 4
    * Presenter notes from column 5

### Illustration Processing

The new illustration processing follows a type-specific approach:

1.  **Pattern-Based Detection**:
    * Simple "iframe URL" format
    * "iframe <a href...>" format

2.  **Element-Based Detection**:
    * iframe elements
    * icon spans
    * direct images
    * picture elements
    * SVG elements
    * anchor links to images/content

3.  **Deduplication Logic**:
    * Uses a Set-based approach to prevent duplicate content
    * Generates unique identifiers based on content type
    * Preserves original item order after deduplication
    * Lightweight safety net that prevents common issues

### Sequence Building

Sequences are now structured as containers with clear separation:

```html
<div class="image-sequence">
  <div class="sequence-item-container active" data-sequence-id="0">
    <div class="sequence-item-label">Image 1/3</div>
    <img src="..." alt="..." class="sequence-image active">
  </div>
  <div class="sequence-item-container" data-sequence-id="1">
    <div class="sequence-item-label">Icon 2/3</div>
    <img src="/icons/..." alt="..." class="sequence-image icon-image">
  </div>
  <div class="sequence-item-container" data-sequence-id="2">
    <div class="sequence-item-label">Iframe 3/3</div>
    <div class="sequence-image iframe-container">
      <iframe src="..."></iframe>
    </div>
  </div>
</div>
```

This structure provides several advantages:
- Clear separation between sequence items
- Simple show/hide logic with CSS display property
- Consistent labeling for all content types
- Proper nesting for complex content like iframes

## Navigation System

The navigation system now uses a simpler, more direct approach:

1.  **Slide Navigation**: Direct toggling of slide display with consistent state updates
2.  **Sequence Navigation**: Container-based navigation with clear boundaries
3.  **State Management**: Maintains a current slide index and sequence index for clear state tracking

### Navigation Flow

1.  When navigating forward:
    * Check if current slide has a sequence with more items
    * If yes, advance to the next sequence item
    * If no, advance to the next slide

2.  When navigating backward:
    * Check if current slide has a sequence and is past the first item
    * If yes, go back to the previous sequence item
    * If no, go back to the previous slide

This approach eliminates complex state calculations and provides a more intuitive navigation experience.

## Timer Implementation

The timer system has been simplified for better reliability:

1.  **Timer Initialization**: Timer automatically starts when moving past the first slide
2.  **Timer Controls**: Space key toggles timer pause/resume
3.  **Visual Feedback**: Time warning flashes when 2 minutes remain
4.  **Timer Display**: MM:SS format with clear visual styling

## Presenter Notes System

The presenter notes system has been enhanced:

1.  **Basic Mode**: Shows notes in bottom left corner (31.25% width)
2.  **Expanded Mode**: Enlarged view (50% width) with 'P' key
3.  **Presenter Mode**: Full presenter mode with slide content hidden
4.  **Resize Handling**: Drag-based resizing for flexible note display
5.  **Content Synchronization**: Notes update automatically with slide changes

## Implementation Notes

### Code Structure

The codebase is now organized into clear, focused sections:

1.  **Core Functions and Setup** (0-600 lines)
    * Configuration and state variables
    * Main entry point
    * Basic utility functions
    * DOM creation helpers
    * Content parsing

2.  **Illustration Processing and Slide Building** (600-1200 lines)
    * Illustration extraction
    * Content type detection
    * Slide building
    * Sequence HTML creation

3.  **Navigation and Timer Functions** (1200-1800 lines)
    * Slide navigation
    * Sequence navigation
    * Timer controls
    * Presenter notes functions
    * Keyboard handlers

4.  **CSS Styles** (1800-2400 lines)
    * Embedded CSS for consistent styling
    * Responsive design rules
    * Print formatting

### Deduplication Logic

The deduplication system has been designed to be lightweight but effective:

1.  **Why Deduplication is Necessary**:
    * Defense against HTML quirks in source content
    * Protection against common user errors (duplicate content)
    * Stability for edge cases with nested structures
    * Better reliability with different content sources

2.  **How Deduplication Works**:
    * Generates unique identifiers based on content type and attributes
    * Uses a Set-based approach for efficient duplicate detection
    * Preserves original item order in the final output
    * Minimal performance impact as a safety mechanism

3.  **Content Identifiers**:
    * iframe items: URL as identifier
    * Icon items: "icon-{iconName}" as identifier
    * Other items: First 100 characters of content as identifier

## Browser Compatibility

The revised implementation has been tested in:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Improvements

Potential areas for future enhancement:

1.  **Performance Optimization**:
    * Lazy loading for sequence items
    * More efficient DOM updates for very large presentations

2.  **Enhanced Feature Set**:
    * Support for audio and video content
    * Interactive polls or questions
    * Advanced presenter tools (timer controls, next slide preview)

3.  **Additional Content Types**:
    * MathML support
    * Data visualization components
    * Annotation tools

## Troubleshooting

Common issues and solutions:

1.  **Slide Display Issues**:
    * Check for proper table structure in the source document
    * Ensure proper nesting of HTML elements in content cells

2.  **Navigation Problems**:
    * Validate slide index is within bounds
    * Check navigation event handling

3.  **Timer Issues**:
    * Verify timer initialization in showSlide function
    * Check timer interval handling

4.  **Content Parsing Problems**:
    * Review content extraction in parseRows function
    * Check illustration extraction logic for supported formats

```