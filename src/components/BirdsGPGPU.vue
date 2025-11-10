<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import GUI from 'lil-gui'

const props = defineProps({
  scene: Object,
  renderer: Object,
  camera: Object
})

/* 鳥群數量設定 */
const WIDTH = 45  // 45x45 = 2025 隻（接近 2000）
const BIRDS = WIDTH * WIDTH  // 2025 隻

const BOUNDS = 800  // 官方範例值
const BOUNDS_HALF = BOUNDS / 2

let gpuCompute
let velocityVariable
let positionVariable
let positionUniforms
let velocityUniforms
let birdUniforms
let birdMesh
let last = performance.now()
let gui = null
let mixer = null // 動畫混合器
let flamingos = [] // 儲存所有紅鶴的動畫混合器
let lights = [] // 儲存光源以便清理

// 控制參數 - 預設值調整為裝飾性鳥群
const effectController = {
  separation: 100.0,   // 分離距離（截圖值）
  alignment: 71.0,     // 對齊距離（截圖值）
  cohesion: 50.0,      // 聚合距離（截圖值）
  freedom: 0.0,        // 自由度（截圖值）
  size: 8,
  count: BIRDS,
  wingSpeed: 0.6       // 拍翅膀速度（截圖值）
}

// 創建白鷺鷥模型（根據線條圖 - 有長脖子和大翅膀）
function createBirdGeometry() {
  const geometry = new THREE.BufferGeometry()
  const trianglesPerBird = 10 // 增加三角形數量來做更細緻的鳥
  const triangles = BIRDS * trianglesPerBird
  const points = triangles * 3

  const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
  const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
  const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2)
  const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1)

  geometry.setAttribute('position', vertices)
  geometry.setAttribute('birdColor', birdColors)
  geometry.setAttribute('reference', references)
  geometry.setAttribute('birdVertex', birdVertex)

  let v = 0

  function verts_push(...args) {
    for (let i = 0; i < args.length; i++) {
      vertices.array[v++] = args[i]
    }
  }

  for (let f = 0; f < BIRDS; f++) {
    // === 身體（橢圓形） ===
    verts_push(
      0, 0, 0,
      -3, -2, -5,
      3, -2, -5
    )
    verts_push(
      0, 0, 0,
      -3, -2, -5,
      0, -3, -10
    )
    verts_push(
      0, 0, 0,
      3, -2, -5,
      0, -3, -10
    )

    // === 長脖子（向前伸） ===
    verts_push(
      0, 0, 0,
      0, 2, 10,
      -1, 1, 5
    )
    verts_push(
      0, 0, 0,
      0, 2, 10,
      1, 1, 5
    )
    
    // === 頭和尖嘴 ===
    verts_push(
      0, 2, 10,
      0, 3, 15,
      0, 2.5, 12
    )

    // === 左翅膀（大而優雅） ===
    verts_push(
      0, 0, -2,
      -30, 3, -8,
      -30, -2, -5
    )
    verts_push(
      0, 0, -2,
      -30, -2, -5,
      -15, -2, -3
    )

    // === 右翅膀（鏡像） ===
    verts_push(
      0, 0, -2,
      30, 3, -8,
      30, -2, -5
    )
    verts_push(
      0, 0, -2,
      30, -2, -5,
      15, -2, -3
    )
  }

  // 顏色和引用
  for (let v = 0; v < triangles * 3; v++) {
    const triangleIndex = ~~(v / 3)
    const birdIndex = ~~(triangleIndex / trianglesPerBird)
    const x = (birdIndex % WIDTH) / WIDTH
    const y = ~~(birdIndex / WIDTH) / WIDTH

    const c = new THREE.Color(0xffffff)

    birdColors.array[v * 3 + 0] = c.r
    birdColors.array[v * 3 + 1] = c.g
    birdColors.array[v * 3 + 2] = c.b

    references.array[v * 2] = x
    references.array[v * 2 + 1] = y

    birdVertex.array[v] = v % (trianglesPerBird * 3)
  }

  geometry.scale(0.2, 0.2, 0.2)

  return geometry
}

