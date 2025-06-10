<script>
    import PromptArea from "$lib/components/PromptArea.svelte";
    import showdown from "showdown";

    export let messages = [];
    export let generating = false;
    export let temp = "";

    function addMessage(who, message) {
        const converter = new showdown.Converter(), html = converter.makeHtml(message);

        messages.push({
            time: Date.now(),
            who: who,
            message: html
        });

        // Force SvelteKit to update and rerender the page.
        messages = messages;
    }

    async function sendPrompt() {
        if (generating) return;
        generating = true;

        const prompt = document.getElementById("prompt").textContent;
        if (!prompt) return;

        const conversation = messages.map(message => {
            return {
                role: message.who,
                content: message.message
            }
        });

        addMessage("user", prompt);
        document.getElementById("prompt").textContent = "";

        const stream = await fetch("/api/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookies": document.cookies
            },
            body: JSON.stringify({
                prompt: prompt,
                conversation: conversation
            })
        });

        const reader = stream.body.getReader();
        const decoder = new TextDecoder();

        let max = 2048; // We use 2048 max tokens for each LLM answer, therefore this is our upper limit
        while (max > 0) { // Not a big fan of "while(true)"
            max--;

            const { value, done } = await reader.read();
            const text = decoder.decode(value);

            if(done) {
                generating = false;
                addMessage("system", temp);
                temp = "";
                break;
            } else {
                if(text.startsWith("!>0<!")) {
                    temp = text.replace("!>0<!", "");
                }
            }

            temp = temp + text;
        }
    }
</script>

<div class="md:shadow md:shadow-teal-950 md:rounded md:mt-10 md:mx-50 mt-10">
    <div class="message-box mt-2 mx-4">
        <div class="flex items-start gap-2.5 place-content-end text-end mr-5 mb-1 mt-2">
            <div class="shadow-md rounded ml-5 p-3">
                <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                    <div class="space-x-2 rtl:space-x-reverse">
                        <span class="text-sm font-semibold text-gray-900">System</span>
                    </div>
                    <p class="text-sm font-normal py-2 text-gray-900 text-left">Willkommen im Serviceportal für Benutzerkonten. Dieser Assistent begleitet Sie schrittweise und benutzerfreundlich durch den Registrierungsprozess. Zudem ist das System mit den Charakteristika aller verfügbaren Kontomodelle vertraut und steht Ihnen für Anfragen hierzu zur Verfügung.</p>
                </div>
            </div>
            <img class="w-8 h-8 rounded-full" src="/chatbot_system.png" alt="Chat Bot"/>
        </div>

        {#each messages as message}
            {#if message.who === "user"}
                <div class="flex items-start gap-2.5 my-4 ml-5 mb-1">
                    <div class="w-8 h-8 rounded-full">
                        <svg width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                            <path d="M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z"></path>
                        </svg>
                    </div>
                    <div class="shadow-md rounded mr-5 p-3">
                        <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span class="text-sm font-semibold text-gray-900">Sie</span>
                                <span class="text-sm font-normal text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                            </div>
                            <div class="text-sm font-normal py-2 text-gray-900 text-left">{@html message.message}</div>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="flex items-start gap-2.5 place-content-end text-end mr-5 mb-1">
                    <div class="shadow-md rounded ml-5 p-3">
                        <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                            <div class="space-x-2 rtl:space-x-reverse">
                                <span class="text-sm font-normal text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                                <span class="text-sm font-semibold text-gray-900">Chatbot</span>
                            </div>
                            <div class="text-sm font-normal py-2 text-gray-900 text-left">{@html message.message}</div>
                        </div>
                    </div>
                    <img class="w-8 h-8 rounded-full" src="/chatbot.png" alt="Chat Bot"/>
                </div>
            {/if}
        {/each}

        {#if generating}
            <div class="flex items-start gap-2.5 place-content-end text-end mr-5 mb-1">
                <div class="shadow-md rounded ml-5 p-3">
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                        <div class="space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900">Chatbot</span>
                        </div>
                        <p class="text-sm font-normal py-2 text-gray-900">{temp}</p>
                        <span class="text-sm font-normal text-gray-500 flex place-content-end">Generating ...
                            <svg class="ml-2 size-4 mt-1 animate-spin text-white" fill="#ffffff" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#000000" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    </div>
                </div>
                <img class="w-8 h-8 rounded-full" src="/chatbot.png" alt="Chat Bot"/>
            </div>
        {/if}
    </div>

    <PromptArea sendFunction={sendPrompt} generating={generating} num={messages.length} />
</div>

<style>
    .message-box {
        overflow: auto !important;
        max-height: calc(100vh - 310px);
    }
</style>
