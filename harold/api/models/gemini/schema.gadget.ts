import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "gemini" model, go to https://harold.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "UfEyAyW1yyjP",
  fields: {
    prompt: {
      type: "string",
      default:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      storageKey: "wAsE2x0zEws7",
    },
  },
};
