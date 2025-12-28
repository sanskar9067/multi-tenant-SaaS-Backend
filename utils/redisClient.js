import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'M1V3De1n6Npsta9mCJ9w0iq1nWdwDwwd',
    socket: {
        host: 'redis-12824.c85.us-east-1-2.ec2.cloud.redislabs.com',
        port: 12824
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client
