import getCommands from "../commands";

import dotenv from 'dotenv';
dotenv.config();

const { REST, Routes } = require('discord.js');
const { CLIENT_ID, GUILD_ID, BOT_TOKEN } = process.env;

const commands = getCommands().map((command) => {
    console.log('got command ->', command.data.name)
    return command.data.toJSON()
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
