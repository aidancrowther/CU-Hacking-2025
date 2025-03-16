import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import HaroldOutline from "../components/HaroldOutline";
import Modal from '@/components/Modal';
import QuizPage from './_anon.quizpage';

export default function ReaderWithHelp() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const yass_text = queryParams.get('text');
  const file_url = queryParams.get('file');

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const speechBubbleRef = useRef(null);

  const handleReturnToHomepage = () => {
    setIsOpen(false);
    setShowAnswer(false);
    setShowSpeechBubble(false);
    setShowQuiz(false);
    setResponse(null);
    setQuery("");
    setQuizData(null);
    navigate('/', { state: { fresh: true } });
  };

  const getHelp = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        question: query,
        file: file_url || ''
      }).toString();
      const res = await fetch(`/followup?${params}`);
      const data = await res.json();
      setResponse(data.text);
      setShowAnswer(true);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (speechBubbleRef.current && !speechBubbleRef.current.contains(event.target)) {
        setShowSpeechBubble(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    margin: '0',
  };

  const inputStyles = {
    width: '60vw',
    maxWidth: '600px',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#555',
    height: '90vh',
    resize: 'none',
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1001
      }}>
        <Button
          onClick={handleReturnToHomepage}
          className="flex items-center gap-2"
          variant="default"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Upload Another PDF
        </Button>
      </div>

      <div style={containerStyles}>
        <textarea
          id="reader"
          value={yass_text || ''}
          required
          style={inputStyles}
          onFocus={(e) => (e.target.style.borderColor = '#4f8a8b')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          readOnly
        />

        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          {showSpeechBubble && (
            <div
              ref={speechBubbleRef}
              style={{
                position: 'absolute',
                bottom: '60px',
                right: '0',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                width: '220px',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setShowSpeechBubble(false);
                  }}
                >
                  Ask Harold
                </Button>
                <Button
                  onClick={startQuiz}
                  variant="secondary"
                >
                  Quiz Yourself!
                </Button>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '20px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  boxShadow: '4px 4px 5px rgba(0, 0, 0, 0.1)',
                  zIndex: -1,
                }}
              />
            </div>
          )}

          <button
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center relative z-10"
            onClick={() => setShowSpeechBubble(!showSpeechBubble)}
            title="Ask Harold"
            aria-label="Ask Harold"
          >
            <HaroldOutline />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
          {!showAnswer && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Ask a Question</h2>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query..."
                className="text-gray-800 placeholder:text-gray-400 focus:placeholder:text-gray-300"
                onFocus={(e) => e.target.classList.add('ring-2', 'ring-primary')}
                onBlur={(e) => e.target.classList.remove('ring-2', 'ring-primary')}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setIsOpen(false)} variant="outline">Back</Button>
                <Button
                  onClick={getHelp}
                  disabled={!query.trim()}
                  variant={query.trim() ? "default" : "secondary"}
                >Submit</Button>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl shadow-xl w-96 text-center"
            >
              <div className="mb-4">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Harold is thinking...</h2>
              <p className="text-gray-600 mb-4">he's old this might take a while 🙄 UGH OLD PEOPLE</p>
            </motion.div>
          )}

          {showAnswer && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-xl shadow-xl w-[700px] max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Answer</h2>
              <Card className="border-2 border-purple-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="prose-lg max-w-none" style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    color: '#444',
                    maxWidth: '65ch',
                    margin: '0 auto'
                  }}>
                    {response ? (
                      <ReactMarkdown>{response}</ReactMarkdown>
                    ) : (
                      <p>No response available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => { setShowAnswer(false); setQuery(""); }}
                  variant="outline"
                  className="px-6 py-2 rounded-full"
                >
                  Back
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {showQuiz && (
        <Modal isOpen={showQuiz} onClose={handleCloseQuiz}>
          <QuizPage file_url={file_url} onClose={handleCloseQuiz} />
        </Modal>
      )}
    </div>
  );
}