import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PLANTS, ZOMBIES } from '@/utils/gameConfig'

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const gameStatus = ref('idle') // idle, playing, paused, won, lost
  const sun = ref(50)
  const wave = ref(1)
  const score = ref(0)
  const selectedPlant = ref(null)
  
  // 游戏实体
  const plants = ref([])
  const zombies = ref([])
  const bullets = ref([])
  const suns = ref([])
  
  // 游戏时间
  const gameTime = ref(0)
  const lastZombieSpawn = ref(0)
  const lastSunDrop = ref(0)
  const zombiesSpawnedInWave = ref(0)  // 追踪当前波次已生成的僵尸数
  
  // 计算属性
  const isPlaying = computed(() => gameStatus.value === 'playing')
  const isPaused = computed(() => gameStatus.value === 'paused')
  const isGameOver = computed(() => ['won', 'lost'].includes(gameStatus.value))
  
  // 开始游戏
  function startGame() {
    resetGame()
    gameStatus.value = 'playing'
  }
  
  // 重置游戏
  function resetGame() {
    sun.value = 150  // 增加初始阳光，方便开局
    wave.value = 1
    score.value = 0
    selectedPlant.value = null
    plants.value = []
    zombies.value = []
    bullets.value = []
    suns.value = []
    gameTime.value = 0
    lastZombieSpawn.value = 0
    lastSunDrop.value = 0
    zombiesSpawnedInWave.value = 0
    gameStatus.value = 'idle'
  }
  
  // 暂停游戏
  function pauseGame() {
    if (gameStatus.value === 'playing') {
      gameStatus.value = 'paused'
    }
  }
  
  // 继续游戏
  function resumeGame() {
    if (gameStatus.value === 'paused') {
      gameStatus.value = 'playing'
    }
  }
  
  // 选择植物
  function selectPlant(plantType) {
    const plantConfig = PLANTS[plantType]
    if (plantConfig && sun.value >= plantConfig.cost) {
      selectedPlant.value = plantType
    }
  }
  
  // 取消选择
  function cancelSelection() {
    selectedPlant.value = null
  }
  
  // 种植植物
  function plantAt(row, col) {
    if (!selectedPlant.value) return false
    
    const plantConfig = PLANTS[selectedPlant.value]
    if (!plantConfig || sun.value < plantConfig.cost) return false
    
    // 检查位置是否已有植物
    const exists = plants.value.some(p => p.row === row && p.col === col)
    if (exists) return false
    
    // 创建植物
    const plant = {
      id: Date.now() + Math.random(),
      type: selectedPlant.value,
      row,
      col,
      health: plantConfig.health,
      maxHealth: plantConfig.health,
      // 让植物种下后立即可以行动（向日葵立即产阳光，射手立即射击）
      lastAction: selectedPlant.value === 'sunflower' 
        ? gameTime.value - (plantConfig.sunInterval || 0) + 2000  // 向日葵2秒后产第一个阳光
        : gameTime.value - (plantConfig.fireRate || 0)  // 射手立即可以射击
    }
    
    plants.value.push(plant)
    sun.value -= plantConfig.cost
    selectedPlant.value = null
    
    return true
  }
  
  // 移除植物
  function removePlant(plantId) {
    const index = plants.value.findIndex(p => p.id === plantId)
    if (index !== -1) {
      plants.value.splice(index, 1)
    }
  }
  
  // 添加阳光
  function addSun(amount) {
    sun.value += amount
  }
  
  // 收集阳光
  function collectSun(sunId) {
    const index = suns.value.findIndex(s => s.id === sunId)
    if (index !== -1) {
      sun.value += suns.value[index].value
      suns.value.splice(index, 1)
    }
  }
  
  // 生成阳光
  function spawnSun(x, y, value = 25, fromPlant = false) {
    suns.value.push({
      id: Date.now() + Math.random(),
      x,
      y,
      value,
      fromPlant,
      createdAt: gameTime.value
    })
  }
  
  // 生成僵尸
  function spawnZombie(type, row, spawnX = 1000) {
    const zombieConfig = ZOMBIES[type]
    if (!zombieConfig) return
    
    zombies.value.push({
      id: Date.now() + Math.random(),
      type,
      row,
      x: spawnX,  // 从最右侧出现（考虑到渲染时会减去70px的lawn margin）
      health: zombieConfig.health,
      maxHealth: zombieConfig.health,
      speed: zombieConfig.speed,
      damage: zombieConfig.damage,
      isEating: false,
      isFrozen: false,
      frozenUntil: 0
    })
  }
  
  // 移除僵尸
  function removeZombie(zombieId) {
    const index = zombies.value.findIndex(z => z.id === zombieId)
    if (index !== -1) {
      score.value += 100
      zombies.value.splice(index, 1)
    }
  }
  
  // 发射子弹
  function fireBullet(plant) {
    const plantConfig = PLANTS[plant.type]
    if (!plantConfig || !plantConfig.damage) return
    
    const bulletCount = plant.type === 'repeater' ? 2 : 1
    
    for (let i = 0; i < bulletCount; i++) {
      setTimeout(() => {
        bullets.value.push({
          id: Date.now() + Math.random(),
          row: plant.row,
          x: plant.col * 80 + 70 + 80,  // 从植物右侧边缘发射
          damage: plantConfig.damage,
          speed: 5,
          isFrozen: plant.type === 'snowPea'
        })
      }, i * 150)
    }
  }
  
  // 移除子弹
  function removeBullet(bulletId) {
    const index = bullets.value.findIndex(b => b.id === bulletId)
    if (index !== -1) {
      bullets.value.splice(index, 1)
    }
  }
  
  // 游戏胜利
  function winGame() {
    gameStatus.value = 'won'
  }
  
  // 游戏失败
  function loseGame() {
    gameStatus.value = 'lost'
  }
  
  // 增加波数
  function nextWave() {
    wave.value++
    zombiesSpawnedInWave.value = 0  // 重置当前波次的僵尸计数
  }
  
  // 更新游戏时间
  function updateGameTime(delta) {
    gameTime.value += delta
  }
  
  return {
    // 状态
    gameStatus,
    sun,
    wave,
    score,
    selectedPlant,
    plants,
    zombies,
    bullets,
    suns,
    gameTime,
    lastZombieSpawn,
    lastSunDrop,
    zombiesSpawnedInWave,
    
    // 计算属性
    isPlaying,
    isPaused,
    isGameOver,
    
    // 方法
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    selectPlant,
    cancelSelection,
    plantAt,
    removePlant,
    addSun,
    collectSun,
    spawnSun,
    spawnZombie,
    removeZombie,
    fireBullet,
    removeBullet,
    winGame,
    loseGame,
    nextWave,
    updateGameTime
  }
})
