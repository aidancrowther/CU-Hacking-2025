import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";
import { useState } from 'react';

/*export async function User() {
  const [{ data, fetching, error }, refresh] = useFetch("/gemini", {
    method: "GET",
    json: true,
  });

  console.log(await data);

}*/

export default function() {

  const getQuiz = async () => {
    const params = new URLSearchParams({ "file": "https://www.rsb.org.uk/images/15_Photosynthesis.pdf" }).toString();

    try {
      const response = await fetch(`/quiz?${params}`);
      const quiz = await response.json();
      console.log(quiz.text);
    } catch (err) {
      console.error(err);
    }
  };

  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file').value;
    const params = new URLSearchParams({ "file": "https://www.rsb.org.uk/images/15_Photosynthesis.pdf" }).toString();

    getQuiz();

    try {
      const response = await fetch(`/init?${params}`);
      const data = await response.json();
      setResponse(data);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="file">Choose a THICCC file:</label>
        <input type="text" id="file" name="file" required />
        <button type="submit">Upload</button>
      </form>

      <Button asChild size="lg" variant="default" className="px-8 py-6 text-lg font-semibold">
        <Link to="/quizpage">Start Quiz</Link>
      </Button>

      {response && (
        <div className="response-container">
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <div className="mt-6 text-center">

          </div>
        </div>

      )}
    </div>
  );
}
