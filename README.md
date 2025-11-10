# Vue 3 + Three.js Demo

A stunning 3D visualization demo featuring volumetric clouds, flocking birds, and interactive effects built with Vue 3 and Three.js.

## ✨ Features

- **GPU-Accelerated Bird Flocking**: 2000+ birds using GPGPU and Boids algorithm
- **Volumetric Cloud Rendering**: Custom GLSL shaders with ray marching
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Camera**: OrbitControls for scene exploration

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Build for deployment
npm run build

# Preview production build
npm run preview
```

## 📦 GitHub Pages Deployment

1. **Update repository name in `vite.config.js`**:
   ```js
   base: '/your-repo-name/'  // Change this to your GitHub repo name
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   - Push the `dist` folder to `gh-pages` branch, or
   - Use GitHub Actions (see `.github/workflows/deploy.yml`)

## 主要功能

### � 3D 渲染技術
- **體積雲渲染** - 使用自定義 GLSL Shader 實現逼真的 3D 雲朵效果
- **鳥群模擬** - GPGPU 加速的 Boids 算法，2000+ 鳥隻即時模擬
- **GLTF 模型** - 載入 Three.js 官方 Flamingo 模型，InstancedMesh 優化渲染
- **OrbitControls** - 滑鼠互動式 3D 場景控制

### 🌊 Canvas 2D 動畫
- **多層波浪** - 三層獨立漸層波浪動畫系統
- **氣泡粒子** - 上升氣泡效果與漸層色彩過渡
- **魚群 AI** - 驚嚇逃離、點擊吸引、自由巡遊行為模擬
- **互動效果** - 滑鼠懸停與點擊觸發不同動畫

### 💻 前端技術亮點
- ✅ Vue 3 Composition API 與 shallowRef 性能優化
- ✅ Three.js GPUComputationRenderer 實現 Boids 算法
- ✅ 自定義 GLSL Fragment/Vertex Shader
- ✅ Canvas API 實現流體動畫與粒子系統
- ✅ lil-gui 即時調試面板（F10 開啟）
- ✅ 響應式 RWD 設計，支援手機/平板/桌面
- ✅ Vite 快速建置與熱更新開發體驗

## 🛠️ Tech Stack

- **Vue 3.3.4** - Progressive JavaScript framework with Composition API
- **Three.js 0.181.0** - 3D graphics library with WebGL
- **Vite 4.4.9** - Lightning-fast build tool
- **Sass 1.93.3** - CSS preprocessor
- **Core Technologies**: 
  - GLSL Shaders (Custom volumetric rendering)
  - GPUComputationRenderer (Boids algorithm)
  - InstancedMesh (Optimized rendering)
  - OrbitControls (Camera interaction)

## 📁 Project Structure

```
sky_bird/
├── public/                  # Static assets
│   ├── perlin256.png       # Perlin noise texture
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── BirdsGPGPU.vue  # GPGPU bird flocking component
│   ├── utils/
│   │   └── SkyCloudMesh.min.js  # Volumetric cloud shader
│   ├── assets/             # Images and SVG icons
│   ├── App.vue             # Main application component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── .gitignore              # Git ignore rules
```

## 🎮 Usage

### Interactive Controls
- **Mouse Drag** - Rotate the 3D scene
- **Mouse Wheel** - Zoom in/out
- **Arrow Keys** - Pan camera

### Performance
- **Desktop**: 2000+ birds with smooth 60 FPS
- **Mobile**: Optimized rendering with responsive design

## 🌐 Browser Support

- ✅ Chrome / Edge (Recommended) - Full WebGL 2.0 support
- ✅ Firefox - Good support
- ⚠️ Safari - Basic support (some shader features may be limited)

## 📄 License

MIT License - Free to use for learning and experimentation!

## 🙏 Acknowledgments

- Three.js community for excellent documentation
- Vue.js team for the amazing framework
- WebGL and GLSL shader community
