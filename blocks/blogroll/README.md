# Blogroll Block

The Blogroll block is a versatile component for displaying a list of blog posts, with support for both full and compact display modes.

## Usage

To use the Blogroll block, add it to your page with the following structure:

| Blogroll |
|----------|
| [filter terms] |

Filter terms are case sensitive by default, except for terms containing the word "guide" (which remain case insensitive for compatibility with older pages).

You can also use the format `path=value` to filter posts by a specific path. The filtering is partial, meaning it will match any part of the path (not just exact matches). If no posts are found matching the path, the system will automatically try to match the value against post titles instead.

Special case: Using `path=*` will filter posts to only show those in the current subdirectory.

### Examples:

| Blogroll |
|----------|
| path=/blogs/tech |

This will show only posts with "/blogs/tech" in their path. If none are found, it will show posts with "blogs/tech" in their titles.

| Blogroll |
|----------|
| path=/tutorials |

| Blogroll |
|----------|
| path=* |
| guide |

This will show posts with "/tutorials" in their path (or title if no path matches), as well as any posts containing "guide" (case-insensitive).

This will show only posts in the current subdirectory.

For a compact version, add the 'compact' class:

| Blogroll (compact) |
|--------------------|
| [filter terms] |

## Authoring

In Google Docs or Microsoft Word:
1. Create a table with one row and one column.
2. In the first cell, type "Blogroll" (or "Blogroll (compact)" for the compact version).
3. Optionally, add a second row with filter terms to limit displayed posts.

## Styling

The block uses CSS variables for easy customization:

- `--blogroll-font-family`: Font family for the blogroll (default: Arial, sans-serif)
- `--blogroll-max-width`: Maximum width of the blogroll container (default: 800px)
- `--blogroll-padding`: Padding around the blogroll content (default: 20px)
- `--blogroll-title-color`: Color of series titles (default: #333)
- `--blogroll-border-color`: Color of borders (default: #ddd)
- `--blogroll-link-color`: Color of post links (default: #0066cc)
- `--blogroll-date-color`: Color of post dates (default: #666)
- `--blogroll-text-color`: Color of post descriptions (default: #444)
- `--blogroll-panel-bg-color`: Background color of the compact panel (default: #f0f4f8)
- `--blogroll-panel-text-color`: Text color in the compact panel (default: #333)
- `--blogroll-icon-size`: Size of the compact mode icon (default: 40px)
- `--blogroll-icon-bg-color`: Background color of the compact mode icon (default: #007bff)
- `--blogroll-icon-color`: Color of the compact mode icon (default: white)
- `--blogroll-panel-width`: Width of the compact panel (default: 300px)
- `--blogroll-panel-header-border-color`: Border color of the compact panel header (default: #d0d9e1)
- `--blogroll-panel-link-color`: Link color in the compact panel (default: #0056b3)
- `--blogroll-panel-date-color`: Date color in the compact panel (default: #555)
- `--blogroll-entry-border-color`: Border color for individual entries (default: #e0e0e0)

## Behavior

- The block fetches blog post data from '/query-index.json'.
- Posts are grouped by series and sorted within each series.
- **Default Fallback**: When no configuration cell is present or detected, the component automatically applies `path=*` behavior, filtering posts to show only those in the current subdirectory.
- Filter terms are case sensitive by default, except for terms containing the word "guide" (which remain case insensitive for backward compatibility).
- Special path filtering using `path=value` format allows filtering by path, with fallback to title filtering if no matches are found.
  - Path filters take precedence over regular filter terms
  - Multiple path filters can be used together (posts matching any of them will be shown)
  - Path filtering is case-sensitive
  - Path filtering is partial (matches any part of the path, not just exact matches)
  - For example, `path=blogs/ddt/d` would match `/blogs/ddt/developer-guide-part-1`
  - Special case: `path=*` will filter posts to only show those in the current subdirectory
- In compact mode, an icon is displayed that opens a side panel when clicked.
- The compact panel includes a "Show All Posts" toggle.
- Each blog post entry now has a thin border for improved visual separation.

## Accessibility

- The compact mode icon and panel are keyboard accessible.
- ARIA labels are used for better screen reader support.
- The panel can be closed using the Escape key.

## Dependencies

- This block relies on the presence of a '/query-index.json' file for blog post data.

## Recent Changes

- **Added automatic fallback mechanism**: When no configuration cell is present or detected, the component now automatically applies `path=*` behavior as the default, ensuring proper functionality with wildcard path matching.
- Added path-specific filtering with `path=value` format, with automatic fallback to title filtering if no matches are found.
- Added special case `path=*` to filter posts to only show those in the current subdirectory.
- Added case sensitivity for filter terms, while maintaining case insensitivity for terms containing "guide" for backward compatibility.
- Added a thin border around each blog post entry for improved visual separation.
- Implemented the `blogroll-entry` class for consistent styling across full and compact modes.
- Enhanced the README with more detailed styling information and recent changes.

## Suggestions for Improvement

1. Implement lazy loading for large numbers of posts to improve performance.
2. Add sorting options (e.g., by date, alphabetically) for user customization.
3. Enhance the filtering mechanism to allow for more complex queries.
4. Implement a search functionality within the blogroll.
5. Add options for different layout styles (e.g., grid view, list view).
6. Implement pagination for better handling of large numbers of posts.
7. Add social sharing buttons for individual blog posts.
8. Implement a "Related Posts" feature based on tags or categories.
9. Add an option to display post thumbnails for a more visual representation.
10. Implement a caching mechanism to improve load times for frequently accessed data.
