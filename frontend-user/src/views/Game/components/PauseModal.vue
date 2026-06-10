<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="pause-overlay">
        <div class="pause-modal">
          <div class="pause-modal__header">
            <span class="pause-icon">⏸️</span>
            <h2>游戏暂停</h2>
          </div>
          
          <div class="pause-modal__content">
            <p>按 ESC 键或点击下方按钮继续游戏</p>
            
            <div class="current-stats">
              <div class="stat">
                <span class="stat-icon">☀️</span>
                <span class="stat-value">{{ gameStore.sun }}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">🌊</span>
                <span class="stat-value">{{ gameStore.wave }}/10</span>
              </div>
              <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">{{ gameStore.score }}</span>
              </div>
            </div>
          </div>
          
          <div class="pause-modal__actions">
            <button class="action-btn action-btn--primary" @click="resumeGame">
              <span class="btn-icon">▶️</span>
              继续游戏
            </button>
            <button class="action-btn action-btn--danger" @click="quitGame">
              <span class="btn-icon">🚪</span>
              退出游戏
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

const visible = computed(() => gameStore.isPaused)

const resumeGame = () => {
  gameStore.resumeGame()
}

const quitGame = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pause-modal {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  min-width: 380px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  
  &__header {
    text-align: center;
    margin-bottom: $spacing-lg;
    
    .pause-icon {
      font-size: 60px;
      display: block;
      margin-bottom: $spacing-md;
      animation: pausePulse 2s ease-in-out infinite;
    }
    
    h2 {
      font-size: $font-size-xxl;
      color: white;
      margin: 0;
    }
  }
  
  &__content {
    text-align: center;
    margin-bottom: $spacing-xl;
    
    p {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: $spacing-lg;
    }
    
    .current-stats {
      display: flex;
      justify-content: center;
      gap: $spacing-lg;
      
      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-md;
        background: rgba(255, 255, 255, 0.05);
        border-radius: $border-radius-md;
        min-width: 80px;
        
        .stat-icon {
          font-size: 24px;
        }
        
        .stat-value {
          font-size: $font-size-lg;
          font-weight: 700;
          color: white;
        }
      }
    }
  }
  
  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-lg;
  font-size: $font-size-lg;
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
  
  &--danger {
    background: linear-gradient(135deg, #5D4037, #3E2723);
    color: #FFCC80;
    border-color: #8D6E63;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(93, 64, 55, 0.4);
    }
  }
}

@keyframes pausePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
  
  .pause-modal {
    transition: all 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .pause-modal {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
}
</style>
