<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 引入魚的圖片
import blueFish from '../fishicon/blue-fish.png'
import clownFish from '../fishicon/clown-fish.png'
import clownFish1 from '../fishicon/clown-fish (1).png'
import clownFish2 from '../fishicon/clown-fish (2).png'
import fish from '../fishicon/fish.png'
import fish1 from '../fishicon/fish (1).png'
import fish2 from '../fishicon/fish (2).png'
import fish3 from '../fishicon/fish (3).png'
import pufferFish from '../fishicon/puffer-fish.png'
import salmon from '../fishicon/salmon.png'

const canvasRef = ref(null)
let ctx = null
let animationId = null

// 魚的圖片陣列
const fishImages = []
const fishImageSrcs = [
  blueFish,
  clownFish,
  clownFish1,
  clownFish2,
  fish,
  fish1,
  fish2,
  fish3,
  pufferFish,
  salmon
]

// 預載入所有魚的圖片
fishImageSrcs.forEach(src => {
  const img = new Image()
  img.src = src
  fishImages.push(img)
})

// 漸層數據
const gradient1 = [
  { color: '#A0F5FF', position: 0.0 },
  { color: '#D0FAFF', position: 0.293269 },
  { color: '#E7FDFF', position: 0.567308 },
  { color: '#F3FEFF', position: 0.894231 },
  { color: '#FFFFFF', position: 1.0 }
]

const gradient2 = [
  { color: '#CCE82D', position: 0.0 },
  { color: '#FAF6A6', position: 0.168269 },
  { color: '#FFFECD', position: 0.365385 },
  { color: '#FFFCC6', position: 0.591346 },
  { color: '#FFD2B5', position: 0.860577 },
  { color: '#FF6656', position: 1.0 }
]

const gradient3 = [
  { color: '#FF4C43', position: 0.0 },
  { color: '#FFA070', position: 0.350962 },
  { color: '#FFCB8D', position: 0.692308 },
  { color: '#FFDC98', position: 0.850962 },
  { color: '#FFEEAD', position: 1.0 }
]

// 波浪參數
const waves = [
  { amplitude: 40, speed: 0.18, bones: 5, gradient: gradient1, height: 0.9 },
  { amplitude: 60, speed: 0.12, bones: 3, gradient: gradient2, height: 0.7 },
  { amplitude: 50, speed: 0.15, bones: 4, gradient: gradient3, height: 0.5 }
]

let time = 0
let mouseX = -1000
let mouseY = -1000
let isMouseClicked = false
let clickTimer = 0

// 魚的類別
class Fish {
  constructor(canvas, index) {
    this.canvas = canvas
    this.index = index
    
    // 隨機初始位置
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    
    // 目標位置（用於自由游動）
    this.targetX = this.x
    this.targetY = this.y
    
    // 速度（手機版減半）
    const isMobile = window.innerWidth < 768
    const baseSpeed = isMobile ? 1 : 2
    const randomSpeed = isMobile ? 1.5 : 3
    this.speed = baseSpeed + Math.random() * randomSpeed
    this.maxSpeed = isMobile ? 3 : 6
    
    // 角度
    this.angle = Math.random() * Math.PI * 2
    
    // 選擇魚的圖片（循環使用10種圖片）
    this.fishImageIndex = index % fishImages.length
    this.fishImage = fishImages[this.fishImageIndex]
    
    // 魚的大小
    this.size = 30 + Math.random() * 30 // 30-60px
    
    // 自由游動計時器
    this.wanderTimer = Math.random() * 50
    this.nextWanderTime = 60 + Math.random() * 120
  }
  
  update(time) {
    this.wanderTimer++
    
    // 獲取當前 canvas 的實際高度
    const currentCanvasHeight = this.canvas.height
    
    // 定期設定新的隨機目標位置（更頻繁，避免發呆）
    if (this.wanderTimer > this.nextWanderTime) {
      this.targetX = Math.random() * this.canvas.width
      this.targetY = Math.random() * currentCanvasHeight // 使用當前高度
      this.wanderTimer = 0
      this.nextWanderTime = 60 + Math.random() * 120 // 更頻繁更新目標
    }
    
    // 滑鼠互動效果
    const mouseDistX = mouseX - this.x
    const mouseDistY = mouseY - this.y
    const mouseDistance = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY)
    
