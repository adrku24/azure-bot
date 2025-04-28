<script>
    export let messages = [];
    export let generating = false;
    export let temp = "That's awesome. I think our ";

    function addMessage(who, message) {
        messages.push({
            time: Date.now(),
            who: who,
            message: message
        });
    }

    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("user", "That's awesome. I think our users will really appreciate the improvements.");
    addMessage("bot", "That's awesome. I think our users will really appreciate the improvements.");
</script>

<div class="md:border md:border-teal-950 md:rounded md:m-5 md:mx-50">
    <div class="message-box mt-2 mx-4">
        {#each messages as message}
            {#if message.who === "user"}
                <div class="flex items-start gap-2.5 my-4 ml-5">
                    <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese image">
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900">Sie</span>
                            <span class="text-sm font-normal text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                        </div>
                        <p class="text-sm font-normal py-2 text-gray-900"> That's awesome. I think our users will really appreciate the improvements.</p>
                    </div>
                </div>
            {:else}
                <div class="flex items-start gap-2.5 place-content-end text-end mr-5">
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5">
                        <div class="space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-normal text-gray-500">{new Date(message.time).toLocaleTimeString()}</span>
                            <span class="text-sm font-semibold text-gray-900">Chatbot</span>
                        </div>
                        <p class="text-sm font-normal py-2 text-gray-900"> That's awesome. I think our users will really appreciate the improvements.</p>
                    </div>
                    <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese image">
                </div>
            {/if}
        {/each}

        {#if generating}
            <div class="flex items-start gap-2.5 place-content-end text-end">
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
                <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Jese image">
            </div>
        {/if}
    </div>

    <div class="w-full align-middle">
        <div class="bg-white border border-black rounded m-2 mt-2">
            <div class="flex w-full flex-col overflow-hidden bg-surface-alt text-on-surface has-[p:focus]:outline-2 has-[p:focus]:rounded has-[p:focus]:outline-offset-2 has-[p:focus]:outline-primary dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark dark:has-[p:focus]:outline-primary-dark">
                <div class="p-1">
                    <p id="promptLabel" class="pb-0.5 pl-1 text-sm font-bold text-on-surface opacity-60 dark:text-on-surface-dark">Prompt</p>  <!-- Reduced padding -->
                    <textarea name="promptText" rows="2" hidden></textarea>
                    <div class="scroll-on max-h-32 w-full overflow-y-auto px-1 py-0.5 focus:outline-hidden" role="textbox" aria-labelledby="promptLabel" contenteditable></div> <!-- Reduced padding and height -->
                </div>

                <div class="flex w-full items-center justify-end gap-2 px-1 py-1">
                    <button class="rounded-radius p-1 text-on-surface/75 hover:bg-surface-dark/10 hover:text-on-surface focus:outline-hidden focus-visible:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary active:bg-surface-dark/5 active:-outline-offset-2 dark:text-on-surface-dark/75 dark:hover:bg-surface/10 dark:hover:text-on-surface-dark dark:focus-visible:text-on-surface-dark dark:focus-visible:outline-primary-dark dark:active:bg-surface/5 hover:cursor-pointer" title="Use Voice" aria-label="Use Voice">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
                            <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                            <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .message-box {
        overflow: auto !important;
        max-height: calc(100vh - 250px);
    }
</style>
