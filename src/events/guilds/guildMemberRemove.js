module.exports = {
	name: 'guildMemberRemove',
	once: false,
execute: async (member, client, con) => {
    await SimpleWelcomeMessages();

    async function SimpleWelcomeMessages() {
        const channel = member.guild.channels.cache.get('1303463541638168596');
        if(!channel) return;

        channel.send({
            content: `**[-]** **${member.user.username}** vient de quitter le serveur 👾 \`[${member.guild.memberCount}]\``
        })
    }
    }
}