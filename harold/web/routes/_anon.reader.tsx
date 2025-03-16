import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import QuizPage from "./_anon.quizpage";


export default function ReaderWithHelp() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yass_text = queryParams.get('text');
  const file_url = queryParams.get('file');

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const speechBubbleRef = useRef(null);

  function playRandomVideoFromPlaylist(playlist) {
    // Step 1: Randomly select a video from the playlist
    const randomIndex = Math.floor(Math.random() * playlist.length);
    const videoId = playlist[randomIndex];

    // Step 2: Construct the YouTube video URL (autoplay enabled)
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;

    // Step 3: Create an iframe to display the video
    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = videoUrl;
    iframe.frameborder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowfullscreen = true;

    // Step 4: Create a video container with styling for the modal
    const videoContainer = document.createElement('div');
    videoContainer.style.position = 'fixed';
    videoContainer.style.top = '50%';
    videoContainer.style.left = '50%';
    videoContainer.style.transform = 'translate(-50%, -50%)';
    videoContainer.style.zIndex = '1000';
    videoContainer.style.backgroundColor = '#fff';
    videoContainer.style.padding = '20px';
    videoContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    videoContainer.style.borderRadius = '10px';
    videoContainer.appendChild(iframe);

    const titleElement = document.createElement('h2');
    titleElement.id = 'video-title';
    titleElement.textContent = 'Wake up Pookie';
    videoContainer.appendChild(titleElement);

    // Step 5: Add a close button to the modal
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Video';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#ff6347';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    closeButton.onclick = () => {
      // Remove the video modal when close button is clicked
      document.body.removeChild(videoContainer);
    };

    // Append the close button to the video container
    videoContainer.appendChild(closeButton);

    // Step 6: Append the video container to the body
    document.body.appendChild(videoContainer);
  }

  // Example usage:
  // List of YouTube video IDs from the playlist
  const playlist = [
    'dQw4w9WgXcQ',
    'D-UmfqFjpl0',
    '7q7wAABkdaQ',
    '7PzOTCeGwGU',
    'cAsmIjCrxxc',
    '7-WoV8FNDPo',
    'UnktCDi-BVs',
    'UOqFz3iPcTQ',
    'bgJ_1WuhUig'
  ];

  function detectIdleMouse() {
    let timeout;

    // Function to reset the timer when the mouse moves
    function resetTimer() {
      // Clear the previous timeout if there was one
      clearTimeout(timeout);

      // Set a new timeout for 5 seconds of inactivity
      timeout = setTimeout(() => {
        playRandomVideoFromPlaylist(playlist);
      }, 5000); // 5000 milliseconds = 5 seconds
    }

    // Add the mousemove event listener to the document
    document.addEventListener('mousemove', resetTimer);

    // Optionally, trigger resetTimer immediately to prevent the alert on page load
    resetTimer();
  }

  detectIdleMouse();

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

  const startQuiz = async () => {
    setQuizLoading(true);
    setQuizDialogOpen(true);
    setShowSpeechBubble(false);

    try {
      const params = new URLSearchParams({ file: file_url }).toString();
      const res = await fetch(`/quiz?${params}`);
      const data = await res.json();
      setQuizData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    margin: '0',
    position: 'relative',
    paddingBottom: '50px',
  };

  const inputStyles = {
    width: '80vw',
    maxWidth: '800px',
    padding: '12px',
    margin: '100px 0 10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#555',
    height: '75vh',
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
        <div
          onClick={() => {
            setIsOpen(false);
            setShowAnswer(false);
            setShowSpeechBubble(false);
            setQuizDialogOpen(false);
            setResponse(null);
            setQuery("");
            setQuizData(null);
            navigate('/', { state: { fresh: true } });
          }}
          className="cursor-pointer text-center py-3 px-4 rounded-lg font-extrabold text-lg relative overflow-hidden"
          style={{
            background: "linear-gradient(45deg, #ff6600, #ffff00, #33cc33, #0099ff, #ff00cc, #6633ff)",
            backgroundSize: "400% 400%",
            animation: "uploadButtonAnimation 3s ease infinite, uploadButtonPulse 0.8s infinite alternate",
            boxShadow: "0 0 15px 5px rgba(255, 102, 0, 0.5), 0 0 30px 10px rgba(255, 255, 0, 0.3)",
            transform: "scale(1.1)",
            border: "3px solid white",
            textShadow: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6",
            WebkitTextStroke: "1px #000",
            maxWidth: "280px"
          }}
        >
          <style jsx>{`
            @keyframes uploadButtonAnimation {
              0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
              50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
              100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
            }
            @keyframes uploadButtonPulse {
              0% { transform: scale(1) rotate(-1deg); }
              100% { transform: scale(1.1) rotate(1deg); }
            }
          `}</style>
          <div style={{ animation: "glitch 0.3s infinite", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            🔥 Ű̴P̴L̴O̴Ä̴D̴ ⚡ M̴0̴R̴3̴ 📝 N̸O̸T̸E̸S! 🚀
          </div>
        </div>
      </div>

      <div style={containerStyles}>
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 100,
          width: '100%',
          maxWidth: '700px',
          padding: '12px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 105, 180, 0.3)',
          border: '3px solid black',
          animation: 'titlePulse 2s infinite alternate'
        }}>
          <style jsx>{`
            @keyframes titlePulse {
              0% { transform: translateX(-50%) scale(1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 105, 180, 0.3); }
              100% { transform: translateX(-50%) scale(1.03); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 25px rgba(255, 105, 180, 0.4); }
            }
            @keyframes arrowBounce {
              0% { transform: translateY(0); }
              100% { transform: translateY(10px); }
            }
          `}</style>
          <h2 style={{
            fontFamily: 'Comic Sans MS, cursive, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 'bold',
            margin: '0 0 15px',
            background: 'linear-gradient(45deg, #ff6600, #ff00ff, #00ccff, #33cc33)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            letterSpacing: '1px'
          }}>
            The YAAASSSSified version of your notes
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '5px'
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                width: '30px',
                height: '30px',
                animation: `arrowBounce 0.8s ${i * 0.2}s infinite alternate ease-in-out`
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <textarea
          id="reader"
          value={yass_text || ''}
          required
          style={{
            ...inputStyles,
            position: 'fixed',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #ccc',
            background: 'white',
            padding: '10px',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4f8a8b')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          readOnly
        />

        {/* <textarea
          id="reader"
          value={yass_text || ''}
          required
          style={inputStyles}
          onFocus={(e) => (e.target.style.borderColor = '#4f8a8b')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          readOnly
        /> */}

        <div style={{ position: 'fixed', bottom: '30px', right: '30px', margin: '0 0 10px 0' }}>
          {showSpeechBubble && (
            <div
              ref={speechBubbleRef}
              style={{
                position: 'absolute',
                bottom: '110%',
                right: '20%',
                transform: 'translateX(12%) rotate(-5deg) skew(-3deg, 5deg)',
                backgroundImage: 'linear-gradient(125deg, #ff00ff, #00ff6a, #ff3300, #880044, #00ccff, #ff0066)',
                padding: '32px 45px 18px 27px',
                borderRadius: '28px 12px 35px 8px',
                boxShadow: '0 8px 32px rgba(255, 0, 0, 0.55), inset 0 0 18px rgba(0, 255, 0, 0.7), 0 0 25px #ff00ff',
                width: '520px',
                zIndex: 1000,
                marginBottom: '35px',
                border: '6px dotted #00ffcc',
                animation: 'vibrate 0.2s infinite alternate',
                overflow: 'hidden',
              }}
            >
              <style jsx>{`
                @keyframes vibrate {
                  0% { transform: translateX(12%) rotate(-5deg) skew(-3deg, 5deg) scale(1.02); }
                  33% { transform: translateX(11%) rotate(-3deg) skew(-2deg, 3deg) scale(1.01); }
                  66% { transform: translateX(13%) rotate(-6deg) skew(-4deg, 4deg) scale(0.99); }
                  100% { transform: translateX(10%) rotate(-4deg) skew(-5deg, 6deg) scale(0.98); }
                }
                
                @keyframes staticNoise {
                  0%, 100% { opacity: 0.05; }
                  50% { opacity: 0.15; }
                }
              `}</style>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                  opacity: 0.1,
                  mixBlendMode: 'overlay',
                  animation: 'staticNoise 0.5s infinite',
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '23px',
                  transform: 'skew(-4deg, 3deg) rotate(2deg)',
                  margin: '8px -5px 15px 12px',
                }}
              >
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setShowSpeechBubble(false);
                  }}
                  className="cursor-pointer text-left py-5 px-2 font-extrabold text-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(78deg, #ff3300, #8800ff, #00ffee, #ff0099, #00ff99)",
                    backgroundSize: "300% 300%",
                    animation: "askHaroldAnimation 1.5s ease infinite, askHaroldSpin 1.7s ease-in-out infinite, askHaroldBounce 0.6s infinite alternate",
                    boxShadow: "inset 0 0 25px 15px rgba(255, 0, 153, 0.8), 0 0 40px 15px rgba(0, 255, 255, 0.6)",
                    transform: "scale(1.65) rotate(4deg)",
                    border: "5px dashed yellow",
                    textShadow: "0 0 8px #ff00ff, 0 0 15px #00ffff, 0 0 20px #ff3399",
                    WebkitTextStroke: "2px #073",
                    borderRadius: "25px 5px 38px 2px",
                    letterSpacing: "-1px",
                  }}
                >
                  <style jsx>{`
                    @keyframes askHaroldAnimation {
                      0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
                      50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
                      100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
                    }
                    @keyframes askHaroldSpin {
                      0% { transform: rotate(-3deg) scale(1.1); }
                      33% { transform: rotate(3deg) scale(1.2); }
                      66% { transform: rotate(-3deg) scale(1.15); }
                      100% { transform: rotate(3deg) scale(1.1); }
                    }
                    @keyframes askHaroldBounce {
                      0% { transform: translateY(0) scale(1.1); }
                      100% { transform: translateY(-3px) scale(1.15); }
                    }
                  `}</style>
                  <div style={{ animation: "glitch 0.25s infinite", display: "inline-block", filter: "contrast(1.5) brightness(1.2)" }}>
                    <div style={{ marginBottom: "5px", fontSize: "1.1rem" }}></div>
                    🚨🔥 🅰🆂🅺 👴 H̸A̸R̸O̸L̸D̸ 🧠💫 😭🫠
                  </div>
                </div>
                <div
                  onClick={startQuiz}
                  className="cursor-pointer text-right py-4 px-6 font-extrabold text-3xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(115deg, #ff00cc, rgb(255, 73, 1), #9d00ff, #00ff73, #00ddff, #ff0062)",
                    backgroundSize: "200% 200%",
                    animation: "gradientShift 2.2s ease infinite, wildSpin 1.1s ease-in-out infinite, pulse 0.5s infinite alternate",
                    boxShadow: "0 0 20px 10px rgba(255, 0, 255, 0.7), 0 0 35px 15px rgba(255, 255, 0, 0.5)",
                    transform: "scale(1.8) rotate(-5deg)",
                    border: "8px ridge #00ff00",
                    textShadow: "0 0 7px #ff00ff, 0 0 14px #ff00ff, 0 0 21px #ff00ff, 0 0 28px #ff00ff",
                    WebkitTextStroke: "2px rgb(0, 60, 255)",
                    borderRadius: "3px 40px 15px 32px",
                    marginTop: "-5px",
                    marginLeft: "-35px",
                    marginBottom: "18px",
                  }}
                >
                  <style jsx>{`
                    @keyframes gradientShift {
                      0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
                      25% { filter: hue-rotate(90deg); }
                      50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
                      75% { filter: hue-rotate(270deg); }
                      100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
                    }
                    @keyframes pulse {
                      0% { transform: scale(1.15) rotate(-3deg); }
                      100% { transform: scale(1.35) rotate(3deg); }
                    }
                    @keyframes glitch {
                      0% { transform: translate(0); filter: brightness(1.2); }
                      20% { transform: translate(-4px, 4px); filter: brightness(1.5); }
                      40% { transform: translate(-4px, -4px); filter: brightness(1.2); }
                      60% { transform: translate(4px, 4px); filter: brightness(1.8); }
                      80% { transform: translate(4px, -4px); filter: brightness(1.4); }
                      100% { transform: translate(0); filter: brightness(1.2); }
                    }
                    @keyframes wildSpin {
                      0% { transform: rotate(-5deg) scale(1); }
                      25% { transform: rotate(15deg) scale(1.1); }
                      50% { transform: rotate(-15deg) scale(1.2); }
                      75% { transform: rotate(5deg) scale(1.1); }
                      100% { transform: rotate(-5deg) scale(1); }
                    }
                  `}</style>
                  <div style={{ animation: "glitch 0.3s infinite", display: "inline-block", filter: "contrast(1.5) brightness(1.2)" }}>
                    🔥💯 💥🌀 Q̴U̴I̴Z Y0U̴R S3L̴F! 🧠💥 🚀✨
                  </div>
                </div>
              </div>
              {/* haROlD WiLl HelllP YOU!!!!!!!1!! */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-25px',
                  right: '62%',
                  width: '35px',
                  height: '35px',
                  background: 'linear-gradient(45deg, #ff6600, #00ffcc)',
                  borderRadius: '8px 15px 5px 12px',
                  transform: 'translateX(30%) rotate(12deg)',
                  boxShadow: '0 8px 12px rgba(255, 0, 0, 0.3)',
                  zIndex: -1,
                  border: '3px dotted #ff00ff',
                }}
              />
            </div>
          )}

          <div className="absolute" style={{
            right: '220px',
            bottom: '55px',
            transform: 'rotate(-5deg)',
            zIndex: 20,
            pointerEvents: 'none'
          }}>
            <div className="relative">
              {/* Animated Text */}
              <div className="text-3xl font-extrabold" style={{
                animation: "crazyTextAnimate 0.7s infinite alternate",
                textShadow: "3px 3px 0 yellow, -3px -3px 0 #00ffff, -3px 3px #ff00cc",
                color: "#00ff00",
                WebkitTextStroke: "2px blue",
                letterSpacing: "-1px",
                marginBottom: "10px",
                transform: "skew(-5deg, 2deg) rotate(3deg)",
                filter: "contrast(150%) brightness(120%)"
              }}>haROlD WiLl HelllP YOU!!!!!!!1!!
                <span style={{ fontSize: "40px", color: "#ff00ff" }}>C</span>
                <span style={{ fontSize: "35px", color: "#ff0000" }}>L</span>
                <span style={{ fontSize: "42px", color: "#00ffff" }}>!</span>
                <span style={{ fontSize: "38px", color: "#ffff00" }}>C</span>
                <span style={{ fontSize: "45px", color: "#ff00cc" }}>C</span>
                <span style={{ fontSize: "36px", color: "#00ff00" }}>C</span>
                <span style={{ fontSize: "44px", color: "#ff3300" }}>C</span>
                <span style={{ fontSize: "32px", color: "#9900ff" }}> H</span>
                <span style={{ fontSize: "42px", color: "#00ccff" }}>U</span>
                <span style={{ fontSize: "38px", color: "#ff6600" }}>U</span>
                <span style={{ fontSize: "45px", color: "#33ff00" }}>R</span>
                <span style={{ fontSize: "40px", color: "#cc00ff" }}>R</span>
                <span style={{ fontSize: "46px", color: "#ff0066" }}>!!</span>
                <span style={{ fontSize: "38px", color: "#00ffaa" }}>!</span>
              </div>

              {/* Animated Arrow */}
              <div className="absolute" style={{
                right: "-50px",
                top: "50%",
                transform: "translateY(-10%)",
                animation: "arrowBounce 0.5s infinite alternate",
                zIndex: 25
              }}>
                <div className="relative">
                  <div style={{
                    width: "120px",
                    height: "40px",
                    backgroundColor: "#ff0000",
                    clipPath: "polygon(0 35%, 75% 35%, 75% 0%, 100% 50%, 75% 100%, 75% 65%, 0 65%)",
                    boxShadow: "0 0 15px 5px rgba(255, 0, 0, 0.7)",
                    animation: "arrowPulse 0.3s infinite alternate"
                  }}></div>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(45deg, transparent 0%, yellow 50%, transparent 100%)",
                    animation: "arrowGlow 0.7s infinite alternate",
                    opacity: 0.8
                  }}></div>
                </div>
              </div>
            </div>
            <style jsx>{`
              @keyframes crazyTextAnimate {
                0% { transform: skew(-5deg, 2deg) rotate(3deg) scale(1); filter: hue-rotate(0deg); }
                25% { transform: skew(3deg, -5deg) rotate(-2deg) scale(1.05); filter: hue-rotate(90deg); }
                50% { transform: skew(-7deg, 0deg) rotate(5deg) scale(0.95); filter: hue-rotate(180deg); }
                75% { transform: skew(2deg, -3deg) rotate(-4deg) scale(1.1); filter: hue-rotate(270deg); }
                100% { transform: skew(-5deg, 5deg) rotate(2deg) scale(1.05); filter: hue-rotate(360deg); }
              }
              @keyframes arrowBounce {
                0% { transform: translateY(-10%) translateX(0) scale(1); }
                100% { transform: translateY(-10%) translateX(20px) scale(1.1); }
              }
              @keyframes arrowPulse {
                0% { background-color: #ff0000; }
                50% { background-color: #ff6600; }
                100% { background-color: #ff0000; }
              }
              @keyframes arrowGlow {
                0% { opacity: 0.3; transform: scale(1); }
                100% { opacity: 0.8; transform: scale(1.05); }
              }
            `}</style>
          </div>

          <img
            src="/harold.png"
            alt="Harold the Helper"
            className="w-[180px] h-[180px] rounded-lg object-contain cursor-pointer relative z-10"
            style={{
              boxShadow: "0 0 20px 5px rgba(106, 90, 205, 0.6), 0 0 40px 10px rgba(75, 0, 130, 0.3)",
              animation: "haroldIdle 3s ease-in-out infinite",
              transition: "all 0.3s ease"
            }}
            onClick={() => setShowSpeechBubble(!showSpeechBubble)}
            title="Ask Harold"
            aria-label="Ask Harold"
            onMouseOver={(e) => {
              e.currentTarget.style.animation = "haroldHover 0.7s ease-in-out infinite";
              e.currentTarget.style.boxShadow = "0 0 30px 15px rgba(255, 105, 180, 0.8), 0 0 60px 20px rgba(148, 0, 211, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.animation = "haroldIdle 3s ease-in-out infinite";
              e.currentTarget.style.boxShadow = "0 0 20px 5px rgba(106, 90, 205, 0.6), 0 0 40px 10px rgba(75, 0, 130, 0.3)";
            }}
          />
          <style jsx global>{`
            @keyframes haroldIdle {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            @keyframes haroldHover {
              0% { transform: scale(1.1) rotate(-2deg); }
              50% { transform: scale(1.15) rotate(2deg); }
              100% { transform: scale(1.1) rotate(-2deg); }
            }
          `}</style>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
          {!showAnswer && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">ask meester harold</h2>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="plop ur q huurrr"
                className="text-gray-800 placeholder:text-gray-400 focus:placeholder:text-gray-300"
                onFocus={(e) => e.target.classList.add('ring-2', 'ring-primary')}
                onBlur={(e) => e.target.classList.remove('ring-2', 'ring-primary')}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setIsOpen(false)} variant="outline">tak3 meh baaaaq</Button>
                <Button
                  onClick={getHelp}
                  disabled={!query.trim()}
                  variant={query.trim() ? "default" : "secondary"}
                >5ubm!t</Button>
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
              <div className="wilde-title-container overflow-hidden" style={{
                marginBottom: '1rem',
                position: 'relative',
                textAlign: 'center',
              }}>
                <style jsx>{`
                      @keyframes crazyRotate {
                        0% { transform: rotate(-2deg) scale(1); }
                        25% { transform: rotate(3deg) scale(1.03); }
                        50% { transform: rotate(-1deg) scale(0.98); }
                        75% { transform: rotate(2deg) scale(1.02); }
                        100% { transform: rotate(-2deg) scale(1); }
                      }
                      @keyframes glitchEffect {
                        0% { transform: translate(0); text-shadow: -2px 0 #ff00cc, 2px 2px #00ffff; }
                        25% { transform: translate(-5px, 5px); text-shadow: 2px -2px #ff3300, -2px 2px #00ff99; }
                        50% { transform: translate(5px, 0); text-shadow: -3px 0 #ffff00, 3px -1px #ff00ff; }
                        75% { transform: translate(0, -3px); text-shadow: 1px 3px #00ccff, -3px -2px #ff6600; }
                        100% { transform: translate(0); text-shadow: -2px 0 #ff00cc, 2px 2px #00ffff; }
                      }
                      @keyframes rainbowText {
                        0% { color: #ff0000; filter: hue-rotate(0deg); }
                        25% { color: #ffff00; filter: hue-rotate(90deg); }
                        50% { color: #00ff00; filter: hue-rotate(180deg); }
                        75% { color: #00ffff; filter: hue-rotate(270deg); }
                        100% { color: #ff00ff; filter: hue-rotate(360deg); }
                      }
                      @keyframes pulseBorder {
                        0% { border-width: 3px; border-color: #ff00cc; }
                        50% { border-width: 7px; border-color: #00ffff; }
                        100% { border-width: 3px; border-color: #ff00cc; }
                      }
                    `}</style>
                <h1 style={{
                  background: "linear-gradient(70deg, #ff00cc, #ff6600, #ffff00, #33cc33, #00ccff, #cc00ff, #ff3399)",
                  backgroundSize: "300% 300%",
                  animation: "rainbowText 3s linear infinite, crazyRotate 4s ease-in-out infinite",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "5px dashed #00ffff",
                  fontSize: "2.2rem",
                  fontWeight: "900",
                  letterSpacing: "-1px",
                  WebkitTextStroke: "2px black",
                  textShadow: "3px 3px 0 #ff00cc, -3px -3px 0 #00ffff, 6px 6px 12px rgba(0,0,0,0.5)",
                  marginBottom: "1rem",
                  display: "inline-block",
                  transform: "rotate(-2deg)",
                  maxWidth: "95%"
                }}>
                  <span style={{ animation: "glitchEffect 2s infinite", display: "inline-block" }}>
                    🔥 t<span style={{ fontSize: "2.5rem", color: "#ff00cc" }}>H</span>e y<span style={{ fontSize: "2rem", color: "#00ffff" }}>A</span>s<span style={{ fontSize: "2.4rem", transform: "rotate(8deg)", display: "inline-block" }}>S</span>s<span style={{ fontSize: "2.1rem", color: "#ffcc00" }}>i</span>F<span style={{ transform: "rotate(-10deg)", display: "inline-block" }}>i</span>e<span style={{ fontSize: "2.3rem", color: "#ff3300" }}>D</span> 🌈
                    <br />
                    <span style={{ fontSize: "2.7rem", color: "#00ff99", filter: "brightness(1.3)" }}>s</span>Um<span style={{ fontSize: "2.2rem", color: "#ff6600" }}>M</span>ar<span style={{ textDecoration: "wavy underline #ff00ff" }}>Y</span> 💯
                    <span style={{ fontSize: "1.9rem", color: "#9900ff" }}>H</span><span style={{ fontSize: "2.5rem", color: "#ff0066" }}>a</span>r0<span style={{ fontSize: "2.3rem", color: "#00ccff" }}>L</span>d
                    <span style={{ transform: "skew(-10deg,5deg)", display: "inline-block" }}> MaD</span>e
                  </span>
                  <span style={{ fontSize: "2.4rem", animation: "glitchEffect 1.5s infinite", filter: "contrast(1.3) brightness(1.2)" }}>
                    4️⃣ Y0<span style={{ fontSize: "2.8rem", color: "#33ff33" }}>U</span>‼️ 🧠✨
                  </span>
                </h1>
              </div>
              <Card className="border-2 border-purple-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="prose-lg max-w-none mt-2" style={{
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

      {/* Quiz Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {quizLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-6">
                <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Creating Your Quiz...</h2>
              <p className="text-gray-600 mb-4">Harold is crafting some mind-bending questions for you! 🧠✨</p>
            </div>
          ) : (
            quizData && <QuizPage quizData={quizData} onClose={() => setQuizDialogOpen(false)} isLoading={quizLoading} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}