    let currentSpeed = this.speed
    let finalTargetX = this.targetX
    let finalTargetY = this.targetY
    
    // 如果有點擊，魚會被吸引過來（持續3秒）
    if (isMouseClicked && clickTimer > 0 && mouseX > 0 && mouseY > 0) {
      finalTargetX = mouseX + (Math.random() - 0.5) * 80
      finalTargetY = mouseY + (Math.random() - 0.5) * 80
      currentSpeed = this.speed * 3 // 提升吸引速度：原本2倍，現在3倍
    }
    // 如果沒有點擊，滑鼠靠近會驚嚇魚
    else if (mouseDistance < 150 && mouseX > 0 && mouseY > 0) {
      // 計算逃離方向（與滑鼠相反）
      const escapeAngle = Math.atan2(mouseDistY, mouseDistX) + Math.PI
      const escapeDistance = 600 // 逃離目標距離增加3倍 (200 * 3)
      
      finalTargetX = this.x + Math.cos(escapeAngle) * escapeDistance
      finalTargetY = this.y + Math.sin(escapeAngle) * escapeDistance
      
      // 驚嚇時速度加快9-15倍（原本3-5倍的3倍）
      currentSpeed = this.speed * (9 + Math.random() * 6)
    }
    // 如果滑鼠在中等距離（150-300px），魚會警戒並稍微加速
    else if (mouseDistance < 300 && mouseX > 0 && mouseY > 0 && !isMouseClicked) {
      // 稍微偏離滑鼠方向
      const avoidAngle = Math.atan2(mouseDistY, mouseDistX) + Math.PI + (Math.random() - 0.5) * Math.PI / 2
      const avoidDistance = 300 // 增加3倍
      
      finalTargetX = this.x + Math.cos(avoidAngle) * avoidDistance
      finalTargetY = this.y + Math.sin(avoidAngle) * avoidDistance
      
      // 警戒時速度加快4.5倍（原本1.5倍的3倍）
      currentSpeed = this.speed * 4.5
    }
    
    // 計算移動方向
    const dx = finalTargetX - this.x
    const dy = finalTargetY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // 移動（降低停止閾值，避免發呆）
    if (distance > 2) { // 原本是5，改成2讓魚更積極移動
      const moveX = (dx / distance) * currentSpeed
      const moveY = (dy / distance) * currentSpeed
      
      this.x += moveX
      this.y += moveY
      
      // 更新角度（面向移動方向）
      this.angle = Math.atan2(dy, dx)
    } else {
      // 如果到達目標，立即設定新目標（避免發呆）
      this.targetX = Math.random() * this.canvas.width
      this.targetY = Math.random() * currentCanvasHeight // 使用當前高度
    }
    
    // 邊界檢查（環繞）- 使用當前 canvas 高度
    if (this.x < -50) this.x = this.canvas.width + 50
    if (this.x > this.canvas.width + 50) this.x = -50
    if (this.y < -50) this.y = currentCanvasHeight + 50
    if (this.y > currentCanvasHeight + 50) this.y = -50
  }
  
  getPosition() {
    // 根據角度判斷方向：角度在 -90度到90度之間朝右，否則朝左
    // angle 的範圍是 -π 到 π
    const normalizedAngle = this.angle % (Math.PI * 2)
    const shouldFlip = normalizedAngle > Math.PI / 2 && normalizedAngle < Math.PI * 3 / 2
    
    return { 
      x: this.x, 
      y: this.y, 
      flip: shouldFlip
    }
  }
  
  draw(ctx) {
    const { x, y, flip } = this.getPosition()
    
    // 確保圖片已載入
    if (!this.fishImage || !this.fishImage.complete) return
    
    ctx.save()
    ctx.translate(x, y)
    
    // 根據游動方向翻轉
    if (flip) {
      ctx.scale(-1, 1)
    }
    
    // 繪製魚的圖片
    ctx.drawImage(
      this.fishImage,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    )
    
    ctx.restore()
  }
}

let fishes = []

