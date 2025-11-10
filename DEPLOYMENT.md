# 🚀 Deployment Guide

## GitHub Pages Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Enable GitHub Pages in your repository**:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Update `vite.config.js`**:
   ```js
   base: '/your-repo-name/'  // Change to your repository name
   ```

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

4. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically build and deploy your site.

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# Navigate to dist folder
cd dist

# Initialize git and push to gh-pages branch
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f git@github.com:USERNAME/REPO.git main:gh-pages

cd ..
```

## Vercel Deployment

1. Import your GitHub repository to Vercel
2. Vercel will auto-detect Vite
3. Deploy!

## Netlify Deployment

1. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. Drag and drop the `dist` folder, or connect your GitHub repo

## Environment Variables

No environment variables required for this project!

## Troubleshooting

### Assets not loading
Make sure `base` in `vite.config.js` matches your deployment path:
- GitHub Pages: `/repo-name/`
- Root domain: `/`

### White screen
Check browser console for errors. Common issues:
- Incorrect base path
- Missing dependencies
- Browser doesn't support WebGL

## Performance Tips

- Enable compression on your hosting platform
- Use CDN for static assets
- Enable caching headers
