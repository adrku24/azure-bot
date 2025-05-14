export class JsonUserMatcher {

    static matches(json) {
        if(!
            (
                JsonUserMatcher._includes(json, "first_name") &&
                JsonUserMatcher._includes(json, "last_name") &&
                JsonUserMatcher._includes(json, "birthday") &&
                JsonUserMatcher._includes(json, "address") &&
                JsonUserMatcher._includes(json, "email") &&
                JsonUserMatcher._includes(json, "phone") &&
                JsonUserMatcher._includes(json, "confirmation_message")
            )
        ) return false;

        const address = json["address"];

        if(!
            (
                JsonUserMatcher._includes(address, "street_address") &&
                JsonUserMatcher._includes(address, "city") &&
                JsonUserMatcher._includes(address, "state_province") &&
                JsonUserMatcher._includes(address, "postal_code") &&
                JsonUserMatcher._includes(address, "country") &&
                JsonUserMatcher._includes(address, "address_type")
            )
        ) return false;

        const phone = json["phone"];
        return JsonUserMatcher._includes(phone, "phone_number") && JsonUserMatcher._includes(phone, "phone_type");
    }

    static _includes(json, value) {
        const temp = json[value];
        return temp !== null && temp !== undefined;
    }
}
