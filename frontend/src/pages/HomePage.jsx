import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Master System Design
              <span className="block text-primary-500">The Right Way</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Practice system design with interactive whiteboards, code editors, and real-world scenarios. 
              Build the skills that top tech companies are looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="large">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="primary" size="large">
                      Start Practicing
                    </Button>
                  </Link>
                  <Button variant="outline" size="large">
                    View Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and resources to help you master system design concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-slate-600">System Design Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-slate-600">Practice Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-slate-600">Interview Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of engineers who have improved their system design skills with our platform
          </p>
          {!isAuthenticated && (
            <Link to="/auth">
              <Button variant="secondary" size="large">
                Get Started Today
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;