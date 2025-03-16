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

  const prompt = `You are a zoomer teacher, you need to help fellow zoomers understand the material covered in the provided document. break it down using meme language and yassify it. provide follow up questions to make sure they understood the material.`;

  const pdfResp = await fetch(request.query.file)
    .then((response) => response.arrayBuffer());

  const result = await model.generateContent([{
    inlineData: {
      data: Buffer.from(pdfResp).toString("base64"),
      mimeType: "application/pdf",
    },
  }, prompt]);

  logger.info({ result }, "result");

  logger.info({
    "text": result.response.candidates[0].content.parts[0].text,
    "filepath": request.query.file
  }, "result for frontend")

  await reply.type("application/json").send({
    "text": result.response.candidates[0].content.parts[0].text,
    "filepath": request.query.file
  });

};

export default route;
