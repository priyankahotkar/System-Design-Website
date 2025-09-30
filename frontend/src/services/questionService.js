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
  },
  {
    id: '7',
    title: 'Design Parking Lot System',
    description: 'Design a multi-level parking lot management system, supporting different vehicle types and floor capacity management.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['OOP Design', 'Strategy Pattern', 'Factory Pattern'],
    createdAt: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    title: 'Design Movie Ticket Booking System',
    description: 'Build a system to let users search shows, book/cancel tickets, manage seat allocation.',
    category: QUESTION_CATEGORIES.SCALABILITY,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['Concurrency', 'Seat Allocation', 'Load Balancer', 'Cache'],
    createdAt: '2024-01-08T12:00:00Z'
  },
  {
    id: '9',
    title: 'Design Elevator Management System',
    description: 'Design a system for elevator control in a high-rise building with scheduling and state management.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['State Pattern', 'Scheduling Algorithms', 'Concurrency'],
    createdAt: '2024-01-07T09:30:00Z'
  },
  {
    id: '10',
    title: 'Design a Library Management System',
    description: 'Build features like borrow/return books, catalog search, due tracking, reservations.',
    category: QUESTION_CATEGORIES.DATABASE,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['ORM', 'Relationships', 'Transactions'],
    createdAt: '2024-01-06T15:00:00Z'
  },
  {
    id: '11',
    title: 'Design StackOverflow (Mini-version)',
    description: 'Implement core features of a Q&A platform: post questions, answers, comments, and vote system.',
    category: QUESTION_CATEGORIES.SOCIAL,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['OOP Design', 'Polymorphism', 'Reputation System', 'Search'],
    createdAt: '2024-01-05T14:30:00Z'
  },
  {
    id: '12',
    title: 'Design Pub/Sub Messaging Service',
    description: 'Build a publish-subscribe messaging system supporting multiple topics and subscribers.',
    category: QUESTION_CATEGORIES.MESSAGING,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['Message Broker', 'Queueing', 'Partitioning', 'Scaling'],
    createdAt: '2024-01-04T11:45:00Z'
  },
  {
    id: '13',
    title: 'Design Rate Limiter',
    description: 'Design a rate limiting module (e.g. per-user API rate limit) to prevent abuse.',
    category: QUESTION_CATEGORIES.SECURITY,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '20-30 minutes',
    topics: ['Token Bucket', 'Leaky Bucket', 'Counters', 'Sliding Window'],
    createdAt: '2024-01-03T10:20:00Z'
  },
  {
    id: '14',
    title: 'Design Notification & Push System',
    description: 'Create a system to send real-time push notifications (email, SMS, push) to users.',
    category: QUESTION_CATEGORIES.SCALABILITY,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['Queueing', 'Retry Mechanism', 'Fan-out', 'Backoff Strategy'],
    createdAt: '2024-01-02T08:50:00Z'
  },
  {
    id: '15',
    title: 'Design Vending Machine',
    description: 'Design a vending machine system that handles product selection, payment, and inventory management.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['OOP Design', 'State Pattern', 'Singleton', 'Inventory Management'],
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: '16',
    title: 'Design ATM System',
    description: 'Build an ATM system supporting withdrawals, deposits, balance checks, and transaction logging.',
    category: QUESTION_CATEGORIES.SECURITY,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['OOP Design', 'Authentication', 'Transactions', 'State Management'],
    createdAt: '2023-12-31T10:00:00Z'
  },
  {
    id: '17',
    title: 'Design Restaurant Management System',
    description: 'Design a system for managing orders, tables, menus, and billing in a restaurant.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['OOP Design', 'Observer Pattern', 'Factory Pattern', 'Billing'],
    createdAt: '2023-12-30T14:00:00Z'
  },
  {
    id: '18',
    title: 'Design Tic-Tac-Toe Game',
    description: 'Implement a Tic-Tac-Toe game with player turns, win detection, and draw conditions.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.EASY,
    estimatedTime: '20-30 minutes',
    topics: ['OOP Design', 'Game Logic', 'State Management'],
    createdAt: '2023-12-29T11:00:00Z'
  },
  {
    id: '19',
    title: 'Design Snake Game',
    description: 'Design a classic Snake game handling movement, food generation, collision detection, and scoring.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['OOP Design', 'Event Handling', 'Collision Detection', 'Scoring'],
    createdAt: '2023-12-28T09:00:00Z'
  },
  {
    id: '20',
    title: 'Design Chess Game',
    description: 'Build a chess game system with piece movements, rules enforcement, and checkmate detection.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['OOP Design', 'Polymorphism', 'Strategy Pattern', 'Game Rules'],
    createdAt: '2023-12-27T15:00:00Z'
  },
  {
    id: '21',
    title: 'Design File System',
    description: 'Design a file system supporting directories, files, permissions, and basic operations like create/delete.',
    category: QUESTION_CATEGORIES.DATABASE,
    difficulty: DIFFICULTY_LEVELS.HARD,
    estimatedTime: '45-60 minutes',
    topics: ['Tree Structure', 'OOP Design', 'Permissions', 'Traversal'],
    createdAt: '2023-12-26T13:00:00Z'
  },
  {
    id: '22',
    title: 'Design Logger Framework',
    description: 'Create a flexible logging system with levels, appenders, and configurable formats.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['Singleton', 'Observer Pattern', 'Configuration', 'Appender'],
    createdAt: '2023-12-25T10:30:00Z'
  },
  {
    id: '23',
    title: 'Design Deck of Cards',
    description: 'Design a deck of cards system for games, including shuffling, dealing, and card representations.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.EASY,
    estimatedTime: '20-30 minutes',
    topics: ['OOP Design', 'Enums', 'Collections', 'Shuffling'],
    createdAt: '2023-12-24T12:00:00Z'
  },
  {
    id: '24',
    title: 'Design Online Shopping Cart',
    description: 'Build a shopping cart system handling item addition/removal, quantity updates, and checkout.',
    category: QUESTION_CATEGORIES.SCALABILITY,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['OOP Design', 'Session Management', 'Pricing', 'Inventory Sync'],
    createdAt: '2023-12-23T14:30:00Z'
  },
  {
    id: '25',
    title: 'Design Traffic Light System',
    description: 'Design a traffic light control system for intersections with timing, synchronization, and pedestrian signals.',
    category: QUESTION_CATEGORIES.SYSTEM,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    estimatedTime: '30-45 minutes',
    topics: ['State Pattern', 'Timer', 'Synchronization', 'OOP Design'],
    createdAt: '2023-12-22T11:00:00Z'
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
