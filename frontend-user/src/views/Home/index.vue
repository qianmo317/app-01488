<template>
  <div class="home">
    <!-- 动态背景 -->
    <div class="home__background">
      <div class="bg-gradient"></div>
      <div class="bg-pattern"></div>
      <div class="floating-plants">
        <span v-for="i in 15" :key="i" class="plant-float">
          {{ ['🌻', '🌱', '🥜', '❄️', '🌿', '🍒'][i % 6] }}
        </span>
      </div>
      <div class="floating-zombies">
        <span v-for="i in 8" :key="i" class="zombie-float">🧟</span>
      </div>
    </div>
    
    <!-- 主内容 -->
    <div class="home__content">
      <!-- Logo区域 -->
      <div class="home__logo fade-in">
        <div class="logo-wrapper">
          <div class="logo-sun">☀️</div>
          <div class="logo-icon">🌻</div>
          <div class="logo-zombie">🧟</div>
        </div>
        <h1 class="logo-title">
          <span class="title-plant">植物</span>
          <span class="title-vs">VS</span>
          <span class="title-zombie">僵尸</span>
        </h1>
        <p class="logo-subtitle">Plants vs. Zombies</p>
        <div class="logo-decoration">
          <span>🌱</span>
          <span>⚔️</span>
          <span>💀</span>
        </div>
      </div>
      
      <!-- 菜单区域 -->
      <div class="home__menu fade-in" style="animation-delay: 0.2s">
        <button class="game-btn game-btn--primary" @click="startGame">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">开始游戏</span>
          <span class="btn-arrow">→</span>
        </button>
        
        <button class="game-btn game-btn--secondary" @click="goToHelp">
          <span class="btn-icon">📖</span>
          <span class="btn-text">游戏帮助</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
      
      <!-- 特性展示 -->
      <div class="home__features fade-in" style="animation-delay: 0.4s">
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">🌱</span>
          </div>
          <h3>6种植物</h3>
          <p>向日葵、豌豆射手、坚果墙...</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">🧟</span>
          </div>
          <h3>3种僵尸</h3>
          <p>普通、路障、铁桶僵尸</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">🏆</span>
          </div>
          <h3>10波挑战</h3>
          <p>难度递增的僵尸波次</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  router.push('/game')
}

