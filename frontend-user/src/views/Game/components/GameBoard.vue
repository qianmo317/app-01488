<template>
  <div class="game-board" ref="boardRef">
    <!-- 房子区域 -->
    <div class="game-board__house">
      <div class="house-building">🏠</div>
      <div class="house-door"></div>
    </div>
    
    <!-- 草坪区域 -->
    <div class="game-board__lawn">
      <div 
        v-for="row in 5" 
        :key="row" 
        class="lawn-row"
      >
        <div 
          v-for="col in 9" 
          :key="col"
          class="lawn-cell"
          :class="{ 
            'lawn-cell--highlight': gameStore.selectedPlant,
            'lawn-cell--light': (row + col) % 2 === 0
          }"
          @click="handleCellClick(row - 1, col - 1)"
        >
          <PlantEntity 
            v-if="getPlantAt(row - 1, col - 1)"
            :plant="getPlantAt(row - 1, col - 1)"
          />
        </div>
      </div>
      
      <!-- 僵尸和子弹层 - 放在草坪内部 -->
      <div class="lawn-entities">
        <ZombieEntity 
          v-for="zombie in gameStore.zombies"
          :key="zombie.id"
          :zombie="zombie"
        />
        
        <BulletEntity 
          v-for="bullet in gameStore.bullets"
          :key="bullet.id"
          :bullet="bullet"
        />
      </div>
      
      <!-- 阳光层 - 放在草坪内部 -->
      <div class="lawn-suns">
        <SunEntity 
          v-for="sun in gameStore.suns"
          :key="sun.id"
          :sun="sun"
          @collect="collectSun"
        />
      </div>
    </div>
    
    <!-- 爆炸效果层 -->
    <div class="game-board__explosions">
      <ExplosionEffect 
        v-for="explosion in explosions"
        :key="explosion.id"
        :row="explosion.row"
        :col="explosion.col"
      />
    </div>
    
    <!-- 僵尸出生区域指示 -->
    <div class="game-board__spawn-zone">
      <span v-for="i in 5" :key="i" class="spawn-indicator">⚠️</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { PLANTS, ZOMBIES, WAVE_CONFIG, GAME_CONFIG } from '@/utils/gameConfig'
import { ElMessage } from 'element-plus'
import PlantEntity from './PlantEntity.vue'
import ZombieEntity from './ZombieEntity.vue'
import BulletEntity from './BulletEntity.vue'
import SunEntity from './SunEntity.vue'
import ExplosionEffect from './ExplosionEffect.vue'

const gameStore = useGameStore()
const boardRef = ref(null)
const explosions = ref([])
let gameLoop = null
let lastTime = 0

const getPlantAt = (row, col) => {
  return gameStore.plants.find(p => p.row === row && p.col === col)
}

const handleCellClick = (row, col) => {
  if (!gameStore.selectedPlant) return
  
  const success = gameStore.plantAt(row, col)
  if (success) {
    ElMessage({
      message: '种植成功！',
      type: 'success',
      duration: 1000,
      showClose: false
    })
  } else {
    ElMessage({
      message: '该位置已有植物或阳光不足！',
      type: 'warning',
      duration: 1000,
      showClose: false
    })
  }
}

const collectSun = (sunId) => {
  gameStore.collectSun(sunId)
}

const update = (currentTime) => {
  if (!gameStore.isPlaying) {
    gameLoop = requestAnimationFrame(update)
    return
  }
  
  const delta = currentTime - lastTime
  lastTime = currentTime
  
  gameStore.updateGameTime(delta)
  spawnSkySun()
  updatePlants()
  updateZombies()
  updateBullets()
  spawnZombies()
  cleanupSuns()
  checkGameState()
  
  gameLoop = requestAnimationFrame(update)
}

const spawnSkySun = () => {
  if (gameStore.gameTime - (gameStore.lastSunDrop || 0) > GAME_CONFIG.sunDropInterval) {
    // 草坪区域：左边距70px + 9列 * 80px = 790px
    // 阳光宽度60px，范围 70 到 730
    const x = Math.random() * 660 + 70
    gameStore.spawnSun(x, -50, GAME_CONFIG.sunDropValue, false)
    gameStore.lastSunDrop = gameStore.gameTime
  }
}

