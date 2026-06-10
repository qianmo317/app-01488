<template>
  <div 
    class="sun-entity"
    :style="sunStyle"
    @click="handleClick"
  >
    <div class="sun-glow"></div>
    <div class="sun-content">
      <span class="sun-sprite">☀️</span>
      <span class="sun-value">+{{ sun.value }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  sun: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['collect'])

const currentY = ref(props.sun.y)
// 草坪高度约为 5行 * 82px = 410px，加上边距约 450px
// 天空阳光目标位置：100-350px（确保在可视范围内）
// 向日葵阳光：微微下落20px（从原位置稍微下落一点）
const targetY = ref(props.sun.fromPlant ? props.sun.y + 20 : 100 + Math.random() * 250)

const sunStyle = computed(() => ({
  left: `${props.sun.x - 70}px`,  // 减去lawn区域的margin-left偏移
  top: `${currentY.value}px`
}))

const handleClick = () => {
  emit('collect', props.sun.id)
}

onMounted(() => {
  const animate = () => {
    if (currentY.value < targetY.value) {
      currentY.value += 2
      requestAnimationFrame(animate)
    }
  }
  animate()
})
</script>

<style lang="scss" scoped>
.sun-entity {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 100;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 60px;
  height: 60px;
  
  &:hover {
    transform: scale(1);  // 再减小一点，从 1.15 到 1.1
    
    .sun-glow {
      opacity: 1;
      transform: scale(1.05);  // 从 1.3 减小到 1.2
    }
    
    .sun-content {
      animation: sunHover 0.3s ease;
    }
  }
  
  .sun-glow {
    position: absolute;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.5;
    transition: all 0.3s ease;
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .sun-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    animation: sunFloat 2s ease-in-out infinite;
  }
  
  .sun-sprite {
    font-size: 45px;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .sun-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 900;
    color: #8B4513;
    text-shadow: 
      0 0 3px rgba(255, 255, 255, 0.8),
      0 1px 2px rgba(0, 0, 0, 0.5);
    z-index: 2;
    pointer-events: none;
  }
}

@keyframes sunFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(10deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-3px) rotate(-10deg);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes sunHover {
  0% { transform: scale(1); }
  50% { transform: scale(1.05) rotate(8deg); }  // 再减小一点
  100% { transform: scale(1); }
}
</style>
