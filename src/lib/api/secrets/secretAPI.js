import { SecretClient } from "@azure/keyvault-secrets";
import { ClientSecretCredential } from "@azure/identity";

import dotenv from "dotenv";
import {building} from "$app/environment";
dotenv.config();

class SecretAPI {

    _client;

    constructor() {
        const keyVault = "https://" + process.env.KEY_VAULT_NAME + ".vault.azure.net";
        const credential = new ClientSecretCredential(process.env.TENNANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);
        this._client = new SecretClient(keyVault, credential);
    }

    async getSecret(name) {
        return await this._client.getSecret(name);
    }
}

class BuildSecretAPI {
    constructor() {}

    async getSecret(name) {
        return "";
    }
}

let SECRETS;
if(!building) {
    SECRETS = new SecretAPI();
} else {
    SECRETS = new BuildSecretAPI();
}

export { SECRETS };
