import fs from 'node:fs';
import {json, text} from '@sveltejs/kit';
import { AzureChatGPT } from "$lib/api/openai/llm.js";
import {JsonExtractor} from "$lib/api/jsonExtractor.js";
import {JsonUserMatcher} from "$lib/api/user/jsonUserMatcher.js";
import {UserAddress} from "$lib/api/user/entity/userAddress.js";
import {UserPhone} from "$lib/api/user/entity/userPhone.js";
import {User} from "$lib/api/user/entity/user.js";
import {UserService} from "$lib/api/user/service/userService.js";
import {Unlock} from "$lib/api/unlock/unlock.js";

// Chat assistant configuration
const SYSTEM_PROMPT = fs.readFileSync("llm/system/system_prompt.txt", { encoding: 'utf8' });

export async function POST({ request, cookies }) {
    const accessToken = cookies.get("access_token");
    if(!accessToken || !(await Unlock.isAccessTokenStillValid(accessToken))) {
        return text("No Permission.", { status: 403 });
    }

    const { prompt, conversation } = await request.json();

    if(!prompt) {
        return json(undefined, { status: 400 });
    }

    let messages = [];
    if(conversation !== null && conversation !== undefined && conversation instanceof Array) {
        for(let i = 0; i < conversation.length; i++) {
            const role = conversation[i].role;
            if(role === null || role === undefined) continue;

            const content = conversation[i].content;
            if(content === null || content === undefined) continue;

            messages.push({
                "role": role.toUpperCase() === "USER" ? "user" : "assistant",
                "content": content
            });
        }
    }

    const modifiedSystemPrompt = SYSTEM_PROMPT.replace("{accounts}", JSON.stringify(await UserService.prepareForSystemPrompt()));

    let streamIterator;
    try {
        streamIterator = await AzureChatGPT.completion(prompt, modifiedSystemPrompt, messages, true);
    } catch (e) {
        return text(e.error.message, { status: 400 });
    }

    if(streamIterator === null) return json(undefined, { status: 400 });

    let middleMan = "";
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                let inserted = false;

                for await (const chunk of streamIterator) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        middleMan = middleMan + content;
                        controller.enqueue(encoder.encode(content));
                    } else {
                        const json = JsonExtractor.extract(middleMan);
                        for(let i = 0; i < json.length && !inserted; i++) {
                            const match = json[i];
                            if(JsonUserMatcher.matches(match)) {
                                const jsonAddress = match["address"];

                                const address = new UserAddress(
                                    null,
                                    jsonAddress["street_address"],
                                    jsonAddress["city"],
                                    jsonAddress["state_province"],
                                    jsonAddress["postal_code"],
                                    jsonAddress["country"],
                                    jsonAddress["address_type"]
                                );

                                const jsonPhone = match["phone"];
                                const phone = new UserPhone(
                                    null,
                                    jsonPhone["phone_number"],
                                    jsonPhone["phone_type"]
                                );

                                const user = new User(
                                    null,
                                    match["first_name"],
                                    match["last_name"],
                                    match["birthday"],
                                    address,
                                    match["email"],
                                    phone
                                );

                                await UserService.insertUser(user);
                            }
                        }
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
