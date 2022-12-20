import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("announce-in-dm")
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

    async execute(interaction: CommandInteraction) {
        const { options, guild } = interaction;
        const title = options.get("title")?.value as string | undefined;
        const message = options.get("message")?.value as string | undefined;
        const roleid = options.get("roleid")?.value as string | undefined;

        if (!title || !message || !roleid) {
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

        await Promise.all(membersArr.map((m) => m.send(message)));

        await interaction.reply({ content: 'sent message to:' + membersArr?.length });
        return;
    }
}
