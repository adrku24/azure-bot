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

    const download = () => {
        const content = JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            birthday: birthday,
            address: {
                street: street,
                city: city,
                postalCode: postalCode,
                state: state,
                country: country,
                addressType: addressType
            },
            phone: {
                phoneNumber: phoneNumber,
                phoneType: phoneType
            }
        }, null, 4);

        const blob = new Blob([content]);
        const a = document.createElement('a');
        document.body.append(a);
        a.download = firstName + "-" + lastName + ".json";
        a.href = URL.createObjectURL(blob);
        a.click();
        a.remove();
    }
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
    <td class="p-4">
        <button class="text-sm hover:cursor-pointer" onclick={() => download()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
        </button>
    </td>
</tr>
