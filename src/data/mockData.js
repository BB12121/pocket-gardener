export const currentUser = {
  id: 'u1',
  username: '小绿手',
  phone: '138****1234',
  registerTime: '2025-12-01',
  city: '杭州',
  reputation: 92,
  avatar: '🧑‍🌾'
};

export const species = [
  { id: 's1', name: '绿萝', latin: 'Epipremnum aureum', category: '观叶植物', waterCycle: 3, fertCycle: 14, light: '散射光' },
  { id: 's2', name: '多肉（桃蛋）', latin: 'Graptopetalum amethystinum', category: '多肉植物', waterCycle: 7, fertCycle: 30, light: '全日照' },
  { id: 's3', name: '栀子花', latin: 'Gardenia jasminoides', category: '开花植物', waterCycle: 2, fertCycle: 10, light: '半日照' },
  { id: 's4', name: '龟背竹', latin: 'Monstera deliciosa', category: '观叶植物', waterCycle: 4, fertCycle: 21, light: '散射光' },
];

export const plants = [
  { id: 'p1', nickname: '小绿', speciesId: 's1', createDate: '2026-01-15', purchaseDate: '2026-01-10', location: '客厅窗台', status: '健康', tags: ['耐阴', '喜湿'], image: '/images/plants/lvluo.jpg' },
  { id: 'p2', nickname: '桃桃', speciesId: 's2', createDate: '2026-02-20', purchaseDate: '2026-02-18', location: '阳台', status: '健康', tags: ['怕涝', '喜阳'], image: '/images/plants/duorou.jpg' },
  { id: 'p3', nickname: '小栀', speciesId: 's3', createDate: '2026-03-05', purchaseDate: '2026-03-01', location: '阳台', status: '轻微黄叶', tags: ['喜酸', '怕寒'], image: '/images/plants/zhizi.jpg' },
  { id: 'p4', nickname: '大龟', speciesId: 's4', createDate: '2026-04-10', purchaseDate: '2026-04-08', location: '书房', status: '健康', tags: ['耐阴', '喜湿'], image: '/images/plants/guibei.jpg' },
];

