import { Client, ClientConfig } from "pg";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const getDBClient = async () => {
    const dbOptions: ClientConfig = {
        host: PG_HOST,
        port: parseInt(PG_PORT),
        database: PG_DATABASE,
        user: PG_USERNAME,
        password: PG_PASSWORD,
        ssl: {
            rejectUnauthorized: false // to avoid warring in this example
        },
        connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
    };

    const client = new Client(dbOptions);
    await client.connect();

    return client;
}

