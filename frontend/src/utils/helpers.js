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
    'Easy': 'text-green-300 bg-green-900/50',
    'Medium': 'text-yellow-300 bg-yellow-900/50',
    'Hard': 'text-red-300 bg-red-900/50'
  };
  return colors[difficulty] || 'text-gray-300 bg-gray-700/50';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Scalability': 'text-blue-300 bg-blue-900/50',
    'Database Design': 'text-purple-300 bg-purple-900/50',
    'Microservices': 'text-indigo-300 bg-indigo-900/50',
    'Caching Systems': 'text-cyan-300 bg-cyan-900/50',
    'Message Queues': 'text-orange-300 bg-orange-900/50',
    'Security & Auth': 'text-red-300 bg-red-900/50'
  };
  return colors[category] || 'text-gray-300 bg-gray-700/50';
};