export const careLogs = [
  { id: 'l1', plantId: 'p1', type: '浇水', time: '2026-05-06 08:30', note: '土壤偏干，浇透', status: '正常' },
  { id: 'l2', plantId: 'p1', type: '施肥', time: '2026-05-01 09:00', note: '液态肥1:1000', status: '正常' },
  { id: 'l3', plantId: 'p2', type: '浇水', time: '2026-05-04 10:00', note: '少量喷雾', status: '正常' },
  { id: 'l4', plantId: 'p3', type: '浇水', time: '2026-05-05 07:30', note: '加了硫酸亚铁', status: '黄叶未改善' },
  { id: 'l5', plantId: 'p3', type: '修剪', time: '2026-05-03 16:00', note: '剪去黄叶3片', status: '轻微黄叶' },
  { id: 'l6', plantId: 'p4', type: '浇水', time: '2026-05-05 09:00', note: '浇透', status: '正常' },
  { id: 'l7', plantId: 'p1', type: '浇水', time: '2026-04-28 08:00', note: '正常浇水', status: '正常' },
  { id: 'l8', plantId: 'p1', type: '浇水', time: '2026-04-25 09:00', note: '浇透', status: '正常' },
  { id: 'l9', plantId: 'p1', type: '施肥', time: '2026-04-17 09:00', note: '液态肥', status: '正常' },
  { id: 'l10', plantId: 'p1', type: '浇水', time: '2026-04-22 08:30', note: '浇透', status: '正常' },
  { id: 'l11', plantId: 'p1', type: '浇水', time: '2026-04-19 08:00', note: '浇透', status: '正常' },
  { id: 'l12', plantId: 'p1', type: '浇水', time: '2026-04-15 08:30', note: '浇透', status: '正常' },
  { id: 'l13', plantId: 'p1', type: '修剪', time: '2026-04-10 15:00', note: '修剪黄叶', status: '正常' },
  { id: 'l14', plantId: 'p2', type: '浇水', time: '2026-04-27 10:00', note: '少量', status: '正常' },
  { id: 'l15', plantId: 'p2', type: '浇水', time: '2026-04-20 10:00', note: '喷雾', status: '正常' },
  { id: 'l16', plantId: 'p2', type: '施肥', time: '2026-04-13 09:00', note: '多肉专用肥', status: '正常' },
  { id: 'l17', plantId: 'p3', type: '浇水', time: '2026-04-30 07:30', note: '加硫酸亚铁', status: '正常' },
  { id: 'l18', plantId: 'p3', type: '浇水', time: '2026-04-26 08:00', note: '正常浇水', status: '正常' },
  { id: 'l19', plantId: 'p3', type: '施肥', time: '2026-04-20 09:00', note: '酸性肥', status: '正常' },
  { id: 'l20', plantId: 'p4', type: '浇水', time: '2026-04-29 09:00', note: '浇透', status: '正常' },
  { id: 'l21', plantId: 'p4', type: '浇水', time: '2026-04-24 09:00', note: '浇透', status: '正常' },
  { id: 'l22', plantId: 'p4', type: '施肥', time: '2026-04-15 09:00', note: '通用肥', status: '正常' },
  { id: 'l23', plantId: 'p1', type: '浇水', time: '2026-04-07 08:30', note: '浇透', status: '正常' },
  { id: 'l24', plantId: 'p1', type: '浇水', time: '2026-04-03 08:00', note: '浇透', status: '正常' },
  { id: 'l25', plantId: 'p2', type: '浇水', time: '2026-04-06 10:00', note: '少量', status: '正常' },
  { id: 'l26', plantId: 'p3', type: '浇水', time: '2026-04-12 08:00', note: '正常', status: '正常' },
  { id: 'l27', plantId: 'p4', type: '浇水', time: '2026-04-18 09:00', note: '浇透', status: '正常' },
  { id: 'l28', plantId: 'p4', type: '浇水', time: '2026-04-11 09:00', note: '浇透', status: '正常' },
];

export const careTasks = [
  { id: 't1', plantId: 'p1', type: '浇水', planTime: '2026-05-07 08:00', priority: '高', status: '待处理', source: '规则生成' },
  { id: 't2', plantId: 'p2', type: '浇水', planTime: '2026-05-08 10:00', priority: '中', status: '待处理', source: '规则生成' },
  { id: 't3', plantId: 'p3', type: '施肥', planTime: '2026-05-07 09:00', priority: '高', status: '待处理', source: 'AI建议' },
  { id: 't4', plantId: 'p4', type: '浇水', planTime: '2026-05-09 09:00', priority: '低', status: '待处理', source: '规则生成' },
  { id: 't5', plantId: 'p3', type: '换盆', planTime: '2026-05-10 14:00', priority: '中', status: '已延期', source: 'AI建议' },
];

export const aiSuggestions = [
  { id: 'a1', plantId: 'p3', time: '2026-05-06 10:00', risk: '中', model: 'GPT-4o', summary: '栀子花黄叶可能由土壤碱化引起', detail: '建议：1. 每周浇水时加入硫酸亚铁调节pH；2. 检查排水孔是否堵塞；3. 避免中午直射阳光。风险：若持续2周未改善，可能需要换土。' },
  { id: 'a2', plantId: 'p1', time: '2026-05-04 14:00', risk: '低', model: 'GPT-4o', summary: '绿萝生长状态良好，可考虑扦插繁殖', detail: '建议：当前绿萝长势旺盛，藤蔓已超过50cm，可在节点处剪取进行水培扦插。注意保持水培容器清洁，每3天换水一次。' },
];

export const weatherAlerts = [
  { id: 'w1', type: '高温预警', level: '橙色', time: '2026-05-07 06:00', suggestion: '建议将阳台多肉移至散射光处，增加通风，避免中午暴晒灼伤', affectedPlants: ['p2', 'p3'] },
  { id: 'w2', type: '暴雨预警', level: '蓝色', time: '2026-05-08 12:00', suggestion: '建议收回阳台植物或加盖遮雨，防止盆土积水导致烂根', affectedPlants: ['p2', 'p3'] },
];

