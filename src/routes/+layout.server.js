export async function load({ locals }) {
    return { renderExtraHeader: locals.auth }
}
