import { databaseConnection } from "$lib/api/database/database.js";
import { User } from "$lib/api/user/entity/user.js";
import { UserAddress } from "$lib/api/user/entity/userAddress.js";
import { UserPhone } from "$lib/api/user/entity/userPhone.js";

export class UserService {

    static getAllUsers = async () => {
        return await databaseConnection.promise().query("SELECT * FROM azure_bot_user, azure_bot_user_addresses.user_id, azure_bot_user_phone_numbers.user_id " +
            "LEFT JOIN azure_bot_user_addresses ON azure_bot_user_addresses.user_id = azure_bot_user.id" +
            "LEFT JOIN azure_bot_user_phone_numbers ON azure_bot_user_phone_numbers.user_id = azure_bot_user.id;"
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
        });
    }

    static deleteUserById = async (id) => {
        await databaseConnection.promise().query(
            "DELETE FROM azure_bot_user WHERE id = ?;",
            [id]
        );
    }

    static findUserIdByEmail = async (email) => {
        return await databaseConnection.promise().query(
            "SELECT id FROM azure_bot_user WHERE email = ?;",
            [ email ]
        ).then((rows) => {
            const sqlAnswer = rows[0];

            if(sqlAnswer === null || sqlAnswer === undefined) {
                return null;
            }

            if(sqlAnswer.length === 0) {
                return -1;
            }

            const row = sqlAnswer[0];
            if(row) {
                return row["id"];
            } else {
                return -1;
            }
        });
    }

    static insertUser = async (user) => {
        await databaseConnection.promise().query(
            "INSERT INTO azure_bot_user(email, first_name, last_name, birthday) VALUES (?, ?, ?, ?);",
            [user.getEmail(), user.getFirstName(), user.getLastName(), user.getBirthday()],
        );

        const userId = await UserService.findUserIdByEmail(user.email);
        const address = user.getAddress();

        await databaseConnection.promise().query(
            "INSERT INTO azure_bot_user_addresses(user_id, street_address, city, state_province, postal_code, country, address_type) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [userId, address.getStreetAddress(), address.getCity(), address.getStateProvince(), address.getPostalCode(), address.getCountry(), address.getAddressType()],
        );

        const phone = user.getPhone();
        await databaseConnection.promise().query(
            "INSERT INTO azure_bot_user_phone_numbers(user_id, phone_number, phone_type) VALUES (?, ?, ?);",
            [userId, phone.getPhoneNumber(), phone.getPhoneType()],
        );
    }
}
