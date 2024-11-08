const { Colors } = require("discord.js");

module.exports = {
	name: 'guildMemberAdd',
	once: false,
execute: async (member, client, con) => {
    await SimpleWelcomeMessages();
    await WelcomeMessages();

    async function SimpleWelcomeMessages() {
        const channel = member.guild.channels.cache.get('1303463541638168596');
        if(!channel) return;

        channel.send({
            embeds: [{
                color: Colors.Green,
                description: `**[+]** ${member} vient de rejoindre le serveur 👾 \`[${member.guild.memberCount}]\``
            }]
        })
    }

    async function WelcomeMessages() {
        const channel = member.guild.channels.cache.get('1303463541638168596');
        if(!channel) return;

        channel.send({
            content: `\`[👤]\` Souhaitez la bienvenue à ${member} ou en réagissant a ce message pour gagner de l'expérience.`
        }).then(async (msg) => {
            msg.react('👋');
        })

        member.send({
            embeds: [{
                title: `Hello World !`,
                description: `<id:customize>`
            }]
        })
    }

    }
}