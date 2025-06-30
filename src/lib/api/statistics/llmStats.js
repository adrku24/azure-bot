import { databaseConnection } from "$lib/api/database/database.js";

export class LLMStats {

    static async insertStatistic(text) {
        const date = Date.now();

        await databaseConnection.new().then(async connection => {
            await connection.query(
                "INSERT INTO azure_bot_llm_stats(timestamp, text) VALUES (?, ?);",
                [date, text]
            ).finally(() => {
                connection.close();
            });
        });
    }

    static async getStatistic() {
        return await databaseConnection.new().then(async connection => {
            return await connection.query(
                "SELECT timestamp, text FROM azure_bot_llm_stats;"
            ).then((rows) => {
                const sqlAnswer = rows[0];

                if(sqlAnswer === null || sqlAnswer === undefined) {
                    return null;
                }

                if(sqlAnswer.length === 0) {
                    return [];
                }

                const output = [];
                for(let i = 0; i < sqlAnswer.length; i++) {
                    const row = sqlAnswer[i];
                    output.push({
                        timestamp: row["timestamp"],
                        text: row["text"]
                    });
                }

                return output;
            }).finally(() => {
                connection.close();
            })
        });
    }
}
