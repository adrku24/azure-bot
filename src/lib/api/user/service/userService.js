import { databaseConnection } from "$lib/api/database/database.js";
import { User } from "$lib/api/user/entity/user.js";
import { UserAddress } from "$lib/api/user/entity/userAddress.js";
import { UserPhone } from "$lib/api/user/entity/userPhone.js";

export class UserService {

    static getAllUsers = async () => {
        return await databaseConnection.new().then(async connection => {
            return await connection.query("SELECT" +
                " u.*," +
                " a.*," +
                " p.* "  +
                "FROM" +
                " azure_bot_user AS u " +
                "LEFT JOIN" +
                " azure_bot_user_addresses AS a ON a.user_id = u.id " +
                "LEFT JOIN" +
                " azure_bot_user_phone_numbers AS p ON p.user_id = u.id;"
            ).then((rows) => {
                const sqlAnswer = rows[0];

                if(sqlAnswer === null || sqlAnswer === undefined) {
                    return null;
                }

                if(sqlAnswer.length === 0) {
                    return [];
                }

                let output = [];
                for(let i = 0; i < sqlAnswer.length; i++) {
                    const row = sqlAnswer[i];
                    output.push(new User(
                        row["id"],
                        row["first_name"],
                        row["last_name"],
                        row["birthday"],
                        new UserAddress(
                            row["address_id"],
                            row["street_address"],
                            row["city"],
                            row["state_province"],
                            row["postal_code"],
                            row["country"],
                            row["address_type"]
                        ),
                        row["email"],
                        new UserPhone(
                            row["phone_id"],
                            row["phone_number"],
                            row["phone_type"]
                        )
                    ));
                }

                return output;
            }).finally(() => {
                connection.close();
            });
        });
    }

    static deleteUserById = async (id) => {
        return await databaseConnection.new().then(async connection => {
            await connection.query(
                "DELETE FROM azure_bot_user WHERE id = ?;",
                [id]
            ).finally(() => {
                connection.close();
            });
        });
    }

    static findUsersDynamically = async (property) => {
        const list = await UserService.getAllUsers();
        const output = [];
        for (let user of list) {
            if(user.getEmail().includes(property) || user.getFirstName().includes(property) || user.getLastName().includes(property) || user.getBirthday().includes(property)) {
                output.push(user);
                continue;
            }

            const phone = user.getPhone();

            if(phone.getPhoneNumber().includes(property) || phone.getPhoneType().includes(property)) {
                output.push(user);
                continue;
            }

            const address = user.getAddress();

            if(address.getStreetAddress().includes(property) || address.getCity().includes(property) || address.getStateProvince().includes(property) || address.getPostalCode().includes(property) || address.getCountry().includes(property) || address.getAddressType().includes(property)) {
                output.push(user);
            }
        }

        return output;
    }

    static prepareForSystemPrompt = async () => {
        const list = await UserService.getAllUsers();
        const output = [];

        for(let user of list) {
            output.push({
                first_name: user.getFirstName(),
                last_name: user.getLastName(),
                birthday: user.getBirthday(),
                email: user.getEmail()
            })
        }

        return output;
    }

    static findUserIdByEmail = async (email) => {
        return await databaseConnection.new().then(async connection => {
            return await connection.query(
                "SELECT id FROM azure_bot_user WHERE email = ?;",
                [email]
            ).then((rows) => {
                const sqlAnswer = rows[0];

                if (sqlAnswer === null || sqlAnswer === undefined) {
                    return null;
                }

                if (sqlAnswer.length === 0) {
                    return -1;
                }

                const row = sqlAnswer[0];
                if (row) {
                    return row["id"];
                } else {
                    return -1;
                }
            }).finally(() => {
                connection.close();
            });
        });
    }

    static insertUser = async (user) => {
        await databaseConnection.new().then(async connection => {
            await connection.query(
                "INSERT INTO azure_bot_user(email, first_name, last_name, birthday) VALUES (?, ?, ?, ?);",
                [user.getEmail(), user.getFirstName(), user.getLastName(), user.getBirthday()],
            );

            const userId = await UserService.findUserIdByEmail(user.getEmail());
            const address = user.getAddress();

            await connection.query(
                "INSERT INTO azure_bot_user_addresses(user_id, street_address, city, state_province, postal_code, country, address_type) VALUES (?, ?, ?, ?, ?, ?, ?);",
                [userId, address.getStreetAddress(), address.getCity(), address.getStateProvince(), address.getPostalCode(), address.getCountry(), address.getAddressType()],
            );

            const phone = user.getPhone();
            await connection.query(
                "INSERT INTO azure_bot_user_phone_numbers(user_id, phone_number, phone_type) VALUES (?, ?, ?);",
                [userId, phone.getPhoneNumber(), phone.getPhoneType()],
            ).finally(() => {
                connection.close();
            });
        });
    }
}
