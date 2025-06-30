# bio block javascript

The `decorate` function takes a `block` parameter and performs the following steps:

## Processing Logic

If the bio block doesn't have the class 'hide-author', the function performs both image link processing and author name extraction:

### Image Link Processing

1. **Image Link Detection**: The function checks if the first cell of the bio block contains a link to an image file.

2. **Image Link Conversion**: If a link pointing to an image file (.jpg, .jpeg, .png, .gif, .webp, .svg) is found, it automatically converts the link into an actual `<img>` element, using the link's text content as the image's `alt` attribute.

### Author Name Processing

1. It searches for an `<img>` element within an element that has the class `.bio.block`.

2. If the `<img>` element is found and it has a non-empty `alt` attribute, the function extracts the author name from the `alt` attribute.

3. If the author name is not found in the `alt` attribute or if the `<img>` element doesn't exist, the function looks for a `<meta>` tag with the `name` attribute set to `"author"`. If found, it retrieves the author name from the `content` attribute of the `<meta>` tag.

4. The function then creates a new `<strong>` element and sets its text content to the author name.

5. Finally, the function locates the element with the class `.bio.block` and appends the newly created `<strong>` element containing the author name as the last child of the `.bio.block` element.

## Mobile Responsiveness

The bio block includes responsive CSS that:
- Adjusts image sizes for different screen sizes (80px desktop, 60px tablet, 50px mobile)
- Changes layout to vertical stack on mobile devices (≤768px)
- Centers content and adjusts spacing for optimal mobile viewing

## Expression Processing

The wrapper is added to the expressions resolver; it obeys the expression {{expand,$NAMESPACE:VARIABLE$})

It is assumed that the $system:enableprofilevariables$ has been set to 'y' and there are meaningful profile variables
