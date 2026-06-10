// 植物配置
export const PLANTS = {
  sunflower: {
    name: '向日葵',
    cost: 50,
    health: 100,
    cooldown: 7500,
    sunProduction: 50,  // 增加产量从 25 到 50
    sunInterval: 12000,  // 减少间隔从 24000 到 12000 (12秒)
    description: '生产阳光的基础植物',
    emoji: '🌻'
  },
  peashooter: {
    name: '豌豆射手',
    cost: 100,
    health: 100,
    damage: 20,
    fireRate: 1500,
    description: '发射豌豆攻击僵尸',
    emoji: '🌱'
  },
  wallnut: {
    name: '坚果墙',
    cost: 50,
    health: 400,
    cooldown: 30000,
    description: '高生命值的防御植物',
    emoji: '🥜'
  },
  snowPea: {
    name: '寒冰射手',
    cost: 175,
    health: 100,
    damage: 20,
    fireRate: 1500,
    slowEffect: 0.5,
    description: '发射冰冻豌豆减速僵尸',
    emoji: '❄️'
  },
  repeater: {
    name: '双发射手',
    cost: 200,
    health: 100,
    damage: 20,
    fireRate: 1500,
    description: '一次发射两颗豌豆',
    emoji: '🌿'
  },
  cherryBomb: {
    name: '樱桃炸弹',
    cost: 150,
    health: 100,
    damage: 1800,
    range: 1,
    cooldown: 50000,
    description: '爆炸消灭周围僵尸',
    emoji: '🍒'
  }
}

// 僵尸配置
export const ZOMBIES = {
  normal: {
    name: '普通僵尸',
    health: 100,
    speed: 0.4,
    damage: 10,
    attackRate: 500,
    emoji: '🧟'
  },
  cone: {
    name: '路障僵尸',
    health: 200,
    speed: 0.4,
    damage: 10,
    attackRate: 500,
    emoji: '🧟‍♂️'
  },
  bucket: {
    name: '铁桶僵尸',
    health: 400,
    speed: 0.35,
    damage: 10,
    attackRate: 500,
    emoji: '🧟‍♂️'
  }
}

// 游戏配置
export const GAME_CONFIG = {
  gridRows: 5,
  gridCols: 9,
  cellSize: 80,
  initialSun: 150,
  sunDropInterval: 8000,  // 减少天空阳光掉落间隔从 10000 到 8000
  sunDropValue: 25,
  maxWaves: 10,
  zombiesPerWave: [3, 5, 7, 10, 12, 15, 18, 20, 25, 30],
  waveInterval: 30000
}

// 波次配置
export const WAVE_CONFIG = {
  1: { types: ['normal'], count: 6, interval: 5000 },  // 减少第一波间隔到5秒
  2: { types: ['normal'], count: 8, interval: 6000 },
  3: { types: ['normal', 'cone'], count: 8, interval: 5500 },
  4: { types: ['normal', 'cone'], count: 8, interval: 5000 },
  5: { types: ['normal', 'cone', 'bucket'], count: 10, interval: 4500 },
  6: { types: ['normal', 'cone', 'bucket'], count: 12, interval: 4000 },
  7: { types: ['cone', 'bucket'], count: 14, interval: 3500 },
  8: { types: ['cone', 'bucket'], count: 16, interval: 3000 },
  9: { types: ['cone', 'bucket'], count: 18, interval: 2500 },
  10: { types: ['bucket'], count: 20, interval: 2000 }
}
