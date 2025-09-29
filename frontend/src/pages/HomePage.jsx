import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/auth';
import Button from '../components/common/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Practice',
      description: 'Practice with real system design questions using our whiteboard and code editor.'
    },
    {
      icon: Target,
      title: 'Structured Learning',
      description: 'Follow guided approaches to tackle complex system design problems step by step.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn from solutions shared by other engineers and industry experts.'
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor your improvement and see how you compare with other learners.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
          <div className="relative h-full max-w-7xl mx-auto">
            <svg className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
              <defs>
                <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-700" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
            <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
              <defs>
                <pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-700" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
              Master System Design
              <span className="block text-indigo-400">The Right Way</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Practice system design with interactive whiteboards, code editors, and real-world scenarios. 
              Build the skills that top tech companies are looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="large" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="primary" size="large" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg">
                      Start Practicing
                    </Button>
                  </Link>
                  <Button variant="outline" size="large" className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white px-8 py-4 text-lg">
                    View Demo
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and resources to help you master system design concepts
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300"
                variants={itemVariants}
              >
                <div className="mx-auto w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <div className="text-4xl font-extrabold text-indigo-400 mb-2">50+</div>
              <div className="text-gray-400 text-lg">System Design Questions</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-400 mb-2">10K+</div>
              <div className="text-gray-400 text-lg">Practice Sessions</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-indigo-400 mb-2">95%</div>
              <div className="text-gray-400 text-lg">Interview Success Rate</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              Join thousands of engineers who have improved their system design skills with our platform
            </p>
            {!isAuthenticated && (
              <Link to="/auth">
                <Button variant="secondary" size="large" className="bg-white text-indigo-600 hover:bg-gray-200">
                  Get Started Today
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;