const goToHelp = () => {
  router.push('/help')
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .bg-gradient {
      position: absolute;
      width: 100%;
      height: 100%;
      // 移除背景渐变，使用 body 的背景
      background: transparent;
    }
    
    .bg-pattern {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 70%);
    }
  }
  
  .floating-plants {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .plant-float {
      position: absolute;
      font-size: 30px;
      opacity: 0.15;
      animation: floatPlant 20s ease-in-out infinite;
      
      @for $i from 1 through 15 {
        &:nth-child(#{$i}) {
          left: #{math.random(90)}%;
          top: #{math.random(90)}%;
          animation-delay: #{$i * -1.3}s;
          animation-duration: #{15 + math.random(10)}s;
          font-size: #{20 + math.random(20)}px;
        }
      }
    }
  }
  
  .floating-zombies {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .zombie-float {
      position: absolute;
      font-size: 25px;
      opacity: 0.1;
      animation: floatZombie 25s linear infinite;
      
      @for $i from 1 through 8 {
        &:nth-child(#{$i}) {
          right: -50px;
          top: #{$i * 12}%;
          animation-delay: #{$i * -3}s;
        }
      }
    }
  }
  
  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: $spacing-xl;
  }
  
  &__logo {
    text-align: center;
    margin-bottom: $spacing-xl;
    
    .logo-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-lg;
      margin-bottom: $spacing-lg;
      
      .logo-sun {
        font-size: 50px;
        animation: rotateSun 10s linear infinite;
        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
      }
      
      .logo-icon {
        font-size: 100px;
        animation: bounceMain 2s ease-in-out infinite;
        filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
      }
      
      .logo-zombie {
        font-size: 50px;
        animation: shakeZombie 3s ease-in-out infinite;
        filter: drop-shadow(0 0 15px rgba(100, 100, 100, 0.5));
      }
    }
    
    .logo-title {
      font-size: 56px;
      font-weight: 900;
      margin-bottom: $spacing-sm;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      
      .title-plant {
        color: #7CB342;
        text-shadow: 
          0 0 10px rgba(124, 179, 66, 0.5),
          0 4px 20px rgba(0, 0, 0, 0.5);
      }
      
      .title-vs {
        color: #FFD700;
        font-size: 40px;
        margin: 0 $spacing-md;
        text-shadow: 
          0 0 15px rgba(255, 215, 0, 0.8),
          0 4px 20px rgba(0, 0, 0, 0.5);
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      .title-zombie {
        color: #8D6E63;
        text-shadow: 
          0 0 10px rgba(141, 110, 99, 0.5),
          0 4px 20px rgba(0, 0, 0, 0.5);
      }
    }
    
    .logo-subtitle {
      font-size: $font-size-xl;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 8px;
      font-weight: 300;
      margin-bottom: $spacing-md;
    }
    
    .logo-decoration {
      display: flex;
      justify-content: center;
      gap: $spacing-lg;
      font-size: 24px;
      opacity: 0.5;
      
      span {
        animation: twinkle 2s ease-in-out infinite;
        
        &:nth-child(2) { animation-delay: 0.3s; }
        &:nth-child(3) { animation-delay: 0.6s; }
      }
    }
  }
  
  &__menu {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }
  
  &__features {
    display: flex;
    gap: $spacing-lg;
    flex-wrap: wrap;
    justify-content: center;
  }
}

// 游戏风格按钮
.game-btn {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-xl;
  min-width: 280px;
  border-radius: $border-radius-xl;
  font-size: $font-size-lg;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
  
  .btn-icon {
    font-size: 28px;
  }
  
  .btn-text {
    flex: 1;
    text-align: left;
  }
  
  .btn-arrow {
    font-size: 20px;
    transition: transform 0.3s ease;
    opacity: 1;  /* 始终显示箭头 */
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    
    .btn-arrow {
      transform: translateX(5px);  /* hover 时箭头向右移动 */
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1);
  }
  
  &--primary {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    border-color: #81C784;
    box-shadow: 
      0 8px 25px rgba(76, 175, 80, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #66BB6A 0%, #388E3C 100%);
      box-shadow: 
        0 12px 35px rgba(76, 175, 80, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
  
  &--secondary {
    background: linear-gradient(135deg, #5D4037 0%, #3E2723 100%);
    color: #FFCC80;
    border-color: #8D6E63;
    box-shadow: 
      0 8px 25px rgba(93, 64, 55, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: linear-gradient(135deg, #6D4C41 0%, #4E342E 100%);
      box-shadow: 
        0 12px 35px rgba(93, 64, 55, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
  }
}

// 特性卡片
.feature-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border-radius: $border-radius-xl;
  padding: $spacing-lg;
  min-width: 160px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    .feature-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  .feature-icon-wrapper {
    width: 70px;
    height: 70px;
    margin: 0 auto $spacing-md;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.2));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 2px solid rgba(76, 175, 80, 0.3);
  }
  
  .feature-icon {
    font-size: 36px;
  }
  
  h3 {
    font-size: $font-size-md;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    font-weight: 700;
  }
  
  p {
    font-size: $font-size-xs;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.4;
  }
}

// 动画
@keyframes floatPlant {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-25px) rotate(3deg);
  }
}

@keyframes floatZombie {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateX(-120vw);
    opacity: 0;
  }
}

@keyframes rotateSun {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounceMain {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

@keyframes shakeZombie {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-5px) rotate(-5deg);
  }
  75% {
    transform: translateX(5px) rotate(5deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
