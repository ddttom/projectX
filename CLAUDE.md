# ProjectX Development Guide

**Author:** Tom Cranstoun  
**GitHub:** [@ddttom](https://github.com/ddttom)  
**Repository:** https://github.com/ddttom/projectX

## Overview

ProjectX is an Adobe Edge Delivery Services (EDS) project focused on simplicity, performance, and modern web standards. This guide provides context for AI assistants working with the codebase.

## Project Philosophy

- Modern JavaScript (ES modules) without TypeScript
- Pure CSS without preprocessors
- No build-heavy frameworks
- Focus on simplicity and performance
- Clear code organization and documentation
- Minimal dependencies and build steps

## Development Environment

### Local Development Server

The project includes a custom development server (`server.js`) that:
- Serves local files with priority
- Provides comprehensive MIME type support
- Includes enhanced logging for debugging
- Supports CORS headers for cross-origin requests

Start with: `npm run debug`

### Block Development

Each EDS block follows a consistent structure:
```
blocks/block-name/
├── block-name.js     # Core functionality
├── block-name.css    # Block-specific styles
├── README.md         # Documentation
├── EXAMPLE.md        # Markdown example for Google Docs
└── test.html         # Development test file
```

### CSS Best Practices

- Use CSS variables for theming
- Follow mobile-first responsive design
- Standard breakpoints: 600px, 900px, 1200px
- Namespace all classes with block name
- Never style container elements directly

### JavaScript Patterns

- Configuration constants at file top
- Proper error handling for async functions
- ESLint disable comments for console statements
- Modular, focused functions
- ES module imports/exports

## AI Development Context

When working with this codebase:

1. **Maintain Simplicity**: Avoid adding build complexity
2. **Follow EDS Patterns**: Use established block structures
3. **Test Locally**: Use the development server for testing
4. **Document Changes**: Update README files for new blocks
5. **Performance First**: Optimize for Core Web Vitals

## Key Files

- `package.json` - Project configuration
- `server.js` - Development server
- `README.md` - Main documentation
- `docs/` - Comprehensive guides
- `blocks/` - EDS block components
- `styles/` - Global styles

## Development Workflow

1. Create/modify blocks in `blocks/` directory
2. Test using local development server
3. Document in README.md and EXAMPLE.md
4. Ensure EDS compatibility
5. Commit with clear messages

This project prioritizes developer experience while maintaining EDS best practices and performance standards.