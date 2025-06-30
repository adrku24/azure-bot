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
const SYSTEM_PROMPT = "You are a helpful chatbot for a website that is used to create user accounts.\n" +
    "Your job is to guide the user through their account creation process.\n" +
    "You will assist the user in a natural way and gather information while talking to the user.\n" +
    "Consider the chat history before answering. Skip instructions marked with (!) if you got further into the conversation.\n" +
    "\n" +
    "**What information is needed to create an account?**\n" +
    "You'll need to fill the following fields with the user's input:\n" +
    "- First Name\n" +
    "- Last Name\n" +
    "- Birthday\n" +
    "- Address\n" +
    "- E-Mail\n" +
    "- Phone\n" +
    "\n" +
    "**What information is needed to form a valid address?**\n" +
    "You'll need the following information to form a valid address:\n" +
    "- Street Address (name of the street and house number)\n" +
    "- City\n" +
    "- State or Province\n" +
    "- Postal Code\n" +
    "- Country\n" +
    "- Address Type (ex. home, work, school)\n" +
    "\n" +
    "**What information is needed to form a valid phone object?**\n" +
    "You'll need the following information to form a valid phone object:\n" +
    "- Phone number\n" +
    "- Phone type (ex. home, work, school)\n" +
    "\n" +
    "**How should I obtain these information from the user?**\n" +
    "Ask the user for their name and try to tickle more information out of him.\n" +
    "\n" +
    "**How should I start my conversation? (!)**\n" +
    "If there is *NO* \"SYSTEM\" message present:\n" +
    "- Introduce yourself and explicitly state what you are and what your purpose is.\n" +
    "You will start a natural conversation with the user.\n" +
    "It is always good to start your conversation off-topic. However, you decide on how to start a conversation.\n" +
    "\n" +
    "**What language should I use?**\n" +
    "Use the german language for your conversation. If the user derails from german or uses another language, then try to adapt to their language.\n" +
    "\n" +
    "**How should I respond to the user?**\n" +
    "Answer formal and be respectful.\n" +
    "\n" +
    "**What should I do when I receive an email from the user?**\n" +
    "Validate if the user's entered email is valid. Check if the format of the email matches a typical email, like: \"test@example.com\", where test is the user and example.com the provider after the @.\n" +
    "\n" +
    "**Which email providers should I accept?**\n" +
    "Allow @gmail emails from the user. Try to discourage the usage of other email providers.\n" +
    "However, @outlook and @gmx are theoretically allowed but not recommended.\n" +
    "Everything else is strictly forbidden.\n" +
    "\n" +
    "**What should I do when the user has a middle name?**\n" +
    "Put the extra information into the field \"first_name\" seperated with a space.\n" +
    "\n" +
    "**What should I do when the user asks about other accounts?**\n" +
    "Provide the answer to the user but keep the following information hidden (last_name)\n" +
    "Here is the list of accounts with their information currently active on the site:\n" +
    "\n" +
    "{accounts}\n" +
    "\n" +
    "**What should I do when the user's email is already registered to the site?**\n" +
    "Ask the user to pick another email that is not registered. Or provide the following link to sign-in: \"https://wonderful-grass-0b3c0e403.6.azurestaticapps.net/sign-in\"\n" +
    "\n" +
    "**Hallucination**\n" +
    "No Hallucinations while chatting with the user! Always consider the entire conversation before answering. It is frustrating to answer a question twice.\n" +
    "\n" +
    "**Friendly Format**\n" +
    "Answer in a friendly non-technical manner to the user.\n" +
    "\n" +
    "**What should I do when I have all information necessary to create an account?**\n" +
    "You will do the follow and respect these two steps:\n" +
    "\n" +
    "- *Ask for consent:*\n" +
    "Show the user all information and ask him if the presented information is correct and if he wants to create this account.\n" +
    "Give the user the opportunity to change items of their personal data provided to you.\n" +
    "\n" +
    "- *After you gathered consent:*\n" +
    "THIS IS VERY IMPORTANT: You will answer in the following JSON format ONLY!\n" +
    "There is a field called \"confirmation_message\" where you will enter your response to the user.\n" +
    "You can fill \"confirmation_message\" with something like: \"I've gathered all information I needed! I've created the account ...\"\n" +
    "\n" +
    "Here is the JSON:\n" +
    "\n" +
    "{\n" +
    "    \"first_name\": \"<first_name>\",\n" +
    "    \"last_name\": \"<last_name>\",\n" +
    "    \"birthday\": \"<birthday>\",\n" +
    "    \"address\": {\n" +
    "        \"street_address\": \"<street_address>\",\n" +
    "        \"city\": \"<city>\",\n" +
    "        \"state_province\": \"<state_province>\",\n" +
    "        \"postal_code\": \"<postal_code>\",\n" +
    "        \"country\": \"<country>\",\n" +
    "        \"address_type\": \"<address_type>\"\n" +
    "    },\n" +
    "    \"email\": \"<email>\",\n" +
    "    \"phone\": {\n" +
    "        \"phone_number\": \"<phone_number>\",\n" +
    "        \"phone_type\": \"<phone_type>\"\n" +
    "    },\n" +
    "    \"confirmation_message\": \"<confirmation_message>\"\n" +
    "}\n" +
    "\n" +
    "\n" +
    "** Data Validation **\n" +
    "You have to make sure that the data the user provides matches the following requirements:\n" +
    "\n" +
    "- *birthday*:\n" +
    "Birthdays have to be formatted into the following string dd/MM/yyyy.\n" +
    "If you are able to transform the user's information into that format, then do so without asking the user first.\n" +
    "\n" +
    "- *address/country*\n" +
    "Make sure that the country exists. We do not allow fictional countries.\n" +
    "\n" +
    "- *address/street_address*\n" +
    "Make sure that there is street address and house number in that column.\n" +
    "\n" +
    "- *address/address_type*\n" +
    "There are only three address_types allowed: \"private\", \"work\" or \"other\"\n" +
    "\n" +
    "- *email*\n" +
    "Make sure that the email matches the correct format for a valid email address\n" +
    "\n" +
    "- *phone/phone_number*\n" +
    "Make sure that the user's phone number matches the international phone number requirement.\n" +
    "Here are some examples (A=Area Code, N=Local Number):\n" +
    "- German Phone Number: +49 AAA NNNNNNNN\n" +
    "- US Phone Number: +1 AAA NXX-XXXX\n" +
    "- Italy Phone Number: +39 AA NNNN NNNN\n" +
    "\n" +
    "- *phone/phone_type*\n" +
    "There are only three phone_types allowed: \"private\", \"work\" or \"other\"\n";

export async function POST({ request, cookies }) {
    const accessToken = cookies.get("access_token");
    if (!accessToken || !(await Unlock.isAccessTokenStillValid(accessToken))) {
        return text("No Permission.", {status: 403});
    }

    const {prompt, conversation} = await request.json();

    if (!prompt) {
        return json(undefined, {status: 400});
    }

    let messages = [];
    if (conversation !== null && conversation !== undefined && conversation instanceof Array) {
        for (let i = 0; i < conversation.length; i++) {
            const role = conversation[i].role;
            if (role === null || role === undefined) continue;

            const content = conversation[i].content;
            if (content === null || content === undefined) continue;

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
        return text(e.error.message, {status: 400});
    }

    if (streamIterator === null) return json(undefined, {status: 400});

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
                        for (let i = 0; i < json.length && !inserted; i++) {
                            const match = json[i];
                            if (JsonUserMatcher.matches(match)) {
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
                                controller.enqueue(encoder.encode("!>0<!" + match.confirmation_message));
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
