import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const sentence = req.body.sentence || '';
  if (sentence.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a any sentence",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(sentence),
      temperature: 0.1,
      max_tokens: 2000
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion.data.choices)
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(sentence) {
  return `If you see bad grammar in my sentences, give me advice by applying the following rules
  rules
  1. Write a solution to each incorrect statement in bullet format 
  2. If the input given to you is a success, it will be labeled as such. Correct Sentence: The given input value
  3. Explain the etymology of why this is a good phrase (put the etymology in brackets).
  4. Grammatically, if something is good to know, write it in (To know: ~)
  5. Give each answer as a bullet
  
  sentence: ${sentence}
  `;
}
