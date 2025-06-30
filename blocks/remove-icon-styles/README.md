# Remove Icon Styles Block

## Overview

This block is designed to override the default icon styling in Edge Delivery Services (EDS) without modifying core files. It uses CSS specificity to reset the default styling constraints placed on elements with the `.icon` class.

## Content Structure

This is a utility block that doesn't require specific content structure in EDS Documents. Simply add the block anywhere in your document to activate the icon style overrides globally.

### Example Table Structure

| Remove-Icon-Styles |


## Purpose

The default EDS styling for icons (defined in styles.css) constrains icons to a fixed size of 24x24 pixels:

```css
.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
}

.icon img {
  height: 100%;
  width: 100%;
}
```

This block overrides these constraints, allowing icons to be sized according to their natural dimensions or through other styling mechanisms.

## Use Cases

- When you need icons of varying sizes on your page
- When you want to use CSS to control icon sizes differently in various contexts
- When you're working with SVG icons that have their own sizing attributes
- When you want to apply custom styling to icons without being constrained by the default EDS styles

## Implementation Notes

This block:
1. Doesn't modify core files (follows EDS best practices)
2. Uses CSS specificity to override default styles
3. Makes itself invisible in the DOM to avoid taking up space
4. Applies its styles globally to all icons on the page


## Accessibility Considerations

When removing size constraints from icons, ensure that icons remain at appropriate sizes for usability and visibility. Icons that are too small can be difficult to see or interact with.

## Performance Impact

This block has minimal performance impact as it only adds a small CSS file and doesn't perform complex DOM manipulations.
