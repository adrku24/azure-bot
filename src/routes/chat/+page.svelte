<script>
    import PromptArea from "$lib/components/PromptArea.svelte";

    export let messages = [];
    export let generating = false;
    export let temp = "";

    function addMessage(who, message) {
        messages.push({
            time: Date.now(),
            who: who,
            message: message
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
                "Content-Type": "application/json"
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
            }

            temp = temp + text;
        }
    }
</script>

<div class="md:border md:border-teal-950 md:rounded md:m-5 md:mx-50">
    <div class="message-box mt-2 mx-4">
        {#if messages.length > 0}
            {#each messages as message}
                {#if message.who === "user"}
                    <div class="flex items-start gap-2.5 my-4 ml-5 mb-1">
                        <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese User"/>
                        <div class="shadow-md rounded mr-5 p-3">
                            <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span class="text-sm font-semibold text-gray-900">Sie</span>
                                    <span class="text-sm font-normal text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                                </div>
                                <p class="text-sm font-normal py-2 text-gray-900 text-left">{message.message}</p>
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
                                <p class="text-sm font-normal py-2 text-gray-900 text-left">{message.message}</p>
                            </div>
                        </div>
                        <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese Bot"/>
                    </div>
                {/if}
            {/each}
        {:else}
            <div class="flex items-start gap-2.5 place-content-end text-end mr-5 mb-1">
                <div class="shadow-md rounded ml-5 p-3">
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                        <div class="space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900">System</span>
                        </div>
                        <p class="text-sm font-normal py-2 text-gray-900 text-left">Willkommen im Serviceportal für Benutzerkonten. Dieser Assistent begleitet Sie schrittweise und benutzerfreundlich durch den Registrierungsprozess. Zudem ist das System mit den Charakteristika aller verfügbaren Kontomodelle vertraut und steht Ihnen für Anfragen hierzu zur Verfügung.</p>
                    </div>
                </div>
                <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese Bot"/>
            </div>
        {/if}

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
                <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese Generating">
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
