# Floating Alert

| metadata        |                                                                                |
| :-------------- | :----------------------------------------------------------------------------- |
| title           | Floating Alert Example                                                         |
| description     | Example usage of the Floating Alert block with various content types           |
| json-ld         | article                                                                        |
| image           |                                                                                |
| author          | Tom Cranstoun                                                                  |
| longdescription | This page demonstrates how to use the Floating Alert block with different types of content and styling options. |

## Basic Usage

| Floating Alert |
| -------------- |
| Welcome to our website! Please take a moment to review our [updated privacy policy](https://example.com/privacy). |

## With Heading and Multiple Links

| Floating Alert |
| -------------- |
| ## New Features Available<br>Check out our [documentation](https://example.com/docs) or [contact support](https://example.com/support) for help. |

## With Important Notice and Heading

| Floating Alert |
| -------------- |
| ## Scheduled Maintenance<br>⚠️ Our service will be unavailable this weekend. Visit our [status page](https://example.com/status) for updates. |

## With Call to Action and Heading

| Floating Alert |
| -------------- |
| ## Special Offer<br>🎉 20% off all products! [Shop now](https://example.com/shop) or [learn more](https://example.com/offer) about this limited-time deal. |

## With Formatted Text and Heading

| Floating Alert |
| -------------- |
| ## Important Update<br>Our service will be unavailable from 2-4 AM EST. [View maintenance schedule](https://example.com/maintenance) for details. |

## Without Heading (Basic)

| Floating Alert |
| -------------- |
| **Important:** This is an example without a heading. The content will display normally without title formatting. |

Note: The alert will appear immediately when the page loads and can be dismissed by clicking the X button, clicking outside the modal, or pressing the Escape key. Once dismissed, it won't appear again until localStorage is cleared.

**Heading Processing:** When you include a heading (h1-h6) in your content, it will automatically be extracted as the alert title and displayed prominently at the top, followed by a horizontal rule separator, then the remaining content below. 
