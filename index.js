const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { join } = require('node:path')
const mysql = require('mysql2');
const colors = require('colors');

require('dotenv').config()

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ]
});


client.commands = new Collection();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

client.on('ready', async () => {
    const { Handler } = await require('./handlers');
    const { execute } = await require(join(process.cwd(), 'src', 'events', 'client', 'ready.js'));

    const handler = new Handler(client, connection);

    const commands = await handler.loadCommands();
    client.application.commands.set(commands.flat());

    await handler.loadEvents();

    const { load } = require('./src/web/index');
    load(client, connection);

    await execute(client, connection);
})

client.login(process.env.TOKEN)

module.exports = client, connection;