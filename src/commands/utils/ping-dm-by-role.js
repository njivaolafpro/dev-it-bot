const { PermissionFlagsBits } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');


module.exports = {
    name: "ping-dm-by-role",
    description: "Announce in direct message to specified roles.",
    
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'message',
            description: 'Message of your DM announcement.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'roleid',
            description: 'The role of the target',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    execute: async (_client, interaction, _args, _con) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "You do not have the required permissions to use this command.", ephemeral: true });
        }

        const { options, guild } = interaction;
        const message = options.get("message")?.value;
        const roleid = options.get("roleid")?.value;

        if (!message || !roleid) {
            await interaction.reply({ content: 'Please make sure that all parameters are sent!', ephemeral: true });
            console.warn('Missing data');
            return;
        }

        const allMembers = await guild?.members.fetch();
        const membersFound = allMembers?.filter(m => m.roles.cache.find(r => r.id === roleid));

        const membersArr = membersFound?.map(m => m);
        if (!membersArr) {
            await interaction.reply({ content: 'no users found for that role' });
            return;
        }

        await interaction.reply({ content: 'Gonna send message to:' + membersArr?.length });

        const result = await Promise.allSettled(membersArr.map((m) => m.send(message)));

        const failedCount = result.filter(r=> r.status === 'rejected').length;
        const successCount = result.filter(r=> r.status === 'fulfilled').length;
        const countMessage = JSON.stringify({ failedCount, successCount});
        await interaction.followUp('Message sent to ' + countMessage + ' users where total users:' + membersArr?.length);
        return;
    }
}