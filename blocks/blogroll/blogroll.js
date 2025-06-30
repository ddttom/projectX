// Function to format the date
function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp, 10) * 1000);
  return date.toLocaleDateString('en-GB');
}

// Function to extract series name and part number
function extractSeriesInfo(title, path) {
  const match = title.match(/^(.*?)\s*-?\s*Part\s*(\d+)$/i);
  const basePath = path.split('/').slice(0, -1).join('/');
  return {
    name: match ? match[1].trim() : title,
    part: match ? parseInt(match[2], 10) : null,
    basePath
  };
}
// Function to group and sort blog posts based on configuration
function groupAndSortPosts(posts, config) {
  // Destructure configuration, providing default empty arrays if undefined
  const { acceptList = [], pathFilters = [], currentDirFilter = null } = config || {};
  // console.log('groupAndSortPosts - config:', config);
  //console.log('groupAndSortPosts - initial posts length:', posts.length);

  let filteredPosts = [...posts]; // Start with all posts
  let usedPathFilter = false; // Flag to track if path=* or path= filters were applied
  let usedTitleFilter = false; // Flag to track if title fallback filter was applied

  // *** Priority 1: Handle currentDirFilter (path=*) if it exists ***
  if (currentDirFilter) {
    // console.log('Applying current directory filter (path=*):', currentDirFilter);
    filteredPosts = posts.filter(post => {
      // Check if post.path is a string and starts with the current directory path
      const match = typeof post.path === 'string' && post.path.startsWith(currentDirFilter);
      if (match) {
      //   console.log(`Current directory match found: "${currentDirFilter}" starts path "${post.path}"`);
      }
      return match;
    });
    // console.log(`Found ${filteredPosts.length} posts matching current directory filter`);
    usedPathFilter = true; // Mark that a path-based filter was used

    // If no posts were found with this specific filter, the result is empty for path=*
    if (filteredPosts.length === 0) {
     // console.log('No matches found using current directory filter (path=*).');
      // We don't attempt title fallback for path=*
    }
  }
  // *** Priority 2: Handle regular pathFilters only if path=* wasn't used ***
  else if (pathFilters.length > 0) {
   // console.log('Applying regular path filters:', pathFilters);

    // Attempt to filter by path first
    const pathFilteredPosts = posts.filter(post => {
      // Check if post.path is a string and includes any of the pathFilters
      return pathFilters.some(pathFilter => typeof post.path === 'string' && post.path.includes(pathFilter));
    });

    //console.log(`Found ${pathFilteredPosts.length} posts matching path filters`);

    if (pathFilteredPosts.length > 0) {
      filteredPosts = pathFilteredPosts;
      usedPathFilter = true; // Mark that a path-based filter was used
    } else {
      // If no path matches, attempt to filter by title as a fallback
     // console.log('No path matches found for path filters, trying title filtering');
      const titleFilteredPosts = posts.filter(post => {
        // Check if post.title is a string and includes any of the pathFilters
        return pathFilters.some(pathFilter => typeof post.title === 'string' && post.title.includes(pathFilter));
      });

      // console.log(`Found ${titleFilteredPosts.length} posts matching title filters`);

      if (titleFilteredPosts.length > 0) {
        filteredPosts = titleFilteredPosts;
        usedTitleFilter = true; // Mark that title fallback filter was used
      } else {
        // If neither path nor title matched, the result is empty for these filters
       //  console.log('No matches found in either path or title using path filters.');
        filteredPosts = [];
      }
    }
  }

  // *** Priority 3: Apply regular acceptList filtering only if NO path or title filters were successfully applied ***
  if (!usedPathFilter && !usedTitleFilter && acceptList.length > 0) {
    console.log('Applying regular acceptList filtering:', acceptList);
    filteredPosts = filteredPosts.filter(post => {
      return acceptList.some(term => {
        // Case-insensitive check for terms containing 'guide' (backward compatibility)
        if (term === term.toLowerCase() && term.includes('guide')) {
          // Check if post.path is a string before calling toLowerCase()
          return typeof post.path === 'string' && post.path.toLowerCase().includes(term);
        }
        // Case-sensitive check otherwise
        // Check if post.path is a string before calling includes()
        return typeof post.path === 'string' && post.path.includes(term);
      });
    });
    console.log(`Found ${filteredPosts.length} posts after acceptList filtering.`);
  }

  // If after all filtering attempts, filteredPosts is empty, return immediately.
  if (filteredPosts.length === 0) {
   //  console.log('Returning empty array because filteredPosts is empty after all filtering attempts');
    return []; // Return an empty array directly
  }

  // *** Grouping and Sorting Logic (only runs if filteredPosts is not empty) ***
 // console.log('Grouping and sorting filtered posts. Count:', filteredPosts.length);
  const seriesMap = new Map();

  // Group the remaining filtered posts
  filteredPosts.forEach(post => {
    // Ensure title and path are strings before processing
    const title = typeof post.title === 'string' ? post.title : '';
    const path = typeof post.path === 'string' ? post.path : '';
    const { name, part, basePath } = extractSeriesInfo(title, path);
    const key = `${basePath}/${name}`; // Use base path and extracted name as the key
    if (!seriesMap.has(key)) {
      seriesMap.set(key, []);
    }
    // Add the post (with its extracted part number) to the corresponding series
    seriesMap.get(key).push({ ...post, part });
  });

  // Sort posts within each series
  seriesMap.forEach((postsInSeries) => {
    postsInSeries.sort((a, b) => {
      // Sort by part number if both posts have one
      if (a.part !== null && b.part !== null) {
        return a.part - b.part;
      }
      // Otherwise, sort alphabetically by title
      // Ensure titles are strings before comparing
      const titleA = typeof a.title === 'string' ? a.title : '';
      const titleB = typeof b.title === 'string' ? b.title : '';
      return titleA.localeCompare(titleB);
    });
  });

  // console.log('After grouping, seriesMap size:', seriesMap.size);

  // Convert map to array of [seriesName, postsArray] entries
  // Sort the series themselves based on the number of posts (descending)
  return Array.from(seriesMap.entries())
    .sort((a, b) => b[1].length - a[1].length) // Sort series by number of posts descending
    .map(([key, postsInSeries]) => {
        // Extract a representative series name (e.g., from the first post's title before " - Part")
        // Ensure the first post and its title exist
        const firstPostTitle = postsInSeries[0] && typeof postsInSeries[0].title === 'string' ? postsInSeries[0].title : '';
        const seriesName = firstPostTitle.includes(' - Part') ? firstPostTitle.split(' - Part')[0] : firstPostTitle;
        return [seriesName, postsInSeries];
    }); // Return array of [seriesName, sortedPostsArray]
}
// Configuration function
function getConfig(block) {
  // Initialize the config object
  const config = {
    acceptList: [],
    pathFilters: [],
    currentDirFilter: null, // Added to specifically handle path=*
    isCompact: block.classList.contains('compact'),
  };

  // Get rows from the block configuration in the document
  const rows = [...block.children];
  if (rows.length > 0) {
    // Process the first row which contains the filter terms
    const firstRow = rows.shift(); // Removes the first row (header) if it exists, assumes filters are in subsequent rows. Check if this is the intended logic or if filters are in the *first* data row. If filters are in the first row, just use rows[0].

    // Iterate over cells in the filter row
    [...firstRow.children].forEach(cell => {
      const text = cell.textContent.trim();
      if (text === '') return; // Skip empty cells

      // Check for path=value format
      const pathMatch = text.match(/^path=(\S+)$/);
      if (pathMatch) {
        // Get the path value from the match
        const pathValue = pathMatch[1];
        // console.log('Found path filter:', pathValue);

        // Special case: path=* means "this subdirectory only"
        if (pathValue === '*') {
          const currentPath = window.location.pathname;
          // console.log('Current pathname:', currentPath);

          // Get the current directory path (ensure it ends with /)
          let currentDir = currentPath;
          if (!currentPath.endsWith('/')) {
            currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
          }
          // console.log('Current directory for path=*:', currentDir);

          // *** MODIFICATION: Store the current directory filter separately ***
          config.currentDirFilter = currentDir;
        } else {
          // Store regular path filters
          config.pathFilters.push(pathValue);
        }
      } else {
        // Process regular filter terms (non-path filters)
        // Only convert to lowercase if it contains 'guide' (case insensitive for backward compatibility)
        const processedText = text.toLowerCase().includes('guide') ? text.toLowerCase() : text;
        config.acceptList.push(processedText);
      }
    });
  }

  // Fallback mechanism: Set default path=* when no configuration is present
  // If all filter arrays are empty and no currentDirFilter is set, apply path=* as default
  if (config.acceptList.length === 0 && config.pathFilters.length === 0 && !config.currentDirFilter) {
    const currentPath = window.location.pathname;
    // console.log('No configuration detected, applying default path=* behavior');
    // console.log('Current pathname for default fallback:', currentPath);

    // Get the current directory path (ensure it ends with /)
    let currentDir = currentPath;
    if (!currentPath.endsWith('/')) {
      currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    }
    // console.log('Current directory for default path=*:', currentDir);

    // Set the current directory filter (equivalent to path=*)
    config.currentDirFilter = currentDir;
  }

  // Default filter for compact mode if no other filters are specified
  // If both acceptList and pathFilters are empty AND currentDirFilter is not set AND it's compact mode, set default path
  if (config.acceptList.length === 0 && config.pathFilters.length === 0 && !config.currentDirFilter && config.isCompact) {
    const currentPath = window.location.pathname.toLowerCase();
    const pathParts = currentPath.split('/');
    // Remove potential part number suffix (e.g., -part-1) from the page name
    const lastPart = pathParts[pathParts.length - 1].replace(/-part-\d+$/, '');
    const folderPath = pathParts.slice(0, -1).join('/');
    // Add the inferred folder/page path to the acceptList for default filtering
    config.acceptList.push(folderPath + '/' + lastPart);
   // console.log('Compact mode default filter applied:', config.acceptList);
  }

  // Return the final configuration object
  return config;
}
// Function to create the compact blogroll panel
function createCompactBlogrollPanel(groupedPosts, originalPosts, config) {
  const panel = document.createElement('div');
  panel.className = 'blogroll-panel';
  
  const panelHeader = document.createElement('div');
  panelHeader.className = 'blogroll-panel-header';
  
  const panelTitle = document.createElement('div');
  panelTitle.className = 'blogroll-panel-title';
  panelTitle.textContent = 'Blogroll';
  panelHeader.appendChild(panelTitle);
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;'; // This creates a × symbol
  closeButton.className = 'blogroll-panel-close';
  closeButton.setAttribute('aria-label', 'Close blogroll panel');
  closeButton.addEventListener('click', () => panel.classList.remove('open'));
  panelHeader.appendChild(closeButton);
  
  panel.appendChild(panelHeader);

  const blogrollContent = document.createElement('div');
  blogrollContent.className = 'blogroll-panel-content';

  //console.log('In createCompactBlogrollPanel, groupedPosts:', groupedPosts);
  //console.log('In createCompactBlogrollPanel, groupedPosts type:', typeof groupedPosts);
  //console.log('In createCompactBlogrollPanel, groupedPosts length:', groupedPosts.length);
  //console.log('In createCompactBlogrollPanel, is array?', Array.isArray(groupedPosts));
  
  updatePanelContent(blogrollContent, groupedPosts);

  // Add "Show All" button at the bottom of the panel
  const showAllContainer = document.createElement('div');
  showAllContainer.className = 'blogroll-show-all';
  
  const showAllButton = document.createElement('button');
  showAllButton.textContent = 'Show All Posts';
  showAllButton.setAttribute('aria-label', 'Show all posts');
  showAllButton.title = 'Show all posts';
  
  let isShowingAll = false;
  
  showAllContainer.appendChild(showAllButton);
  showAllContainer.addEventListener('click', () => {
    if (isShowingAll) {
      // Revert to previous state
      updatePanelContent(blogrollContent, groupedPosts);
      showAllButton.textContent = 'Show All Posts';
    } else {
      // Show all posts
      const allPosts = groupAndSortPosts(originalPosts, { acceptList: [], pathFilters: [] });
      updatePanelContent(blogrollContent, allPosts);
      showAllButton.textContent = 'Show Filtered Posts';
    }
    isShowingAll = !isShowingAll;
  });

  panel.appendChild(blogrollContent);
  panel.appendChild(showAllContainer);

  return panel;
}
function updatePanelContent(container, groupedPosts) {
  container.innerHTML = ''; // Clear existing content
  
  //console.log('In updatePanelContent, groupedPosts:', groupedPosts);
  //console.log('In updatePanelContent, groupedPosts type:', typeof groupedPosts);
  //console.log('In updatePanelContent, groupedPosts length:', groupedPosts.length);
  //console.log('In updatePanelContent, is array?', Array.isArray(groupedPosts));
  
  // If groupedPosts is not an array or is empty, show a message
  if (!Array.isArray(groupedPosts) || groupedPosts.length === 0) {
    const noPostsMessage = document.createElement('p');
    noPostsMessage.textContent = 'No blog posts found.';
    container.appendChild(noPostsMessage);
    return;
  }
  
  
  groupedPosts.forEach(([seriesName, posts]) => {
    const seriesContainer = document.createElement('div');
    seriesContainer.className = 'blogroll-series';

    const seriesTitle = document.createElement('h3');
    seriesTitle.textContent = seriesName;
    seriesContainer.appendChild(seriesTitle);

    const postList = document.createElement('ul');
    posts.forEach(post => {
      const listItem = document.createElement('li');
      listItem.className = 'blogroll-entry'; // Add this line to apply the new class
      
      const postLink = document.createElement('a');
      postLink.href = post.path;
      postLink.textContent = post.title;
      
      const postDate = document.createElement('span');
      postDate.className = 'blogroll-date';
      postDate.textContent = formatDate(post.lastModified);
      
      listItem.appendChild(postLink);
      listItem.appendChild(postDate);

      postList.appendChild(listItem);
    });

    seriesContainer.appendChild(postList);
    container.appendChild(seriesContainer);
  });
}

