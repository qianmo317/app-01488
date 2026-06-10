<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="gameover-overlay">
        <div class="gameover-modal" :class="{ 'gameover-modal--win': isWin }">
          <div class="gameover-modal__header">
            <div class="result-icon">{{ isWin ? '🏆' : '💀' }}</div>
            <h2>{{ isWin ? '恭喜胜利！' : '游戏结束' }}</h2>
            <p class="result-message">
              {{ isWin ? '你成功保卫了家园！' : '僵尸入侵了你的房子...' }}
            </p>
          </div>
          
          <div class="gameover-modal__stats">
            <div class="stat-card">
              <span class="stat-icon">⭐</span>
              <span class="stat-label">最终得分</span>
              <span class="stat-value">{{ gameStore.score }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">🌊</span>
              <span class="stat-label">坚持波数</span>
              <span class="stat-value">{{ gameStore.wave }} / 10</span>
            </div>
          </div>
          
          <div class="gameover-modal__actions">
            <button class="action-btn action-btn--primary" @click="restartGame">
              <span class="btn-icon">🔄</span>
              再来一局
            </button>
            <button class="action-btn action-btn--secondary" @click="goHome">
              <span class="btn-icon">🏠</span>
              返回首页
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const visible = computed(() => gameStore.isGameOver)
const isWin = computed(() => gameStore.gameStatus === 'won')

const restartGame = () => {
  gameStore.startGame()
}

const goHome = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.gameover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.gameover-modal {
  background: linear-gradient(145deg, #37474F, #263238);
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  min-width: 420px;
  border: 4px solid #546E7A;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  
  &--win {
    background: linear-gradient(145deg, #2E7D32, #1B5E20);
    border-color: #81C784;
    
    .result-icon {
      animation: winCelebrate 1s ease infinite;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
  
  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
    
    .result-icon {
      font-size: 80px;
      display: block;
      margin-bottom: $spacing-md;
      animation: iconBounce 1s ease infinite;
    }
    
    h2 {
      font-size: $font-size-xxl;
      color: white;
      margin: 0 0 $spacing-sm;
    }
    
    .result-message {
      color: rgba(255, 255, 255, 0.7);
      font-size: $font-size-md;
    }
  }
  
  &__stats {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
    
    .stat-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-lg;
      background: rgba(0, 0, 0, 0.3);
      border-radius: $border-radius-lg;
      border: 2px solid rgba(255, 255, 255, 0.1);
      
      .stat-icon {
        font-size: 32px;
      }
      
      .stat-label {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .stat-value {
        font-size: $font-size-xl;
        font-weight: 800;
        color: #FFD54F;
      }
    }
  }
  
  &__actions {
    display: flex;
    gap: $spacing-md;
  }
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $border-radius-lg;
  font-size: $font-size-md;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  .btn-icon {
    font-size: 20px;
  }
  
  &--primary {
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
    color: white;
    border-color: #81C784;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
    }
  }
  
  &--secondary {
    background: linear-gradient(135deg, #5D4037, #3E2723);
    color: #FFCC80;
    border-color: #8D6E63;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(93, 64, 55, 0.4);
    }
  }
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes winCelebrate {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-10deg); }
  75% { transform: translateY(-10px) rotate(10deg); }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s ease;
  
  .gameover-modal {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .gameover-modal {
    transform: scale(0.8) translateY(30px);
    opacity: 0;
  }
}
</style>
