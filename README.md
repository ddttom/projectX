# ProjectX

**Author:** Tom Cranstoun  
**GitHub:** [@ddttom](https://github.com/ddttom)

## Overview

This project is built for Adobe Edge Delivery Services (EDS) with a focus on simplicity, performance, and modern web standards. The project intentionally avoids TypeScript and build-heavy frameworks to maintain simplicity and reduce build complexity.

## Development Requirements

- Modern JavaScript (ES modules) without TypeScript
- Pure CSS without preprocessors
- No build-heavy frameworks
- Focus on simplicity and performance
- Clear code organization and documentation
- Minimal dependencies and build steps

## Quick Start

### Development Server

Start the development server designed to improve AI assistant workflows when testing blocks and components:

```bash
npm run debug
```

The server will start on `http://localhost:3000` and provide:
- Local file serving with automatic proxy fallback for missing files
- Support for testing EDS blocks in isolation with immediate feedback
- Comprehensive MIME type support and clear error reporting
- CORS headers for cross-origin requests
- Enhanced logging to help AI assistants understand request flow and debug issues

### Testing Blocks

Create test files in your block directories:

```
blocks/your-block/
├── your-block.js
├── your-block.css
├── README.md
└── test.html
```

**Important**: Test files must use the exact same block structure as EDS to ensure compatibility between local testing and production deployment. Use `.block-name.block` class structure with proper data attributes.

Access your tests at: `http://localhost:3000/blocks/your-block/test.html`

## Project Structure

```
├── blocks/                 # EDS blocks and components
├── docs/                   # Documentation
│   ├── Server-README.md    # Development server documentation
│   ├── eds.txt            # EDS development guide
│   └── eds-appendix.txt   # EDS best practices
├── scripts/               # Core EDS scripts
├── styles/                # Global styles
├── server.js              # Development server
└── package.json           # Project configuration
```

## Available Scripts

- `npm run debug` - Start development server on port 3000
- `npm run lint` - Run ESLint and Stylelint
- `npm run lint:js` - Run ESLint on JavaScript files
- `npm run lint:css` - Run Stylelint on CSS files

## Development Guidelines

### Code Organization

- Use ES modules for all JavaScript code
- Follow consistent module patterns
- Maintain clear separation of concerns
- Document all blocks and components

### Block Development

Each block should include:
- `blockname.js` - Core functionality
- `blockname.css` - Block-specific styles
- `README.md` - Documentation and usage examples
- 'EXAMPLE.md' - a markdown example, ready to paste into Gdocs
- `test.html` - Development test file

### CSS Best Practices

- Use CSS variables for theming
- Follow mobile-first responsive design
- Use standard breakpoints (600px, 900px, 1200px)
- Never style container elements directly
- Namespace all class names with block name

### JavaScript Best Practices

- Use configuration constants at the top of files
- Implement proper error handling
- Follow async/await patterns
- Use ESLint disable comments for console statements
- Keep functions focused and modular

## Documentation

- [Development Server Guide](docs/Server-README.md) - Comprehensive server documentation
- [Block Debugging Guide](docs/debug.md) - Step-by-step debugging guide for AI assistants
- [Fast EDS Development Tutorial](docs/blog.md) - Complete tutorial with real-world examples
- [EDS Development Guide](docs/eds.md) - Complete EDS development reference
- [EDS Best Practices](docs/eds-appendix.md) - Advanced patterns and techniques

## Security and Performance

- No build process required, if components need build use a separate repo
- Zero dependencies for core functionality
- Optimized for Core Web Vitals
- Security through proper application hardening
- Minimal attack surface

## Contributing

When contributing to this project:

1. Follow the established development requirements
2. Maintain the focus on simplicity and performance
3. Document all new blocks and components
4. Test thoroughly using the development server
5. Test thoroughly on EDS
6. Ensure code passes linting requirements

## Notes

- Do not use placeholders in markdown documents
- All code should be production-ready and well-documented
- Focus on solving real problems with simple, effective solutions
