# Table Block

Table block is derived from Adobe blocks

It has been enhanced with additional code to improve variations and accessibility:

- Added ARIA attributes for better screen reader support
- Implemented variations like striped, bordered, and first-line for flexible styling options
- First-line variation applies a pale blue background to the first row of the table

## Usage

The table block supports several variations that can be combined:

| Table |
| :---- |
| Content |

| Table (striped) |
| :-------------- |
| Content with alternating row backgrounds |

| Table (bordered) |
| :--------------- |
| Content with borders around cells |

| Table (first-line) |
| :----------------- |
| First row has pale blue background |

| Table (no-header) |
| :---------------- |
| For tables without header rows |

## Styling

The block uses CSS variables for consistent styling and easy theming:

- `--table-first-line-bg`: Pale blue background for first-line variation
