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

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that rewrites emails to improve clarity, tone, and effectiveness. Use a ${tone} tone. The purpose of the email is: ${purpose}.`,
      },
      {
        role: "user",
        content: emailText,
      }
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const rewrittenEmail = response.data.choices[0].message.content.trim();
    return NextResponse.json({ rewrittenEmail });
  } catch (error) {
    console.error('Rewrite API Error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      {
        error: 'Something went wrong. Check your API key and model access.',
      },
      { status: 500 }
    );
  }
}
