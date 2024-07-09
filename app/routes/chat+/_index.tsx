import { experimental_useObject as useObject } from "@ai-sdk/react";
import { schema } from "./api";


export default function Index() {
  const { submit, isLoading, object } = useObject({
    api: "/chat/api",
    method: "POST", // POSTメソッドを明示的に指定
    schema,
  });

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const prompt = "please explain the concept of time.";
          console.log(submit);
          submit(prompt);
        }}
        className="flex w-full flex-col gap-4 rounded-md border border-zinc-200 p-4"
      >
        <label htmlFor="message">message:</label>
        <input type="text" id="message" name="message" />
        <button type="submit">Submit</button>
      </form>
      {object && (
        <div>
          <h2>Streamed Text:</h2>
          <p>{object?.text}</p>
        </div>
      )}
    </div>
  );
}
