import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function explainError(errorText: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You're a senior dev helping fix code errors." },
          { role: "user", content: `What does this error mean?\n\n${errorText}` },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err: any) {
    return `❌ Failed to fetch explanation: ${err.message}`;
  }
}
