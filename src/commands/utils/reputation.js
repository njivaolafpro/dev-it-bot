const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'reputation',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Member',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
execute: async (client, interaction, args, con) => {
    const target = interaction.options.getMember('user');
    if(interaction.user.id === target.id) return interaction.reply({ content: `Vous en pouvez pas vous remercier vous-même.`, ephemeral: true });

    con.query(`SELECT * FROM reputations WHERE userID = '${target.id}'`, function(err, result) {
        if(!result[0]) {
            con.query(`INSERT INTO reputations (userID, points) VALUES ('${target.id}', '1')`, function(err, result) {
                return interaction.reply({ content: `${interaction.user} vient de remercier ${target} **(1)** !` });
            })
        } else {
            let points = Number(result[0].points);
            con.query(`UPDATE reputations SET points = '${Math.floor(points + 1)}' WHERE userID ='${target.id}'`, function(err, result) {
                return interaction.reply({ content: `${interaction.user} vient de remercier ${target} **(${Math.floor(points + 1)})** !` });
            })
        }
    })
    }
}