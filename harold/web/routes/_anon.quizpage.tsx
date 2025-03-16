import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

// Define types for API response format
type ApiQuestionItem = {
  question: string;
  answers: string[];
  answer: number;
};

type ApiQuizResponse = {
  text: {
    [key: string]: ApiQuestionItem;
  };
  filepath: string;
};

// Define types for quiz data (format used by the component)
type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
};

type QuizData = {
  questions: QuizQuestion[];
};

// Define enum for quiz states
enum QuizState {
  Initial = "initial",
  Loading = "loading",
  Question = "question",
  Results = "results"
}

export default function QuizPage() {
  // State for file input functionality
  const [fileUrl, setFileUrl] = useState("https://www.rsb.org.uk/images/15_Photosynthesis.pdf");
  const [initResponse, setInitResponse] = useState<any>(null);

  // Quiz state management
  const [quizState, setQuizState] = useState<QuizState>(QuizState.Initial);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [score, setScore] = useState(0);

  // Initialize a quiz by fetching data from the backend
  const initializeQuiz = async () => {
    setQuizState(QuizState.Loading);
    const params = new URLSearchParams({ "file": fileUrl }).toString();

    try {
      const response = await fetch(`/quiz?${params}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
      }

      const apiData: ApiQuizResponse = await response.json();

      // Transform the API response to the expected format
      if (apiData && apiData.text) {
        // Convert from object with numbered keys to array of questions
        const transformedQuestions: QuizQuestion[] = Object.values(apiData.text).map(item => {
          // Extract the correct answer text using the answer index
          const correctAnswerText = item.answers[item.answer];

          return {
            question: item.question,
            options: item.answers,  // Rename "answers" to "options"
            correct_answer: correctAnswerText  // Convert answer index to the actual string
          };
        });

        const formattedData: QuizData = {
          questions: transformedQuestions
        };

        setQuizData(formattedData);
        setUserAnswers(new Array(transformedQuestions.length).fill(""));
        setQuizState(QuizState.Question);
      } else {
        console.error("Invalid API response structure:", apiData);
        setQuizState(QuizState.Initial);
      }
    } catch (err) {
      console.error("Error fetching or processing quiz data:", err);
      setQuizState(QuizState.Initial);
    }
  };

  // Process file input
  const handleFileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams({ "file": fileUrl }).toString();

    try {
      const response = await fetch(`/init?${params}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setInitResponse(data);
    } catch (err) {
      console.error("Error initializing with file:", err instanceof Error ? err.message : String(err));
      // Could add UI error state here if needed
    }
  };

  // Move to next question or finish quiz
  const handleNextQuestion = () => {
    // Save current answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = currentAnswer;
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
    } else {
      // Calculate score
      let correctCount = 0;
      newUserAnswers.forEach((answer, index) => {
        if (quizData?.questions[index].correct_answer === answer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setQuizState(QuizState.Results);
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setQuizState(QuizState.Initial);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer("");
    setScore(0);
    setQuizData(null);
  };

  // Render the file input section
  const renderFileInput = () => (
    <Card className="w-full max-w-md mb-6">
      <CardHeader>
        <CardTitle>Upload PDF for Quiz</CardTitle>
        <CardDescription>Enter a URL to a PDF file to generate quiz questions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">PDF File URL:</Label>
            <Input
              id="file"
              name="file"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              required
            />
          </div>
          <Button type="submit">Process File</Button>
        </form>
      </CardContent>
      {initResponse && (
        <CardFooter className="flex-col items-start">
          <p className="text-sm font-medium mb-2">File processed successfully</p>
          <pre className="text-xs overflow-auto max-h-40 w-full bg-slate-100 p-2 rounded">{JSON.stringify(initResponse, null, 2)}</pre>
        </CardFooter>
      )}
    </Card>
  );

  // Render the current quiz question
  const renderQuestion = () => {
    if (!quizData || quizData.questions.length === 0) return null;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>Quiz Question {currentQuestionIndex + 1}/{quizData.questions.length}</CardTitle>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.question}</div>
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleNextQuestion}
            disabled={!currentAnswer}
          >
            {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Render the quiz results
  const renderResults = () => {
    if (!quizData) return null;

    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>
            You scored {score} out of {quizData.questions.length}
            ({Math.round((score / quizData.questions.length) * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizData.questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correct_answer;
            return (
              <div key={index} className={`p-3 rounded ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                <p className="font-medium">{index + 1}. {question.question}</p>
                <p className="text-sm mt-1">
                  Your answer: <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {userAnswers[index] || "No answer"}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-green-600 mt-1">Correct answer: {question.correct_answer}</p>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleRestartQuiz}>Start New Quiz</Button>
        </CardFooter>
      </Card>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <Card className="w-full max-w-xl">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
        </div>
        <p className="mt-4 text-slate-500">Loading quiz questions...</p>
      </CardContent>
    </Card>
  );

  // Render initial state
  const renderInitial = () => (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Quiz Challenge</CardTitle>
        <CardDescription>Test your knowledge with questions generated from the PDF</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="mb-6 text-center">Ready to start the quiz based on the document content?</p>
        <Button onClick={initializeQuiz} size="lg">Start Quiz</Button>
      </CardContent>
    </Card>
  );

  // Main render function
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {renderFileInput()}

      <Separator className="my-4" />

      {quizState === QuizState.Initial && renderInitial()}
      {quizState === QuizState.Loading && renderLoading()}
      {quizState === QuizState.Question && quizData && renderQuestion()}
      {quizState === QuizState.Results && quizData && renderResults()}
    </div>
  );
}
