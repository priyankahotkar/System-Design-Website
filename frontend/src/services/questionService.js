import { QUESTION_CATEGORIES, DIFFICULTY_LEVELS } from '../utils/constants';

const mockQuestions = [
  {
    id: '1',
    title: 'Design Twitter',
    description: 'Design a Twitter-like social media platform that can handle millions of users.',
    category: QUESTION_CATEGORIES.SCALABILITY,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['Load Balancing', 'Database Sharding', 'Caching', 'CDN'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Design URL Shortener',
    description: 'Build a URL shortening service like bit.ly or TinyURL.',
    category: QUESTION_CATEGORIES.DATABASE,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['Database Design', 'Hashing', 'Analytics'],
    createdAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '3',
    title: 'Design Chat System',
    description: 'Design a real-time chat application like WhatsApp or Slack.',
    category: QUESTION_CATEGORIES.MESSAGING,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['WebSockets', 'Message Queues', 'Real-time Communication'],
    createdAt: '2024-01-13T14:00:00Z'
  },
  {
    id: '4',
    title: 'Design Cache System',
    description: 'Design a distributed caching system like Redis or Memcached.',
    category: QUESTION_CATEGORIES.CACHING,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['LRU Cache', 'Distributed Systems', 'Consistency'],
    createdAt: '2024-01-12T11:00:00Z'
  },
  {
    id: '5',
    title: 'Design Authentication System',
    description: 'Build a secure authentication and authorization system.',
    category: QUESTION_CATEGORIES.SECURITY,
    difficulty: DIFFICULTY_LEVELS.EASY,
    estimatedTime: '20-30 minutes',
    topics: ['OAuth', 'JWT', 'Session Management'],
    createdAt: '2024-01-11T16:00:00Z'
  },
  {
    id: '6',
    title: 'Design Microservices Architecture',
    description: 'Design a microservices architecture for an e-commerce platform.',
    category: QUESTION_CATEGORIES.MICROSERVICES,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '60+ minutes',
    topics: ['Service Discovery', 'API Gateway', 'Circuit Breaker'],
    createdAt: '2024-01-10T13:00:00Z'
  }
];

export const questionService = {
  getAllQuestions: () => {
    return Promise.resolve(mockQuestions);
  },

  getQuestionById: (id) => {
    const question = mockQuestions.find(q => q.id === id);
    return Promise.resolve(question);
  },

  getQuestionsByCategory: (category) => {
    const filtered = mockQuestions.filter(q => q.category === category);
    return Promise.resolve(filtered);
  },

  getQuestionsByDifficulty: (difficulty) => {
    const filtered = mockQuestions.filter(q => q.difficulty === difficulty);
    return Promise.resolve(filtered);
  },

  searchQuestions: (searchTerm) => {
    const filtered = mockQuestions.filter(q => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return Promise.resolve(filtered);
  }
};