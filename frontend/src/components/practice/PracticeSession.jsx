import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { questionService } from '../../services/questionService';
import { formatDate } from '../../utils/helpers';
import Whiteboard from './Whiteboard';
import CodeEditor from './CodeEditor';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { whiteboardService } from '../../services/whiteboardService';

const PracticeSession = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [startTime] = useState(new Date());
  const [whiteboardId, setWhiteboardId] = useState(null);
  const [pastWhiteboards, setPastWhiteboards] = useState([]);

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    try {
      const questionData = await questionService.getQuestionById(id);
      setQuestion(questionData);
      // Load past whiteboards for this question
      const list = await whiteboardService.listByQuestion(id);
      setPastWhiteboards(list);
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWhiteboard = async () => {
    try {
      const wb = await whiteboardService.create(id);
      setWhiteboardId(wb.id);
      // refresh past list
      const list = await whiteboardService.listByQuestion(id);
      setPastWhiteboards(list);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to create whiteboard');
    }
  };

  const handleJoinWhiteboard = async () => {
    const input = prompt('Enter whiteboard ID to join:');
    if (!input) return;
    try {
      const wb = await whiteboardService.getOrJoin(input);
      setWhiteboardId(wb.id);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to join whiteboard');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Question Not Found</h2>
          <p className="text-slate-600 mb-4">The requested question could not be found.</p>
          <Link to="/dashboard">
            <Button variant="primary">Back to Questions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'whiteboard', label: 'Whiteboard', icon: BookOpen },
    { id: 'code', label: 'Code Editor', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard"
                className="flex items-center text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Questions
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <h1 className="text-lg font-semibold text-slate-900">{question.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-1" />
                {question.estimatedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Question Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
                  <p className="text-sm text-slate-600">{question.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {question.topics.map((topic, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Approach</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Understand requirements</li>
                    <li>• Estimate scale</li>
                    <li>• Design high-level architecture</li>
                    <li>• Deep dive into components</li>
                    <li>• Address scalability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Area */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Button variant="primary" onClick={handleCreateWhiteboard}>Create Whiteboard</Button>
              <Button variant="outline" onClick={handleJoinWhiteboard}>Join Whiteboard</Button>
              {whiteboardId && (
                <span className="text-xs text-slate-500">Current Whiteboard ID: {whiteboardId}</span>
              )}
            </div>

          {pastWhiteboards?.length > 0 && (
            <div className="card p-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Past Whiteboards</h4>
              <div className="flex flex-wrap gap-2">
                {pastWhiteboards.map(wb => (
                  <Button key={wb.id} variant="secondary" onClick={() => setWhiteboardId(wb.id)}>
                    Open {wb.id.slice(-6)} • {new Date(wb.updatedAt).toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          )}

            <div style={{ height: '600px' }}>
              {activeTab === 'whiteboard' && <Whiteboard questionId={id} whiteboardId={whiteboardId} />}
              {activeTab === 'code' && <CodeEditor questionId={id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;