import fs from 'node:fs';
import { json } from '@sveltejs/kit';
import { AzureChatGPT } from "$lib/api/openai/llm.js";

// Chat assistant configuration
const SYSTEM_PROMPT = fs.readFileSync("llm/system/system_prompt.txt", { encoding: 'utf8' });

export async function POST({ request }) {
    const { prompt, conversation } = await request.json();

    if(!prompt) {
        return json(undefined, { status: 400 });
    }

    let modifiedConversation = "";
    if(conversation !== null && conversation !== undefined && conversation instanceof Array) {
        for(let i = 0; i < conversation.length; i++) {
            const role = conversation[i].role;
            if(role === null || role === undefined) continue;

            const content = conversation[i].content;
            if(content === null || content === undefined) continue;

            modifiedConversation = modifiedConversation + "\n" + role.toUpperCase() + ":" + content;
        }
    }

    // TODO: add accounts to system prompt
    let pseudoAccounts = JSON.stringify([{
        first_name: "Robert",
        last_name: "Burgers",
        email: "robert.burgers@gmail.com"
    }]);

    const modifiedSystemPrompt = SYSTEM_PROMPT
        .replace("{accounts}", pseudoAccounts)
        .replace("{conversation}", modifiedConversation);

    const streamIterator = await AzureChatGPT.completion(prompt, modifiedSystemPrompt, true);
    if(streamIterator === null) return json(undefined, { status: 400 });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of streamIterator) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(encoder.encode(content));
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        },

        cancel() {
            console.warn("Stream cancelled by client.");
        }
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
        }
    });
}
