const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping-dm-by-role")
        .setDescription("Announce in direct message to specified roles.")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Message of your DM announcement.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("roleid")
                .setDescription("The role of the target")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const { options, guild } = interaction;
        const message = options.get("message")?.value;
        const roleid = options.get("roleid")?.value;

        if (!message || !roleid) {
            await interaction.reply({ content: 'Please make sure that all parameters are sent!', ephemeral: true });
            console.warn('Missing data');
            return;
        }

        console.log('we are checking for role ->', { roleid });
        const allMembers = await guild?.members.fetch();
        const membersFound = allMembers?.filter(m => m.roles.cache.find(r => r.id === roleid));

        const membersArr = membersFound?.map(m => m);
        if (!membersArr) {
            await interaction.reply({ content: 'no users found for that role' });
            return;
        }

        const result = await Promise.allSettled(membersArr.map((m) => m.send(message)));

        const failedCount = result.filter(r=> r.status === 'rejected').length;
        const successCount = result.filter(r=> r.status === 'fulfilled').length;
        const countMessage = JSON.stringify({ failedCount, successCount});
        await interaction.reply({ content: 'sent message to:' + membersArr?.length + '💡 Report: ' + countMessage });
        return;
    }
}