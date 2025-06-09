import { databaseConnection, DatabaseConnection } from "./lib/api/database/database.js";
import { building } from "$app/environment";
import {Unlock} from "$lib/api/unlock/unlock.js";

if(!building) {
    databaseConnection.createTables();
}

export async function handle({ event, resolve }) {
    const { url, cookies } = event;

    // Remove annoying chrome devtools error
    if (url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
        return new Response(null, { status: 204 });
    }

    if (url.pathname.startsWith('/api')) {
        return resolve(event);
    }

    const accessToken = cookies.get("access_token");

    let loggedIn = false;
    if(accessToken) {
        loggedIn = await Unlock.isAccessTokenStillValid(accessToken);
    }

    event.locals.auth = loggedIn;
    return resolve(event);
}
