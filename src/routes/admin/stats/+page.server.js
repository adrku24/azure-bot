import { redirect } from "@sveltejs/kit";

export async function load({ fetch, locals }) {
    if(!locals.auth) {
        throw redirect(303, '/');
    }

    let stats = await fetch("/papi/v1/stats", {
        method: "GET"
    }).then(async (response) => await response.json());

    stats.sort((a, b) => b.timestamp - a.timestamp);
    let amountOfWords = 0;
    let bagOfWords = {};

    for(let i = 0; i < stats.length; i++) {
        const words = stats[i].text.replaceAll(/[^A-Za-zäüöß ]/gm, "").trim().split(/\s+/).filter(w => w.length > 0);
        for(let word of words) {
            if(bagOfWords[word]) {
                bagOfWords[word] += 1;
            } else {
                bagOfWords[word] = 1;
            }
        }

        amountOfWords += words.length;
    }

    bagOfWords = Object.keys(bagOfWords).sort().reduce(
        (obj, key) => {
            obj[key] = bagOfWords[key];
            return obj;
        }, {}
    );

    let lastAccess = [];
    for(let i = 0; i < Math.min(10, stats.length); i++) {
        lastAccess.push(stats[i]);
    }

    return {
        lastAccess: lastAccess,
        bagOfWords: bagOfWords,
        amountOfWords: amountOfWords,
        stats: stats
    };
}


