# Markdown FAQ Block

## Overview

The Markdown FAQ Block transforms a structured table in a Franklin document into an interactive FAQ component. It provides filtering, searching, and expandable Q&A sections with minimal configuration required from content authors.

## Content Structure

Content authors should structure their FAQ tables with the following columns:

1. **Category**: The main topic category (e.g., "Account", "Billing")
2. **Subcategory**: Optional subcategory for more organization (e.g., "Registration", "Password")
3. **Question**: The FAQ question (e.g., "How do I create an account?")
4. **Short Answer**: A brief, concise answer (shown first)
5. **Detailed Answer**: Complete, detailed response with steps, examples, etc.
6. **External Link**: Link to a detailed documentation page (displayed as "Read More")
7. **Related Resources/Tags**: Links, related questions, and tags (with #hashtag format)

### Example Table Structure

| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |
| :------- | :---------- | :------- | :----------- | :-------------- | :------------ | :--------------------- |
| Account | Registration | How do I create an account? | Visit our homepage and click "Sign Up" | To create an account: 1) Navigate to example.com, 2) Click the "Sign Up" button... | https://example.com/docs/create-account | - [Video Tutorial](https://example.com/video)<br>- Related: How do I reset my password?<br>- #account #setup |

### Metadata Table (Optional)

You can include an optional metadata table at the end of your document with information about the FAQ:

| metadata      |                       |
| :------------ | :-------------------- |
| title         | Product Support FAQ   |
| version       | 2.3                   |
| last_updated  | 2025-05-01            |

## Features

- **Interactive Q&A**: Expandable/collapsible question/answer sections with solid grey headers
- **Simple Display Toggle**: Uses display:block and display:none for showing/hiding content
- **Search Functionality**: Real-time filtering as users type across all content
- **Search Term Highlighting**: Visual highlighting of matched search terms
- **Category Filtering**: Filter by main category
- **Multiple External Documentation Links**: Support for multiple "Read More" links
- **Custom Link Text**: Specify custom text for each link
- **Smart Link Handling**: Support for both relative and absolute URLs
- **Link Type Indicators**: Visual distinction between internal and external links
- **Analytics Integration**: Built-in tracking for link clicks with Google Tag Manager support
- **Responsive Design**: Optimized for all device sizes
- **Metadata Display**: Shows title, version, and last updated date
- **Tag Support**: Special styling for hashtag terms
- **Full Accessibility**: ARIA attributes, keyboard navigation, and screen reader announcements

## DOM Structure

The block transforms the raw table structure into an interactive FAQ component with the following structure:

```html
<div class="block dfs">
  <!-- Header section with title and metadata -->
  <div class="faq-header">...</div>
  
  <!-- Controls for search and filtering -->
  <div class="faq-controls">...</div>
  
  <!-- FAQ content organized by category -->
  <div class="faq-container">
    <div class="faq-category-section" data-category="Account">
      <h3 class="faq-category-header">Account</h3>
      <h4 class="faq-subcategory-header">Registration</h4>
      
      <!-- Individual FAQ items -->
      <div class="faq-item" data-question="how do i create an account?">
        <div class="faq-question" role="button" aria-expanded="false" aria-controls="content-123">
          <span class="faq-question-text">How do I create an account?</span>
          <span class="faq-toggle-icon">...</span>
        </div>
        <div id="content-123" class="faq-content" role="region" aria-labelledby="faq-123">
          <div class="faq-short-answer">...</div>
          <div class="faq-detailed-answer">...</div>
          <div class="faq-external-links">...</div>
          <div class="faq-resources">...</div>
        </div>
      </div>
      <!-- More FAQ items... -->
    </div>
    <!-- More category sections... -->
  </div>
  
  <!-- Empty results message (hidden by default) -->
  <div class="faq-empty-message">No FAQs match your search criteria.</div>
</div>
```

## Implementation Details

The FAQ component uses a simple and efficient approach for showing and hiding content:

- **JavaScript Toggle**: Content visibility is controlled using `style.display = 'block'` and `style.display = 'none'`
- **Initial State**: All FAQ content panels are initially hidden with `style.display = 'none'`
- **Toggle Behavior**: Clicking a question toggles its content panel between visible and hidden states
- **CSS Support**: Specific styling is applied to visible content through attribute selectors
- **Accessibility**: ARIA attributes are updated to reflect the current state (expanded/collapsed)

## Configuration Options

The FAQ block includes several configuration options that can be adjusted in the JavaScript file:

```javascript
const CONFIG = {
  // Visual & UX
  ANIMATION_DURATION: 300,        // Duration of animations in milliseconds
  SEARCH_DEBOUNCE: 300,           // Delay before search executes after typing
  HIGHLIGHT_SEARCH_TERMS: true,   // Whether to highlight matching search terms
  
  // Content
  EMPTY_MESSAGE: 'No FAQs match your search criteria.',  // Message when no results found
  DEFAULT_FILTER_TEXT: 'All Categories',                 // Default category filter text
  DEFAULT_READ_MORE_TEXT: 'Read More',                  // Default text for links without custom text
  
  // Mobile
  MOBILE_BREAKPOINT: 768,         // Breakpoint for mobile-specific behavior
  
  // Debugging & Analytics
  DEBUG_MODE: false,              // Enable console logging for debugging
  TRACK_ANALYTICS: true           // Enable analytics tracking
};
```

## External Links

The External Links column supports several formats:

1. **Simple URL**: Just include the URL and it will be displayed as a "Read More" link
   ```
   https://example.com/docs/topic
   ```

2. **Custom Text with URL**: Format as "Text: URL" to customize the link text
   ```
   Complete Guide: https://example.com/complete-guide
   ```

3. **Multiple Links**: Include multiple links separated by line breaks or commas
   ```
   User Guide: https://example.com/user-guide
   Advanced Tutorial: https://example.com/advanced
   ```

4. **Relative Links**: Use relative URLs to link to other pages on your site
   ```
   /help/topic
   /documentation/advanced#section-3
   ```

## Accessibility Considerations

The FAQ block is built with accessibility as a priority:

- **ARIA Attributes**: Proper roles, states, and properties for expandable content
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Visible focus indicators and proper focus handling
- **Screen Reader Announcements**: Live region updates for search results
- **Semantic Structure**: Proper heading hierarchy and landmark regions
- **High Contrast**: Text meets WCAG AA contrast requirements
- **Link Descriptions**: External links include "opens in new tab" in aria-label
- **Touch-Friendly**: Enhanced touch targets on mobile devices

## Analytics Integration

The FAQ block includes built-in analytics tracking:

- **Link Click Tracking**: Automatically tracks when users click FAQ links
- **Google Tag Manager Support**: Works with GTM's dataLayer
- **Rich Data**: Captures question, category, link type, and URL
- **Custom Event**: Uses 'faq_link_click' event name

## Best Practices for Content Authors

For the best results, content authors should:

1. **Maintain Consistent Structure**: Follow the specified column order and format
2. **Keep Short Answers Brief**: Aim for 1-2 sentences that directly answer the question
3. **Use Formatting in Detailed Answers**: Lists, bold text, and other formatting for clarity
4. **Add Multiple External Links**: Provide contextual links with descriptive text
5. **Use Tags Consistently**: Apply consistent hashtags across related questions
6. **Group by Logical Categories**: Organize questions into intuitive categories and subcategories
7. **Include Metadata**: Add the metadata table at the end for versioning and documentation