// 舊的簡單幾何體（備用）
class BirdGeometry extends THREE.BufferGeometry {
  constructor() {
    super()

    const trianglesPerBird = 3
    const triangles = BIRDS * trianglesPerBird
    const points = triangles * 3

    const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
    const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
    const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2)
    const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1)

    this.setAttribute('position', vertices)
    this.setAttribute('birdColor', birdColors)
    this.setAttribute('reference', references)
    this.setAttribute('birdVertex', birdVertex)

    let v = 0

    function verts_push() {
      for (let i = 0; i < arguments.length; i++) {
        vertices.array[v++] = arguments[i]
      }
    }

    const wingsSpan = 20

    for (let f = 0; f < BIRDS; f++) {
      // Body
      verts_push(
        0, -0, -20,
        0, 4, -20,
        0, 0, 30
      )

      // Wings
      verts_push(
        0, 0, -15,
        -wingsSpan, 0, 0,
        0, 0, 15
      )

      verts_push(
        0, 0, 15,
        wingsSpan, 0, 0,
        0, 0, -15
      )
    }

    for (let v = 0; v < triangles * 3; v++) {
      const triangleIndex = ~~(v / 3)
      const birdIndex = ~~(triangleIndex / trianglesPerBird)
      const x = (birdIndex % WIDTH) / WIDTH
      const y = ~~(birdIndex / WIDTH) / WIDTH

      const c = new THREE.Color(
        0x666666 +
        ~~(v / 9) / BIRDS * 0x666666
      )

      birdColors.array[v * 3 + 0] = c.r
      birdColors.array[v * 3 + 1] = c.g
      birdColors.array[v * 3 + 2] = c.b

      references.array[v * 2] = x
      references.array[v * 2 + 1] = y

      birdVertex.array[v] = v % 9
    }

    this.scale(0.2, 0.2, 0.2)
  }
}

// Position Shader
const fragmentShaderPosition = `
  uniform float time;
  uniform float delta;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D(texturePosition, uv);
    vec3 position = tmpPos.xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    float phase = tmpPos.w;

    phase = mod((phase + delta +
      length(velocity.xz) * delta * 3. +
      max(velocity.y, 0.0) * delta * 6.), 62.83);

    gl_FragColor = vec4(position + velocity * delta * 15., phase);
  }
`

// Velocity Shader
const fragmentShaderVelocity = `
  uniform float time;
  uniform float testing;
  uniform float delta;
  uniform float separationDistance;
  uniform float alignmentDistance;
  uniform float cohesionDistance;
  uniform float freedomFactor;
  uniform vec3 predator;

  const float width = resolution.x;
  const float height = resolution.y;

  const float PI = 3.141592653589793;
  const float PI_2 = PI * 2.0;

  float zoneRadius = 40.0;
  float zoneRadiusSquared = 1600.0;

  float separationThresh = 0.45;
  float alignmentThresh = 0.65;

  const float UPPER_BOUNDS = BOUNDS;
  const float LOWER_BOUNDS = -UPPER_BOUNDS;

  const float SPEED_LIMIT = 9.0;  // 官方 Three.js 範例值

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    separationThresh = separationDistance / zoneRadius;
    alignmentThresh = (separationDistance + alignmentDistance) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 birdPosition, birdVelocity;

    vec3 selfPosition = texture2D(texturePosition, uv).xyz;
    vec3 selfVelocity = texture2D(textureVelocity, uv).xyz;

    float dist;
    vec3 dir;
    float distSquared;

    float separationSquared = separationDistance * separationDistance;
    float cohesionSquared = cohesionDistance * cohesionDistance;

    float f;
    float percent;

    vec3 velocity = selfVelocity;

    float limit = SPEED_LIMIT;

    dir = predator * UPPER_BOUNDS - selfPosition;
    dir.z = 0.;
    dist = length(dir);
    distSquared = dist * dist;

    float preyRadius = 150.0;
    float preyRadiusSq = preyRadius * preyRadius;

    // move birds away from predator
    if (dist < preyRadius) {
      f = (distSquared / preyRadiusSq - 1.0) * delta * 100.;
      velocity += normalize(dir) * f;
      limit += 5.0;
    }

    // Attract flocks to the center
    vec3 central = vec3(0., 0., 0.);
    dir = selfPosition - central;
    dist = length(dir);

    dir.y *= 2.5;
    velocity -= normalize(dir) * delta * 5.;

    for (float y = 0.0; y < height; y++) {
      for (float x = 0.0; x < width; x++) {
        vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
        birdPosition = texture2D(texturePosition, ref).xyz;

        dir = birdPosition - selfPosition;
        dist = length(dir);

        if (dist < 0.0001) continue;

        distSquared = dist * dist;

        if (distSquared > zoneRadiusSquared) continue;

        percent = distSquared / zoneRadiusSquared;

        if (percent < separationThresh) {
          // Separation
          f = (separationThresh / percent - 1.0) * delta;
          velocity -= normalize(dir) * f;
        } else if (percent < alignmentThresh) {
          // Alignment
          float threshDelta = alignmentThresh - separationThresh;
          float adjustedPercent = (percent - separationThresh) / threshDelta;

          birdVelocity = texture2D(textureVelocity, ref).xyz;

          f = (0.5 - cos(adjustedPercent * PI_2) * 0.5 + 0.5) * delta;
          velocity += normalize(birdVelocity) * f;
        } else {
          // Cohesion
          float threshDelta = 1.0 - alignmentThresh;
          float adjustedPercent;
          if(threshDelta == 0.) adjustedPercent = 1.;
          else adjustedPercent = (percent - alignmentThresh) / threshDelta;

          f = (0.5 - (cos(adjustedPercent * PI_2) * -0.5 + 0.5)) * delta;

          velocity += normalize(dir) * f;
        }
      }
    }

    // Speed Limits
    if (length(velocity) > limit) {
      velocity = normalize(velocity) * limit;
    }

    gl_FragColor = vec4(velocity, 1.0);
  }
`

