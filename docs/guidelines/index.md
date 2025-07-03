# ProjectX Framework Guidelines Documentation

## Overview

This documentation collection provides comprehensive guidelines for developing with ProjectX Framework - a privacy-first JavaScript web framework designed as a drop-in replacement for Adobe Edge Delivery Services (EDS). These guidelines ensure consistent development practices, maintain code quality, and support the framework's core principles of privacy protection, performance optimization, and developer experience enhancement.

ProjectX Framework delivers 80% performance improvement over Adobe EDS while maintaining 100% backward compatibility and eliminating all Real User Monitoring (RUM) functionality for complete user privacy protection.

## Documentation Structure

### Core Architecture & Implementation

#### [Technology Stack](./tech-stack.md)
Comprehensive overview of ProjectX Framework's technology choices, architecture decisions, and implementation patterns including the Primary-Clone Architecture, privacy-first design principles, and performance optimization strategies.

#### [Application Flow](./app-flow.md)
Detailed documentation of ProjectX's application initialization, content processing pipeline, privacy-first data flow, and enhanced block processing system with comprehensive error handling and recovery mechanisms.

#### [Backend Structure](./backend-structure.md)
Complete guide to ProjectX's serverless architecture, local development server implementation, content management integration, and privacy-compliant API design with zero external dependencies.

### Development Guidelines

#### [Frontend Guidelines](./frontend-guidelines.md)
Coding standards and best practices for ProjectX frontend development including HTML semantic structure, CSS architecture, JavaScript patterns, performance optimization, and accessibility requirements.

#### [Security Checklist](./security-checklist.md)
Comprehensive security practices specific to ProjectX's privacy-first architecture, including RUM removal benefits, Content Security Policy configuration, input validation, and GDPR compliance verification.

### Product Documentation

#### [Product Requirements Document](./prd.md)
Executive summary of ProjectX Framework's objectives, target market analysis, technical specifications, user stories, success metrics, and implementation roadmap for privacy-first web development.

## Quick Navigation by Topic

