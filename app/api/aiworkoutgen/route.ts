import Together from "together-ai";
import { NextResponse } from 'next/server';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST() {
  try {
    const response = await together.chat.completions.create({
      messages: [{ "role": "user", "content": "give me a 1 week push pull legs workout plan in structured format." }],
      model: "meta-llama/Llama-Vision-Free",
    });

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      console.log(content)
      return NextResponse.json({ content });
    } else {
      return NextResponse.json({ error: 'No valid response from the model' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error occurred during API call' }, { status: 500 });
  }
}