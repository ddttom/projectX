export default function decorate(block) {
  // First, try to find any icon spans
  const iconSpan = block.querySelector('span[class^="icon icon-"]');
  
  if (iconSpan) {
    // Get the icon name from the class
    const iconClasses = Array.from(iconSpan.classList);
    const iconClass = iconClasses.find(cls => cls.startsWith('icon-'));
    const iconName = iconClass ? iconClass.replace('icon-', '') : '';
    
    if (iconName) {
      // Clear the block content
      block.textContent = '';
      
      // Create the new standardized structure
      const paragraph = document.createElement('p');
    
      const img = document.createElement('img');
      img.src = `/icons/${iconName}.svg`;
      img.alt = `${iconName} illustration`;
      
      block.appendChild(img);
      block.appendChild(paragraph);
    }
  } else {
    // Check for SVG content as fallback
    const svgText = block.textContent.trim();
    if (svgText.startsWith('<svg')) {
      // Clear the block content
      block.textContent = '';
      
      //create a container for the svg
      const svgContainer = document.createElement('div');
      svgContainer.innerHTML = svgText;

      //extract the svg element
      const svgElement = svgContainer.querySelector('svg'); 
      
      if (svgElement) {
        //ensure the svg takes full width and height
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');

        block.appendChild(svgElement);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('No valid icon or SVG content found in the block');
    }
  }
}