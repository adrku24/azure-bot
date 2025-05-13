import mysql from "mysql2/promise";
import { building } from '$app/environment';
import dotenv from "dotenv";
dotenv.config();

class DatabaseConnection {

    connection;

    constructor(host, port, username, password, databaseName) {
        this.connection = mysql.createConnection({
            connectionLimit: 50,

            host: host,
            port: port,

            user: username,
            password: password,

            database: databaseName
        });
    }

    /**
     * @returns SQL connection {Promise<*>}
     */
    async getConnection() {
        return await (await this.connection).connect();
    }

    /**
     * Function to initialise database schema
     * @returns {Promise<void>}
     */
    async createTables() {
        /*
            User Table (id, email, first_name, last_name, birthday)
         */
        await this.connection.query(
            "CREATE TABLE IF NOT EXISTS azure_bot_users (" +
                "id INTEGER PRIMARY KEY AUTO_INCREMENT," +
                "email TEXT UNIQUE," +
                "first_name TEXT," +
                "last_name TEXT," +
                "birthday DATE" +
            ");"
        );

        /*
            User Address (address_id, user_id (foreign key), street_address, city, state_province, postal_code, country, address_type)
         */
        await this.connection.query(
            "CREATE TABLE IF NOT EXISTS user_addresses (" +
                "address_id INTEGER PRIMARY KEY AUTO_INCREMENT," +
                "user_id INTEGER NOT NULL," +
                "street_address TEXT," +
                "city TEXT," +
                "state_province TEXT," +
                "postal_code TEXT," +
                "country TEXT," +
                "address_type TEXT," +
                "FOREIGN KEY (user_id) REFERENCES azure_bot_users(id) ON DELETE CASCADE" +
            ");"
        );

        /*
            User Phone (phone_id, user_id (foreign key), phone_number, phone_type)
         */
        await this.connection.query("CREATE TABLE IF NOT EXISTS user_phone_numbers (" +
                "phone_id INTEGER PRIMARY KEY AUTO_INCREMENT," +
                "user_id INTEGER NOT NULL," +
                "phone_number TEXT NOT NULL," +
                "phone_type TEXT," +
                "FOREIGN KEY (user_id) REFERENCES azure_bot_users(id) ON DELETE CASCADE" +
            ");"
        );
    }
}

let databaseConnection;
if(!building) { // Ignore database connection setup when building
    databaseConnection = await (new DatabaseConnection(
        process.env.AZURE_MYSQL_HOST,
        process.env.AZURE_MYSQL_PORT,
        process.env.AZURE_MYSQL_USERNAME,
        process.env.AZURE_MYSQL_PASSWORD,
        process.env.AZURE_MYSQL_DATABASE_NAME
    ).getConnection());
} else {
    databaseConnection = null;
}

export { databaseConnection };