// Bird Vertex Shader
const birdVS = `
  attribute vec2 reference;
  attribute float birdVertex;
  attribute vec3 birdColor;

  uniform sampler2D texturePosition;
  uniform sampler2D textureVelocity;

  varying vec4 vColor;
  varying float z;

  uniform float time;

  void main() {
    vec4 tmpPos = texture2D(texturePosition, reference);
    vec3 pos = tmpPos.xyz;
    vec3 velocity = normalize(texture2D(textureVelocity, reference).xyz);

    vec3 newPosition = position;

    if (birdVertex == 4.0 || birdVertex == 7.0) {
      // flap wings
      newPosition.y = sin(tmpPos.w) * 5.;
    }

    newPosition = mat3(modelMatrix) * newPosition;

    velocity.z *= -1.;
    float xz = length(velocity.xz);
    float xyz = 1.;
    float x = sqrt(1. - velocity.y * velocity.y);

    float cosry = velocity.x / xz;
    float sinry = velocity.z / xz;

    float cosrz = x / xyz;
    float sinrz = velocity.y / xyz;

    mat3 maty = mat3(
      cosry, 0, -sinry,
      0    , 1, 0     ,
      sinry, 0, cosry
    );

    mat3 matz = mat3(
      cosrz , sinrz, 0,
      -sinrz, cosrz, 0,
      0     , 0    , 1
    );

    newPosition = maty * matz * newPosition;
    newPosition += pos;

    z = newPosition.z;

    vColor = vec4(birdColor, 1.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(newPosition, 1.0);
  }
`

// Bird Fragment Shader
const birdFS = `
  varying vec4 vColor;
  varying float z;

  uniform vec3 color;

  void main() {
    // Fake colors for now
    float z2 = 0.2 + (1000. - z) / 1000. * vColor.x;
    gl_FragColor = vec4(z2, z2, z2, 1.);
  }
`

function initComputeRenderer() {
  gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, props.renderer)

  const dtPosition = gpuCompute.createTexture()
  const dtVelocity = gpuCompute.createTexture()
  fillPositionTexture(dtPosition)
  fillVelocityTexture(dtVelocity)

  velocityVariable = gpuCompute.addVariable('textureVelocity', fragmentShaderVelocity, dtVelocity)
  positionVariable = gpuCompute.addVariable('texturePosition', fragmentShaderPosition, dtPosition)

  gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])
  gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])

  positionUniforms = positionVariable.material.uniforms
  velocityUniforms = velocityVariable.material.uniforms

  positionUniforms['time'] = { value: 0.0 }
  positionUniforms['delta'] = { value: 0.0 }
  velocityUniforms['time'] = { value: 1.0 }
  velocityUniforms['delta'] = { value: 0.0 }
  velocityUniforms['testing'] = { value: 1.0 }
  velocityUniforms['separationDistance'] = { value: effectController.separation }
  velocityUniforms['alignmentDistance'] = { value: effectController.alignment }
  velocityUniforms['cohesionDistance'] = { value: effectController.cohesion }
  velocityUniforms['freedomFactor'] = { value: effectController.freedom }
  velocityUniforms['predator'] = { value: new THREE.Vector3() }
  velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2)

  velocityVariable.wrapS = THREE.RepeatWrapping
  velocityVariable.wrapT = THREE.RepeatWrapping
  positionVariable.wrapS = THREE.RepeatWrapping
  positionVariable.wrapT = THREE.RepeatWrapping

  const error = gpuCompute.init()

  if (error !== null) {
    console.error(error)
  }
}

