import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDifficultyColor, getCategoryColor } from '../../utils/helpers';
import Button from '../common/Button';

const QuestionCard = ({ question }) => {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
            {question.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>

        <p className="text-gray-400 mb-4 line-clamp-3">
          {question.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            {question.estimatedTime}
          </div>

          <div className="flex items-center text-sm">
            <Tag className="h-4 w-4 mr-2 text-gray-500" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
              {question.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {question.topics.slice(0, 3).map((topic, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs"
              >
                {topic}
              </span>
            ))}
            {question.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs">
                +{question.topics.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <Link to={`/practice/${question.id}`} className="w-full">
          <Button variant="primary" className="w-full group">
            <span className="inline-flex items-center gap-2">
              Start Practice
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuestionCard;