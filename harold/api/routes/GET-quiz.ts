import { RouteHandler } from "gadget-server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDRqY7-nR8pzGjau-9C_ZD6GxKkr5EDJsk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Route handler for GET quiz
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{ Querystring: { file?: string; }; }> = async ({ request, reply, api, logger, connections }) => {
  logger.info({ query: request.query }, "Received request");

  // Check if file parameter exists
  if (!request.query.file) {
    logger.error("Missing 'file' parameter in request");
    return reply.code(400).send({
      error: "Missing required parameter",
      message: "The 'file' query parameter is required"
    });
  }

  // Validate URL format
  let fileUrl: string;
  try {
    fileUrl = new URL(request.query.file).toString();
  } catch (error) {
    logger.error({ error, url: request.query.file }, "Invalid URL format");
    return reply.code(400).send({
      error: "Invalid URL",
      message: "The 'file' parameter must be a valid URL"
    });
  }

  const prompt = `You are a zoomer teacher, you are helping fellow zoomers to better understand their material by yassifying and meme speaking. A previous iteration has broken down the material for the students, now you need to ask them questions to verify their understanding. For now we want multiple choice questions only. Be tricky! We want to make sure they were fully paying attention. Match the following json schema:

  {
    "1": {
      "question": "<Yassified question here>",
      "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": <index of correct answer in answers array>
    }
  }
  
Ask a good number of questions, and randomize the order of options in the answers list. Only return the json object, do not respond with text aside from this object as I need to be able to parse it. The json must be in stringified format, do not include any special characters or padding, omit newline characters. Following this prompt you will also be supplied with the source PDF that your information should come from.`;

  try {
    // Fetch PDF content
    const response = await fetch(fileUrl);

    if (!response.ok) {
      logger.error({ status: response.status, statusText: response.statusText, url: fileUrl }, "Failed to fetch PDF");
      return reply.code(response.status === 404 ? 404 : 502).send({
        error: "File fetch error",
        message: `Failed to fetch the PDF file: ${response.statusText}`
      });
    }

    const pdfResp = await response.arrayBuffer();

    // Generate quiz content
    const result = await model.generateContent([{
      inlineData: {
        data: Buffer.from(pdfResp).toString("base64"),
        mimeType: "application/pdf",
      },
    }, prompt]);

    logger.info("Generated content from PDF");

    let quiz = result.response.candidates[0].content.parts[0].text;
    let jsonString = quiz.slice(1, -1).replace(/\\/g, '"').replace(/`/g, '').replace("json", "").replace(/^[, '\s]+|[, '\s]+$/g, '').replace(/""/g, '"').replace(/[\x00-\x1F\x7F]/g, (match) => '\\x' + match.charCodeAt(0).toString(16).padStart(2, '0')).replace(/^['"`]+|['"`]+$/g, '');
    logger.info({ string: jsonString }, "Response string");

    let jsonObject;
    try {
      jsonObject = JSON.parse(jsonString);
    } catch (error) {
      logger.error({ error, jsonString }, "Failed to parse JSON response");
      return reply.code(500).send({
        error: "Processing error",
        message: "Failed to parse response from AI model"
      });
    }

    logger.info({
      text: jsonObject,
      filepath: fileUrl
    }, "Successfully processed quiz");

    return reply.type("application/json").send({
      text: jsonObject,
      filepath: fileUrl
    });

  } catch (error) {
    logger.error({ error, url: fileUrl }, "Error processing request");
    return reply.code(500).send({
      error: "Processing error",
      message: "An unexpected error occurred while generating the quiz"
    });
  }
};

// Add schema validation for query parameters
route.options = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        file: { type: "string" }
      },
      required: ["file"]
    }
  }
};

export default route;
