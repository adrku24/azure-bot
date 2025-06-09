import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    if(!locals.auth) {
        throw redirect(303, '/');
    }
}
