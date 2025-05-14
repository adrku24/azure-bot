import { databaseConnection, DatabaseConnection } from "./lib/api/database/database.js";
import { building } from "$app/environment";

if(!building) {
    await DatabaseConnection.createTables(databaseConnection);
}
