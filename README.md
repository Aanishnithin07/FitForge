# 🚀 FitForge – AI-Powered HR Role-Fit Analyzer

<div align="center">

![FitForge Banner](https://img.shields.io/badge/FitForge-AI%20Powered-22d3ee?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnoiIGZpbGw9IiMyMmQzZWUiLz4KPC9zdmc+)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

**Transform your hiring process with intelligent resume-job matching**

[🌐 Live Demo](https://fitforge.vercel.app/) • [📖 Documentation](https://github.com/Aanishnithin07/FitForge#readme) • [🐛 Report Bug](https://github.com/Aanishnithin07/FitForge/issues) • [✨ Request Feature](https://github.com/Aanishnithin07/FitForge/issues)

</div>

---

## ✨ What Makes FitForge Special?

FitForge is a **next-generation, client-side HR analytics tool** that revolutionizes how you assess candidate fit. Built with cutting-edge web technologies and beautiful UI/UX, it provides instant, intelligent analysis of resume-job description matches—all while keeping your data 100% private in your browser.

### 🎯 Key Highlights

- **🔒 100% Privacy-First**: All processing happens locally in your browser. Zero data leaves your device.
- **⚡ Lightning Fast**: Instant analysis with real-time updates as you type
- **🎨 Stunning UI/UX**: Glassmorphism design, smooth animations, and delightful micro-interactions
- **📊 Comprehensive Analytics**: Multi-dimensional scoring with detailed breakdowns
- **🎭 Theme Support**: Beautiful dark and light themes
- **📱 Fully Responsive**: Seamless experience across all devices
- **📦 Batch Processing**: Analyze multiple candidates simultaneously
- **📄 Export Reports**: Generate CSV and formatted text reports
- **🌐 PWA Ready**: Install as a native app on any platform

## 🌟 Try It Live

**🔗 Live Demo**: [https://fitforge.vercel.app/](https://fitforge.vercel.app/)

Experience FitForge instantly without any installation! Try the live demo to:
- Upload sample resumes and job descriptions
- See real-time analysis and scoring
- Explore the beautiful UI and interactive features
- Test batch comparison mode
- Export analysis reports

> 💡 **Tip**: Use the sample files in the `examples/` folder to get started quickly!

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/Aanishnithin07/FitForge.git
cd FitForge/hr-fitforge

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the magic happen! ✨

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The optimized build will be in the `dist/` directory.

## ☁️ One-Click Deploy

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aanishnithin07/FitForge)

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `hr-fitforge`
- Framework: Vite

The included `vercel.json` handles automatic configuration.

## 🎯 Core Features

### 📝 Smart Input Methods
- **Paste & Go**: Simply paste text directly
- **Drag & Drop**: Drop `.txt` files for instant upload
- **Button Upload**: Traditional file selection supported
- **Real-time Analysis**: Results update as you type

### 🧠 Advanced Analysis Engine

#### Multi-Dimensional Scoring
- **Skill Matching (50%)**: Matches against 200+ curated technical & soft skills
- **Keyword Analysis (25%)**: Intelligent keyword extraction and matching
- **Contextual Understanding (15%)**: Synonym recognition and phrase matching
- **Length Heuristics (10%)**: Optimal resume length assessment

#### Intelligent Processing
- **Text Normalization**: Smart lowercase conversion, punctuation handling
- **Stopword Removal**: 100+ common words filtered for precision
- **Stemming Algorithm**: Captures word variations (e.g., "develop", "developing")
- **N-gram Extraction**: Recognizes multi-word phrases and technical terms
- **Synonym Mapping**: Understands tech stack variations (React.js = ReactJS)

### 📊 Beautiful Visualizations

- **Circular Progress**: Animated score visualization with color coding
- **Metric Cards**: Individual component scores with progress bars
- **Interactive Tabs**: Overview, Skills Analysis, and Text Highlights
- **Keyword Cloud**: Visual representation of matched terms
- **Gap Analysis**: Clear visualization of missing skills
- **Live Highlighting**: Matched terms highlighted in original text

### 📦 Batch Processing

- Upload multiple resumes simultaneously
- Automatic leaderboard generation
- Rank candidates by fit score
- Quick identification of top matches
- Export leaderboard data

### 📄 Export & Reporting

- **CSV Export**: Structured data for further analysis
- **PDF Report**: Professional formatted summary
- **Leaderboard Export**: Batch comparison data
- **Customizable**: Job title and candidate names included

### 🎨 Design Excellence

- **Glassmorphism**: Modern frosted glass aesthetics
- **Smooth Animations**: Delightful micro-interactions
- **Gradient Accents**: Eye-catching color schemes
- **Theme Toggle**: Switch between dark and light modes
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with ARIA labels

### 🔒 Privacy & Security

- **Zero Server Calls**: All processing happens locally
- **No Data Storage**: Nothing is saved or transmitted
- **No Tracking**: No analytics or cookies
- **Client-Side Only**: Complete privacy guaranteed
- **Open Source**: Transparent and auditable code

## Tuning & Extensibility
- Adjust weights and heuristics in `src/utils/analyzer.js`:
  - `skillWeight` (default 0.6)
  - `keywordWeight` (default 0.3)
  - `lengthWeight` (default 0.1)
  - Length thresholds (e.g., 120 and 1200 tokens)
- Extend curated skills in `src/data/skills.json` (simple array of strings).
- Replace the simple stemmer with a stronger algorithm if desired—kept lightweight for transparency.

## 📁 Project Structure

```
hr-fitforge/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── main.jsx               # Application entry point
│   ├── App.jsx                # Main application component
│   ├── styles.css             # Core styles with theme support
│   ├── styles-results.css     # Results panel styles
│   ├── components/
│   │   ├── Header.jsx         # Header with theme toggle
│   │   ├── TextInputBlock.jsx # Input component with file upload
│   │   └── ResultsPanel.jsx   # Results visualization
│   ├── data/
│   │   └── skills.json        # 200+ curated skills database
│   └── utils/
│       ├── analyzer.js        # Core analysis engine
│       └── export.js          # Export functionality
├── examples/
│   ├── sample-jd.txt          # Example job description
│   └── sample-resume.txt      # Example resume
├── index.html                 # Entry HTML with SEO & PWA
├── package.json               # Dependencies
├── vercel.json                # Deployment config
└── README.md                  # This file
```

## 🎓 How It Works

### Analysis Algorithm

1. **Text Preprocessing**
   - Normalize text (lowercase, remove special characters)
   - Remove stopwords (common words like "the", "and")
   - Apply stemming to capture word variations

2. **Skill Extraction**
   - Match against 200+ curated technical skills
   - Handle synonyms and variations
   - Calculate skill coverage percentage

3. **Keyword Analysis**
   - Extract top keywords from JD by frequency
   - Match with resume keywords
   - Identify missing critical terms

4. **Contextual Matching**
   - Recognize technology synonyms
   - Match related concepts
   - Understand technical variations

5. **Score Calculation**
   ```
   Final Score = (Skill Match × 0.5) + 
                 (Keyword Match × 0.25) + 
                 (Context Match × 0.15) + 
                 (Length Score × 0.1)
   ```

6. **Result Generation**
   - Overall score (0-100)
   - Rating label (Excellent/Good/Fair/Needs Review)
   - Matched skills list
   - Missing skills identification
   - Top 5 improvement suggestions

## 🔧 Customization

### Adjusting Scoring Weights

Edit `src/utils/analyzer.js`:

```javascript
const SKILL_WEIGHT = 0.5      // Skills importance
const KEYWORD_WEIGHT = 0.25   // Keywords importance
const CONTEXTUAL_WEIGHT = 0.15 // Context importance
const LENGTH_WEIGHT = 0.1     // Resume length importance
```

### Adding Custom Skills

Edit `src/data/skills.json`:

```json
[
  "your-custom-skill",
  "another-skill",
  ...
]
```

### Theme Customization

Edit CSS variables in `src/styles.css`:

```css
:root {
  --accent: #22d3ee;      /* Primary accent color */
  --purple: #a855f7;      /* Secondary accent */
  --good: #22c55e;        /* Success color */
  --danger: #ef4444;      /* Error color */
  ...
}
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- **First Load**: ~100KB gzipped
- **Analysis Speed**: <50ms for typical documents
- **No External Dependencies**: Pure React + Vite
- **Optimized Bundle**: Code splitting enabled
- **PWA Cacheable**: Offline capable

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] PDF resume parsing
- [ ] DOCX file support
- [ ] More export formats (PDF with charts)
- [ ] Advanced analytics dashboard
- [ ] Historical comparison
- [ ] Team collaboration features
- [ ] Custom skill database management
- [ ] Multi-language support

## 🐛 Known Limitations

- Only supports `.txt` files (plain text)
- English language optimized
- Client-side only (large files may impact performance)
- No persistent storage (intentional for privacy)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Aanish Nithin**

- GitHub: [@Aanishnithin07](https://github.com/Aanishnithin07)
- Project Link: [https://github.com/Aanishnithin07/FitForge](https://github.com/Aanishnithin07/FitForge)

## 🙏 Acknowledgments

- React.js Team for the amazing framework
- Vite for lightning-fast development
- The open-source community
- HR professionals who inspired this tool

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ❤️ for HR professionals worldwide

</div>