const updatePlants = () => {
  gameStore.plants.forEach(plant => {
    const config = PLANTS[plant.type]
    if (!config) return
    
    if (plant.type === 'sunflower') {
      if (gameStore.gameTime - plant.lastAction > (config.sunInterval || 24000)) {
        // 固定80px格子大小，阳光从向日葵上方产生
        // 添加随机偏移避免多个阳光重叠
        const x = plant.col * 80 + 70 + 40 + (Math.random() - 0.5) * 30  // 左右随机偏移15px
        const y = plant.row * 80 + 16 + 10 + (Math.random() - 0.5) * 20  // 上下随机偏移10px
        gameStore.spawnSun(x, y, config.sunProduction, true)
        plant.lastAction = gameStore.gameTime
      }
    }
    
    if (config.damage && config.fireRate) {
      // 检测僵尸是否在该行且在植物右侧
      const plantRightEdge = plant.col * 80 + 70 + 80
      const hasZombieInRow = gameStore.zombies.some(z => z.row === plant.row && z.x > plantRightEdge)
      
      if (hasZombieInRow && gameStore.gameTime - plant.lastAction > config.fireRate) {
        gameStore.fireBullet(plant)
        plant.lastAction = gameStore.gameTime
      }
    }
    
    if (plant.type === 'cherryBomb' && !plant.exploded) {
      plant.exploded = true
      
      // 添加爆炸效果
      const explosionId = Date.now() + Math.random()
      explosions.value.push({
        id: explosionId,
        row: plant.row,
        col: plant.col
      })
      
      // 0.6秒后移除爆炸效果
      setTimeout(() => {
        const index = explosions.value.findIndex(e => e.id === explosionId)
        if (index !== -1) {
          explosions.value.splice(index, 1)
        }
      }, 600)
      
      // 延迟爆炸伤害，让玩家看到效果
      setTimeout(() => {
        gameStore.zombies.forEach(zombie => {
          const rowDiff = Math.abs(zombie.row - plant.row)
          const colDiff = Math.abs(Math.floor((zombie.x - 70) / 80) - plant.col)
          
          if (rowDiff <= 1 && colDiff <= 1) {
            zombie.health -= config.damage
          }
        })
        gameStore.removePlant(plant.id)
      }, 300)
    }
  })
}

const updateZombies = () => {
  gameStore.zombies.forEach(zombie => {
    const config = ZOMBIES[zombie.type]
    if (!config) return
    
    // 检查前方是否有植物
    const plantInFront = gameStore.plants.find(p => {
      if (p.row !== zombie.row) return false
      
      const plantX = p.col * 80 + 70 + 40  // 植物中心 X 坐标
      const distance = zombie.x - plantX
      return distance >= -10 && distance <= 40
    })
    
    if (plantInFront) {
      zombie.isEating = true
      if (gameStore.gameTime - (zombie.lastAttack || 0) > config.attackRate) {
        plantInFront.health -= config.damage
        zombie.lastAttack = gameStore.gameTime
        
        if (plantInFront.health <= 0) {
          gameStore.removePlant(plantInFront.id)
        }
      }
    } else {
      zombie.isEating = false
      let speed = config.speed
      if (zombie.isFrozen && gameStore.gameTime < zombie.frozenUntil) {
        speed *= 0.5
      } else {
        zombie.isFrozen = false
      }
      zombie.x -= speed
    }
    
    if (zombie.health <= 0) {
      gameStore.removeZombie(zombie.id)
    }
  })
}

const updateBullets = () => {
  gameStore.bullets.forEach(bullet => {
    bullet.x += bullet.speed
    
    // 优化碰撞检测：扩大范围以确保能命中正在吃植物的僵尸
    const hitZombie = gameStore.zombies.find(z => {
      if (z.row !== bullet.row) return false
      
      // 子弹从左向右飞，僵尸从右向左走
      // 扩大碰撞范围，确保能命中正在吃植物的僵尸（distance可能达到40）
      const distance = bullet.x - z.x
      return distance >= -10 && distance <= 50  // 扩大到50，覆盖吃植物状态的僵尸
    })
    
    if (hitZombie) {
      hitZombie.health -= bullet.damage
      
      if (bullet.isFrozen) {
        hitZombie.isFrozen = true
        hitZombie.frozenUntil = gameStore.gameTime + 5000
      }
      
      gameStore.removeBullet(bullet.id)
    }
    
    if (bullet.x > 900) {
      gameStore.removeBullet(bullet.id)
    }
  })
}

