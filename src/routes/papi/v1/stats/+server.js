import { Unlock } from "$lib/api/unlock/unlock.js";
import { json } from "@sveltejs/kit";
import {LLMStats} from "$lib/api/statistics/llmStats.js";

export async function GET({ cookies }) {
    const accessToken = cookies.get("access_token");
    if(!accessToken || !(await Unlock.isAccessTokenStillValid(accessToken))) {
        return json(undefined, { status: 403 });
    }

    return json(await LLMStats.getStatistic(), { status: 200 });
}
