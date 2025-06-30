import { AzureOpenAI } from "openai";

// Environment initialisation
import { LLMStats } from "$lib/api/statistics/llmStats.js";
import { building } from "$app/environment";

import dotenv from "dotenv";
import {SECRETS} from "$lib/api/secrets/secretAPI.js";
dotenv.config();

class LLM {

    _model;
    _client;

    async constructor() {
        const apiKey = await SECRETS.getSecret("azure-openapi-key");
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
        const endpoint = process.env.AZURE_OPENAI_API_ENDPOINT;
        const deployment = process.env.AZURE_OPENAI_API_DEPLOYMENT;
        const options = {endpoint, apiKey, deployment, apiVersion}

        this._model = process.env.AZURE_OPENAI_API_MODEL_NAME;
        this._client = new AzureOpenAI(options);
    }

    async completion(user, system, conversation = [], use_streaming = true) {
        if (user === undefined || user === null) {
            return null;
        }

        if (system !== null && system !== undefined) {
            conversation = [{
                "role": "system",
                "content": system
            }].concat(conversation)
        }

        conversation.push({
            "role": "user",
            "content": user
        });

        await LLMStats.insertStatistic(user);

        return this._client.chat.completions.create({
            messages: conversation,
            max_tokens: 2048,
            temperature: 0.01,
            top_p: 1,
            model: this._model,
            stream: use_streaming
        });
    }
}

let AzureChatGPT = null;
if(!building) {
    AzureChatGPT = await new LLM();
}
export { AzureChatGPT };