// 備用函數：使用簡單幾何體
function initFallbackBirds() {
  console.log('使用備用幾何體...')
  
  const geometry = createBirdGeometry()
  geometry.scale(effectController.size, effectController.size, effectController.size)
  
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  })
  
  birdMesh = new THREE.InstancedMesh(geometry, material, BIRDS)
  
  // 初始化每隻鳥的位置
  const dummy = new THREE.Object3D()
  for (let i = 0; i < BIRDS; i++) {
    const x = (Math.random() - 0.5) * BOUNDS
    const y = (Math.random() - 0.5) * BOUNDS
    const z = (Math.random() - 0.5) * BOUNDS
    
    dummy.position.set(x, y, z)
    dummy.rotation.y = Math.random() * Math.PI * 2
    dummy.updateMatrix()
    birdMesh.setMatrixAt(i, dummy.matrix)
  }
  
  birdMesh.instanceMatrix.needsUpdate = true
  props.scene.add(birdMesh)
  
  console.log('已加入', BIRDS, '隻鳥到場景（備用幾何體）')
}

function initBirds() {
  console.log('載入 Three.js 官方紅鶴模型...')
  
  const loader = new GLTFLoader()
  
  loader.load(
    '/Flamingo.glb',
    (gltf) => {
      console.log('✅ 紅鶴模型載入成功！')
      console.log('- 模型結構:', gltf.scene)
      
      // 找到第一個有幾何體的 mesh
      let flamingo = null
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.geometry && !flamingo) {
          flamingo = child
        }
      })
      
      if (!flamingo || !flamingo.geometry) {
        console.error('❌ 找不到有效的幾何體')
        // 使用備用幾何體
        initFallbackBirds()
        return
      }
      
      console.log('- 使用幾何體:', flamingo.name || '無名稱')
      console.log('- 頂點數:', flamingo.geometry.attributes.position.count)
      console.log('- 原始幾何體屬性:', Object.keys(flamingo.geometry.attributes))
      console.log('- 原始索引:', flamingo.geometry.index)
      
      // 🔥 關鍵修復: 強制轉換為非索引幾何體
      console.log('🔧 開始轉換幾何體...')
      let flamingoGeometry = flamingo.geometry.toNonIndexed()
      console.log('✅ 轉換完成,新頂點數:', flamingoGeometry.attributes.position.count)
      console.log('- 轉換後索引:', flamingoGeometry.index)
      console.log('- 轉換後的屬性:', Object.keys(flamingoGeometry.attributes))
      
      // 詳細檢查每個屬性
      console.log('🔍 檢查屬性細節:')
      for (const key in flamingoGeometry.attributes) {
        const attr = flamingoGeometry.attributes[key]
        console.log(`  - ${key}:`, {
          array: attr.array ? `TypedArray[${attr.array.length}]` : 'undefined',
          count: attr.count,
          itemSize: attr.itemSize,
          isBufferAttribute: attr.isBufferAttribute
        })
      }
      
      // 確保 geometry 有所有必要的屬性
      if (!flamingoGeometry.attributes.position) {
        console.error('❌ 模型缺少 position 屬性')
        initFallbackBirds()
        return
      }
      
      // 🔥 重新創建所有屬性來確保結構正確
      console.log('🔧 重新創建屬性...')
      const newGeometry = new THREE.BufferGeometry()
      
      // 複製 position
      newGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array(flamingoGeometry.attributes.position.array),
        3
      ))
      
      // 複製或計算 normal
      if (flamingoGeometry.attributes.normal) {
        newGeometry.setAttribute('normal', new THREE.BufferAttribute(
          new Float32Array(flamingoGeometry.attributes.normal.array),
          3
        ))
      } else {
        console.log('  - 計算法線...')
        newGeometry.computeVertexNormals()
      }
      
      flamingoGeometry = newGeometry
      console.log('✅ 屬性重建完成')
      console.log('- 最終屬性:', Object.keys(flamingoGeometry.attributes))
      
      // 縮放幾何體 - 縮小到 1.5%（作為裝飾性元素）
      const s = effectController.size * 0.015
      console.log('🔧 紅鶴縮放比例:', s, '(size:', effectController.size, '× 0.015)')
      flamingoGeometry.scale(s, s, s)
      
      // 計算模型尺寸
      flamingoGeometry.computeBoundingBox()
      const bbox = flamingoGeometry.boundingBox
      const size = new THREE.Vector3()
      bbox.getSize(size)
      console.log('- 紅鶴尺寸:', size)
      
      // 🎨 使用 MeshPhongMaterial - 全白
      console.log('🎨 創建 Phong 材質（全白）...')
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,      // 白色
        emissive: 0x111111,   // 微弱自發光
        shininess: 60,
        side: THREE.DoubleSide,
        flatShading: false
      })
      
      // 使用 InstancedMesh 來渲染多隻鳥
      console.log('🦩 創建 InstancedMesh（白鷺鷥）...')
      birdMesh = new THREE.InstancedMesh(flamingoGeometry, material, BIRDS)
      
      // 初始化每隻鳥的位置
      const dummy = new THREE.Object3D()
      for (let i = 0; i < BIRDS; i++) {
        const x = (Math.random() - 0.5) * BOUNDS
        const y = (Math.random() - 0.5) * BOUNDS
        const z = (Math.random() - 0.5) * BOUNDS
        
        dummy.position.set(x, y, z)
        dummy.rotation.y = Math.random() * Math.PI * 2
        dummy.updateMatrix()
        birdMesh.setMatrixAt(i, dummy.matrix)
      }
      
      birdMesh.instanceMatrix.needsUpdate = true
      props.scene.add(birdMesh)
      
      console.log('已加入', BIRDS, '隻紅鶴到場景')
      
      // 處理動畫（如果有）
      if (gltf.animations && gltf.animations.length > 0) {
        console.log('- 找到動畫:', gltf.animations.length, '個')
        // 注意：InstancedMesh 不支援骨骼動畫，所以我們只用靜態模型
      }
    },
    (progress) => {
      console.log('載入進度:', (progress.loaded / progress.total * 100).toFixed(0) + '%')
    },
    (error) => {
      console.error('❌ 載入紅鶴模型失敗:', error)
      initFallbackBirds()
    }
  )
}

