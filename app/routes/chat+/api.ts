import { createAzure } from "@ai-sdk/azure";
import { streamObject } from "ai";
import { z } from "zod";
import { ActionFunctionArgs,json } from "@remix-run/node";

export const schema = z.object({
  text: z.string().describe("APIの出力"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const message = await request.text();

    if (!message) {
      return json({ error: "message is required." }, { status: 400 });
    }

    if (!process.env.EXPERIMENTAL_AOAI_KEY) {
      return json(
        { error: "EXPERIMENTAL_AOAI_KEY is not set." },
        { status: 500 }
      );
    }

    const aoai = createAzure({
      resourceName: "gpt-east-us-region",
      apiKey: process.env.EXPERIMENTAL_AOAI_KEY,
    });

    const result = await streamObject({
      model: aoai(process.env.EXPERIMENTAL_AOAI_DEPLOYMENT_NAME),
      prompt: message,
      schema: schema,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in action function:", error);
    return json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
};
