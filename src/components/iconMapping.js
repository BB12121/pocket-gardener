export function getPlantIcon(category) {
  if (category === '多肉植物') return 'succulent';
  if (category === '开花植物') return 'flower';
  return 'leaf';
}

export function getTaskIcon(type) {
  if (type === '浇水') return 'water';
  if (type === '施肥') return 'fertilize';
  if (type === '修剪') return 'trim';
  if (type === '换盆') return 'repot';
  if (type === '病虫害' || type === '病虫害观察') return 'bug';
  return 'note';
}
