<script>
    export let id;
    export let firstName;
    export let lastName;
    export let email;
    export let birthday;

    export let street;
    export let city;
    export let postalCode;
    export let state;
    export let country;
    export let addressType;

    export let phoneNumber;
    export let phoneType;
</script>

<tr class="hover:bg-slate-50">
    <td class="p-4">
        <p class="text-sm font-bold">
            {id}
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {firstName}
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {lastName}
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {email}
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {birthday}
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {street} in {city}<br>
            {postalCode} {state}<br>
            {country} ({addressType})
        </p>
    </td>
    <td class="p-4">
        <p class="text-sm">
            {phoneNumber}<br>
            ({phoneType})
        </p>
    </td>
</tr>