export default async function decorate(block) {
  // console.log('Decorating blogroll block:', block);
  const config = getConfig(block);
  //console.log('Blogroll config:', config);
  //console.log('Path filters:', config.pathFilters);
  //console.log('Accept list:', config.acceptList);
  
  // Add loading state
  block.textContent = 'Loading blog posts...';
  
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const blogPosts = json.data;
    // console.log('Fetched blog posts:', blogPosts);

    const groupedPosts = groupAndSortPosts(blogPosts, config);
    // console.log('Grouped posts:', groupedPosts);
    // console.log('Grouped posts type:', typeof groupedPosts);
    // console.log('Grouped posts length:', groupedPosts.length);
    // console.log('Is array?', Array.isArray(groupedPosts));

    // Clear loading message
    block.textContent = '';

    // Only create the full blogroll if it's not compact mode
    if (!config.isCompact) {
      const blogrollContainer = document.createElement('div');
      blogrollContainer.className = 'blogroll-container';

      // Ensure groupedPosts is an array
      if (!Array.isArray(groupedPosts) || groupedPosts.length === 0) {
        // console.log('No posts to display or groupedPosts is not an array');
        // console.log('groupedPosts:', groupedPosts);
        const noPostsMessage = document.createElement('p');
        noPostsMessage.textContent = 'No blog posts found.';
        blogrollContainer.appendChild(noPostsMessage);
      } else {
        groupedPosts.forEach(([seriesName, posts]) => {
          const seriesContainer = document.createElement('div');
          seriesContainer.className = 'blogroll-series';

          const seriesTitle = document.createElement('h2');
          seriesTitle.textContent = seriesName;
          seriesContainer.appendChild(seriesTitle);

          const postList = document.createElement('ul');
          posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.className = 'blogroll-entry'; // Add this line to apply the new class
            
            const postLink = document.createElement('a');
            postLink.href = post.path;
            postLink.textContent = post.title;
            
            const postDate = document.createElement('span');
            postDate.className = 'blogroll-date';
            postDate.textContent = formatDate(post.lastModified);
            
            listItem.appendChild(postLink);
            listItem.appendChild(postDate);

            const postDescription = document.createElement('p');
            postDescription.textContent = post.longdescription || post.description;
            listItem.appendChild(postDescription);

            postList.appendChild(listItem);
          });

          seriesContainer.appendChild(postList);
          blogrollContainer.appendChild(seriesContainer);
        });
      }

      // Append the blogroll container to the block
      block.appendChild(blogrollContainer);
      // console.log('Blogroll content added to block:', blogrollContainer);
    }

    // If compact mode is enabled, add the icon and panel
    if (config.isCompact) {
      // console.log('Creating compact blogroll');
      // Create compact blogroll icon container
      const iconContainer = document.createElement('div');
      iconContainer.className = 'blogroll-icon-container';

      // Create compact blogroll icon
      const icon = document.createElement('div');
      icon.className = 'blogroll-icon';
      icon.innerHTML = '📚';
      iconContainer.appendChild(icon);

      // Add "Blogroll" text next to the icon
      const iconText = document.createElement('span');
      iconText.className = 'blogroll-icon-text';
      iconText.textContent = 'Blogroll';
      iconContainer.appendChild(iconText);

      document.body.appendChild(iconContainer);

      // Create compact blogroll panel
      const panel = createCompactBlogrollPanel(groupedPosts, blogPosts, config);
      document.body.appendChild(panel);

      // Function to close the panel
      const closePanel = () => {
        panel.classList.remove('open');
      };

      // Add click event to icon container
      iconContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.add('open');
      });

      // Add click event to document to close panel when clicking outside
      document.addEventListener('click', (e) => {
        if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== iconContainer) {
          closePanel();
        }
      });

      // Prevent clicks inside the panel from closing it
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Add keydown event listener to close panel on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
          closePanel();
        }
      });
    }
  } catch (error) {
    console.error('Error in blogroll decoration:', error);
    block.textContent = 'Failed to load blog posts. Please try again later.';
  }

  // console.log('Blogroll decoration completed');
}
