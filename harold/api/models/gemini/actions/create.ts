import { applyParams, save, ActionOptions } from "gadget-server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

const genAI = new GoogleGenerativeAI("AIzaSyDRqY7-nR8pzGjau-9C_ZD6GxKkr5EDJsk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  const { id, prompt } = record;

  const request = `You are a zoomer teacher, you need to help fellow zoomers understand the material covered in the provided document. break it down using meme language and yassify it. provide follow up questions to make sure they understood the material.`;

  const pdfResp = await fetch(prompt ? prompt : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
    .then((response) => response.arrayBuffer());

  const result = await model.generateContent([{
    inlineData: {
      data: Buffer.from(pdfResp).toString("base64"),
      mimeType: "application/pdf",
    },
  }, request]);

  // write to the Gadget Logs
  logger.info({ result }, "Response for ${id}");

};

export const options: ActionOptions = {
  actionType: "create",
};