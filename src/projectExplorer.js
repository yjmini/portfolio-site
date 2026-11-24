export const projectCategories = [
  { id: 'all', label: '전체' },
  { id: 'learning', label: 'Learning & Simulation' },
  { id: 'control', label: 'Control & Systems' },
  { id: 'perception', label: 'Perception' },
  { id: 'software', label: 'Software' },
]

export function projectCategory(project) {
  if (project.slug === 'kinderbot') return 'control'
  if (project.slug === 'hydraulic-robot-rl' || project.slug === 'robot-study') return 'learning'
  if (['go1-remote-inspection', 'yolov10-ros', 'yolo-head-tracking'].includes(project.slug)) return 'perception'
  if (['thing-robot-hand', 'smart-assembly-transport', 'hazardous-process-automation', 'ros2-control-ui'].includes(project.slug)) return 'control'
  return 'software'
}

export function filterProjects(items, category = 'all', query = '') {
  const term = query.trim().toLocaleLowerCase()
  return items.filter(p => (category === 'all' || projectCategory(p) === category)
    && `${p.title} ${p.shortTitle} ${p.tagline} ${p.stack.join(' ')}`.toLocaleLowerCase().includes(term))
}

export function selectedProjects(items) {
  const order = ['hydraulic-robot-rl', 'kinderbot', 'cadflow', 'thing-robot-hand', 'smart-assembly-transport', 'go1-remote-inspection']
  return order.map(slug => items.find(p => p.slug === slug)).filter(Boolean)
}
