import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RainbowText } from "@/components/RainbowText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/*export async function User() {
  const [{ data, fetching, error }, refresh] = useFetch("/gemini", {
    method: "GET",
    json: true,
  });

  console.log(await data);

}*/

export default function() {
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file').value;
    const params = new URLSearchParams({ "file": fileInput }).toString();

    try {
      const response = await fetch(`/gemini?${params}`);
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8"> {/* Increased padding and gap */}
      <h1 className="text-6xl font-bold text-primary"><RainbowText /></h1> {/* Was 4xl, now 6xl */}
      
      <Card className="w-full max-w-2xl"> {/* Increased max-width */}
        <CardHeader>
          <CardTitle className="text-3xl">About <RainbowText /></CardTitle> {/* Added text-3xl */}
          <CardDescription className="text-xl"> {/* Added text-xl */}
            <RainbowText /> is your AI study buddy that helps make learning more fun! Upload your lecture slides 
            and <RainbowText /> will break down the material in a way that's easier to understand, using meme-friendly 
            language and a dash of humor. Ask questions, get clarification, and let <RainbowText /> help you master 
            your coursework! 🎓✨
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-4">
          <Label htmlFor="file" className="text-xl font-medium text-black">
            Choose a THICCC file:
          </Label>
          
          <Input 
            type="text" 
            id="file" 
            name="file" 
            required 
            className="w-full text-black bg-white border-gray-300" 
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Upload
          </Button>
        </div>
      </form>
      
      {response && (
        <div className="w-full max-w-2xl p-4 mt-4 bg-white rounded-lg shadow-md">
          <pre className="text-black whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