function fillPositionTexture(texture) {
  const theArray = texture.image.data

  for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    const x = Math.random() * BOUNDS - BOUNDS_HALF
    const y = Math.random() * BOUNDS - BOUNDS_HALF
    const z = Math.random() * BOUNDS - BOUNDS_HALF

    theArray[k + 0] = x
    theArray[k + 1] = y
    theArray[k + 2] = z
    theArray[k + 3] = 1
  }
}

function fillVelocityTexture(texture) {
  const theArray = texture.image.data

  for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    const x = Math.random() - 0.5
    const y = Math.random() - 0.5
    const z = Math.random() - 0.5

    // 官方 Three.js 範例值
    theArray[k + 0] = x * 10
    theArray[k + 1] = y * 10
    theArray[k + 2] = z * 10
    theArray[k + 3] = 1
  }
}

function update() {
  if (!birdMesh) return
  
  const now = performance.now()
  let delta = (now - last) / 1000
  if (delta > 1) delta = 1
  last = now
  
  // 更新控制參數到 GPU
  if (velocityUniforms) {
    const paramsChanged = 
      velocityUniforms['separationDistance'].value !== effectController.separation ||
      velocityUniforms['alignmentDistance'].value !== effectController.alignment ||
      velocityUniforms['cohesionDistance'].value !== effectController.cohesion ||
      velocityUniforms['freedomFactor'].value !== effectController.freedom
    
    if (paramsChanged) {
      console.log('🔄 控制參數已變更，更新 GPU uniforms:')
      console.log('   Separation:', velocityUniforms['separationDistance'].value, '→', effectController.separation)
      console.log('   Alignment:', velocityUniforms['alignmentDistance'].value, '→', effectController.alignment)
      console.log('   Cohesion:', velocityUniforms['cohesionDistance'].value, '→', effectController.cohesion)
      console.log('   Freedom:', velocityUniforms['freedomFactor'].value, '→', effectController.freedom)
    }
    
    velocityUniforms['separationDistance'].value = effectController.separation
    velocityUniforms['alignmentDistance'].value = effectController.alignment
    velocityUniforms['cohesionDistance'].value = effectController.cohesion
    velocityUniforms['freedomFactor'].value = effectController.freedom
  }
  
  // 使用 GPU 計算的 Boids 算法
  if (gpuCompute && positionUniforms && velocityUniforms) {
    positionUniforms['time'].value = now
    positionUniforms['delta'].value = delta
    velocityUniforms['time'].value = now
    velocityUniforms['delta'].value = delta

    velocityUniforms['predator'].value.set(0, 0, 0)

    gpuCompute.compute()

    // ✅ 如果是 InstancedMesh（紅鶴模型）
    if (birdMesh.isInstancedMesh) {
      const dummy = new THREE.Object3D()
      
      // 創建緩衝區來讀取 GPU 計算結果
      const positionRenderTarget = gpuCompute.getCurrentRenderTarget(positionVariable)
      const velocityRenderTarget = gpuCompute.getCurrentRenderTarget(velocityVariable)
      
      // 使用臨時 canvas 讀取紋理數據（更穩定的方法）
      const width = WIDTH
      const height = WIDTH
      const positionData = new Float32Array(width * height * 4)
      const velocityData = new Float32Array(width * height * 4)
      
      // 安全讀取紋理數據
      try {
        props.renderer.readRenderTargetPixels(
          positionRenderTarget,
          0, 0, width, height, positionData
        )
        props.renderer.readRenderTargetPixels(
          velocityRenderTarget,
          0, 0, width, height, velocityData
        )
      } catch (error) {
        console.error('讀取 GPU 數據失敗:', error)
        return
      }
      
      // 更新每隻鳥的位置和旋轉
      for (let i = 0; i < BIRDS; i++) {
        const i4 = i * 4
        
        // 從紋理讀取位置
        const px = positionData[i4 + 0]
        const py = positionData[i4 + 1]
        const pz = positionData[i4 + 2]
        const phase = positionData[i4 + 3] // 相位用於拍翅膀
        
        // 從速度計算朝向
        const vx = velocityData[i4 + 0]
        const vy = velocityData[i4 + 1]
        const vz = velocityData[i4 + 2]
        
        // 檢查數據有效性
        if (!isFinite(px) || !isFinite(py) || !isFinite(pz)) {
          continue
        }
        
        dummy.position.set(px, py, pz)
        
        // 計算朝向（面向速度方向）
        if (vx !== 0 || vz !== 0) {
          dummy.rotation.y = Math.atan2(vx, vz)
        }
        
        // 根據垂直速度設定俯仰
        const horizontalSpeed = Math.sqrt(vx * vx + vz * vz)
        if (horizontalSpeed > 0.1) {
          dummy.rotation.x = Math.atan2(-vy, horizontalSpeed) * 0.5
        }
        
        // 轉彎時的側傾
        dummy.rotation.z = vx * 0.3
        
        // 🦩 拍翅膀動畫 - 綜合多種效果讓擺動更自然
        const wingFlap = Math.sin(phase * effectController.wingSpeed)
        
        // 1. 身體上下起伏（Y 軸位置微調）
        const bodyBob = Math.sin(phase * effectController.wingSpeed * 2) * 0.5
        dummy.position.y += bodyBob
        
        // 2. 左右擺動（Y 軸旋轉）
        dummy.rotation.y += wingFlap * 0.2
        
        // 3. 俯仰變化（X 軸旋轉微調）
        dummy.rotation.x += wingFlap * 0.15
        
        dummy.updateMatrix()
        birdMesh.setMatrixAt(i, dummy.matrix)
      }
      
      birdMesh.instanceMatrix.needsUpdate = true
    }
    // 如果是 Shader Material（備用幾何體）
    else if (birdUniforms) {
      birdUniforms['time'].value = now
      birdUniforms['delta'].value = delta
      birdUniforms['texturePosition'].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture
      birdUniforms['textureVelocity'].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture

      birdMesh.updateMatrix()
    }
  }
}

