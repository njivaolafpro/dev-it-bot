const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const UUID = require("../../../handlers/functions/uuidGenerator");

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await Modals();
    await Selects();
    await Buttons();

    async function Modals() {
        if(!interaction.isModalSubmit()) return;

        switch(interaction.customId) {
            case 'create-project': {
                interaction.reply({
                    embeds: [{
                        color: Colors.Green,
                        author: {
                            image_url: interaction.user.avatarURL(),
                            text: interaction.user.username
                        },
                        title: `${interaction.fields.getTextInputValue('title')}`,
                        description: `${interaction.fields.getTextInputValue('description') || 'Aucune description'}`,
                        fields: [
                            {
                                name: `Site Web`,
                                value: `${interaction.fields.getTextInputValue('link') || 'Aucun lien'}`,
                                inline: true
                            },
                            {
                                name: `Repository GitHub`,
                                value: `${interaction.fields.getTextInputValue('github') || 'Aucun lien'}`,
                                inline: true
                            },
                        ]
                    }],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('tags')
                            .setPlaceholder("Choisissez un ou plusieurs tags")
                            .setMaxValues(6)
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                .setValue("sql")
                                .setLabel("SQL"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("python")
                                .setLabel("Python"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("java")
                                .setLabel("Java"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("c#")
                                .setLabel("C#"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("php")
                                .setLabel("PHP"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("ruby")
                                .setLabel("Ruby"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("nodejs")
                                .setLabel("Node.JS"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("go")
                                .setLabel("Go"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("rust")
                                .setLabel("Rust"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("c")
                                .setLabel("C"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("c++")
                                .setLabel("C++"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("javascript")
                                .setLabel("JavaScript"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("typescript")
                                .setLabel("TypeScript"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("html")
                                .setLabel("HTML"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("css")
                                .setLabel("CSS"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("dart")
                                .setLabel("Dart"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("react")
                                .setLabel("React"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("angular")
                                .setLabel("Angular"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("vuejs")
                                .setLabel("Vue.JS"),
                                new StringSelectMenuOptionBuilder()
                                .setValue("other")
                                .setLabel("Autres"),
                            )
                        )
                    ],
                    ephemeral: true
                }).then(async (msg) => {
                    const filter = (i) => i.user.id === interaction.member.id;
                    await SelectsMenu()

                    async function SelectsMenu() {
                        let collected;

                        try {
                            collected = await msg.awaitMessageComponent({ filter: filter });
                        } catch(err) {
                            if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                                return msg.delete()
                            }
                        }
            
                        console.log(collected)
                        if (!collected.deffered) await collected.deferUpdate();

                        console.log(collected)
                    }
                })
                break;
            }
            
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

    async function Selects() {
        if(!interaction.isStringSelectMenu()) return;

        switch(interaction.customId) {
            case 'tags': {
                let array = [];
                const channel = interaction.guild.channels.cache.get('1308516852401438850');

                interaction.values.forEach((item) => {
                    const matchingTag = channel.availableTags.find(tag => tag.name.toLowerCase() === item.toLowerCase());
                    
                    if(matchingTag) array.push(matchingTag.id);
                });

                console.log(interaction)

                await channel.threads.create({
                    name: `${interaction.user.username}`,
                    message: {
                        content: `${interaction.user}`,
                        embeds: interaction.message.embeds
                    },
                    appliedTags: !array[0] ? array : ['1308522264018550794']
                })
                //await interaction.message.edit({
                //    components: []
                //})
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