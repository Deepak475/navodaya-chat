import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-55P8jg9SibgPcTwbDUdVdl2B",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function runApi() {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "How are you?",
        max_tokens: 7,
        temperature: 0,
    });
    console.log(response.data.choices[0].text);
};

runApi();