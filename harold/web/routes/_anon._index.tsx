import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';

/*export async function User() {
  const [{ data, fetching, error }, refresh] = useFetch("/gemini", {
    method: "GET",
    json: true,
  });

  console.log(await data);

}*/

export default function() {

  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirect = (data) => {

    const params = new URLSearchParams({ "file": data.filepath, "text": data.text }).toString();

    navigate(`/reader?${params}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const fileInput = document.getElementById('file').value;
    const params = new URLSearchParams({ "file": fileInput == "" ? "https://www.rsb.org.uk/images/15_Photosynthesis.pdf" : fileInput }).toString();

    try {
      const response = await fetch(`/init?${params}`);
      const data = await response.json();
      setResponse(data);
      console.log(data);
      setIsLoading(false);
      handleRedirect(data);
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
    }

  };

  // Inline styles for form elements
  const formStyles = {
    backgroundColor: '#0d0d0d',
    backgroundImage: 'linear-gradient(45deg, #0d0d0d, #222, #111)',
    borderRadius: '20px',
    boxShadow: '0 0 40px #ff00ff, 0 0 80px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(57, 255, 20, 0.4)',
    padding: '40px',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center' as const,
    border: '4px solid',
    borderImageSlice: '1',
    borderImageSource: 'linear-gradient(to right, #ff00ff, #00ffff, #39ff14, #fe0000)',
    margin: '40px auto',
    transform: 'perspective(1000px) rotateX(2deg)',
  };

  const headingStyles = {
    fontSize: '42px',
    marginBottom: '40px',
    color: '#ff00ff',
    fontWeight: 'bold' as const,
    textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 4px 4px 0px #00ffff, -4px -4px 0px #39ff14',
    animation: 'colorPulse 7s linear infinite',
    letterSpacing: '3px',
    transform: 'skew(-5deg)',
  };

  const inputStyles = {
    width: '100%',
    padding: '25px',
    margin: '20px 0',
    border: '3px solid #39ff14',
    borderRadius: '15px',
    fontSize: '24px',
    color: '#00ffff',
    backgroundColor: '#111',
    boxShadow: '0 0 20px #39ff14, inset 0 0 10px #00ffff',
    textShadow: '0 0 5px #00ffff',
    animation: 'pulse 2s infinite alternate',
    fontWeight: 'bold' as const,
    letterSpacing: '2px',
    transform: 'skew(-2deg)',
  };

  const inputFocusStyles = {
    borderColor: '#ff00ff',
    outline: 'none',
    boxShadow: '0 0 30px #ff00ff, inset 0 0 15px #fe0000',
    transform: 'scale(1.05) skew(-2deg)',
    transition: 'all 0.3s',
  };

  const buttonStyles = {
    backgroundColor: '#fe0000',
    backgroundImage: 'linear-gradient(45deg, #fe0000, #ff00ff, #00ffff, #39ff14)',
    color: 'white',
    border: 'none',
    padding: '30px',
    borderRadius: '15px',
    fontSize: '32px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 0 40px rgba(255, 0, 255, 0.8), 0 0 20px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.5)',
    textShadow: '3px 3px 0 #fe0000, -3px -3px 0 #00ffff, 6px 6px 10px #39ff14',
    letterSpacing: '2px',
    transform: 'skew(-5deg) rotate(1deg)',
    marginTop: '30px',
    transition: 'all 0.3s',
  };

  const buttonHoverStyles = {
    transform: 'scale(1.1) skew(-5deg) rotate(-1deg)',
    boxShadow: '0 0 60px rgba(255, 0, 255, 1), 0 0 30px rgba(57, 255, 20, 0.7), inset 0 0 30px rgba(0, 255, 255, 0.7)',
  };

  // Loading modal styles
  const overlayStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.9) 40%, rgba(255, 0, 255, 0.6) 100%)',
    display: isLoading ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    animation: 'pulse 2s infinite alternate',
  };

  const modalStyles = {
    backgroundColor: '#0a0a0a',
    backgroundImage: 'linear-gradient(45deg, #0a0a0a, #222, #0a0a0a)',
    padding: '50px',
    borderRadius: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 0 50px #ff00ff, 0 0 100px #fe0000, inset 0 0 30px #00ffff',
    maxWidth: '700px',
    width: '100%',
    border: '5px solid',
    borderImageSlice: '1',
    borderImageSource: 'linear-gradient(to right, #ff00ff, #00ffff, #39ff14, #fe0000)',
    animation: 'pulse 1.5s infinite alternate',
    transform: 'perspective(1000px) rotateX(5deg)',
  };

  const spinnerStyles = {
    border: '12px solid rgba(0, 0, 0, 0.1)',
    borderTop: '12px solid #ff00ff',
    borderRight: '12px solid #39ff14',
    borderBottom: '12px solid #00ffff',
    borderLeft: '12px solid #fe0000',
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    margin: '40px auto',
    animation: 'regularSpin 2s linear infinite',
    boxShadow: '0 0 30px #ff00ff, 0 0 15px #00ffff',
  };

  return (
    <>
      <style>
        {`
          @keyframes regularSpin {
            0% {
              transform: rotate(0deg);
              box-shadow: 0 0 15px #ff00ff, 0 0 8px #00ffff;
            }
            25% {
              transform: rotate(90deg);
              box-shadow: 0 0 15px #00ffff, 0 0 8px #39ff14;
            }
            50% {
              transform: rotate(180deg);
              box-shadow: 0 0 15px #39ff14, 0 0 8px #fe0000;
            }
            75% {
              transform: rotate(270deg);
              box-shadow: 0 0 15px #fe0000, 0 0 8px #ff00ff;
            }
            100% {
              transform: rotate(360deg);
              box-shadow: 0 0 15px #ff00ff, 0 0 8px #00ffff;
            }
          }
          
          @keyframes wildSpin {
            0% { /* 💀 /-_-\\/ */
              transform: perspective(200px) rotate(0deg) scale(1) translate3d(0, 0, 0); 
              color: #ff00ff;
              text-shadow: 
                5px 5px 0 #00ffff,
                -5px -5px 0 #39ff14,
                10px -10px 15px #ff0099,
                -10px 10px 15px #ffff00;
              filter: hue-rotate(0deg) brightness(1.5) contrast(2);
            }
            12.5% { /* 💥🤯 -=|W-H-A-T|=- */
              transform: perspective(200px) rotate(15deg) scale(1.1) translate3d(10px, -5px, 20px) rotateX(15deg); 
              color: #00ffff;
              text-shadow: 
                8px 0px 0 #ff00ff,
                -8px 0px 0 #ffcc00,
                0px 10px 20px #39ff14,
                0px -10px 20px #fe0000;
              filter: hue-rotate(90deg) brightness(1.8) saturate(300%);
            }
            25% { /* 🌀💥 ==XXX== */
              transform: perspective(150px) rotate(30deg) scale(1.2) skew(10deg) translate3d(-10px, 5px, -15px);
              color: #39ff14; 
              text-shadow: 
                -10px 10px 0 #ff00ff,
                10px -10px 0 #fe0000,
                20px 20px 30px #00ffff,
                -20px -20px 30px #ffcc00;
              filter: hue-rotate(180deg) brightness(1.7) contrast(2.2);
            }
            37.5% { /* ⚡️🌈 !!%@#$%!! */
              transform: perspective(150px) rotate(45deg) scale(0.9) skew(-15deg) translate3d(15px, 15px, 30px) rotateY(30deg); 
              color: #ffcc00;
              text-shadow: 
                0px 0px 20px #fe0000,
                10px 10px 0 #00ffff,
                -10px 10px 0 #39ff14,
                10px -10px 30px #ff00ff;
              filter: hue-rotate(270deg) brightness(2) saturate(350%);
            }
            50% { /* 🧠💀 <(°0°)> */
              transform: perspective(200px) rotate(60deg) scale(1.1) skew(-15deg) translate3d(0, -20px, -20px) rotateX(-30deg);
              color: #fe0000;
              text-shadow: 
                4px 4px 0 #ff00ff,
                -4px -4px 0 #00ffff,
                15px 15px 25px #39ff14,
                -15px 15px 25px #ffcc00,
                15px -15px 25px #ff00ff;
              filter: hue-rotate(0deg) brightness(2) contrast(2.5) invert(50%);
            }
            62.5% { /* 🔮👁️ ]|I{•⊙•}I|[ */
              transform: perspective(200px) rotate(75deg) scale(1.3) skew(10deg) translate3d(-20px, -5px, 30px) rotateY(-30deg); 
              color: #00ffff;
              text-shadow: 
                -8px 0px 0 #ff00ff,
                8px 0px 0 #fe0000,
                0px -30px 10px #ffcc00,
                0px 30px 10px #39ff14;
              filter: hue-rotate(90deg) brightness(1.7) contrast(2.8) saturate(400%);
            }
            75% { /* 🔥💀 +-+-+-+ */
              transform: perspective(180px) rotate(90deg) scale(1.2) skew(20deg) translate3d(15px, 10px, -30px);
              color: #39ff14;
              text-shadow: 
                10px 10px 0 #ff00ff,
                -10px -10px 0 #fe0000,
                20px -20px 40px #00ffff,
                -20px 20px 40px #ffcc00;
              filter: hue-rotate(180deg) brightness(2) saturate(300%);
            }
            87.5% { /* 🌋💣 #@$%&*!? */
              transform: perspective(150px) rotate(105deg) scale(0.95) skew(-10deg) translate3d(-15px, 20px, 10px) rotateX(30deg); 
              color: #ffcc00;
              text-shadow: 
                0px 0px 30px #ff00ff,
                15px 15px 0 #39ff14,
                -15px 15px 0 #00ffff,
                15px -15px 0 #fe0000,
                -15px -15px 40px #ff00ff;
              filter: hue-rotate(270deg) brightness(2.2) contrast(2) saturate(400%);
            }
            100% { /* ✨🚨 \\=||=// */
              transform: perspective(200px) rotate(120deg) scale(1) translate3d(0, 0, 0); 
              color: #ff00ff;
              text-shadow: 
                5px 5px 0 #00ffff,
                -5px -5px 0 #39ff14,
                10px -10px 15px #ff0099,
                -10px 10px 15px #ffff00;
              filter: hue-rotate(360deg) brightness(1.5) contrast(2);
            }
          }
          
          @keyframes colorPulse {
            0% {
              color: #ff00ff;
              text-shadow: 
                0 0 10px #ff00ff, 
                0 0 20px #ff00ff, 
                4px 4px 0px #00ffff, 
                -4px -4px 0px #39ff14;
              filter: hue-rotate(0deg) brightness(1.5);
            }
            25% {
              color: #00ffff;
              text-shadow: 
                0 0 10px #00ffff, 
                0 0 20px #00ffff, 
                4px 4px 0px #ff00ff, 
                -4px -4px 0px #fe0000;
              filter: hue-rotate(90deg) brightness(1.7);
            }
            50% {
              color: #39ff14;
              text-shadow: 
                0 0 10px #39ff14, 
                0 0 20px #39ff14, 
                4px 4px 0px #ff00ff, 
                -4px -4px 0px #00ffff;
              filter: hue-rotate(180deg) brightness(1.9);
            }
            75% {
              color: #fe0000;
              text-shadow: 
                0 0 10px #fe0000, 
                0 0 20px #fe0000, 
                4px 4px 0px #39ff14, 
                -4px -4px 0px #00ffff;
              filter: hue-rotate(270deg) brightness(1.7);
            }
            100% {
              color: #ff00ff;
              text-shadow: 
                0 0 10px #ff00ff, 
                0 0 20px #ff00ff, 
                4px 4px 0px #00ffff, 
                -4px -4px 0px #39ff14;
              filter: hue-rotate(360deg) brightness(1.5);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              filter: hue-rotate(0deg);
            }
            50% {
              transform: scale(1.05);
              filter: hue-rotate(180deg);
            }
            100% {
              transform: scale(1);
              filter: hue-rotate(360deg);
            }
          }

          @keyframes flashingBorder {
            0% {
              border-color: #ff00ff;
              box-shadow: 0 0 30px #ff00ff;
            }
            25% {
              border-color: #00ffff;
              box-shadow: 0 0 30px #00ffff;
            }
            50% {
              border-color: #39ff14;
              box-shadow: 0 0 30px #39ff14;
            }
            75% {
              border-color: #fe0000;
              box-shadow: 0 0 30px #fe0000;
            }
            100% {
              border-color: #ff00ff;
              box-shadow: 0 0 30px #ff00ff;
            }
          }
        `}
      </style>
      <div style={overlayStyles}>
        <div style={modalStyles}>
          <h2 style={{
            color: '#ff00ff', 
            marginBottom: '30px', 
            fontSize: '36px',
            fontWeight: 'bold',
            textShadow: '0 0 15px #ff00ff, 0 0 30px #00ffff, 0 0 45px #39ff14',
            animation: 'wildSpin 15s linear infinite',
            padding: '20px',
            lineHeight: '1.5'
          }}>H̷A̷R̷O̷L̷D̷ 𝕀̷S 𝕽𝕰𝒜𝒟𝒾𝑁𝒢 Y0UR P̸D̷F... 👀💣🚨 W̶A̷T̸C̸H̸ 𝕳𝑰𝕸 𝕊𝒞𝒓𝒐𝓁𝓁𝒾𝓃𝑔 𝓁𝒾𝓀𝑒 A̸𝖉̶𝓭𝓲𝓬𝓽 𝗂𝘁...💥🥴⏳... 💥𝓗𝒶𝓇𝑜𝓁𝒹 𝑰𝒔 𝒏𝒐𝒕 𝓈𝓉𝑜𝓅𝒾𝓃𝑔!!! 🚨🔥📉</h2>
          <div style={spinnerStyles}></div>
        </div>
      </div>
      <div style={formStyles}>
        <h1 style={headingStyles}>⚡️💾 U̸P̸L̸O̸A̸D ur N0T3S! 🧠🗒️</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="file"
            placeholder="3nT3r yooor peeDEEeff yuAREelle"
            required
            style={inputStyles}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff00ff';
              e.target.style.boxShadow = '0 0 30px #ff00ff, inset 0 0 15px #fe0000';
              e.target.style.transform = 'scale(1.05) skew(-2deg)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#39ff14';
              e.target.style.boxShadow = '0 0 20px #39ff14, inset 0 0 10px #00ffff';
              e.target.style.transform = 'skew(-2deg)';
            }}
          />
          <button
            type="submit"
            style={buttonStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) skew(-5deg) rotate(-1deg)';
              e.currentTarget.style.boxShadow = '0 0 60px rgba(255, 0, 255, 1), 0 0 30px rgba(57, 255, 20, 0.7), inset 0 0 30px rgba(0, 255, 255, 0.7)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'skew(-5deg) rotate(1deg)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 255, 0.8), 0 0 20px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.5)';
            }}
          >
            <span style={{
              fontSize: '42px',
              display: 'block',
              fontWeight: 'bold',
              textShadow: '3px 3px 0 #fe0000, -3px -3px 0 #00ffff, 6px 6px 10px #39ff14',
              animation: 'colorPulse 5s linear infinite',
            }}>UNLEASH THE HAROLD 🧠🔥</span>
          </button>
        </form>
      </div>
    </>
  );
};
