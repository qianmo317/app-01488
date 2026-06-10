<template>
  <div 
    class="explosion-effect"
    :style="explosionStyle"
  >
    <div class="explosion-ring explosion-ring--1"></div>
    <div class="explosion-ring explosion-ring--2"></div>
    <div class="explosion-ring explosion-ring--3"></div>
    <div class="explosion-flash"></div>
    <div class="explosion-particles">
      <span v-for="i in 12" :key="i" class="particle">💥</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  }
})

const explosionStyle = computed(() => ({
  left: `${props.col * 80 + 70 + 40}px`,
  top: `${props.row * 82 + 40}px`
}))
</script>

<style lang="scss" scoped>
.explosion-effect {
  position: absolute;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;
}

.explosion-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: explosionRing 0.6s ease-out forwards;
  
  &--1 {
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, rgba(255, 100, 0, 0.8), transparent);
    border: 3px solid #FF6B00;
  }
  
  &--2 {
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, rgba(255, 200, 0, 0.6), transparent);
    border: 3px solid #FFC800;
    animation-delay: 0.1s;
  }
  
  &--3 {
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, rgba(255, 50, 0, 0.4), transparent);
    border: 3px solid #FF3200;
    animation-delay: 0.2s;
  }
}

.explosion-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 200, 0, 0.5), transparent);
  border-radius: 50%;
  animation: explosionFlash 0.3s ease-out forwards;
}

.explosion-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  
  .particle {
    position: absolute;
    font-size: 24px;
    animation: particleExplosion 0.6s ease-out forwards;
    
    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        $angle: $i * 30deg;
        left: 50%;
        top: 50%;
        animation-delay: #{$i * 0.02}s;
        
        @keyframes particleExplosion {
          0% {
            transform: translate(-50%, -50%) rotate($angle) translateY(0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate($angle) translateY(-80px) scale(1.5);
            opacity: 0;
          }
        }
      }
    }
  }
}

@keyframes explosionRing {
  0% {
    width: 50px;
    height: 50px;
    opacity: 1;
  }
  100% {
    width: 250px;
    height: 250px;
    opacity: 0;
  }
}

@keyframes explosionFlash {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}
</style>
