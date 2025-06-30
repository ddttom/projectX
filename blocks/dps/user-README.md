# Creating Slide Decks with the Dynamic Presentation System (DPS)

The Dynamic Presentation System (DPS) is a powerful presentation framework that transforms structured content into an interactive presentation with advanced features like image sequences, presenter notes, and timer controls.

## Basic Structure

A DPS slide deck is structured as a markdown table with the following format:

```
| DPS                |                |                     |                 |                       |                            |
| :----------------- | :------------- | :------------------ | :-------------- | :-------------------- | :------------------------- |
| Presentation Title | Subtitle       | Timer duration      | Image           | Presenter Notes       | Presenter Guidance         |
| Slide Title        | Slide Subtitle | Concise Description | Image Reference | Audience-Facing Notes | Private Presenter Guidance |
```

### Column Definitions

1. **First column**: Slide titles
   - First row contains "DPS" to identify the table as a presentation
   - Second row contains the presentation title
   - Subsequent rows contain individual slide titles

2. **Second column**: Introduction text or subtitle
   - Second row contains the presentation subtitle, optionally with a URL using format: `Subtitle - [URL](URL)`
   - Subsequent rows contain slide introduction text or contextual information

3. **Third column**: Concise description or timer
   - Second row contains the presentation timer duration in minutes (e.g., "15")
   - Subsequent rows contain terse descriptions (10 words or less) summarizing key points

4. **Fourth column**: Image references
   - Uses a standardized format for referencing images: `:image-name:`
   - The system will automatically load the corresponding image file
   - For multiple images that will be shown in sequence, use separate identifiers

5. **Fifth column**: Audience-facing presenter notes
   - Contains information that can be shared with the audience as handouts
   - Expanded explanations of slide content
   - Key points for audience understanding

6. **Sixth column (optional)**: Private presenter guidance
   - Speaking tips visible only to the presenter
   - Audience engagement strategies
   - Timing recommendations
   - Example preparation suggestions
   - Questions to pose to the audience

## Best Practices for Creating Effective DPS Slide Decks

### Content Organization

1. **Logical Flow**
   - Arrange slides in a narrative sequence that builds understanding
   - Group related concepts together
   - Create clear transitions between major sections

2. **Concise Descriptions**
   - Keep column 3 descriptions under 10 words
   - Use action verbs and clear language
   - Focus on the single most important concept

3. **Image References**
   - Use meaningful names that reflect content (e.g., `:ai-limitations:` rather than `:image1:`)
   - Maintain consistent naming conventions throughout the deck
   - Use separate identifiers for sequence images

### Creating Effective Presenter Notes

1. **Audience-Facing Notes (Column 5)**
   - Write in complete sentences suitable for reading
   - Expand on slide concepts without introducing new material
   - Provide context and background information
   - Avoid overly technical jargon unless necessary
   - Structure for readability as standalone content

2. **Private Presenter Guidance (Column 6)**
   - Include audience engagement techniques
   - Suggest questions to prompt discussion
   - Provide technical depth adaptation recommendations
   - Include preparation notes for examples or demonstrations
   - Note potential challenging questions and suggested responses
   - Add timing guidance for flexible presentation management

## Example Slide With All Components

```
| Creating AI Strategy | Balancing Innovation and Risk | Implementation framework for organizational AI adoption | :ai-strategy: | An effective AI strategy balances innovation opportunities with implementation risks. Organizations must consider technical limitations, data availability, talent requirements, and regulatory compliance when developing their approach. | Begin with a brief audience poll on current AI implementation status. Have 2-3 industry-specific examples ready. For technical audiences, emphasize architecture considerations; for business audiences, focus on ROI and governance. |
```

## Special Features and Extensions

### Metadata Section

After the main presentation table, include a metadata section for additional information:

```
| metadata        |                                              |
| :-------------- | :------------------------------------------- |
| title           | Your Presentation Title                      |
| description     | Brief description for indexing               |
| json-ld         | article                                      |
| author          | Your Name                                    |
| longdescription | Extended description with key topics covered |
```

### URL Handling

For adding links to your presentation, use the markdown format in any cell:

```
[Link Text](https://example.com)
```

The presentation subtitle can include a contact or reference URL that will automatically be incorporated into the Q&A slide:

```
Presentation Subtitle - [https://example.com](https://example.com)
```

### Formatting in Cells

- Use markdown formatting within cells for emphasis
- Create line breaks with physical returns in the text
- For bullet points in column 3, use single lines with no special formatting
- For bullet points in columns 5-6, use markdown list format:
  ```
  - First point
  - Second point
  - Third point
  ```

## Full Example Structure

```
# Slide Deck Title

| DPS                  |                                                       |                                |                    |                                    |                                  |
| :------------------- | :---------------------------------------------------- | :----------------------------- | :----------------- | :--------------------------------- | :------------------------------- |
| Presentation Title   | Subtitle - [https://example.com](https://example.com) | 30                             |                    |                                    |                                  |
| Introduction         | Presenter Name                                        | Key themes of the presentation | :intro-image:      | Audience-facing introduction notes | Opening guidance for presenter   |
| First Content Slide  | Supporting context                                    | Concise 5-10 word description  | :content-image-1:  | Detailed explanation for audience  | Presenter tips and strategies    |
| Second Content Slide | More context                                          | Another concise description    | :content-image-2:  | More audience-facing notes         | More presenter guidance          |
| Conclusion           | Summary                                               | Key takeaways                  | :conclusion-image: | Final notes for audience           | Closing strategies for presenter |

| metadata        |                                                       |
| :-------------- | :---------------------------------------------------- |
| title           | Presentation Title                                    |
| description     | Brief description                                     |
| json-ld         | article                                               |
| author          | Presenter Name                                        |
| longdescription | Extended description covering main topics and purpose |
```

## Presentation Delivery

The DPS system will automatically transform your structured content into an interactive presentation with the following features:

- Full-screen presentation mode
- Keyboard-based navigation between slides
- Multiple images per slide with arrow key navigation
- Timer with warning system
- Presenter notes toggle (+ and - keys)
- Dedicated presenter mode for secondary device
- Automatic Q&A slide generation
- Print-friendly handout mode

By following this structure, you can create well-organized presentations that support both engaging delivery and effective audience handouts.