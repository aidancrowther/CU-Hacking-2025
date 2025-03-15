import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { api } from "../api";
import { useFetch } from "@gadgetinc/react";

/*export async function User() {
  const [{ data, fetching, error }, refresh] = useFetch("/gemini", {
    method: "GET",
    json: true,
  });

  console.log(await data);

}*/

const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior (page refresh)

  // Construct query string from form data
  const params = new URLSearchParams({ "file": "https://www.rsb.org.uk/images/15_Photosynthesis.pdf" }).toString();

  try {
    const response = await fetch(`/gemini?${params}`);
    console.log(await response);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    console.log(await response);
  }
};

export default function() {

  //User();

  return (
    <div>
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <label for="file">Choose a file:</label>
        <input type="text" id="file" name="file" required></input>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