export const communityUsers = [
  { id: 'cu1', name: '花花世界', bio: '养花10年，专注观叶植物', city: '上海', followers: 128, following: 45 },
  { id: 'cu2', name: '新手小白', bio: '刚入坑的小白一枚', city: '北京', followers: 12, following: 30 },
  { id: 'cu3', name: '多肉控', bio: '阳台多肉花园主理人', city: '深圳', followers: 256, following: 60 },
  { id: 'cu4', name: '园艺老张', bio: '退休园艺师，乐于分享', city: '成都', followers: 512, following: 20 },
  { id: 'cu5', name: '植物猎人', bio: '全国各地寻找稀有品种', city: '广州', followers: 340, following: 88 },
];

export const followedUsers = ['cu1', 'cu3'];

export const communityPosts = [
  { id: 'c1', type: '经验', authorId: 'cu1', author: '花花世界', title: '绿萝爆盆秘诀分享', content: '坚持每周施薄肥，保持散射光，3个月从一盆变三盆！关键是要用疏松透气的土壤，配合适当修剪促进分枝。', time: '2026-05-05', likes: 42, comments: 8, tags: ['绿萝', '施肥'], images: ['/images/posts/lvluo.jpg'] },
  { id: 'c2', type: '求助', authorId: 'cu2', author: '新手小白', title: '栀子花叶子发黄怎么办？', content: '买回来一周就开始黄叶，浇水也正常，求大神帮忙看看', time: '2026-05-06', likes: 5, comments: 12, tags: ['栀子花', '黄叶'], urgent: '中', images: ['/images/posts/zhizi.jpg'] },
  { id: 'c3', type: '经验', authorId: 'cu3', author: '多肉控', title: '夏天多肉防晒攻略', content: '遮阳网+通风是关键，分享我的阳台改造方案。夏天温度超过35度一定要遮阳，否则容易晒伤化水。', time: '2026-05-04', likes: 67, comments: 15, tags: ['多肉', '夏季养护'], images: ['/images/posts/duorou1.jpg', '/images/posts/duorou2.jpg'] },
  { id: 'c4', type: '经验', authorId: 'cu4', author: '园艺老张', title: '月季修剪的正确时机', content: '很多花友不知道什么时候该修剪月季，其实关键看花后。花谢后在花下第二片五小叶处剪断即可。', time: '2026-05-03', likes: 89, comments: 22, tags: ['月季', '修剪'], images: ['/images/posts/yueji.jpg'] },
  { id: 'c5', type: '求助', authorId: 'cu4', author: '园艺老张', title: '龟背竹叶片开裂不均匀', content: '我的龟背竹新叶开裂总是不对称，有经验的朋友指点一下', time: '2026-05-02', likes: 15, comments: 6, tags: ['龟背竹', '叶片'], images: ['/images/posts/guibei.jpg'] },
  { id: 'c6', type: '经验', authorId: 'cu5', author: '植物猎人', title: '云南寻找野生兰花记', content: '上周去了趟云南山区，发现了几株野生石斛兰，分享一下经历。海拔1500米左右的阔叶林中最容易找到。', time: '2026-05-01', likes: 120, comments: 35, tags: ['兰花', '野生植物'], images: ['/images/posts/lanhua1.jpg', '/images/posts/lanhua2.jpg', '/images/posts/lanhua3.jpg'] },
  { id: 'c7', type: '经验', authorId: 'u1', author: '小绿手', title: '我的绿萝养护心得', content: '养了半年的绿萝终于爆盆了，分享一下我的日常养护方法和注意事项。', time: '2026-05-06', likes: 18, comments: 4, tags: ['绿萝', '新手'], images: [] },
];

