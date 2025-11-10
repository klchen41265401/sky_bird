<template>
  <div class="sky-container">
    <canvas ref="skyCanvas" class="sky-canvas"></canvas>
    <BirdsGPGPU v-if="scene && renderer && camera" ref="birdsRef" :scene="scene" :renderer="renderer" :camera="camera" />
    <div class="bottom-white"></div>
    <div class="download-section">
      <h1>Vue 3 + Vite + Three.js Prototype</h1>
      
      <!-- Technical Features Section -->
      <div class="internal-link-section">
        <h2>Core Technologies</h2>
        <div class="link-grid">
          <div class="link-card">
            <h3>Three.js GPGPU</h3>
            <a href="#" class="access-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Bird Flocking Demo
            </a>
          </div>
          
          <div class="link-card">
            <h3>Custom Shaders</h3>
            <a href="#" class="access-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Volumetric Rendering
            </a>
          </div>
          
          <div class="link-card">
            <h3>Canvas 2D</h3>
            <a href="#" class="access-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Wave Animation System
            </a>
          </div>
          
          <div class="link-card">
            <h3>Vue Composition</h3>
            <a href="#" class="access-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Reactive Components
            </a>
          </div>
        </div>
      </div>
      
      <!-- Demo Features Section -->
      <div class="apk-section">
        <h2>Demo Feature List</h2>
        <div class="apk-card">
          <h3>Interactive Experience</h3>
          <div class="apk-buttons">
            <a href="#" class="download-button primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Smooth Interactions
            </a>
            <button @click="showHistoryModal = true" class="history-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="showHistoryModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Technical Details</h2>
          <button class="close-button" @click="showHistoryModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <table>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Implementation Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GPU Compute Shader</td>
                <td>Utilizes Three.js GPUComputationRenderer to implement Boids algorithm for 2000+ bird flock simulation</td>
              </tr>
              <tr>
                <td>Volumetric Rendering</td>
                <td>Custom GLSL shader implementing 3D volumetric clouds with ray marching and Perlin noise sampling</td>
              </tr>
              <tr>
                <td>Canvas 2D Animation</td>
                <td>Multi-layer wave animation system supporting gradient waves and particle effects</td>
              </tr>
              <tr>
                <td>Vue 3 Composition API</td>
                <td>Uses shallowRef for Three.js objects to avoid deep reactivity performance overhead</td>
              </tr>
              <tr>
                <td>GLTF Model Loading</td>
                <td>Supports loading Three.js official Flamingo model and renders as InstancedMesh for optimization</td>
              </tr>
              <tr>
                <td>lil-gui Debug Panel</td>
                <td>F10 shortcut toggles panel to adjust Boids parameters (separation, alignment, cohesion, freedom)</td>
              </tr>
              <tr>
                <td>OrbitControls</td>
                <td>Three.js camera controls supporting mouse rotation, zoom, and damping effects</td>
              </tr>
              <tr>
                <td>Responsive Design</td>
                <td>Adapts to window size changes and automatically adjusts Canvas dimensions</td>
              </tr>
              <tr>
                <td>Vite Build Tool</td>
                <td>Fast hot reload development experience with Vue SFC and GLSL Shader module support</td>
              </tr>
              <tr>
                <td>Three.js MeshPhongMaterial</td>
                <td>Bird models use Phong lighting material with directional and ambient light rendering</td>
              </tr>
              <tr>
                <td>Fish School AI Behavior</td>
                <td>Canvas fish implement flee, separation, attraction, and autonomous patrol behavior patterns</td>
              </tr>
              <tr>
                <td>Gradient Color System</td>
                <td>Three-layer waves using different gradient configurations (green-white, blue-white, purple-white)</td>
              </tr>
              <tr>
                <td>Sass Preprocessor</td>
                <td>Supports CSS nesting syntax for better style management and maintainability</td>
              </tr>
              <tr>
                <td>InstancedMesh Rendering</td>
                <td>Single draw call renders 2000+ birds, significantly improving GPU rendering efficiency</td>
              </tr>
              <tr>
                <td>Express Server</td>
                <td>Node.js Express server for production static file serving</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SkyCloudMesh } from './utils/SkyCloudMesh.min.js'
