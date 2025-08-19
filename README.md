# Miles Portfolio Website 2.0 - Frontend

A modern React TypeScript application built with Vite and Aceternity UI for optimal performance and stunning visual effects. Connected to a Spring Boot backend for dynamic content management.

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 19** - Latest React with concurrent features
- 🔷 **TypeScript** - Type-safe development
- 🎨 **Aceternity UI** - Beautiful, animated UI components
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🔗 **Backend Integration** - Dynamic content from Spring Boot API
- 🎨 **ESLint + Prettier** - Code quality and formatting
- 🔥 **Hot Module Replacement** - Instant updates during development
- 📱 **Responsive Design Ready** - Mobile-first approach

## 🛠️ Tech Stack

- **Build Tool**: Vite 7
- **Framework**: React 19
- **Language**: TypeScript 5.8
- **UI Library**: Aceternity UI + Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Spring Boot (Java)
- **API**: RESTful endpoints
- **Linting**: ESLint 9 + TypeScript ESLint
- **Formatting**: Prettier 3
- **Package Manager**: npm

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🚀 Development

### Frontend
```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Backend
Make sure your Spring Boot backend is running on `http://localhost:8080` before starting the frontend.

## 🔗 Backend Integration

The frontend connects to a Spring Boot backend with the following endpoints:

### API Endpoints
- `GET /api/profile` - Fetch profile data (description, resume URL, profile image URL)
- `POST /api/upload-resume` - Upload resume file
- `POST /api/upload-image` - Upload profile image
- `PUT /api/profile/description` - Update profile description

### Profile Data Structure
```typescript
interface ProfileData {
  description: string;
  resumeUrl: string;
  profileImageUrl: string;
}
```

### Features
- **Dynamic Content**: Profile description, image, and resume are loaded from the backend
- **Resume Download**: Users can download the resume directly from the frontend
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Loading spinners while fetching data

## 🧹 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Aceternity UI Components

This project includes several Aceternity UI components for creating stunning visual effects:

### Available Components

- **Sparkles** (`src/components/ui/sparkles.tsx`) - Animated sparkle effects around text
- **TextGenerateEffect** (`src/components/ui/text-generate-effect.tsx`) - Typewriter-style text animation
- **BackgroundGradient** (`src/components/ui/background-gradient.tsx`) - Interactive gradient backgrounds

### Usage Examples

```tsx
// Sparkles effect
<Sparkles
  className="text-6xl font-bold text-white"
  particleColor="#ffffff"
  particleDensity={100}
>
  Your Text Here
</Sparkles>

// Text generation effect
<TextGenerateEffect 
  words="Your animated text here"
  className="text-2xl text-blue-400"
/>

// Background gradient
<BackgroundGradient className="min-h-screen">
  <YourContent />
</BackgroundGradient>
```

### Adding More Components

To add more Aceternity UI components:

1. Create new component files in `src/components/ui/`
2. Import required dependencies (framer-motion, lucide-react, etc.)
3. Use the `cn` utility from `src/lib/utils.ts` for class merging
4. Follow the existing component patterns

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # Aceternity UI components
│   └── Hero.tsx   # Main hero section
├── hooks/         # Custom React hooks
│   └── useProfile.ts # Profile data management
├── services/      # API services
│   └── api.ts     # Backend API integration
├── lib/           # Utility functions
│   └── utils.ts   # cn function for class merging
├── pages/         # Page components
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── styles/        # CSS/SCSS files
└── assets/        # Static assets (images, fonts, etc.)
```

## 🎯 Best Practices

- Use TypeScript for all new code
- Follow ESLint rules and Prettier formatting
- Write meaningful component and function names
- Use React hooks for state management
- Keep components small and focused
- Use semantic HTML elements
- Implement responsive design patterns
- Leverage Aceternity UI components for visual appeal
- Handle API errors gracefully
- Use loading states for better UX

## 🔧 Configuration Files

- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `tsconfig.app.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

## 📝 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code |
| `npm run format:check` | Check formatting |
| `npm run type-check` | TypeScript type checking |

## 🎨 Customization

### Colors and Themes
- Modify `tailwind.config.js` to customize colors
- Update component props for different visual effects
- Use CSS custom properties for dynamic theming

### Adding Animations
- Use Framer Motion for custom animations
- Leverage Aceternity UI's built-in animation props
- Create custom animation hooks in `src/hooks/`

### Backend Configuration
- Update `API_BASE_URL` in `src/services/api.ts` for different environments
- Add new API endpoints as needed
- Implement caching strategies for better performance

### Performance Optimization
- Lazy load components when needed
- Use React.memo for expensive components
- Optimize images and assets
- Monitor bundle size with `npm run build`
- Implement API response caching
