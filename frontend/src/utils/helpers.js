export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    'Easy': 'text-green-600 bg-green-100',
    'Medium': 'text-yellow-600 bg-yellow-100',
    'Hard': 'text-red-600 bg-red-100'
  };
  return colors[difficulty] || 'text-slate-600 bg-slate-100';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Scalability': 'text-blue-600 bg-blue-100',
    'Database Design': 'text-purple-600 bg-purple-100',
    'Microservices': 'text-indigo-600 bg-indigo-100',
    'Caching Systems': 'text-cyan-600 bg-cyan-100',
    'Message Queues': 'text-orange-600 bg-orange-100',
    'Security & Auth': 'text-red-600 bg-red-100'
  };
  return colors[category] || 'text-slate-600 bg-slate-100';
};