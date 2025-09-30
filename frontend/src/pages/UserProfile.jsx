import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { questionService } from "../services/questionService";
import { markAsSolvedService } from "../services/markAsSolvedService";
import { useAuth } from "../components/auth/AuthContext";
import { STORAGE_KEYS } from "../utils/constants";

const UserProfile = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'solved' | 'unsolved'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return; // wait until auth finishes

      if (!currentUser) {
        // fallback to localStorage
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData?.data?.solvedQuestions) {
              setSolvedQuestions(userData.data.solvedQuestions);
            }
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        } else {
          navigate("/auth");
          return;
        }
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all questions
        const questions = await questionService.getAllQuestions();
        setAllQuestions(questions);

        // Prefer solved questions from currentUser
        if (currentUser?.solvedQuestions) {
          setSolvedQuestions(currentUser.solvedQuestions);
        } else {
          try {
            const solvedIds = await markAsSolvedService.listMy();
            setSolvedQuestions(Array.isArray(solvedIds) ? solvedIds : []);
          } catch (apiError) {
            console.error("Error fetching solved questions:", apiError);
            const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
            if (storedUser) {
              try {
                const userData = JSON.parse(storedUser);
                if (userData?.data?.solvedQuestions) {
                  setSolvedQuestions(userData.data.solvedQuestions);
                }
              } catch (e) {
                console.error("Error parsing stored user data:", e);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load your progress. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, currentUser, navigate]);

  const solvedCount = solvedQuestions.length;
  const totalQuestions = allQuestions.length;
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((solvedCount / totalQuestions) * 100)
      : 0;

  const filteredQuestions = allQuestions.filter((question) => {
    const isSolved = solvedQuestions.some(
      (id) => id === question.id || id.toString() === question.id.toString()
    );
    if (activeTab === "solved") return isSolved;
    if (activeTab === "unsolved") return !isSolved;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

        {/* Progress Circle */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2D3748"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4FD1C5"
                strokeWidth="8"
                strokeDasharray={`${progressPercentage * 2.83} 1000`}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{solvedCount}</span>
              <span className="text-gray-400">Solved</span>
              <span className="text-sm text-gray-500">of {totalQuestions}</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold">
            {progressPercentage}% Complete
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-medium ${
              activeTab === "all"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400"
            }`}
          >
            All Questions ({totalQuestions})
          </button>
          <button
            onClick={() => setActiveTab("solved")}
            className={`px-4 py-2 font-medium ${
              activeTab === "solved"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400"
            }`}
          >
            Solved ({solvedCount})
          </button>
          <button
            onClick={() => setActiveTab("unsolved")}
            className={`px-4 py-2 font-medium ${
              activeTab === "unsolved"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400"
            }`}
          >
            To Solve ({totalQuestions - solvedCount})
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-2">
          {filteredQuestions.map((question) => {
            const isSolved = solvedQuestions.some(
              (id) => id === question.id || id.toString() === question.id.toString()
            );
            return (
              <div
                key={question.id}
                className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="mr-4">
                  {isSolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    to={`/practice/${question.id}`}
                    className="text-white hover:text-teal-400 transition-colors"
                  >
                    {question.title}
                  </Link>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {question.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {question.category}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {isSolved ? "Solved" : "Not Solved"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
