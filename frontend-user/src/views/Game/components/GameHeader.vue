<template>
  <div class="game-header">
    <div class="game-header__left">
      <button class="header-btn header-btn--back" @click="goHome">
        <span class="btn-icon">🏠</span>
        <span class="btn-text">返回</span>
      </button>
    </div>
    
    <div class="game-header__center">
      <div class="stat-item stat-item--sun">
        <span class="stat-icon">☀️</span>
        <span class="stat-value">{{ gameStore.sun }}</span>
      </div>
      
      <div class="stat-item stat-item--wave">
        <span class="stat-icon">🌊</span>
        <span class="stat-label">波次</span>
        <span class="stat-value">{{ gameStore.wave }}<small>/10</small></span>
      </div>
      
      <div class="stat-item stat-item--score">
        <span class="stat-icon">⭐</span>
        <span class="stat-label">分数</span>
        <span class="stat-value">{{ gameStore.score }}</span>
      </div>
    </div>
    
    <div class="game-header__right">
      <button 
        class="header-btn header-btn--restart" 
        @click="restartGame"
        title="重新开始"
      >
        <span class="btn-icon">🔄</span>
        <span class="btn-text">重新开始</span>
      </button>
      <button 
        class="header-btn header-btn--pause" 
        @click="togglePause"
      >
        <span class="btn-icon">{{ gameStore.isPlaying ? '⏸️' : '▶️' }}</span>
        <span class="btn-text">{{ gameStore.isPlaying ? '暂停' : '继续' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const goHome = () => {
  gameStore.resetGame()
  router.push('/')
}

const restartGame = () => {
  gameStore.startGame()
}

const togglePause = () => {
  if (gameStore.isPlaying) {
    gameStore.pauseGame()
  } else if (gameStore.isPaused) {
    gameStore.resumeGame()
  }
}
</script>

<style lang="scss" scoped>
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
  
  &__left, &__right {
    min-width: 120px;
  }
  
  &__right {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    min-width: 240px;
  }
  
  &__center {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }
}

.header-btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-lg;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  .btn-icon {
    font-size: 18px;
  }
  
  &--back {
    background: linear-gradient(135deg, #5D4037, #3E2723);
    color: #FFCC80;
    border-color: #8D6E63;
    
    &:hover {
      background: linear-gradient(135deg, #6D4C41, #4E342E);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(93, 64, 55, 0.4);
    }
  }
  
  &--pause {
    background: linear-gradient(135deg, #1565C0, #0D47A1);
    color: white;
    border-color: #42A5F5;
    
    &:hover {
      background: linear-gradient(135deg, #1976D2, #1565C0);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(21, 101, 192, 0.4);
    }
  }
  
  &--restart {
    background: linear-gradient(135deg, #43A047, #2E7D32);
    color: white;
    border-color: #66BB6A;
    
    &:hover {
      background: linear-gradient(135deg, #4CAF50, #388E3C);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-lg;
  min-width: 100px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background: linear-gradient(135deg, white 0%, transparent 100%);
  }
  
  .stat-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  .stat-label {
    font-size: $font-size-xs;
    color: rgba(255, 255, 255, 0.7);
    margin-right: $spacing-xs;
  }
  
  .stat-value {
    font-size: $font-size-xl;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    
    small {
      font-size: $font-size-sm;
      opacity: 0.7;
    }
  }
  
  &--sun {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.2));
    border: 2px solid rgba(255, 193, 7, 0.5);
    
    .stat-value {
      color: #FFD54F;
    }
  }
  
  &--wave {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.2));
    border: 2px solid rgba(76, 175, 80, 0.5);
    
    .stat-value {
      color: #81C784;
    }
  }
  
  &--score {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(25, 118, 210, 0.2));
    border: 2px solid rgba(33, 150, 243, 0.5);
    
    .stat-value {
      color: #64B5F6;
    }
  }
}
</style>