import BirdsGPGPU from './components/BirdsGPGPU.vue'

const showHistoryModal = ref(false)
const skyCanvas = ref(null)
const birdsRef = ref(null)

const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)

let controls, skyMesh
let clock = new THREE.Clock()
let elapsedTime = 0
let sunAngle = 0
let sunDirection = new THREE.Vector3()

const params = {
  cloudCoverage: 0.45,
  cloudHeight: 600.0,
  cloudThickness: 45.0,
  cloudAbsorption: 1.030725,
  windSpeedX: 5.0,
  windSpeedZ: 3.0,
  sunSpeed: 0.0,              // Sun is static
  exposure: 1.5,
  maxCloudDistance: 10000.0
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (renderer.value) {
    renderer.value.dispose()
  }
})

function init() {
  // Scene
  scene.value = new THREE.Scene()
  // No background set - SkyCloudMesh shader controls sky color
  
  // Camera
  camera.value = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    30000
  )
  camera.value.position.set(0, 0, 350)  // Official Three.js example value
  camera.value.lookAt(0, 0, 0)
  
  // Renderer
  renderer.value = new THREE.WebGLRenderer({
    canvas: skyCanvas.value,
    antialias: true
  })
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  renderer.value.setPixelRatio(window.devicePixelRatio)
  renderer.value.toneMapping = THREE.LinearToneMapping
  renderer.value.toneMappingExposure = 2.0
  
  // Controls
  controls = new OrbitControls(camera.value, renderer.value.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 100
  controls.maxDistance = 5000  // Increased from 2000 to 5000
  controls.maxPolarAngle = Math.PI * 0.48
  controls.minPolarAngle = 0.1
  
  // SkyCloudMesh
  skyMesh = new SkyCloudMesh({
    ...params,
    perlinTextureUrl: `${import.meta.env.BASE_URL}perlin256.png`
  })
  scene.value.add(skyMesh)
}

function onWindowResize() {
  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  if (skyMesh && skyMesh.material && skyMesh.material.uniforms.uResolution) {
    skyMesh.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  }
}

function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  elapsedTime = clock.getElapsedTime()
  
  // Sun fixed at top 1/4 of screen (camera looks toward -Z)
  sunDirection.set(
    0.0,          // Centered on X-axis
    0.8,          // Height at top 1/4 position (Y-axis up)
    -1.0          // Camera looks toward -Z, sun also in -Z
  )
  sunDirection.normalize()
  
  // Update SkyCloudMesh
  if (skyMesh && skyMesh.updateSun) skyMesh.updateSun(sunDirection)
  if (skyMesh && skyMesh.updateTime) skyMesh.updateTime(elapsedTime)
  
  // Update bird flock
  if (birdsRef.value && birdsRef.value.update) {
    birdsRef.value.update()
  }
  
  controls.update()
  renderer.value.render(scene.value, camera.value)
}
</script>

<style scoped>
.sky-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #87CEEB; /* Sky blue background - matches Three.js scene */
}

.sky-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: transparent;
}

/* Bottom white section */
.bottom-white {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background: #FFFFFF;
  z-index: 0;
}

.brand-logo {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
  border: none !important;
  outline: none !important;
  background: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0;
  margin: 0;
}

.brand-logo a {
  display: block;
  text-decoration: none;
  line-height: 0;
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 0;
  margin: 0;
}

.brand-logo a:focus,
.brand-logo a:hover,
.brand-logo a:active {
  outline: none !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
}

.brand-logo img {
  height: 80px;
  width: auto;
  display: block;
  filter: none !important;
  transition: height 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  padding: 0;
  margin: 0;
}

.download-section {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
  padding: 150px 20px 60px;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 50px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
  font-weight: bold;
  line-height: 1.2;
  word-break: break-word;
}

h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
}

h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
}

.internal-link-section {
  background: linear-gradient(to bottom, 
    rgba(160, 245, 255, 0.5) 0%, 
    rgba(207, 250, 255, 0.5) 29%, 
    rgba(231, 253, 255, 0.5) 57%, 
    rgba(243, 254, 255, 0.5) 89%, 
    rgba(255, 255, 255, 0.5) 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.link-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.4);
}

