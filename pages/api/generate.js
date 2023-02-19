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
  const expected = req.body.expected || '';
  if (sentence.trim().length === 0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a any sentence",
      }
    });
    return;
  }

  if (expected.trim().length === 0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a any expected",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(sentence, expected),
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

function generatePrompt(sentence, expected) {
  return `If you see bad grammar in my sentences, give me advice by applying the following rules
  rules
  Input = 한글 문장
  Expected = 내가 한글 문장을 영어로 번역한거
  Result = 너가 생각하는 좋은 영어 문장
  Explanation(each explanation as bullet form) = 고쳐야 하는 이유 상세하게 영어권 관점에서 설명 (왜 적절한지 영어권 사람들의 생각 관점에서도 설명해줘)
  
  Input: ${sentence}
  Expected: ${expected}
  `;
}
