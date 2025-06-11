<script>
    let { form } = $props();
</script>

<div class="flex h-screen">
    <div class="m-auto">
        <p class="block text-gray-700 font-bold text-center text-2xl">Willkommen</p>
        <p class="block text-gray-700 font-bold mb-2 text-center text-sm">Fordere Zugriff auf die Inhalte dieser Seite an.</p>
        <form action="?/signin" method="POST">
            <div class="flex items-center border-b {form?.not_accepted ? 'border-red-500' : 'border-teal-500'} py-2">
                <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" id="password" type="password" name="password" placeholder="****">
                <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-800 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                    Freischalten
                </button>
            </div>
        </form>
        {#if form?.not_accepted}
            <p class="text-red-500 text-xs italic">Passwort wurde nicht akzeptiert.</p>
        {/if}
    </div>
</div>
