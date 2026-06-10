<template>
  <div class="help">
    <div class="help__header">
      <button class="back-btn" @click="goBack">
        <span class="btn-icon">←</span>
        <span>返回首页</span>
      </button>
      <h1>📖 游戏帮助</h1>
    </div>
    
    <div class="help__content">
      <section class="help-section fade-in">
        <div class="section-header">
          <span class="section-icon">🎯</span>
          <h2>游戏目标</h2>
        </div>
        <div class="section-body">
          <p>阻止僵尸穿过草坪进入你的房子。使用各种植物来抵御僵尸的进攻，坚持到最后一波僵尸被消灭即可获胜。</p>
        </div>
      </section>
      
      <section class="help-section fade-in" style="animation-delay: 0.1s">
        <div class="section-header">
          <span class="section-icon">🖱️</span>
          <h2>操作说明</h2>
        </div>
        <div class="section-body">
          <ul class="tips-list">
            <li><span class="tip-icon">👆</span>点击底部植物卡片选择要种植的植物</li>
            <li><span class="tip-icon">🌱</span>点击草坪格子种植选中的植物</li>
            <li><span class="tip-icon">☀️</span>点击掉落的阳光收集它们</li>
            <li><span class="tip-icon">⏸️</span>按 ESC 键或点击暂停按钮暂停游戏</li>
          </ul>
        </div>
      </section>
      
      <section class="help-section fade-in" style="animation-delay: 0.2s">
        <div class="section-header">
          <span class="section-icon">🌻</span>
          <h2>植物图鉴</h2>
        </div>
        <div class="section-body">
          <div class="entity-grid">
            <div v-for="(plant, key) in plants" :key="key" class="entity-card entity-card--plant">
              <div class="entity-emoji">{{ plant.emoji }}</div>
              <div class="entity-info">
                <h3>{{ plant.name }}</h3>
                <div class="entity-stats">
                  <span class="stat"><span class="stat-icon">☀️</span>{{ plant.cost }}</span>
                  <span class="stat"><span class="stat-icon">❤️</span>{{ plant.health }}</span>
                </div>
                <p class="entity-desc">{{ plant.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="help-section fade-in" style="animation-delay: 0.3s">
        <div class="section-header">
          <span class="section-icon">🧟</span>
          <h2>僵尸图鉴</h2>
        </div>
        <div class="section-body">
          <div class="entity-grid entity-grid--zombie">
            <div v-for="(zombie, key) in zombies" :key="key" class="entity-card entity-card--zombie">
              <div class="entity-emoji">{{ zombie.emoji }}</div>
              <div class="entity-info">
                <h3>{{ zombie.name }}</h3>
                <div class="entity-stats">
                  <span class="stat"><span class="stat-icon">❤️</span>{{ zombie.health }}</span>
                  <span class="stat"><span class="stat-icon">⚔️</span>{{ zombie.damage }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="help-section fade-in" style="animation-delay: 0.4s">
        <div class="section-header">
          <span class="section-icon">💡</span>
          <h2>游戏技巧</h2>
        </div>
        <div class="section-body">
          <ul class="tips-list tips-list--numbered">
            <li><span class="tip-number">1</span>优先种植向日葵，确保阳光充足</li>
            <li><span class="tip-number">2</span>在每行都部署攻击性植物</li>
            <li><span class="tip-number">3</span>使用坚果墙保护脆弱的植物</li>
            <li><span class="tip-number">4</span>寒冰射手可以减速僵尸，配合其他植物效果更佳</li>
            <li><span class="tip-number">5</span>樱桃炸弹适合在紧急情况下使用</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { PLANTS, ZOMBIES } from '@/utils/gameConfig'

const router = useRouter()
const plants = PLANTS
const zombies = ZOMBIES

const goBack = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.help {
  min-height: 100vh;
  padding: $spacing-lg;
  background: transparent;
  
  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    
    h1 {
      font-size: $font-size-xxl;
      color: $text-primary;
      flex: 1;
    }
  }
  
  &__content {
    max-width: 900px;
    margin: 0 auto;
  }
}

.back-btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, #5D4037, #3E2723);
  color: #FFCC80;
  border-radius: $border-radius-lg;
  font-size: $font-size-md;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #8D6E63;
  
  .btn-icon {
    font-size: 18px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(93, 64, 55, 0.4);
  }
}

.help-section {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: $border-radius-xl;
  margin-bottom: $spacing-lg;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .section-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .section-icon {
      font-size: 28px;
    }
    
    h2 {
      font-size: $font-size-xl;
      color: #81C784;
      margin: 0;
    }
  }
  
  .section-body {
    padding: $spacing-lg;
    
    p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.8;
      font-size: $font-size-md;
    }
  }
}

.tips-list {
  li {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: $font-size-md;
    
    .tip-icon {
      font-size: 20px;
      width: 30px;
      text-align: center;
    }
  }
  
  &--numbered {
    li {
      .tip-number {
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-sm;
        font-weight: 700;
        color: white;
      }
    }
  }
}

.entity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-md;
  
  &--zombie {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

.entity-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: rgba(0, 0, 0, 0.2);
  border-radius: $border-radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
    transform: translateX(5px);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &--plant {
    .entity-emoji {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.2));
      border-color: rgba(76, 175, 80, 0.3);
    }
  }
  
  &--zombie {
    .entity-emoji {
      background: linear-gradient(135deg, rgba(141, 110, 99, 0.3), rgba(93, 64, 55, 0.2));
      border-color: rgba(141, 110, 99, 0.3);
    }
  }
  
  .entity-emoji {
    font-size: 40px;
    width: 65px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-lg;
    border: 2px solid;
    flex-shrink: 0;
  }
  
  .entity-info {
    flex: 1;
    min-width: 0;
    
    h3 {
      font-size: $font-size-md;
      color: white;
      margin: 0 0 $spacing-xs;
    }
    
    .entity-stats {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-xs;
      
      .stat {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: $font-size-sm;
        color: #FFD54F;
        
        .stat-icon {
          font-size: 14px;
        }
      }
    }
    
    .entity-desc {
      font-size: $font-size-xs;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      line-height: 1.4;
    }
  }
}
</style>
