<template>
  <div 
    class="zombie-entity"
    :style="zombieStyle"
    :class="{ 
      'zombie-entity--eating': zombie.isEating,
      'zombie-entity--frozen': zombie.isFrozen
    }"
  >
    <div class="zombie-entity__sprite">
      <span class="zombie-emoji">{{ zombieConfig?.emoji }}</span>
      <span v-if="zombie.type === 'cone'" class="zombie-hat">🔶</span>
      <span v-if="zombie.type === 'bucket'" class="zombie-hat zombie-hat--bucket">🪣</span>
    </div>
    <div class="zombie-entity__health">
      <div class="health-track">
        <div 
          class="health-fill"
          :style="{ width: healthPercent + '%' }"
          :class="healthClass"
        ></div>
      </div>
    </div>
    <div class="zombie-entity__shadow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ZOMBIES } from '@/utils/gameConfig'

const props = defineProps({
  zombie: {
    type: Object,
    required: true
  }
})

const zombieConfig = computed(() => ZOMBIES[props.zombie.type])

const zombieStyle = computed(() => ({
  left: `${props.zombie.x - 70}px`,
  // 僵尸应该垂直居中在格子里：row * (80 + 2) + 格子高度一半 - 僵尸高度一半
  // 僵尸总高度约 55(emoji) + 5(health) + 8(shadow) = 68px
  // 格子中心：row * 82 + 40，僵尸中心偏移：-34
  top: `${props.zombie.row * 82 + 40 - 34}px`
}))

const healthPercent = computed(() => {
  return (props.zombie.health / props.zombie.maxHealth) * 100
})

const healthClass = computed(() => {
  if (healthPercent.value > 60) return 'health-fill--high'
  if (healthPercent.value > 30) return 'health-fill--medium'
  return 'health-fill--low'
})
</script>

<style lang="scss" scoped>
.zombie-entity {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: left 0.05s linear;
  
  &--eating {
    .zombie-entity__sprite {
      animation: zombieEat 0.3s ease infinite;
    }
  }
  
  &--frozen {
    .zombie-entity__sprite {
      filter: hue-rotate(180deg) brightness(1.3) saturate(1.5);
      
      &::after {
        content: '❄️';
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        animation: frozenIcon 1s ease infinite;
      }
    }
  }
  
  &__sprite {
    position: relative;
    animation: zombieWalk 0.6s ease-in-out infinite;
    
    .zombie-emoji {
      font-size: 55px;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
    
    .zombie-hat {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 20px;
      
      &.zombie-hat--bucket {
        font-size: 24px;
        top: -18px;
      }
    }
  }
  
  &__health {
    width: 45px;
    margin-top: -5px;
    
    .health-track {
      height: 5px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .health-fill {
      height: 100%;
      transition: width 0.2s ease;
      border-radius: 3px;
      
      &--high {
        background: linear-gradient(90deg, #EF5350, #C62828);
      }
      
      &--medium {
        background: linear-gradient(90deg, #FFA726, #EF6C00);
      }
      
      &--low {
        background: linear-gradient(90deg, #78909C, #546E7A);
      }
    }
  }
  
  &__shadow {
    width: 35px;
    height: 8px;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    margin-top: 2px;
  }
}

@keyframes zombieWalk {
  0%, 100% {
    transform: translateY(0) rotate(-3deg);
  }
  25% {
    transform: translateY(-8px) rotate(0deg);
  }
  50% {
    transform: translateY(0) rotate(3deg);
  }
  75% {
    transform: translateY(-4px) rotate(0deg);
  }
}

@keyframes zombieEat {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.15) rotate(10deg);
  }
}

@keyframes frozenIcon {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateX(-50%) scale(0.8); }
}
</style>
