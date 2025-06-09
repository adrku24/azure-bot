import {databaseConnection} from "$lib/api/database/database.js";

export class Unlock {

    static createNewAccessToken = async () => {
        const token = crypto.randomUUID().toString();
        const expiration = Date.now() + (1000 * 60 * 60 * 24 * 3);

        return await databaseConnection.new().then(async connection => {
            await connection.query(
                "INSERT INTO azure_bot_access(access_token, expiration) VALUES (unhex(replace(?, '-', '')), ?)",
                [ token, expiration ]
            ).finally(() => {
                connection.close();
            });

            return {
                token: token,
                expiration: expiration
            }
        });
    }

    static MAX_CACHE_SIZE = 64;
    static CACHE = [];

    static isAccessTokenStillValid = async (accessToken) => {
        if(accessToken.length !== 36) {
            return false; // Not a valid access-token (uuids have a fixed length of 36 chars)
        }

        for(let obj of Unlock.CACHE) {
            if(obj.val === accessToken) {
                return obj.exp > Date.now();
            }
        }

        return await databaseConnection.new().then(async connection => {
            return await connection.query(
                "SELECT * FROM azure_bot_access WHERE access_token = unhex(replace(?, '-', ''));",
                [ accessToken ]
            ).then((rows) => {
                const sqlAnswer = rows[0];

                if(sqlAnswer === null || sqlAnswer === undefined || sqlAnswer.length === 0) {
                    return false;
                }

                const row = sqlAnswer[0];
                if(row) {
                    if(Unlock.CACHE.length > Unlock.MAX_CACHE_SIZE) {
                        Unlock.CACHE.pop();
                        Unlock.CACHE.push({
                            val: row["access_token"],
                            exp: row["expiration"]
                        });
                    }

                    const expiration = row["expiration"] || 0;
                    return expiration > Date.now();
                } else {
                    return false;
                }
            }).finally(() => {
                connection.close();
            });
        });
    }
}