onMounted(() => {
  // 延遲初始化，確保 scene 和 renderer 已經準備好
  setTimeout(() => {
    if (props.scene && props.renderer && props.camera) {
      console.log('Initializing birds...')
      
      // 添加環境光和平行光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      props.scene.add(ambientLight)
      lights.push(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 1).normalize()
      props.scene.add(directionalLight)
      lights.push(directionalLight)
      
      console.log('✅ 已添加光源到場景')
      
      initComputeRenderer()
      initBirds()
      initGUI()
    } else {
      console.warn('Birds: scene, renderer or camera not ready')
    }
  }, 100)
  
  // F10 按鍵監聽
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (birdMesh) {
    props.scene.remove(birdMesh)
    if (birdMesh.geometry) birdMesh.geometry.dispose()
    if (birdMesh.material) {
      if (Array.isArray(birdMesh.material)) {
        birdMesh.material.forEach(m => m.dispose())
      } else {
        birdMesh.material.dispose()
      }
    }
  }
  
  // 移除光源
  lights.forEach(light => {
    props.scene.remove(light)
  })
  lights = []
  
  if (gui) {
    gui.destroy()
  }
  window.removeEventListener('keydown', handleKeyDown)
})

// 初始化 GUI 控制面板
function initGUI() {
  gui = new GUI()
  gui.hide() // 預設隱藏
  
  console.log('🎛️ 初始化控制面板...')
  console.log('📊 初始參數:', JSON.stringify(effectController, null, 2))
  
  // Separation - 分離距離
  gui.add(effectController, 'separation', 0.0, 100.0, 1.0).name('Separation').onChange(value => {
    console.log('🔧 [Separation] 分離距離調整:', value)
    console.log('   → 影響: 鳥與鳥之間的最小距離，數值越大越分散')
    if (velocityUniforms) {
      velocityUniforms['separationDistance'].value = value
      console.log('   ✅ shader uniform 已更新')
    } else {
      console.log('   ❌ velocityUniforms 未初始化')
    }
  })
  
  // Alignment - 對齊距離
  gui.add(effectController, 'alignment', 0.0, 100.0, 1.0).name('Alignment').onChange(value => {
    console.log('🔧 [Alignment] 對齊距離調整:', value)
    console.log('   → 影響: 鳥群飛行方向的一致性，數值越大越整齊')
    if (velocityUniforms) {
      velocityUniforms['alignmentDistance'].value = value
      console.log('   ✅ shader uniform 已更新')
    } else {
      console.log('   ❌ velocityUniforms 未初始化')
    }
  })
  
  // Cohesion - 聚合距離
  gui.add(effectController, 'cohesion', 0.0, 100.0, 1.0).name('Cohesion').onChange(value => {
    console.log('🔧 [Cohesion] 聚合距離調整:', value)
    console.log('   → 影響: 鳥群向中心聚集的傾向，數值越大越集中')
    if (velocityUniforms) {
      velocityUniforms['cohesionDistance'].value = value
      console.log('   ✅ shader uniform 已更新')
    } else {
      console.log('   ❌ velocityUniforms 未初始化')
    }
  })
  
  // Freedom - 自由度
  gui.add(effectController, 'freedom', 0.0, 1.0, 0.01).name('Freedom').onChange(value => {
    console.log('🔧 [Freedom] 自由度調整:', value)
    console.log('   → 影響: 鳥群行為的隨機性，數值越大越不規則')
    if (velocityUniforms) {
      velocityUniforms['freedomFactor'].value = value
      console.log('   ✅ shader uniform 已更新')
    } else {
      console.log('   ❌ velocityUniforms 未初始化')
    }
  })
  
  // 修復 Size 調整 - 移除重新初始化，改為動態縮放
  gui.add(effectController, 'size', 5, 50, 1).name('Size').onChange(value => {
    console.log('🔧 [Size] 大小調整:', value)
    console.log('   → 影響: 紅鶴模型的顯示大小')
    
    if (birdMesh && birdMesh.isInstancedMesh) {
      // 動態調整每隻鳥的縮放（基準值 8，縮放比例 0.1）
      const scaleFactor = (value / 8) * 0.1
      console.log('   → 計算縮放係數:', scaleFactor, '= (', value, '/ 8 ) × 0.1')
      
      const dummy = new THREE.Object3D()
      let successCount = 0
      
      for (let i = 0; i < BIRDS; i++) {
        birdMesh.getMatrixAt(i, dummy.matrix)
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
        dummy.scale.setScalar(scaleFactor)
        dummy.updateMatrix()
        birdMesh.setMatrixAt(i, dummy.matrix)
        successCount++
      }
      
      birdMesh.instanceMatrix.needsUpdate = true
      console.log('   ✅ 已更新', successCount, '隻鳥的大小')
    } else {
      console.log('   ❌ birdMesh 不存在或不是 InstancedMesh')
    }
  })
  
  // Wing Speed - 拍翅膀速度
  gui.add(effectController, 'wingSpeed', 0.0, 5.0, 0.1).name('Wing Speed').onChange(value => {
    console.log('🔧 [Wing Speed] 拍翅膀速度調整:', value)
    console.log('   → 影響: 紅鶴翅膀拍動的頻率，數值越大拍越快')
    console.log('   ✅ 即時生效（render 循環中使用）')
  })
  
  // Count - 鳥群數量（只讀，顯示當前數量）
  gui.add(effectController, 'count').name('Count (只讀)').listen().disable()
  
  console.log('✅ GUI 控制面板初始化完成')
  console.log('📋 按 F10 開啟/關閉控制面板')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

// 處理按鍵事件
function handleKeyDown(event) {
  if (event.key === 'F10') {
    event.preventDefault()
    if (gui) {
      if (gui._hidden) {
        gui.show()
      } else {
        gui.hide()
      }
    }
  }
}

// 匯出單隻鳥的模型
function exportBirdModel() {
  console.log('開始匯出白鷺鷥模型...')
  
  // 創建一隻鳥的模型
  const singleBirdGeometry = new THREE.BufferGeometry()
  
  // 定義單隻鳥的頂點
  const vertices = new Float32Array([
    // 身體（橢圓形）
    0, 0, 0,
    -3, -2, -5,
    3, -2, -5,
    
    0, 0, 0,
    -3, -2, -5,
    0, -3, -10,
    
    0, 0, 0,
    3, -2, -5,
    0, -3, -10,

    // 長脖子
    0, 0, 0,
    0, 2, 10,
    -1, 1, 5,
    
    0, 0, 0,
    0, 2, 10,
    1, 1, 5,
    
    // 頭和尖嘴
    0, 2, 10,
    0, 3, 15,
    0, 2.5, 12,

    // 左翅膀
    0, 0, -2,
    -30, 3, -8,
    -30, -2, -5,
    
    0, 0, -2,
    -30, -2, -5,
    -15, -2, -3,

    // 右翅膀
    0, 0, -2,
    30, 3, -8,
    30, -2, -5,
    
    0, 0, -2,
    30, -2, -5,
    15, -2, -3
  ])
  
  singleBirdGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  singleBirdGeometry.computeVertexNormals()
  singleBirdGeometry.scale(0.2, 0.2, 0.2)
  
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  })
  
  const birdMesh = new THREE.Mesh(singleBirdGeometry, material)
  birdMesh.name = '白鷺鷥'
  
  // 使用 GLTFExporter 匯出
  const exporter = new GLTFExporter()
  
  exporter.parse(
    birdMesh,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, '白鷺鷥3D簡化版.glb')
      } else {
        const output = JSON.stringify(result, null, 2)
        saveString(output, '白鷺鷥3D簡化版.gltf')
      }
      console.log('✅ 白鷺鷥模型匯出成功！')
    },
    function (error) {
      console.error('❌ 匯出失敗:', error)
    },
    { binary: true } // 匯出為 GLB 格式
  )
}

// 保存二進制資料
function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename)
}

// 保存文字資料
function saveString(text, filename) {
  save(new Blob([text], { type: 'text/plain' }), filename)
}

// 觸發下載
function save(blob, filename) {
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  document.body.removeChild(link)
}

defineExpose({
  update
})
</script>
