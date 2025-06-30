# PlusPlus - Optimization code for Edge Delivery Services

A git subtree add for AEM-boilerplate, this git provides the scripting required to add the extras developed by Tom Cranstoun, Digital Domain Technologies Ltd

PlusPlus is named as it is an increment onto the underlying Project, whether it be Crosswalk, Universal Editor, Franklin, Helix, Edge DeliveryServices or Ecommerce; your choice.

What does it add:

- Configurable Variables
- Json-ld, Dublin Core and Content Ops markup
- Ability to link client configuration separately from site configuration; samples provided for Adobe Launch, Adobe DataLayer, ABTasty, Dante chatbot,
- Ability to have editorial control over mobile images.
- Differentiation between environments, not required but helpful for regulated industries:
  - prod,
  - preprod,
  - stage,
  - final,
  - preview,
  - Live,
  - local,
  - dev environments
- inclusion of helpful code from block-party <https://www.aem.live/developer/block-collection#block-party> : - Modal, ffetch, DOM-helpers, External - Images
- Inclusion of experimentation, expressions through
 git subtree add <https://github.com/adobe/aem-experimentation/wiki/Experiments#authoring>
 git subtree add --squash  --prefix plugins/expressions  <https://github.com/vtsaplin/franklin-expressions/> main

Smart algorithms to:

- tidy up metadata
- remove comment blocks
- dynamically add height to SVG icons
- add scripts on the fly to a page (inject mechanism)
- remove unnecessary title elements from images
- Change Styling if coming-soon is present on the page by adding class hide to the body
- Adds button role to every link with a class button
- Adds 'target blank' to every external link on the page
- Adds 'current class' to any link to the current page
- adds callback chain registration for a callback after 3 seconds and after page load
- **Enhanced Date Management**: Intelligently detects publication dates from meta tags and uses them as reference points for Content Operations (CO) and Dublin Core (DC) date calculations

The final plusplus environment also requires configuration see <https://github.com/Digital-Domain-Technologies-Ltd/plusplusconfiguration>

## Enhanced Date Management System

PlusPlus includes an intelligent date management system that automatically detects publication dates from meta tags and uses them as reference points for all content lifecycle calculations.

### Publication Date Detection

The system searches for publication dates in the following priority order:
- `meta[name="publication-date"]`
- `meta[property="article:published_time"]`
- `meta[name="date"]`
- `meta[property="article:published"]`
- `meta[name="dc.date"]`
- `meta[name="dc-date"]`

### Supported Date Formats

The date parsing system supports a wide variety of date formats including:
- **ISO 8601**: `2025-06-26T10:30:00Z`
- **Slash formats**: `26/jun/2025`, `26/06/2025`
- **Space formats**: `26 jun 2025`, `26 June 2025`
- **Hyphen formats**: `26-jun-2025`, `26-06-2025`
- **Month-first**: `jun 26 2025`, `June 26, 2025`
- **With time**: `26 jun 2025 2:30 PM`

The system automatically converts all recognized formats to ISO 8601 standard for consistent processing.

### Date Calculation Benefits

When a publication date is found:
- **Content Operations (CO) dates** are calculated from the publication date instead of current date
- **Dublin Core (DC) dates** use the publication date as context for empty date fields
- **Review dates** are calculated as publication date + 300 days (configurable)
- **Expiry dates** are calculated as publication date + 365 days (configurable)
- **Start/Published timestamps** default to the publication date when not specified

### Backward Compatibility

- Falls back to current date behavior when no publication date is found
- No configuration changes required - works automatically
- All existing functionality preserved</search>

## Installation

first of all fork adobe boilerplate, <https://github.com/adobe/aem-boilerplate>

then using the shell CD into the cloned boilerplate folder and run this;

```sh

git subtree add --squash  --prefix config  https://github.com/Digital-Domain-Technologies-Ltd/plusplusconfig main
git subtree add --squash  --prefix plusplus  https://github.com/Digital-Domain-Technologies-Ltd/plusplus main
git subtree add --squash  --prefix tools  https://github.com/Digital-Domain-Technologies-Ltd/plusplustools main

npm i

```

If you later want to update your subtrees, use one of these

```sh

git subtree pull --squash --prefix config  https://github.com/Digital-Domain-Technologies-Ltd/plusplusconfig main

git subtree pull --squash --prefix plusplus  https://github.com/Digital-Domain-Technologies-Ltd/plusplus main

git subtree pull --squash --prefix tools  https://github.com/Digital-Domain-Technologies-Ltd/plusplustools main




```

## Problem Solving

sometimes you get a false error, *fatal: working tree has modifications.  Cannot add.*

If this happens use the command

```sh

git status

```

if the response is similar to

```sh
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

```

use this command to fix and try again

```sh
git update-index --refresh

```

## Updating the master repo

If you have commit access to the plusplus repo, create a pull request and in your branch

```sh
 git subtree push --prefix plusplus https://github.com/Digital-Domain-Technologies-Ltd/plusplus main         

```
