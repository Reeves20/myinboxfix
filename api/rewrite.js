import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request) {
  try {
    const { emailText, tone, purpose } = await request.json();

    if (!emailText || !tone || !purpose) {
      return NextResponse.json({ error: 'Missing input fields' }, { status: 400 });
    }

    const prompt = `
You are a professional writing assistant. Rewrite the following email to improve clarity, tone, and effectiveness.
Use a ${tone} tone. The purpose of the email is: ${purpose}.
Original Email:
${emailText}
Rewritten Email:
`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    if (!response.data || !response.data.choices || !response.data.choices.length) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 502 });
    }

    const rewrittenEmail = response.data.choices[0].text.trim();
    return NextResponse.json({ rewrittenEmail });
  } catch (error) {
    console.error('Rewrite API Error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      {
        error: 'Something went wrong while processing your request. Please try again or check your API key and input content.',
      },
      { status: 500 }
    );
  }
}