### Privacy & Security
- **Privacy Protection**: [Security Checklist](./security-checklist.md#privacy-protection-security) - Complete RUM removal and zero data collection
- **GDPR Compliance**: [Security Checklist](./security-checklist.md#privacy-compliance) - Privacy-first design verification
- **Content Security Policy**: [Security Checklist](./security-checklist.md#content-security-policy-csp) - ProjectX-specific CSP configuration
- **Input Validation**: [Security Checklist](./security-checklist.md#input-validation-and-sanitization) - Secure form and content processing

### Architecture & Performance
- **Primary-Clone Architecture**: [Technology Stack](./tech-stack.md#framework-architecture) - Core architectural pattern explanation
- **Bundle Optimization**: [Technology Stack](./tech-stack.md#performance-optimisation) - 80% size reduction details
- **Application Initialization**: [Application Flow](./app-flow.md#application-initialization-flow) - Framework startup sequence
- **Performance Monitoring**: [Application Flow](./app-flow.md#privacy-first-data-flow) - Local-only metrics collection

### Development Practices
- **JavaScript Guidelines**: [Frontend Guidelines](./frontend-guidelines.md#javascript-guidelines) - ES2021 patterns and best practices
- **CSS Architecture**: [Frontend Guidelines](./frontend-guidelines.md#css-guidelines) - Modern CSS with custom properties
- **Block Development**: [Frontend Guidelines](./frontend-guidelines.md#projectx-specific-guidelines) - ProjectX block creation patterns
- **Local Development**: [Backend Structure](./backend-structure.md#projectx-development-server) - Zero-dependency server setup

### Content Management
- **Google Docs Integration**: [Backend Structure](./backend-structure.md#content-management-system) - Document-based authoring
- **Block Processing**: [Application Flow](./app-flow.md#enhanced-block-processing) - Advanced pattern detection
- **Content Decoration**: [Application Flow](./app-flow.md#content-decoration-flow) - Semantic HTML generation
- **Image Optimization**: [Application Flow](./app-flow.md#content-decoration-flow) - Responsive image processing

## Key Features & Benefits

### Privacy-First Design
- **Zero Data Collection**: Complete elimination of Real User Monitoring (RUM)
- **GDPR Compliance**: Privacy-first architecture meets regulatory requirements
- **Local-Only Monitoring**: Performance tracking without external transmission
- **Deprecation Warnings**: Safe migration from tracking-based implementations

### Performance Optimization
- **80% Bundle Reduction**: From ~270KB (EDS) to ~54KB (ProjectX)
- **Enhanced Auto-blocking**: Advanced content pattern detection
- **Three-Phase Loading**: Eager, Lazy, and Delayed resource strategies
- **Core Web Vitals**: Optimized for excellent performance metrics

### Developer Experience
- **100% EDS Compatibility**: Seamless migration from Adobe Edge Delivery Services
- **Zero Dependencies**: Local development server with comprehensive features
- **Modern JavaScript**: ES2021 features without TypeScript complexity
- **Minimal Build Process**: ESLint and Stylelint for quality assurance

### Architecture Innovation
- **Primary-Clone Pattern**: `window.projectX` (authoritative) → `window.hlx` (proxy)
- **Composition Over Duplication**: Efficient code organization and maintenance
- **Environment-Aware Configuration**: Intelligent script detection and path resolution
- **Progressive Enhancement**: Functionality without JavaScript dependency

## Getting Started

### For Developers
1. **Read**: [Technology Stack](./tech-stack.md) for architecture overview
2. **Follow**: [Frontend Guidelines](./frontend-guidelines.md) for coding standards
3. **Implement**: [Application Flow](./app-flow.md) patterns for functionality
4. **Secure**: [Security Checklist](./security-checklist.md) for privacy compliance

### For Content Authors
1. **Understand**: [Backend Structure](./backend-structure.md#content-management-system) for authoring workflow
2. **Create**: Google Docs with table-based block structures
3. **Configure**: Block variations through table syntax
4. **Publish**: Automatic transformation to optimized web content

### For Project Managers
1. **Review**: [Product Requirements Document](./prd.md) for project scope
2. **Plan**: Implementation roadmap and success metrics
3. **Assess**: Privacy compliance and regulatory requirements
4. **Monitor**: Performance improvements and user experience gains

## Cross-References & Related Topics

### Migration from Adobe EDS
- **Compatibility Layer**: [Technology Stack](./tech-stack.md#projectx-specific-architecture) - Proxy system implementation
- **Migration Support**: [Application Flow](./app-flow.md#migration-and-compatibility) - Seamless transition strategies
- **Legacy Block Support**: [Application Flow](./app-flow.md#migration-and-compatibility) - Existing block compatibility

### Performance Optimization
- **Bundle Analysis**: [Technology Stack](./tech-stack.md#performance-optimisation) - Size reduction breakdown
- **Loading Strategies**: [Application Flow](./app-flow.md#performance-optimization-flow) - Resource prioritization
- **Image Processing**: [Backend Structure](./backend-structure.md#projectx-specific-backend-features) - Automatic optimization

### Security Implementation
- **Privacy Protection**: [Security Checklist](./security-checklist.md#privacy-protection-security) - RUM removal benefits
- **Input Sanitization**: [Frontend Guidelines](./frontend-guidelines.md#javascript-guidelines) - Secure coding practices
- **Error Handling**: [Application Flow](./app-flow.md#error-handling-and-recovery) - Graceful degradation

## Document Maintenance

### Last Updated
- **Technology Stack**: Updated for ProjectX v1.3.0 architecture
- **Frontend Guidelines**: Comprehensive ProjectX-specific patterns
- **Backend Structure**: Zero-dependency server implementation
- **Application Flow**: Primary-Clone Architecture documentation
- **Security Checklist**: Privacy-first security practices
- **Product Requirements**: Current implementation roadmap

### Version Compatibility
All documentation reflects **ProjectX Framework v1.3.0** with:
- Primary-Clone Architecture implementation
- Complete RUM removal and privacy protection
- 80% performance improvement over Adobe EDS
- 100% backward compatibility with existing EDS blocks
- Zero-dependency local development server

### Contributing Guidelines
When updating documentation:
1. **Maintain Consistency**: Follow established patterns and terminology
2. **Update Cross-References**: Ensure all internal links remain valid
3. **Verify Code Examples**: Test all provided code snippets
4. **Document Changes**: Update relevant sections across related documents
5. **Privacy Focus**: Ensure all examples maintain privacy-first principles

## Support & Resources

### Technical Support
- **Architecture Questions**: Reference [Technology Stack](./tech-stack.md) and [Application Flow](./app-flow.md)
- **Development Issues**: Follow [Frontend Guidelines](./frontend-guidelines.md) and [Backend Structure](./backend-structure.md)
- **Security Concerns**: Consult [Security Checklist](./security-checklist.md) for best practices

### Community Resources
- **GitHub Repository**: [ProjectX Framework](https://github.com/ddttom/projectX)
- **Issue Tracking**: Report bugs and feature requests
- **Discussions**: Community support and knowledge sharing
- **Contributions**: Guidelines for code and documentation contributions

### Additional Documentation
- **API Reference**: Detailed method and property documentation
- **Block Library**: Comprehensive block examples and patterns
- **Migration Guide**: Step-by-step EDS to ProjectX transition
- **Performance Guide**: Advanced optimization techniques

## Conclusion

This documentation collection provides everything needed to successfully develop with ProjectX Framework. The guidelines ensure consistent implementation of privacy-first, high-performance web applications while maintaining the familiar content authoring experience that makes Adobe EDS popular among content creators and developers.

ProjectX Framework represents the future of privacy-conscious web development, delivering exceptional performance without compromising user privacy or developer experience. These guidelines support that mission by providing clear, comprehensive, and actionable documentation for all aspects of the framework.

**Key Takeaways**:
- **Privacy-First**: Zero data collection with complete RUM removal
- **Performance-Optimized**: 80% bundle size reduction with maintained functionality
- **Developer-Friendly**: Modern JavaScript with minimal dependencies
- **Migration-Safe**: 100% EDS compatibility for risk-free adoption
- **Future-Proof**: Sustainable architecture for long-term maintenance

Start with the [Technology Stack](./tech-stack.md) for a comprehensive overview, then dive into specific areas based on your role and requirements. Each document builds upon the others to provide a complete understanding of ProjectX Framework's capabilities and implementation patterns.