<script>
    export let sendFunction;
    export let generating;
    export let num;
</script>

<div class="w-full align-middle pb-0.5">
    <div class="bg-white shadow shadow-teal-950 rounded m-2 mt-2">
        <div class="flex w-full flex-col overflow-hidden bg-surface-alt text-on-surface has-[p:focus]:outline-2 has-[p:focus]:rounded has-[p:focus]:outline-offset-2 has-[p:focus]:outline-primary dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark dark:has-[p:focus]:outline-primary-dark">
            <div class="p-1">
                <p id="promptLabel" class="pb-0.5 pl-1 text-sm font-bold text-on-surface opacity-60 dark:text-on-surface-dark">Prompt</p>
                <div class="scroll-on h-24 w-full overflow-y-auto px-1 py-0.5 focus:outline-hidden" role="textbox" aria-labelledby="promptLabel" tabindex="0" id="prompt" contenteditable="{!generating}"></div>
            </div>

            <div class="flex w-full items-center justify-end gap-2 px-1 py-1">
                {#if num <= 0}
                    <button class="text-xs md:text-sm mb-1 bg-transparent hover:bg-teal-800 text-teal-700 font-semibold hover:text-white py-1 px-4 border border-teal-500 hover:border-transparent rounded hover:cursor-pointer" onclick={
                        () => document.getElementById("prompt").textContent = "Hallo"
                    }>
                        Beginne eine Konversation
                    </button>
                {/if}

                <button class="text-xs md:text-sm mb-1 bg-transparent hover:bg-teal-800 text-teal-700 font-semibold hover:text-white py-1 px-4 border border-teal-500 hover:border-transparent rounded hover:cursor-pointer">
                    Liste alle Accounts
                </button>

                <button class="mb-1 rounded-radius p-1 text-on-surface/75 hover:bg-surface-dark/10 hover:text-on-surface focus:outline-hidden focus-visible:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary active:bg-surface-dark/5 active:-outline-offset-2 dark:text-on-surface-dark/75 dark:hover:bg-surface/10 dark:hover:text-on-surface-dark dark:focus-visible:text-on-surface-dark dark:focus-visible:outline-primary-dark dark:active:bg-surface/5 hover:{generating ? 'cursor-wait' : 'cursor-pointer'}" title="Use Voice" aria-label="Use Voice">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
                        <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                        <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
                    </svg>
                </button>

                <button class="mr-3 mb-1 hover:{generating ? 'cursor-wait' : 'cursor-pointer'}" aria-label="Senden" onclick={sendFunction}>
                    <svg width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
