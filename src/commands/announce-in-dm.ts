import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("announce-in-dm")
        .setDescription("Announce in direct message.")
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Name your announcement.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Describe your announcement.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("roleid")
                .setDescription("Describe your announcement.")
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
        console.log('found members ->', membersFound?.map(m=>m).length);
        const embed = new EmbedBuilder()
            .setColor("Green")
            // .setDescription(`Annonce de ${member}`)
            .addFields(
                { name: "Titre", value: title },
                { name: "Message", value: message },
            )

        await interaction.reply({ content: 'done announcement' });
        return;
    }
}
