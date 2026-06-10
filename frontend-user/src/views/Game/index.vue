<template>
  <div class="game">
    <!-- 顶部状态栏 -->
    <GameHeader />
    
    <!-- 游戏主区域 -->
    <div class="game__main">
      <!-- 植物选择栏 - 固定在顶部 -->
      <div class="game__selector-wrapper">
        <PlantSelector />
      </div>
      
      <!-- 游戏场地 - 可滚动区域 -->
      <div class="game__board-wrapper">
        <GameBoard />
      </div>
    </div>
    
    <!-- 暂停弹窗 -->
    <PauseModal />
    
    <!-- 游戏结束弹窗 -->
    <GameOverModal />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import GameHeader from './components/GameHeader.vue'
import PlantSelector from './components/PlantSelector.vue'
import GameBoard from './components/GameBoard.vue'
import PauseModal from './components/PauseModal.vue'
import GameOverModal from './components/GameOverModal.vue'

const gameStore = useGameStore()

// 键盘事件处理
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (gameStore.isPlaying) {
      gameStore.pauseGame()
    } else if (gameStore.isPaused) {
      gameStore.resumeGame()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  gameStore.startGame()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  gameStore.resetGame()
})
</script>

<style lang="scss" scoped>
.game {
  min-height: 100vh;
  min-width: 1100px;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  
  // 云朵装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: 
      radial-gradient(ellipse 100px 60px at 10% 80%, rgba(255, 255, 255, 0.8) 0%, transparent 70%),
      radial-gradient(ellipse 80px 50px at 25% 60%, rgba(255, 255, 255, 0.6) 0%, transparent 70%),
      radial-gradient(ellipse 120px 70px at 50% 70%, rgba(255, 255, 255, 0.7) 0%, transparent 70%),
      radial-gradient(ellipse 90px 55px at 75% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 70%),
      radial-gradient(ellipse 100px 60px at 90% 75%, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    padding: $spacing-md $spacing-lg;
    gap: $spacing-md;
  }
  
  &__selector-wrapper {
    flex-shrink: 0;  // 不允许收缩
  }
  
  &__board-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
