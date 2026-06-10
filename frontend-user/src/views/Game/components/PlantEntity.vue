<template>
  <div 
    class="plant-entity"
    :class="{ 
      'plant-entity--damaged': isDamaged,
      'plant-entity--critical': isCritical
    }"
  >
    <div class="plant-entity__sprite" :class="`plant-entity__sprite--${plant.type}`">
      {{ plantConfig?.emoji }}
    </div>
    <div class="plant-entity__health" v-if="showHealth">
      <div class="health-track">
        <div 
          class="health-fill"
          :style="{ width: healthPercent + '%' }"
          :class="healthClass"
        ></div>
      </div>
    </div>
    <div class="plant-entity__shadow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PLANTS } from '@/utils/gameConfig'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
})

const plantConfig = computed(() => PLANTS[props.plant.type])

const healthPercent = computed(() => {
  return (props.plant.health / props.plant.maxHealth) * 100
})

const isDamaged = computed(() => healthPercent.value < 100)
const isCritical = computed(() => healthPercent.value < 30)

const showHealth = computed(() => {
  return props.plant.type === 'wallnut' && isDamaged.value
})

const healthClass = computed(() => {
  if (healthPercent.value > 60) return 'health-fill--high'
  if (healthPercent.value > 30) return 'health-fill--medium'
  return 'health-fill--low'
})
</script>

<style lang="scss" scoped>
.plant-entity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: plantSpawn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  
  &--damaged {
    .plant-entity__sprite {
      animation: plantDamage 0.3s ease;
    }
  }
  
  &--critical {
    .plant-entity__sprite {
      animation: plantCritical 0.5s ease infinite;
    }
  }
  
  &__sprite {
    font-size: 45px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.4));
    animation: plantIdle 3s ease-in-out infinite;
    position: relative;
    z-index: 2;
    
    &--sunflower {
      animation: sunflowerIdle 2s ease-in-out infinite;
    }
    
    &--peashooter, &--snowPea, &--repeater {
      animation: shooterIdle 1.5s ease-in-out infinite;
    }
    
    &--cherryBomb {
      animation: bombPulse 0.5s ease-in-out infinite;
      filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.5));
      font-size: 50px;  // 让樱桃炸弹更大更明显
    }
  }
  
  &__health {
    width: 55px;
    margin-top: 2px;
    position: relative;
    z-index: 2;
    
    .health-track {
      height: 6px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 3px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .health-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 3px;
      
      &--high {
        background: linear-gradient(90deg, #66BB6A, #43A047);
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
      }
      
      &--medium {
        background: linear-gradient(90deg, #FFA726, #FB8C00);
        box-shadow: 0 0 8px rgba(255, 152, 0, 0.5);
      }
      
      &--low {
        background: linear-gradient(90deg, #EF5350, #E53935);
        box-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
        animation: healthPulse 0.5s ease infinite;
      }
    }
  }
  
  &__shadow {
    position: absolute;
    bottom: 5px;
    width: 40px;
    height: 10px;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
  }
}

@keyframes plantSpawn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes plantIdle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(2deg); }
}

@keyframes sunflowerIdle {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-4px) rotate(3deg); }
}

@keyframes shooterIdle {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

@keyframes bombPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes plantDamage {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes plantCritical {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes healthPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
