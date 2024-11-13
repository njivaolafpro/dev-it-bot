const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const UUID = require("../../../handlers/functions/uuidGenerator");

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await Modals();
    await Buttons();

    async function Modals() {
        if(!interaction.isModalSubmit()) return;

        switch(interaction.customId) {
            case 'suggestion': {
                const uuid = UUID();
                con.query(`INSERT INTO suggestions (uuid, userID, title, description) VALUES ('${uuid}', '${interaction.user.id}', '${interaction.fields.getTextInputValue('ask_0')}', '${interaction.fields.getTextInputValue('ask_1')}')`, function(err, result) {
                    con.query(`SELECT * FROM settings`, function(err, result) {
                        const channel = interaction.guild.channels.cache.get(result[0].suggestions_channel) || null;

                        if(channel === null) return interaction.reply({ content: `Une erreur s'est produite lors de la création de la suggestion **(101)**`, ephemeral: true });

                        channel.send({
                            embeds: [{
                                color: Colors.Yellow,
                                author: {
                                    name: `${interaction.user.username}`,
                                    icon_url: `${interaction.user.avatarURL()}`
                                },  
                                fields: [
                                    {
                                        name: `${interaction.fields.getTextInputValue('ask_0')}`,
                                        value: `> \`\`\`${interaction.fields.getTextInputValue('ask_1')}\`\`\``
                                    }
                                ],
                                footer: {
                                    text: `${uuid}`
                                }
                            }],
                            components: [
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('up_vote')
                                    .setEmoji("👍")
                                    .setLabel("0")
                                    .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                    .setCustomId('neutral_vote')
                                    .setEmoji("👊")
                                    .setLabel("0")
                                    .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                    .setCustomId('down_vote')
                                    .setEmoji("👎")
                                    .setLabel("0")
                                    .setStyle(ButtonStyle.Secondary),
                                )
                            ]
                        })

                        return interaction.reply({
                            content: `Votre suggestion vient d'être publiée.`,
                            ephemeral: true
                        })
                    })
                })
                break;
            }
        }
    }

    async function Buttons() {
        if(!interaction.isButton()) return;

        switch(interaction.customId) {
            case 'up_vote': {
                const uuid = interaction.message.embeds[0].data.footer.text;
                con.query(`SELECT * FROM votes WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO votes (uuid, userID, vote) VALUES ('${uuid}', '${interaction.user.id}', '0')`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être enregistré.`, ephemeral: true });

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    } else {
                        if(result[0].vote === 0) return interaction.reply({ content: `Ce vote correspond au votre actuel.`, ephemeral: true });

                        con.query(`UPDATE votes SET vote = '0' WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être modifié.`, ephemeral: true })

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    }
                })
                break;
            }
    
            case 'neutral_vote': {
                const uuid = interaction.message.embeds[0].data.footer.text;
                con.query(`SELECT * FROM votes WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO votes (uuid, userID, vote) VALUES ('${uuid}', '${interaction.user.id}', '1')`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être enregistré.`, ephemeral: true });

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    } else {
                        if(result[0].vote === 1) return interaction.reply({ content: `Ce vote correspond au votre actuel.`, ephemeral: true });

                        con.query(`UPDATE votes SET vote = '1' WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être modifié.`, ephemeral: true });

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    }
                })
                break;
            }
    
            case 'down_vote': {
                const uuid = interaction.message.embeds[0].data.footer.text;
                con.query(`SELECT * FROM votes WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                    if(!result[0]) {
                        con.query(`INSERT INTO votes (uuid, userID, vote) VALUES ('${uuid}', '${interaction.user.id}', '2')`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être enregistré.`, ephemeral: true });

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    } else {
                        if(result[0].vote === 2) return interaction.reply({ content: `Ce vote correspond au votre actuel.`, ephemeral: true });

                        con.query(`UPDATE votes SET vote = '2' WHERE userID = '${interaction.user.id}' AND uuid = '${uuid}'`, function(err, result) {
                            interaction.reply({ content: `Votre avis vient d'être modifié.`, ephemeral: true });

                            setTimeout(() => {
                                con.query(`SELECT * FROM votes WHERE uuid = '${uuid}'`, function(err, result) {
                                    return interaction.message.edit({
                                        components: [
                                            new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                .setCustomId('up_vote')
                                                .setEmoji("👍")
                                                .setLabel(`${result.filter(i => i.vote === 0).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('neutral_vote')
                                                .setEmoji("👊")
                                                .setLabel(`${result.filter(i => i.vote === 1).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                                new ButtonBuilder()
                                                .setCustomId('down_vote')
                                                .setEmoji("👎")
                                                .setLabel(`${result.filter(i => i.vote === 2).length}`)
                                                .setStyle(ButtonStyle.Secondary),
                                            )
                                        ]
                                    })
                                })
                            }, 1000)
                        })
                    }
                })
                break;
            }
        }
    }

    }
}