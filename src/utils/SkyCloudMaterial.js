import * as THREE from 'three'

export function createSkyCloudMaterial(params = {}) {
  const {
    cloudCoverage = 0.5,
    cloudHeight = 600.0,
    cloudThickness = 100.0,
    cloudAbsorption = 1.5,
    windSpeedX = 5.0,
    windSpeedZ = 3.0,
    maxCloudDistance = 15000.0
  } = params

  const vertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vSunPosition;
    varying vec3 vViewDirection;
    
    uniform vec3 sunDirection;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      vSunPosition = sunDirection;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 sunDirection;
    uniform float time;
    uniform float cloudCoverage;
    uniform float cloudHeight;
    uniform float cloudThickness;
    uniform float cloudAbsorption;
    uniform vec2 windSpeed;
    uniform float maxCloudDistance;
    uniform sampler2D perlinTexture;
    
    varying vec3 vWorldPosition;
    varying vec3 vSunPosition;
    varying vec3 vViewDirection;
    
    #define CLOUD_MARCH_STEPS 8
    #define CLOUD_SHADOW_STEPS 4
    
    // 多層次噪聲採樣
    float sampleNoise(vec2 uv) {
      float noise = 0.0;
      noise += texture2D(perlinTexture, uv).r;
      noise += texture2D(perlinTexture, uv * 2.0).r * 0.5;
      noise += texture2D(perlinTexture, uv * 4.0).r * 0.25;
      return noise / 1.75;
    }
    
    // 雲密度計算 - 更明顯的雲層
    float getCloudDensity(vec3 pos) {
      // 風的影響
      vec2 windOffset = windSpeed * time * 0.01;
      vec2 uv = pos.xz * 0.0003 + windOffset;
      
      // 採樣噪聲
      float noise = sampleNoise(uv);
      
      // 高度衰減
      float heightRatio = (pos.y - (cloudHeight - cloudThickness * 0.5)) / cloudThickness;
      float heightFade = smoothstep(0.0, 0.1, heightRatio) * smoothstep(1.0, 0.9, heightRatio);
      
      // 雲密度閾值
      float density = smoothstep(cloudCoverage - 0.1, cloudCoverage + 0.1, noise);
      density *= heightFade * cloudAbsorption;
      
      return clamp(density, 0.0, 1.0);
    }
    
    // 光線行進計算雲層
    vec4 marchClouds(vec3 rayOrigin, vec3 rayDir) {
      vec3 color = vec3(0.0);
      float alpha = 0.0;
      
      // 計算雲層交點
      float tMin = (cloudHeight - cloudThickness) / max(rayDir.y, 0.001);
      float tMax = (cloudHeight + cloudThickness) / max(rayDir.y, 0.001);
      
      if (tMin < 0.0 || rayDir.y < 0.0) return vec4(0.0);
      
      float stepSize = (tMax - tMin) / float(CLOUD_MARCH_STEPS);
      float t = tMin;
      
      for (int i = 0; i < CLOUD_MARCH_STEPS; i++) {
        vec3 samplePos = rayOrigin + rayDir * t;
        float density = getCloudDensity(samplePos);
        
        if (density > 0.01) {
          // 計算光照
          float sunLight = 1.0;
          vec3 lightRayPos = samplePos;
          
          // 陰影行進（淡化陰影效果）
          for (int j = 0; j < CLOUD_SHADOW_STEPS; j++) {
            lightRayPos += vSunPosition * 30.0;
            float shadowDensity = getCloudDensity(lightRayPos);
            sunLight *= exp(-shadowDensity * 0.3);  // 0.3 讓雲層更淡
          }
          
          // 重新映射 sunLight 讓雲朵更明亮
          sunLight = pow(sunLight, 0.5);  // 降低對比，讓整體更亮
          sunLight = clamp(sunLight * 1.5 - 0.1, 0.0, 1.0);  // 提升亮度
          
          // 雲的顏色 - 使用淡藍灰色陰影
          vec3 cloudBaseColor = vec3(1.0, 1.0, 1.0);              // 亮面：純白色
          vec3 cloudShadowColor = vec3(0.616, 0.71, 0.765);       // 陰影：#9DB5C3 淡藍灰色
          vec3 cloudColor = mix(cloudShadowColor, cloudBaseColor, sunLight);  // 根據光照混合
          
          // 累積顏色和透明度（降低不透明度，讓更多光透過）
          float cloudAlpha = density * 0.2;  // 從 0.3 降到 0.2，雲更透明
          color += cloudColor * cloudAlpha * (1.0 - alpha);
          alpha += cloudAlpha * (1.0 - alpha);
          
          if (alpha > 0.95) break;
        }
        
        t += stepSize;
      }
      
      return vec4(color, alpha);
    }
    
    // 天空顏色
    vec3 getSkyColor(vec3 rayDir) {
      // 天空漸層 - 從地平線到天頂（根據截圖的淺藍色漸層）
      float horizonBlend = pow(1.0 - abs(rayDir.y), 2.0);
      vec3 skyTop = vec3(0.627, 0.941, 1.0);      // 淺水藍色 #A0F0FF
      vec3 skyHorizon = vec3(0.706, 0.953, 1.0);  // 更淺的水藍色 #B4F3FF
      vec3 skyColor = mix(skyTop, skyHorizon, horizonBlend);
      
      // 太陽圓盤 + 光暈
      float sunDot = max(dot(rayDir, vSunPosition), 0.0);
      
      // 1. 太陽實體圓盤（使用角度計算，更準確）
      float sunAngle = acos(clamp(sunDot, 0.0, 1.0));
      float sunSize = 0.03;  // 太陽角度大小（弧度）
      
      // 圓盤邊緣平滑過渡
      float sunDisc = smoothstep(sunSize + 0.005, sunSize - 0.005, sunAngle);
      vec3 sunDiscColor = vec3(1.0, 1.0, 0.85) * sunDisc * 10.0;  // 超亮圓盤
      
      // 2. 太陽光暈（周圍的光芒）
      float sunGlow1 = pow(sunDot, 256.0) * 30.0;     // 銳利核心
      float sunGlow2 = pow(sunDot, 64.0) * 20.0;      // 中等光暈
      float sunGlow3 = pow(sunDot, 16.0) * 10.0;      // 寬廣光暈
      float sunGlow4 = pow(sunDot, 4.0) * 3.0;        // 環境光暈
      float totalSunLight = sunGlow1 + sunGlow2 + sunGlow3 + sunGlow4;
      vec3 sunHaloColor = vec3(1.0, 0.98, 0.85) * totalSunLight;
      
      return skyColor + sunDiscColor + sunHaloColor;
    }
    
    void main() {
      vec3 rayDir = normalize(vWorldPosition);
      vec3 skyColor = getSkyColor(rayDir);
      
      // 計算雲層
      vec4 clouds = marchClouds(vec3(0.0), rayDir);
      
      // 混合天空和雲
      vec3 finalColor = mix(skyColor, clouds.rgb, clouds.a);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

  return new THREE.ShaderMaterial({
    uniforms: {
      sunDirection: { value: new THREE.Vector3(0, 1, 0) },
      time: { value: 0 },
      cloudCoverage: { value: cloudCoverage },
      cloudHeight: { value: cloudHeight },
      cloudThickness: { value: cloudThickness },
      cloudAbsorption: { value: cloudAbsorption },
      windSpeed: { value: new THREE.Vector2(windSpeedX, windSpeedZ) },
      maxCloudDistance: { value: maxCloudDistance },
      perlinTexture: { value: null }
    },
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
    depthWrite: false
  })
}