// 氣泡類別
class Bubble {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + Math.random() * 100
    this.size = Math.random() * 8 + 2
    this.speed = Math.random() * 1.5 + 0.5
    this.wobble = Math.random() * 2
    this.wobbleSpeed = Math.random() * 0.05 + 0.02
  }
  
  update() {
    this.y -= this.speed
    this.wobble += this.wobbleSpeed
    this.x += Math.sin(this.wobble) * 0.5
    
    if (this.y + this.size < 0) {
      this.reset()
    }
  }
  
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fill()
  }
}

let bubbles = []

// 繪製波浪
function drawWave(wave, currentTime, canvas) {
  const numPoints = wave.bones
  const points = []
  
  // 使用視窗高度而不是 canvas 高度來計算波浪位置
  const viewportHeight = window.innerHeight
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * canvas.width
    const sinSeed = (currentTime * Math.PI + i + (i % numPoints)) * wave.speed * 100
    const sinHeight = Math.sin(sinSeed / 100) * wave.amplitude
    const y = viewportHeight * (1 - wave.height) + Math.sin(sinSeed / 100) * sinHeight
    points.push({ x, y })
  }
  
  const regionTop = Math.min(...points.map(p => p.y))
  const regionBottom = canvas.height
  
  const gradientObj = ctx.createLinearGradient(0, regionTop, 0, regionBottom)
  wave.gradient.forEach(stop => {
    const r = parseInt(stop.color.slice(1, 3), 16)
    const g = parseInt(stop.color.slice(3, 5), 16)
    const b = parseInt(stop.color.slice(5, 7), 16)
    gradientObj.addColorStop(stop.position, `rgba(${r}, ${g}, ${b}, 0.5)`)
  })
  
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }
  
  const lastPoint = points[points.length - 1]
  ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, lastPoint.x, lastPoint.y)
  
  ctx.lineTo(canvas.width, canvas.height)
  ctx.lineTo(0, canvas.height)
  ctx.lineTo(points[0].x, points[0].y)
  
  ctx.closePath()
  ctx.fillStyle = gradientObj
  ctx.fill()
}

// 動畫循環
function animate() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  
  // 點擊計時器遞減
  if (clickTimer > 0) {
    clickTimer--
    if (clickTimer === 0) {
      isMouseClicked = false
    }
  }
  
  // 更新 canvas 高度以適應文檔變化
  const newHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight)
  if (canvas.height !== newHeight) {
    canvas.height = newHeight
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < waves.length; i++) {
    drawWave(waves[i], time, canvas)
  }

  bubbles.forEach(bubble => {
    bubble.update()
    bubble.draw(ctx)
  })

  // 更新並繪製所有魚
  fishes.forEach(fish => {
    fish.update(time)
    fish.draw(ctx)
  })

  time += 0.02
  animationId = requestAnimationFrame(animate)
}

// 調整 canvas 尺寸
function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  // 使用整個文檔高度，而不是視窗高度
  canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
  
  // 根據螢幕寬度調整氣泡數量
  const isMobile = window.innerWidth < 768
  const bubbleCount = isMobile ? 20 : 50
  
  // 重新初始化氣泡
  bubbles = []
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new Bubble(canvas))
  }
  
  // 根據螢幕寬度調整魚的數量
  // 手機版：10隻魚
  // 平板版：30隻魚
  // 電腦版：50隻魚
  let fishCount
  if (window.innerWidth < 768) {
    fishCount = 10 // 手機
  } else if (window.innerWidth < 1024) {
    fishCount = 30 // 平板
  } else {
    fishCount = 50 // 電腦
  }
  
  // 初始化魚群
  fishes = []
  for (let i = 0; i < fishCount; i++) {
    fishes.push(new Fish(canvas, i))
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  resizeCanvas()
  animate()
  
  window.addEventListener('resize', resizeCanvas)
  
  // 追蹤滑鼠位置
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top + window.scrollY // 加上滾動偏移
  })
  
  // 滑鼠點擊事件 - 吸引魚群
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top + window.scrollY // 加上滾動偏移
    isMouseClicked = true
    clickTimer = 180 // 3秒效果 (60fps * 3)
  })
  
  // 滑鼠離開畫面時重置
  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000
    mouseY = -1000
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
