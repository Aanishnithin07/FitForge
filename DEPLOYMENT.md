# 🚀 Deployment Guide for FitForge

## Quick Deploy Options

### 1. Vercel (Recommended) ⚡

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aanishnithin07/FitForge)

**Manual Deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to project directory
cd hr-fitforge

# Deploy
vercel
```

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `hr-fitforge`
- Framework: Vite

### 2. Netlify 🌐

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to project
cd hr-fitforge

# Deploy
netlify deploy --prod
```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### 3. GitHub Pages 📄

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Configure `vite.config.js`:**
```javascript
export default {
  base: '/FitForge/'
}
```

### 4. Cloudflare Pages ☁️

1. Push code to GitHub
2. Go to Cloudflare Pages dashboard
3. Connect repository
4. Build Settings:
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `hr-fitforge`

### 5. AWS Amplify 📦

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

## Environment Variables

No environment variables needed! FitForge is 100% client-side.

## Build Verification

Before deployment, always verify the build:

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Deployment Checklist ✅

- [ ] All dependencies installed (`npm install`)
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in preview
- [ ] Theme toggle works
- [ ] File upload works
- [ ] Analysis generates correct results
- [ ] Export functions work
- [ ] Mobile responsive
- [ ] PWA manifest accessible
- [ ] Favicon displays correctly

## Performance Optimization

Already included in the project:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ CSS optimization
- ✅ Asset compression
- ✅ Lazy loading

## SEO Optimization

Already configured:
- ✅ Meta tags
- ✅ Open Graph
- ✅ Twitter Cards
- ✅ Structured Data (JSON-LD)
- ✅ Semantic HTML
- ✅ Sitemap ready

## SSL/HTTPS

All recommended platforms (Vercel, Netlify, etc.) provide automatic SSL certificates.

## Custom Domain Setup

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Monitoring & Analytics (Optional)

To add analytics while maintaining privacy:

1. **Plausible** (Privacy-friendly)
2. **Fathom Analytics**
3. **Simple Analytics**

Add the script tag to `index.html`:

```html
<!-- Example: Plausible -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Assets Not Loading
- Check `base` path in `vite.config.js`
- Verify `dist` folder contains all assets
- Check browser console for 404 errors

### Styles Not Applied
- Clear browser cache
- Check if CSS file is imported in `main.jsx`
- Verify build output includes CSS files

## Post-Deployment

1. **Test on Multiple Devices**
   - Desktop browsers
   - Mobile devices
   - Tablets

2. **Performance Testing**
   - Run Lighthouse audit
   - Check loading speed
   - Verify PWA score

3. **Share Your Project**
   - Update README with live demo link
   - Share on social media
   - Add to portfolio

## Support

If you encounter issues:
1. Check [GitHub Issues](https://github.com/Aanishnithin07/FitForge/issues)
2. Review deployment logs
3. Verify all files are committed
4. Check build output for errors

---

**🎉 Congratulations on deploying FitForge!**

Remember to star the repo: ⭐ [FitForge](https://github.com/Aanishnithin07/FitForge)
