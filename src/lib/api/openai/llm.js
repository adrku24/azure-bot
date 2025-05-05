import { AzureOpenAI } from "openai";

// Environment initialisation
import dotenv from "dotenv";
dotenv.config();

class LLM {

    _model;
    _client;

    constructor() {
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
        const endpoint = process.env.AZURE_OPENAI_API_ENDPOINT;
        const deployment = process.env.AZURE_OPENAI_API_DEPLOYMENT;
        const options = { endpoint, apiKey, deployment, apiVersion }

        this._model = process.env.AZURE_OPENAI_API_MODEL_NAME;
        this._client = new AzureOpenAI(options);
    }

    completion(user, system, use_streaming = true) {
        if (user === undefined || user === null) {
            return null;
        }

        const messages = [{
            "role": "user",
            "content": user
        }];

        if (system !== null && system !== undefined) {
            messages.push({
                "role": "system",
                "content": system
            });
        }

        return this._client.chat.completions.create({
            messages: messages,
            max_tokens: 2048,
            temperature: 0.01,
            top_p: 1,
            model: this._model,
            stream: use_streaming
        });
    }
}

export let AzureChatGPT = new LLM();
