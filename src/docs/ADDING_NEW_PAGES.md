# Adding New Pages to the Portfolio Website

This document explains how to add new pages to the portfolio website using the scalable page transition system.

## Overview

The website now uses a dynamic page system that automatically handles:
- Page transitions (slide up/down animations)
- Navigation bar updates
- Swipe/scroll gestures
- Click navigation
- Page ordering

## How to Add a New Page

### Step 1: Create Your Page Component

Create a new React component for your page in the `src/components/` directory:

```tsx
// src/components/YourNewPage.tsx
import React from 'react';

export const YourNewPage: React.FC = () => {
  return (
    <div className="your-new-page">
      <h1>Your New Page Content</h1>
      {/* Add your page content here */}
    </div>
  );
};
```

### Step 2: Update Page Types

Add your new page ID to the `PageId` type in `src/types/pages.ts`:

```tsx
export type PageId = 'home' | 'portfolio' | 'work' | 'your-new-page';
```

### Step 3: Update Page Configuration

Add your new page to the `PAGE_CONFIG` array in `src/config/pages.ts`:

```tsx
import { YourNewPage } from '../components/YourNewPage';

export const PAGE_CONFIG: PageConfig[] = [
  {
    id: 'home',
    title: 'Home',
    component: HomePage,
    order: 0
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    component: ProjectsPage,
    order: 1
  },
  {
    id: 'work',
    title: 'Work Experience',
    component: WorkExperiencePage,
    order: 2
  },
  {
    id: 'your-new-page',  // Your new page ID
    title: 'Your Page Title',  // Title shown in navigation
    component: YourNewPage,  // Your component
    order: 3  // Position in the page sequence
  }
];
```

### Step 4: Update Navigation Icons (Optional)

If you want a custom icon for your page in the navigation bar, update the `getIconForPage` function in `src/components/ui/floating-doc-nav.tsx`:

```tsx
import { YourIcon } from "lucide-react"; // Import your icon

const getIconForPage = (pageId: PageId) => {
  switch (pageId) {
    case 'home':
      return <Home className="h-5 w-5" />;
    case 'portfolio':
      return <FolderOpen className="h-5 w-5" />;
    case 'work':
      return <Briefcase className="h-5 w-5" />;
    case 'your-new-page':  // Add your new page
      return <YourIcon className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
  }
};
```

### Step 5: Add Page-Specific Styles (Optional)

If you need specific styles for your page, add them to `src/components/LandingPage.css`:

```css
.your-new-page-wrapper {
  /* Your page-specific styles */
}

.your-new-page {
  /* Content styles */
}
```

## How the System Works

### Page Ordering
- Pages are ordered by the `order` property in `PAGE_CONFIG`
- Lower numbers appear first (home = 0, portfolio = 1, etc.)

### Navigation Modes
The system supports two distinct navigation modes:

#### Sequential Navigation (Swipe/Scroll)
- **Swipe up/Scroll down**: Goes to the next page in order
- **Swipe down/Scroll up**: Goes to the previous page in order
- **Click Container**: Goes to the next page in order
- Pages transition in sequence (1 → 2 → 3)

#### Direct Navigation (Nav Bar Clicks)
- **Click Navigation Item**: Directly teleports to that page
- Skips intermediate pages (1 → 3, skipping page 2)
- Creates a "teleportation" effect
- No intermediate page content is shown

### Transitions
- **Sequential**: Pages slide in order with intermediate pages visible
- **Direct**: Pages teleport directly without showing intermediate content
- All pages use absolute positioning for smooth transitions
- The active page is always centered and visible

### Automatic Features
- Navigation bar automatically updates with new pages
- Swipe indicators automatically show/hide based on page position
- Page transitions work for any number of pages
- Type safety ensures only valid page IDs are used

## Example: Adding a "Contact" Page

Here's a complete example of adding a contact page:

1. **Create the component** (`src/components/ContactPage.tsx`):
```tsx
import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <h1>Contact Me</h1>
      <p>Get in touch!</p>
    </div>
  );
};
```

2. **Update types** (`src/types/pages.ts`):
```tsx
export type PageId = 'home' | 'portfolio' | 'work' | 'contact';
```

3. **Update config** (`src/config/pages.ts`):
```tsx
import { ContactPage } from '../components/ContactPage';

export const PAGE_CONFIG: PageConfig[] = [
  // ... existing pages
  {
    id: 'contact',
    title: 'Contact',
    component: ContactPage,
    order: 3
  }
];
```

4. **Update navigation** (`src/components/ui/floating-doc-nav.tsx`):
```tsx
import { Mail } from "lucide-react";

const getIconForPage = (pageId: PageId) => {
  switch (pageId) {
    // ... existing cases
    case 'contact':
      return <Mail className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
  }
};
```

That's it! The contact page will now:
- Appear in the navigation bar
- Be accessible via swipe/scroll gestures
- Have proper slide transitions
- Show appropriate swipe indicators

## Best Practices

1. **Keep page IDs simple**: Use kebab-case (e.g., `contact-page`, `about-me`)
2. **Maintain order consistency**: Don't skip numbers in the order sequence
3. **Use descriptive titles**: The title appears in the navigation bar
4. **Test transitions**: Make sure your page content fits well within the viewport
5. **Consider mobile**: Ensure your page works well on mobile devices

## Troubleshooting

- **Page not appearing**: Check that the page ID is added to the `PageId` type
- **Navigation not working**: Verify the page is in `PAGE_CONFIG` with correct order
- **Icon not showing**: Make sure the icon case is added to `getIconForPage`
- **Styling issues**: Check that your CSS classes match the component structure
