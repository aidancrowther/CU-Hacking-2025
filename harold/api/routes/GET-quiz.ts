import { RouteHandler } from "gadget-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDRqY7-nR8pzGjau-9C_ZD6GxKkr5EDJsk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Route handler for GET gemini
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler = async ({ request, reply, api, logger, connections }) => {

  logger.info({ request }, "Data");

  const prompt = `You are a zoomer teacher, you are helping fellow zoomers to better understand their material by yassifying and meme speaking. A previous iteration has broken down the material for the students, now you need to ask them questions to verify their understanding. For now we want multiple choice questions only. Be tricky! We want to make sure they were fully paying attention. Match the following json schema:

  {
    "1": {
      "question": "<Yassified question here>",
      "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": <index of correct answer in answers array>
    }
  }
  
Ask a good number of questions, and randomize the order of options in the answers list. Only return the json object, do not respond with text aside from this object as I need to be able to parse it. The json must be in stringified format, do not include any special characters or padding, omit newline characters. Following this prompt you will also be supplied with the source PDF that your information should come from.`;

  const pdfResp = await fetch(request.query.file)
    .then((response) => response.arrayBuffer());

  const result = await model.generateContent([{
    inlineData: {
      data: Buffer.from(pdfResp).toString("base64"),
      mimeType: "application/pdf",
    },
  }, prompt]);

  logger.info({ result }, "result");

  let quiz = result.response.candidates[0].content.parts[0].text;
  let jsonString = quiz.slice(1, -1).replace(/\\/g, '"').replace(/`/g, '').replace("json", "").replace(/""/g, '"');
  logger.info({ "string": jsonString }, "Response string");
  let jsonObject = JSON.parse(jsonString);

  logger.info({
    "text": jsonObject,
    "filepath": request.query.file
  }, "result for frontend with string");

  await reply.type("application/json").send({
    "text": jsonObject,
    "filepath": request.query.file
  });

};

export default route;
