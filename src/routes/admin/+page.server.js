import { redirect } from "@sveltejs/kit";

export async function load({ fetch, locals }) {
    if(!locals.auth) {
        throw redirect(303, '/');
    }

    const users = await fetch("/papi/v1/user", { method: "GET" }).then(async (response) => await response.json());
    return { users: users };
}


