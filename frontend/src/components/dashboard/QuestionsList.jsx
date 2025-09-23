import { useState, useEffect } from 'react';
import { questionService } from '../../services/questionService';
import { QUESTION_CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';
import QuestionCard from './QuestionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchFilters from './SearchFilters';

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const loadQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.topics.some(topic => topic.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={Object.values(QUESTION_CATEGORIES)}
        difficulties={Object.values(DIFFICULTY_LEVELS)}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">
          System Design Questions
        </h2>
        <span className="text-slate-600">
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">No questions found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;