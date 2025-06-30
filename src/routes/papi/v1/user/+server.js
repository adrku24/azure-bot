import { json } from "@sveltejs/kit";
import { Unlock } from "$lib/api/unlock/unlock.js";
import { UserService } from "$lib/api/user/service/userService.js";

export async function GET({ cookies }) {
    const accessToken = cookies.get("access_token");
    if(!accessToken || !(await Unlock.isAccessTokenStillValid(accessToken))) {
        return json(undefined, { status: 403 });
    }

    return json(await UserService.getAllUsers(), { status: 200 });
}
