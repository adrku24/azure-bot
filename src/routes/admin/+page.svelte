<script>
    import UserListItem from "$lib/components/UserListItem.svelte";
    import { onMount } from "svelte";
    import CloudLoadingAnimation from "$lib/components/CloudLoadingAnimation.svelte";

    let initialLoading = $state(true);
    let reloading = $state(false);
    let users = $state([]);
    let showing = $state([]);

    const reload = async () => {
        if(reloading) return;

        reloading = true;
        users = await fetch("/api/v1/user", {
            method: "GET",
            headers: {"Cookies": document.cookies}
        }).then(async (response) => await response.json());
        updateShowing();
        reloading = false;
    }

    const updateShowing = () => {
        const filter = document.getElementById("filter").value;
        if(!filter || filter.length === 0) {
            showing = users;
        } else {
            showing = users.filter(user => {
                if(user._email.includes(filter) || user._firstName.includes(filter) || user._lastName.includes(filter) || user._birthday.includes(filter)) {
                    return user;
                }

                const phone = user._phone;
                if(phone._phoneNumber.includes(filter) || phone._phoneType.includes(filter)) {
                    return user;
                }

                const address = user._address;
                if(address._streetAddress.includes(filter) || address._city.includes(filter) || address._stateProvince.includes(filter) || address._postalCode.includes(filter) || address._country.includes(filter) || address._addressType.includes(filter)) {
                    return user;
                }
            });
        }
    }

    onMount(async () => {
        await reload();
        initialLoading = false;
    });
</script>

<div class="flex h-screen">
    <div class="mt-20 mx-auto mb-auto">
        <div class="flex place-content-center mb-5">
            <div class="w-full max-w-sm min-w-[200px]">
                <a href="/admin/stats" class="w-full text-right flex hover:text-blue-500 underline hover:cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1 mr-1">
                        <path d="m10 18 3-3-3-3"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        <path d="M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7"/>
                    </svg>
                    Statistiken
                </a>

                <input oninput={() => updateShowing()} id="filter" class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Suche">
            </div>

            <button class="ml-2 hover:cursor-pointer" onclick={async () => await reload()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
            </button>
        </div>

        {#if reloading || initialLoading}
            <div class="flex mt-10">
                <div class="mx-auto">
                    <CloudLoadingAnimation/>
                </div>
            </div>

            <div class="mx-auto">
                <p class="text-center">Daten werden geladen...</p>
            </div>
        {:else}
            {#if showing.length > 0}
                <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                    <table class="w-full text-left table-auto min-w-max text-slate-800">
                        <thead>
                        <tr class="text-slate-500 border-b border-slate-300 bg-slate-50">
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    ID
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Vorname
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Nachname
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Email
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Geburtstag
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Adresse
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Telefon
                                </p>
                            </th>
                            <th class="p-4">
                                <p></p>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each showing as user}
                            <UserListItem
                                id={user._id}
                                firstName={user._firstName}
                                lastName={user._lastName}
                                birthday={user._birthday}
                                email={user._email}
                                street={user._address._streetAddress}
                                postalCode={user._address._postalCode}
                                state={user._address._stateProvince}
                                city={user._address._city}
                                country={user._address._country}
                                addressType={user._address._addressType}
                                phoneNumber={user._phone._phoneNumber}
                                phoneType={user._phone._phoneType}
                            />
                        {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                {#if users.length > 0}
                    <p class="text-xl font-bold">Die Filtereinstellungen gaben eine leere Liste zurück.</p>
                {:else}
                    <p class="text-xl font-bold">Es existieren noch keine Benutzer.</p>
                {/if}
            {/if}
        {/if}
    </div>
</div>