.link-card h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.access-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(90deg, #399DFF 0%, #6BC5FF 20%, #9CECFF 40%, #CDF5FF 69%, #E6FAFF 89%, #FFFFFF 100%);
  color: #2c3e50;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(57, 157, 255, 0.4);
}

.access-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(57, 157, 255, 0.6);
}

.access-button svg {
  width: 22px;
  height: 22px;
}

.current-version,
.history-versions {
  background: linear-gradient(to bottom, 
    rgba(160, 245, 255, 0.5) 0%, 
    rgba(207, 250, 255, 0.5) 29%, 
    rgba(231, 253, 255, 0.5) 57%, 
    rgba(243, 254, 255, 0.5) 89%, 
    rgba(255, 255, 255, 0.5) 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

thead {
  background: rgba(51, 145, 255, 0.8);
}

thead th {
  color: white;
  padding: 16px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

thead th:first-child {
  border-top-left-radius: 8px;
  text-align: left;
  padding-left: 30px;
  width: 70%;
}

thead th:last-child {
  border-top-right-radius: 8px;
  width: 30%;
}

tbody tr {
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

tbody tr:nth-child(even) {
  background: rgba(162, 226, 227, 0.2);
}

tbody tr:hover {
  background: rgba(147, 221, 241, 0.4);
}

tbody td {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

tbody td:first-child {
  padding-left: 30px;
  font-weight: 500;
  color: #2c3e50;
}

tbody td:last-child {
  text-align: center;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

tbody tr:last-child td {
  border-bottom: none;
}

a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  background: rgba(51, 145, 255, 0.9);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(51, 145, 255, 0.3);
}

a:hover {
  box-shadow: 0 4px 12px rgba(51, 145, 255, 0.5);
  transform: scale(1.05);
}

a svg {
  width: 18px;
  height: 18px;
}

.current-version thead {
  background: rgba(56, 239, 125, 0.8);
}

.current-version table tbody tr:nth-child(even) {
  background: rgba(193, 236, 200, 0.3);
}

.current-version table tbody tr:hover {
  background: rgba(193, 236, 200, 0.5);
}

.current-version a {
  background: rgba(56, 239, 125, 0.9);
  box-shadow: 0 2px 6px rgba(56, 239, 125, 0.3);
}

.current-version a:hover {
  box-shadow: 0 4px 12px rgba(56, 239, 125, 0.5);
}

.access-button svg {
  width: 22px;
  height: 22px;
}

.apk-section {
  background: linear-gradient(to bottom, 
    rgba(160, 245, 255, 0.5) 0%, 
    rgba(207, 250, 255, 0.5) 29%, 
    rgba(231, 253, 255, 0.5) 57%, 
    rgba(243, 254, 255, 0.5) 89%, 
    rgba(255, 255, 255, 0.5) 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.apk-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.apk-card h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.apk-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(270deg, #FFFF90 14%, #C1EBC7 35%, #A2E2E3 49%, #93DDF1 63%, #3391FF 100%);
  color: #2c3e50;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(51, 145, 255, 0.4);
  border: none;
  cursor: pointer;
}

.download-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(51, 145, 255, 0.6);
}

.history-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(90deg, #399DFF 0%, #6BC5FF 20%, #9CECFF 40%, #CDF5FF 69%, #E6FAFF 89%, #FFFFFF 100%);
  color: #2c3e50;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(57, 157, 255, 0.4);
  border: none;
  cursor: pointer;
}

.history-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(57, 157, 255, 0.6);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  text-shadow: none;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-button svg {
  color: #666;
}

.modal-body {
  padding: 20px 30px;
  overflow-y: auto;
}

.modal-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.modal-body thead {
  position: sticky;
  top: 0;
  background: rgba(51, 145, 255, 0.9);
  z-index: 10;
}

.modal-body thead th {
  color: white;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}

.modal-body thead th:first-child {
  width: 60%;
  padding-left: 30px;
}

.modal-body thead th:last-child {
  text-align: center;
  width: 40%;
}

.modal-body tbody tr {
  background: white;
  transition: background 0.2s ease;
}

.modal-body tbody tr:nth-child(even) {
  background: rgba(162, 226, 227, 0.15);
}

.modal-body tbody tr:hover {
  background: rgba(147, 221, 241, 0.3);
}

.modal-body tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #2c3e50;
  font-weight: 500;
}

.modal-body tbody td:first-child {
  padding-left: 30px;
}

.modal-body tbody td:last-child {
  text-align: center;
}

.modal-body tbody tr:last-child td {
  border-bottom: none;
}

.modal-body a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: rgba(51, 145, 255, 0.9);
  color: white;
  text-decoration: none;
  border-radius: 15px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(51, 145, 255, 0.3);
}

.modal-body a:hover {
  box-shadow: 0 4px 12px rgba(51, 145, 255, 0.5);
  transform: scale(1.05);
}

.modal-body a svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .brand-logo {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .brand-logo img {
    height: 90px;
  }
  
  h1 {
    font-size: 1.7rem;
    margin-bottom: 25px;
    padding: 0 10px;
    margin-top: 50px;
  }
  
  h2 {
    font-size: 1.2rem;
  }
  
  .download-section {
    padding: 120px 15px 40px;
    max-width: 100%;
  }
  
  .internal-link-section,
  .apk-section {
    padding: 20px 15px;
    border-radius: 8px;
  }
  
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .link-card {
    padding: 12px;
  }
  
  .link-card h3 {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }
  
  .access-button {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .access-button svg {
    width: 16px;
    height: 16px;
  }
  
  .apk-card {
    padding: 15px;
  }
  
  .apk-card h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
  
  .apk-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .download-button,
  .history-button {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    font-size: 1rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 85vh;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-header h2 {
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 15px 20px;
  }
  
  .modal-body table {
    font-size: 0.85rem;
  }
  
  .modal-body thead th,
  .modal-body tbody td {
    padding: 10px 12px;
  }
  
  .modal-body thead th:first-child,
  .modal-body tbody td:first-child {
    padding-left: 15px;
  }
  
  .modal-body a {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
  
  .modal-body a svg {
    width: 14px;
    height: 14px;
  }
}

/* Tablet size */
@media (min-width: 769px) and (max-width: 1024px) {
  .brand-logo {
    top: 15px;
    left: 15px;
  }
  
  .brand-logo img {
    height: 80px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .download-section {
    padding: 120px 30px 50px;
  }
  
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .internal-link-section,
  .apk-section {
    padding: 25px;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .brand-logo {
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .brand-logo img {
    height: 90px;
  }
  
  h1 {
    font-size: 1.45rem;
    margin-bottom: 18px;
    line-height: 1.3;
    margin-top: 45px;
  }
  
  h2 {
    font-size: 1.05rem;
    margin-bottom: 12px;
  }
  
  .download-section {
    padding: 115px 10px 30px;
  }
  
  .internal-link-section,
  .apk-section {
    padding: 15px 10px;
    margin-bottom: 20px;
  }
  
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .link-card {
    padding: 10px;
  }
  
  .link-card h3 {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  
  .access-button {
    padding: 8px 12px;
    font-size: 0.8rem;
    white-space: nowrap;
  }
  
  .access-button svg {
    width: 14px;
    height: 14px;
  }
  
  .download-button,
  .history-button {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
  
  .modal-content {
    width: 98%;
  }
  
  .modal-header {
    padding: 12px 15px;
  }
  
  .modal-header h2 {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 12px 15px;
  }
  
  .modal-body table {
    font-size: 0.8rem;
  }
  
  .modal-body thead th,
  .modal-body tbody td {
    padding: 8px 10px;
  }
  
  .modal-body thead th:first-child,
  .modal-body tbody td:first-child {
    padding-left: 12px;
  }
}

/* Large screen optimization */
@media (min-width: 1440px) {
  .download-section {
    max-width: 1200px;
  }
  
  .link-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Landscape mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .brand-logo {
    top: 5px;
    left: 5px;
    transform: none;
  }
  
  .brand-logo img {
    height: 35px;
  }
  
  .download-section {
    padding-top: 60px;
  }
  
  h1 {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }
}
</style>