const spawnZombies = () => {
  const waveConfig = WAVE_CONFIG[gameStore.wave]
  if (!waveConfig) return
  
  if (gameStore.zombiesSpawnedInWave < waveConfig.count && 
      gameStore.gameTime - gameStore.lastZombieSpawn > waveConfig.interval) {
    const type = waveConfig.types[Math.floor(Math.random() * waveConfig.types.length)]
    const row = Math.floor(Math.random() * 5)
    // 僵尸从最右侧出现（警告标志位置）
    // 考虑到僵尸渲染时会减去70px，使用更大的值
    gameStore.spawnZombie(type, row, 1000)
    gameStore.zombiesSpawnedInWave++
    gameStore.lastZombieSpawn = gameStore.gameTime
  }
  
  if (gameStore.zombiesSpawnedInWave >= waveConfig.count && gameStore.zombies.length === 0) {
    if (gameStore.wave < 10) {
      gameStore.nextWave()
      ElMessage({
        message: `第 ${gameStore.wave} 波僵尸来袭！`,
        type: 'warning',
        duration: 2000
      })
    }
  }
}

const cleanupSuns = () => {
  // 增加阳光存在时间到15秒，给玩家更多时间收集
  const expiredSuns = gameStore.suns.filter(s => 
    gameStore.gameTime - s.createdAt > 15000
  )
  expiredSuns.forEach(s => {
    const index = gameStore.suns.findIndex(sun => sun.id === s.id)
    if (index !== -1) {
      gameStore.suns.splice(index, 1)
    }
  })
}

const checkGameState = () => {
  const zombieReachedHouse = gameStore.zombies.some(z => z.x < 0)
  if (zombieReachedHouse) {
    gameStore.loseGame()
    return
  }
  
  // 修复：第10波所有僵尸已生成且全部被消灭，游戏胜利
  const waveConfig = WAVE_CONFIG[gameStore.wave]
  if (gameStore.wave === 10 && 
      waveConfig &&
      gameStore.zombiesSpawnedInWave >= waveConfig.count &&
      gameStore.zombies.length === 0) {
    gameStore.winGame()
  }
}

onMounted(() => {
  lastTime = performance.now()
  gameLoop = requestAnimationFrame(update)
  
  // 游戏开始时显示第一波提示
  setTimeout(() => {
    if (gameStore.isPlaying) {
      ElMessage({
        message: '第 1 波僵尸来袭！准备好防御！',
        type: 'warning',
        duration: 3000
      })
    }
  }, 1000)
})

onUnmounted(() => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop)
  }
})
</script>

<style lang="scss" scoped>
.game-board {
  position: relative;
  flex: 1;
  background: linear-gradient(180deg, #8BC34A 0%, #689F38 50%, #558B2F 100%);
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: 
    inset 0 0 100px rgba(0, 0, 0, 0.2),
    0 10px 40px rgba(0, 0, 0, 0.3);
  min-height: 480px;
  min-width: 1000px;  // 增加最小宽度：70(房子) + 720(草坪) + 100(右侧) + 边距 = 至少1000px
  border: 4px solid #33691E;
  display: block;
  
  &__house {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(90deg, #5D4037 0%, #4E342E 50%, transparent 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    
    .house-building {
      font-size: 45px;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
    }
  }
  
  &__lawn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    padding: 0;
    margin-left: 70px;
    margin-right: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    width: 720px;  // 固定宽度：9列 * 80px = 720px
    
    .lawn-entities {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 10;
    }
    
    .lawn-suns {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 11;
      
      > * {
        pointer-events: auto;
      }
    }
  }
  
  &__entities {
    display: none;  // 不再使用
  }
  
  &__suns {
    display: none;  // 不再使用
  }
  
  &__explosions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 5;
  }
  
  &__spawn-zone {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: $spacing-lg 0;
    background: linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.2));
    
    .spawn-indicator {
      font-size: 16px;
      opacity: 0.5;
      animation: blink 2s ease-in-out infinite;
      
      @for $i from 1 through 5 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.2}s;
        }
      }
    }
  }
}

.lawn-row {
  display: flex;
  gap: 2px;
}

.lawn-cell {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, rgba(139, 195, 74, 0.4), rgba(104, 159, 56, 0.3));
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &--light {
    background: linear-gradient(145deg, rgba(156, 204, 101, 0.5), rgba(139, 195, 74, 0.4));
  }
  
  &--highlight {
    &:hover {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
      box-shadow: 
        inset 0 0 20px rgba(255, 255, 255, 0.3),
        0 0 15px rgba(76, 175, 80, 0.5);
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.02);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
    border-radius: 50%;
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
</style>
