# 🤝 Contributing to FitForge

First off, thank you for considering contributing to FitForge! It's people like you that make FitForge such a great tool for HR professionals worldwide.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- 🔧 Fix issues
- ✨ Add new features
- 🧪 Write tests
- 🌍 Add translations

## 📋 Code of Conduct

This project and everyone participating in it is governed by respect, kindness, and professionalism. By participating, you are expected to uphold these values.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/FitForge.git
   cd FitForge/hr-fitforge
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Aanishnithin07/FitForge.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Visit `http://localhost:5173`

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run development server
npm run dev

# Test the build
npm run build
npm run preview
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit!

## 📝 Code Style Guidelines

### JavaScript/React

```javascript
// ✅ Good
const analyzeResume = (jdText, resumeText) => {
  if (!jdText || !resumeText) return null
  return analyze({ jdText, resumeText })
}

// ❌ Avoid
function analyzeResume(jdText,resumeText){
  if(!jdText||!resumeText)return null;
  return analyze({jdText,resumeText});
}
```

### Component Structure

```jsx
import React, { useState, useEffect } from 'react'

/**
 * Component description
 * @param {Object} props - Component props
 */
export default function MyComponent({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // Render
  return (
    <div className="my-component">
      {/* Component JSX */}
    </div>
  )
}
```

### CSS

```css
/* Use CSS custom properties */
.my-component {
  background: var(--glass-bg);
  color: var(--text);
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* Mobile-first approach */
.my-component {
  padding: 16px;
}

@media (min-width: 960px) {
  .my-component {
    padding: 24px;
  }
}
```

## 🎯 Feature Request Guidelines

When requesting a feature:

1. **Search existing issues** - Maybe it's already planned!
2. **Be specific** - Describe the feature clearly
3. **Explain the use case** - Why is this useful?
4. **Consider alternatives** - Are there other solutions?
5. **Mock it up** - Sketches or wireframes help!

## 🐛 Bug Report Guidelines

When reporting a bug:

1. **Search existing issues** - Has it been reported?
2. **Use the bug template** - Provide all requested info
3. **Include steps to reproduce** - How can we see the bug?
4. **Add screenshots** - A picture is worth 1000 words
5. **Specify environment** - Browser, OS, version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
 - Browser: [e.g. Chrome 120]
 - OS: [e.g. macOS 14]
 - Version: [e.g. 1.0.0]
```

## 🧪 Testing

Currently, FitForge doesn't have automated tests, but we plan to add them. You can help by:

1. Manual testing of all features
2. Testing on different browsers
3. Testing on mobile devices
4. Writing test cases

## 📚 Documentation

Good documentation helps everyone! You can contribute by:

- Fixing typos
- Adding examples
- Clarifying instructions
- Adding tutorials
- Creating video guides

## 🎨 UI/UX Contributions

Design improvements are welcome! Consider:

- Accessibility improvements
- Mobile responsiveness
- Animation refinements
- Color scheme suggestions
- Layout enhancements

## 🌍 Internationalization

Help make FitForge available in more languages:

1. Create a translation file
2. Translate all strings
3. Test the translation
4. Submit PR with language support

## 📊 Analytics Features

If adding analytics:

- Keep it privacy-first
- Make it optional
- No tracking without consent
- No external dependencies by default

## ⚡ Performance Contributions

Optimize FitForge by:

- Reducing bundle size
- Improving load time
- Optimizing algorithms
- Adding lazy loading
- Implementing code splitting

## 🔐 Security

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email the maintainer directly
3. Provide detailed information
4. Allow time for a fix before disclosure

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the README

## 💬 Questions?

- Open a discussion on GitHub
- Join our community
- Check existing documentation
- Ask in pull requests

## 🎉 Thank You!

Every contribution matters, no matter how small. Thank you for making FitForge better!

---

**Ready to contribute?** 

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

**Let's build something amazing together! 🚀**
