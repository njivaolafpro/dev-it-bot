// Require the necessary discord.js classes
import { Client, Events, Collection, GatewayIntentBits, Partials } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();
import getCommands from './commands';

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
	] , partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});
const commandCollection = new Collection();
Object.assign(client, { commands: commandCollection });

const commands = getCommands();


commands.forEach(command => {
	commandCollection.set(command.data.name, command);
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, []);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);


// ------------------------------ HANDLERS  ------------------------------------------------------

// Dès qu'un nouveau membre rejoint le serveur,
import * as guildMemberAdd from './handlers/guildMemberAdd';

const guildMemberAddHandler = guildMemberAdd.build(client);

client.on(Events.GuildMemberAdd, guildMemberAddHandler);


// quand une réaction sur un message du serveur
import * as  messageReactionAdd from './handlers/messageReactionAdd'
import * as  messageReactionRemove from './handlers/messageReactionRemove'

const messageReactionAddHandler = messageReactionAdd.build(client);
const messageReactionRemoveHandler = messageReactionRemove.build(client);

client.on(Events.MessageReactionAdd, messageReactionAddHandler);
client.on(Events.MessageReactionRemove, messageReactionRemoveHandler);
