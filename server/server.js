import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";
const PORT = process.env.PORT || 7000;

dotenv.config();

const configuration = new Configuration({
    organization: "org-55P8jg9SibgPcTwbDUdVdl2B",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send(
        {message: 'Hello from Codex!'}
    );
    
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        async function modelApi() {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 3000,
                temperature: 0,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            });
            res.status(200).send({
                bot: response.data.choices[0].text,
            });
        }
        modelApi();
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} and listening on http://localhost:${PORT}`);
})