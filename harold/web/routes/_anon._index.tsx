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
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center' as const,
  };

  const headingStyles = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#4f8a8b',
  };

  const inputStyles = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#555',
  };

  const inputFocusStyles = {
    borderColor: '#4f8a8b',
    outline: 'none',
  };

  const buttonStyles = {
    backgroundColor: '#4f8a8b',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  };

  const buttonHoverStyles = {
    backgroundColor: '#3a6e6f',
  };

  // Loading modal styles
  const overlayStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: isLoading ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyles = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '300px',
    width: '100%',
  };

  const spinnerStyles = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #4f8a8b',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    margin: '20px auto',
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={overlayStyles}>
        <div style={modalStyles}>
          <h2 style={{color: '#4f8a8b', marginBottom: '15px'}}>Harold is reading your PDF</h2>
          <div style={spinnerStyles}></div>
        </div>
      </div>
      <div style={formStyles}>
        <h1 style={headingStyles}>File Upload Form</h1>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="file"
          placeholder="Enter file name or path"
          required
          style={inputStyles}
          onFocus={(e) => (e.target.style.borderColor = '#4f8a8b')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <button
          type="submit"
          style={buttonStyles}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3a6e6f')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f8a8b')}
        >
          Submit
        </button>
      </form>
      </div>
    </>
  );
};
