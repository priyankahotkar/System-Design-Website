import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../components/auth";
import { markAsSolvedService } from "../../services/markAsSolvedService"; 
import Button from "../../components/common/Button"; 

const MarkAsSolved = ({ questionId }) => {
  const { isAuthenticated } = useAuth();
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSolvedStatus = async () => {
      try {
        setLoading(true);
        const solved = await markAsSolvedService.isSolved(questionId);
        setIsSolved(solved);
      } catch (e) {
        console.error("Error fetching solved status:", e);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchSolvedStatus();
  }, [isAuthenticated, questionId]);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  const handleToggleSolved = async () => {
    try {
      setLoading(true);
      if (isSolved) {
        await markAsSolvedService.unmark(questionId);
        setIsSolved(false);
      } else {
        await markAsSolvedService.mark(questionId);
        setIsSolved(true);
      }
    } catch (e) {
      console.error("Error updating solved status:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={handleToggleSolved} 
        disabled={loading}
        variant={isSolved ? "secondary" : "default"}
      >
        {loading
          ? "Updating..."
          : isSolved
          ? "✅ Marked as Solved"
          : "Mark as Solved"}
      </Button>
    </div>
  );
};

export default MarkAsSolved;
