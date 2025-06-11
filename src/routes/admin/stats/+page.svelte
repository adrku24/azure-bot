<script>
    import {jsPDF} from "jspdf";

    let { data } = $props();

    const download = async () => {
        const doc = new jsPDF("p", "pt", "letter");

        let lineIndex = 0;
        doc.text("THB Azure Bot", 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
        lineIndex++;
        doc.text("Statistiken abgerufen am: " + new Date().toLocaleString(), 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
        lineIndex++;
        lineIndex++;
        doc.text("Die letzten Zugriff auf den Bot:", 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
        lineIndex++;
        for(let i = 0; i < data.lastAccess.length; i++) {
            doc.text("- " + new Date(parseInt(data.lastAccess[i].timestamp)).toLocaleString() + ": " + data.lastAccess[i].text, 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
            lineIndex++;
        }

        lineIndex++;
        doc.text("Bag of Words:", 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
        lineIndex++;

        for(let key of Object.keys(data.bagOfWords)) {
            const value = data.bagOfWords[key];
            const text = key + ": " + value + " (" + ((value / data.amountOfWords) * 100).toFixed(3) + "%)";
            doc.text("- " + text, 30, 30 + (20 * lineIndex), { align: "left", maxWidth: 500 });
            lineIndex++;
        }

        doc.save("Statistiken" + "-" + new Date().toISOString() + ".json");
    }
</script>

<div class="flex h-screen" id="pdfContent">
    <div class="mt-10 mx-auto mb-auto">
        <div class="flex justify-center mb-15">
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center hover:cursor-pointer" onclick={async () => await download()}>
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                <span>Download</span>
            </button>
        </div>

        {#if data.stats.length > 0}
            <p class="text-center font-bold text-2xl">Die letzten Zugriff auf den Bot</p>
            <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border mb-20 mt-2">
                <table class="w-full text-left table-auto min-w-max text-slate-800">
                    <thead>
                        <tr class="text-slate-500 border-b border-slate-300 bg-slate-50">
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Zeitpunkt
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Prompt
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.lastAccess as access}
                            <tr class="hover:bg-slate-50">
                                <td class="p-4">
                                    <p class="text-sm font-bold">
                                        {new Date(parseInt(access.timestamp)).toLocaleString()}
                                    </p>
                                </td>
                                <td class="p-4">
                                    <p class="text-sm">
                                        {access.text}
                                    </p>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <p class="text-center font-bold text-2xl">Bag of Words</p>
            <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border mb-10 mt-2">
                <table class="w-full text-left table-auto min-w-max text-slate-800">
                    <thead>
                        <tr class="text-slate-500 border-b border-slate-300 bg-slate-50">
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Wort
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Vorkommen
                                </p>
                            </th>
                            <th class="p-4">
                                <p class="text-sm leading-none font-normal">
                                    Häufigkeit
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each Object.keys(data.bagOfWords) as word}
                            <tr class="hover:bg-slate-50">
                                <td class="p-4">
                                    <p class="text-sm font-bold">
                                        {word}
                                    </p>
                                </td>
                                <td class="p-4">
                                    <p class="text-sm">
                                        {data.bagOfWords[word]}
                                    </p>
                                </td>
                                <td class="p-4">
                                    <p class="text-sm">
                                        {((data.bagOfWords[word] / data.amountOfWords) * 100).toFixed(3)}%
                                    </p>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p class="text-xl font-bold">Es existieren noch keine Statistiken.</p>
        {/if}
    </div>
</div>
