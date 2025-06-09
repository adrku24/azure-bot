import { json } from "@sveltejs/kit";
import { Unlock } from "$lib/api/unlock/unlock.js";

import dotenv from "dotenv";
dotenv.config();

export async function POST({ request }) {
    const { password } = await request.json();

    if(password !== process.env.UNLOCK) {
        return json(undefined, { status: 403 });
    } else {
        return json({ access_token: await Unlock.createNewAccessToken() }, { status: 200 });
    }
}
