<template>
  <div 
    class="bullet-entity"
    :style="bulletStyle"
    :class="{ 'bullet-entity--frozen': bullet.isFrozen }"
  >
    <div class="bullet-trail"></div>
    <span class="bullet-sprite">{{ bullet.isFrozen ? '💎' : '🟢' }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bullet: {
    type: Object,
    required: true
  }
})

const bulletStyle = computed(() => ({
  left: `${props.bullet.x - 70}px`,
  // 子弹应该在格子垂直中心：row * 82 + 40（格子中心）
  top: `${props.bullet.row * 82 + 40}px`
}))
</script>

<style lang="scss" scoped>
.bullet-entity {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  display: flex;
  align-items: center;
  
  .bullet-trail {
    position: absolute;
    right: 100%;
    width: 20px;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.6));
    border-radius: 2px;
  }
  
  .bullet-sprite {
    font-size: 18px;
    filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.8));
    animation: bulletSpin 0.2s linear infinite;
  }
  
  &--frozen {
    .bullet-trail {
      background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.6));
    }
    
    .bullet-sprite {
      filter: drop-shadow(0 0 10px rgba(33, 150, 243, 0.9));
      animation: bulletSpinFrost 0.3s linear infinite;
    }
  }
}

@keyframes bulletSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bulletSpinFrost {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}
</style>
