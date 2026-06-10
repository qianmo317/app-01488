<template>
  <div class="plant-selector">
    <div class="plant-selector__header">
      <span class="header-title">🌱 选择植物</span>
      <div v-if="gameStore.selectedPlant" class="selected-hint">
        已选择 {{ PLANTS[gameStore.selectedPlant]?.name }}，点击草坪种植
      </div>
    </div>
    
    <div class="plant-selector__cards">
      <div 
        v-for="(plant, key) in PLANTS" 
        :key="key"
        class="plant-card"
        :class="{ 
          'plant-card--selected': gameStore.selectedPlant === key,
          'plant-card--disabled': gameStore.sun < plant.cost
        }"
        @click="selectPlant(key)"
      >
        <div class="plant-card__glow"></div>
        <div class="plant-card__content">
          <div class="plant-emoji">{{ plant.emoji }}</div>
          <div class="plant-info">
            <span class="plant-name">{{ plant.name }}</span>
            <span class="plant-cost">
              <span class="sun-icon">☀️</span>
              {{ plant.cost }}
            </span>
          </div>
        </div>
        <div v-if="gameStore.sun < plant.cost" class="plant-card__lock">
          <span>🔒</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game'
import { PLANTS } from '@/utils/gameConfig'
import { ElMessage } from 'element-plus'

const gameStore = useGameStore()

const selectPlant = (plantType) => {
  const plant = PLANTS[plantType]
  
  if (gameStore.sun < plant.cost) {
    ElMessage({
      message: '阳光不足！',
      type: 'warning',
      duration: 1500,
      showClose: false
    })
    return
  }
  
  if (gameStore.selectedPlant === plantType) {
    gameStore.cancelSelection()
  } else {
    gameStore.selectPlant(plantType)
  }
}
</script>

<style lang="scss" scoped>
.plant-selector {
  background: linear-gradient(180deg, rgba(93, 64, 55, 0.95), rgba(62, 39, 35, 0.95));
  backdrop-filter: blur(10px);
  border-radius: $border-radius-xl;
  padding: $spacing-md;
  border: 3px solid #8D6E63;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  width: 100%;  // 添加宽度100%，让容器填满父元素
  box-sizing: border-box;  // 确保padding不会导致溢出
  
  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: 10px;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    min-height: 30px;
    
    .header-title {
      font-size: $font-size-lg;
      font-weight: 700;
      color: #FFCC80;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .selected-hint {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: 0 $spacing-md;
      background: rgba(76, 175, 80, 0.3);
      border-radius: $border-radius-md;
      font-size: $font-size-sm;
      color: #A5D6A7;
      animation: pulse 1.5s ease-in-out infinite;
      border: 1px solid rgba(76, 175, 80, 0.5);
      height: 24px;
      box-sizing: border-box;
    }
  }
  
  &__cards {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
    justify-content: flex-start;  // 确保卡片从左对齐
  }
}

.plant-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border-radius: $border-radius-lg;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 90px;
  overflow: hidden;
  will-change: transform;
  backface-visibility: hidden;
  
  &__glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  &__lock {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: $border-radius-lg;
  }
  
  .plant-emoji {
    font-size: 36px;
    margin-bottom: $spacing-xs;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
    will-change: transform;
  }
  
  .plant-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    
    .plant-name {
      font-size: $font-size-xs;
      color: white;
      font-weight: 600;
    }
    
    .plant-cost {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: $font-size-xs;
      color: #FFD54F;
      font-weight: 700;
      
      .sun-icon {
        font-size: 12px;
      }
    }
  }
  
  &:hover:not(.plant-card--disabled) {
    transform: translateY(-4px) scale(1.05);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    
    .plant-card__glow {
      opacity: 1;
    }
    
    .plant-emoji {
      transform: scale(1.1);
    }
  }
  
  &--selected {
    border-color: #4CAF50;
    background: linear-gradient(145deg, rgba(76, 175, 80, 0.4), rgba(56, 142, 60, 0.3));
    box-shadow: 
      0 0 20px rgba(76, 175, 80, 0.5),
      inset 0 0 20px rgba(76, 175, 80, 0.2);
    
    .plant-emoji {
      animation: selectedBounce 0.5s ease infinite;
    }
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes selectedBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
}
</style>
