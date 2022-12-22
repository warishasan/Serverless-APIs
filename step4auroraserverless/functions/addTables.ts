import {
    GetSecretValueCommand,
    SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client, QueryResult } from 'pg';

export async function handler(
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
    // get the secret from secrets manager.
    const client = new SecretsManagerClient({});
    const secret = await client.send(
        new GetSecretValueCommand({
            SecretId: process.env.databaseSecretArn
        })
    );
    const secretValues = JSON.parse(secret.SecretString || '{}');

    console.log('secretValues', secretValues);

    // connect to the database
    const db = new Client({
        host: secretValues.host, // host is the endpoint of the db cluster
        port: secretValues.port, // port is 5432
        user: secretValues.username, // username is the same as the secret name
        password: secretValues.password, // this is the password for the default database in the db cluster
        database: secretValues.dbname || 'postgres' // use the default database if no database is specified
    });

    await db.connect();
    // execute a query
    let res: any;
    try {
        await db.query(`
        CREATE TABLE books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          primary_author VARCHAR(100) NULL
        )`);
    }
    catch (err) {
        console.log("err ", err)
        return {
            body: JSON.stringify({
                message: `Table Already Exists`
            }),
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    console.log("res ", res)
    console.log("res.rows[0] ", res.rows[0])

    // disconnect from the database
    await db.end();

    return {
        body: JSON.stringify({
            message: `DB Response: ${res.rows[0]}`
        }),
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
            'Content-Type': 'application/json'
        }
    };

}