export const achievements = [
  { id: 'ach1', name: '初入园丁', desc: '创建第一株植物档案', achieved: true, progress: 1, target: 1 },
  { id: 'ach2', name: '绿手指', desc: '连续打卡7天', achieved: true, progress: 7, target: 7 },
  { id: 'ach3', name: '植物收藏家', desc: '拥有5种不同植物', achieved: false, progress: 4, target: 5 },
  { id: 'ach4', name: '养护达人', desc: '完成50个养护任务', achieved: false, progress: 23, target: 50 },
  { id: 'ach5', name: '社区之星', desc: '获得100个点赞', achieved: false, progress: 47, target: 100 },
];

export const plantGrowthData = {
  p1: {
    height: [
      { date: '2026-02-01', value: 15 },
      { date: '2026-02-15', value: 18 },
      { date: '2026-03-01', value: 22 },
      { date: '2026-03-15', value: 26 },
      { date: '2026-04-01', value: 31 },
      { date: '2026-04-15', value: 35 },
      { date: '2026-05-01', value: 40 },
    ],
    leaves: [
      { date: '2026-02-01', value: 8 },
      { date: '2026-02-15', value: 10 },
      { date: '2026-03-01', value: 14 },
      { date: '2026-03-15', value: 18 },
      { date: '2026-04-01', value: 22 },
      { date: '2026-04-15', value: 26 },
      { date: '2026-05-01', value: 30 },
    ],
    health: [
      { date: '2026-02-01', value: 85 },
      { date: '2026-02-15', value: 88 },
      { date: '2026-03-01', value: 90 },
      { date: '2026-03-15', value: 92 },
      { date: '2026-04-01', value: 90 },
      { date: '2026-04-15', value: 93 },
      { date: '2026-05-01', value: 95 },
    ],
  },
  p2: {
    height: [
      { date: '2026-03-01', value: 4 },
      { date: '2026-03-15', value: 4.5 },
      { date: '2026-04-01', value: 5 },
      { date: '2026-04-15', value: 5.5 },
      { date: '2026-05-01', value: 6 },
    ],
    leaves: [
      { date: '2026-03-01', value: 12 },
      { date: '2026-03-15', value: 14 },
      { date: '2026-04-01', value: 15 },
      { date: '2026-04-15', value: 16 },
      { date: '2026-05-01', value: 18 },
    ],
    health: [
      { date: '2026-03-01', value: 92 },
      { date: '2026-03-15', value: 90 },
      { date: '2026-04-01', value: 88 },
      { date: '2026-04-15', value: 91 },
      { date: '2026-05-01', value: 93 },
    ],
  },
  p3: {
    height: [
      { date: '2026-03-15', value: 20 },
      { date: '2026-04-01', value: 24 },
      { date: '2026-04-15', value: 27 },
      { date: '2026-05-01', value: 29 },
    ],
    leaves: [
      { date: '2026-03-15', value: 30 },
      { date: '2026-04-01', value: 34 },
      { date: '2026-04-15', value: 32 },
      { date: '2026-05-01', value: 28 },
    ],
    health: [
      { date: '2026-03-15', value: 88 },
      { date: '2026-04-01', value: 82 },
      { date: '2026-04-15', value: 75 },
      { date: '2026-05-01', value: 70 },
    ],
  },
  p4: {
    height: [
      { date: '2026-04-15', value: 30 },
      { date: '2026-05-01', value: 36 },
      { date: '2026-05-07', value: 38 },
    ],
    leaves: [
      { date: '2026-04-15', value: 6 },
      { date: '2026-05-01', value: 7 },
      { date: '2026-05-07', value: 8 },
    ],
    health: [
      { date: '2026-04-15', value: 90 },
      { date: '2026-05-01', value: 92 },
      { date: '2026-05-07', value: 94 },
    ],
  },
};

export const checkinDays = [
  '2026-04-01', '2026-04-02', '2026-04-03', '2026-04-05', '2026-04-06',
  '2026-04-07', '2026-04-08', '2026-04-10', '2026-04-11', '2026-04-13',
  '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19',
  '2026-04-20', '2026-04-22', '2026-04-24', '2026-04-25', '2026-04-26',
  '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30',
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07',
];
