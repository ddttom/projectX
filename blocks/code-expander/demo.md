# Code Expander Block Demo

This demo showcases the Code Expander block, which enhances code snippets on your page with syntax highlighting, copy functionality, and interactive features.

## Basic Usage

Simply add an empty code-expander block to your page:

| code-expander |
| ------------- |

The block will automatically find and enhance all `<pre><code>` elements on the page.

## Example Code Snippets

Here are some example code snippets that will be enhanced by the Code Expander block:

### JavaScript Example

`javascript
// Sample JavaScript function
function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Usage example
const cart = [
  { name: 'Product 1', price: 10, quantity: 2 },
  { name: 'Product 2', price: 15, quantity: 1 },
  { name: 'Product 3', price: 5, quantity: 3 }
];

const total = calculateTotal(cart);
console.log(`Total: $${total}`); // Output: Total: $50
`

### HTML Example

`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <p>This is a sample HTML page.</p>
  </main>
  <footer>
    <p>&copy; 2025 My Website</p>
  </footer>
</body>
</html>
`

### CSS Example

`css
/* Base styles */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 5px;
}

nav ul {
  display: flex;
  list-style: none;
  padding: 0;
}

nav li {
  margin-right: 20px;
}

nav a {
  text-decoration: none;
  color: #0066cc;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}
`

### Python Example

`python
import json
from datetime import datetime

class DataProcessor:
    def __init__(self, data_file):
        self.data_file = data_file
        self.data = self.load_data()
    
    def load_data(self):
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: File {self.data_file} not found")
            return []
    
    def process_data(self):
        results = []
        for item in self.data:
            if 'timestamp' in item:
                # Convert timestamp to datetime
                item['date'] = datetime.fromtimestamp(item['timestamp'])
            results.append(item)
        return results
    
    def save_results(self, output_file):
        processed_data = self.process_data()
        with open(output_file, 'w') as f:
            json.dump(processed_data, f, default=str, indent=2)
        print(f"Results saved to {output_file}")

# Usage
processor = DataProcessor('data.json')
processor.save_results('processed_data.json')
`

### Shell Script Example

`shell
#!/bin/bash
# Simple backup script

# Configuration
SOURCE_DIR="/path/to/source"
BACKUP_DIR="/path/to/backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create the backup
echo "Creating backup of $SOURCE_DIR..."
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_DIR/$BACKUP_FILE"
  echo "Backup size: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
else
  echo "Backup failed!"
  exit 1
fi
`

## Features and Customization

The Code Expander block provides the following features:

1. **Automatic language detection** - The block detects the programming language based on code content
2. **Syntax highlighting** - Code is highlighted according to the detected language
3. **Copy to clipboard** - One-click copying of code snippets
4. **Raw/formatted view toggle** - Switch between raw text and formatted code
5. **Download as file** - Save code snippets with appropriate file extensions
6. **Expand/collapse for long code blocks** - Collapsible view for long code snippets
7. **Keyboard navigation** - Arrow key navigation for scrolling through code
8. **Info tooltip** - Helpful information about available controls and keyboard shortcuts

## Use Cases

- Technical documentation
- Programming tutorials
- API documentation
- Code examples in blog posts
- Technical specifications
- Educational content

| metadata        |                                                                                                                                   |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| title           | Code Expander Demo                                                                                                                |
| description     | A demonstration of the Code Expander block for Franklin                                                                           |
| json-ld         | article                                                                                                                           |
| image           |                                                                                                                                   |
| author          | Tom Cranstoun                                                                                                                     |
| longdescription | This page showcases the Code Expander block functionality in Franklin, enhancing code snippets with syntax highlighting and interactive features. |
