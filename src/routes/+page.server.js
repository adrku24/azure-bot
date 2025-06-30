import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    if(locals.auth) {
        throw redirect(303, '/chat');
    }
}

export const actions = {

    signin: async ({ cookies, request, fetch }) => {
        const formData = await request.formData();
        const password = formData.get("password");

        const response = await fetch("/papi/v1/unlock", {
            method: "POST",
            body: JSON.stringify({
                password: password
            })
        });

        if(response.status !== 200) {
            return { not_accepted: true };
        }

        const data = await response.json();
        cookies.set("access_token", data.access_token.token, { path: '/', expires: new Date(data.access_token.expiration) });

        redirect(302, '/chat');
    }
}
