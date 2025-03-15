import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { api } from "../api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from 'react';


export default function QuizPage() {
  // State management
  const [quizData, setQuizData] = useState<{
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
    filepath?: string;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Load quiz data when component mounts and transform it to work with the component
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ 
          "file": "https://www.rsb.org.uk/images/15_Photosynthesis.pdf" 
        }).toString();
        
        const response = await fetch(`/quiz?${params}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz: ${response.status}`);
        }
        
        const rawData = await response.json();
        
        // Transform the API format to the format expected by our component
        const transformedData = {
          questions: Object.entries(rawData.text).map(([key, value]) => {
            // TypeScript would complain about 'value' type, but since we're in JSX file, we can use it directly
            const questionData = value as { question: string, answers: string[], answer: number };
            return {
              question: questionData.question,
              options: questionData.answers,
              correctAnswer: questionData.answer
            };
          }),
          filepath: rawData.filepath
        };
        
        setQuizData(transformedData);
        // Initialize selectedAnswers with empty values
        const initialAnswers = {};
        transformedData.questions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setSelectedAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load quiz");
        setLoading(false);
      }
    };
 
    loadQuiz();
  }, []);
 
  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: value,
    });
  };
 
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };
 
  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
 
  // Calculate final score
  const calculateScore = () => {
    let totalScore = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
  };
 
  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
  };
 
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-[500px] max-w-full">
          <CardHeader>
            <CardTitle>Loading Quiz</CardTitle>
            <CardDescription>Please wait while we prepare your questions...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={50} className="w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
 
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-[500px] max-w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Quiz</CardTitle>
            <CardDescription>We encountered a problem while loading your quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
 
  // Results view
  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-[600px] max-w-full">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              You scored {score} out of {quizData?.questions?.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(score / quizData?.questions?.length) * 100} 
                className="w-full h-4" 
              />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium">Questions Summary:</h3>
                {quizData?.questions?.map((question, index) => (
                  <div key={index} className={`p-4 my-2 rounded-md ${
                    selectedAnswers[index] === question.correctAnswer 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="font-medium">{index + 1}. {question.question}</p>
                    <p className="text-sm mt-1">
                      Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                    </p>
                    <p className="text-sm mt-1 font-medium">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={resetQuiz}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
 
  // Quiz view
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {quizData && quizData.questions && (
        <Card className="w-[600px] max-w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Question {currentQuestionIndex + 1} of {quizData.questions.length}</CardTitle>
              <div className="text-sm text-gray-500">
                Score: {score}/{quizData.questions.length}
              </div>
            </div>
            <Progress 
              value={(currentQuestionIndex / quizData.questions.length) * 100} 
              className="w-full" 
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{quizData.questions[currentQuestionIndex].question}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestionIndex]?.toString()}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-start space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={optionIndex.toString()} id={`option-${optionIndex}`} />
                    <Label className="flex-1" htmlFor={`option-${optionIndex}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === null}
            >
              {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}