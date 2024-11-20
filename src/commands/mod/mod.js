const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'mod',
    description: '(💡) Mods',
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

    async function GetLast() {
        con.query(`SELECT * FROM warnings WHERE userID = '${target.id}'`, function(err, result) {
            if(!result[0]) {
                return 'Aucune sanction précédente.'
            } else {
                let array = [];
                const firstValues = result.slice(0, 5);

                function formaterDate(dateString) {
                    const date = new Date(dateString);
                
                    const jour = String(date.getDate()).padStart(2, '0');
                    const mois = String(date.getMonth() + 1).padStart(2, '0');
                    const annee = String(date.getFullYear()).slice(-2);
                    const heures = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                
                    return `${jour}/${mois}/${annee} ${heures}:${minutes}`;
                }

                firstValues.map((index, item) => {
                    array.push(`[${formaterDate(item.createdAt)}]`)
                })

                if(result.length > 5) {
                    array.push(`[Voir toutes les sanctions](https://google.com/)`)
                }

                return `${array.join('\n')}`
                console.log(array)
            }
        })
    }

    console.log(await GetLast());
    interaction.reply({
        embeds: [{
            color: Colors.Orange,
            author: {
                name: `${target.user.username}`,
                icon_url: `${target.user.avatarURL()}`
            },
            title: `Panneau de modération`,
            fields: [
                {
                    name: `(0) Avertissement(s) :`,
                    value: `x`
                },
                {
                    name: `(0) Dernière(s) sanction(s) :`,
                    value: `${await GetLast()}`
                },
            ]
        }],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('clear_action')
                .setEmoji("🧹")
                .setLabel("Nettoyer les messages")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled((!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ? false : true)),
                new ButtonBuilder()
                .setCustomId('muted_action')
                .setEmoji(`${target.isCommunicationDisabled() ? '🔊' : '🔇'}`)
                .setLabel(`${target.isCommunicationDisabled() ? 'Rendre la parole' : 'Rendre muet'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled((!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers) ? false : true)),
                new ButtonBuilder()
                .setCustomId('report_action')
                .setEmoji("⚠️")
                .setLabel("Avertir l'utilisateur")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled((!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ? false : true)),
                new ButtonBuilder()
                .setCustomId('kick_action')
                .setEmoji("🚪")
                .setLabel("Expulser l'utilisateur")
                .setStyle(ButtonStyle.Primary)
                .setDisabled((!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) ? false : true)),
                new ButtonBuilder()
                .setCustomId('ban_action')
                .setEmoji("⛔")
                .setLabel("Bannir l'utilisateur")
                .setStyle(ButtonStyle.Primary)
                .setDisabled((!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) ? false : true)),
            )
        ],
        ephemeral: true
    }).then(async (msg) => {
        const filter = (i) => i.user.id === interaction.member.id;
        await Buttons();

        async function Buttons() {
            let collected;

            try {
                collected = await msg.awaitMessageComponent({ filter: filter });
            } catch(err) {
                if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                    return msg.delete()
                }
            }

            if (!collected.deffered) await collected.deferUpdate();

            switch(collected.customId) {
                case 'clear_action': {
                    const messages = await interaction.channel.messages.fetch({ limit: 100 });
                    const userMessages = messages.filter(m => m.author.id === target.id);
                    userMessages.forEach(async (msg) => {
                        try {
                            await msg.delete();
                        } catch(err) {
                            console.error(err);
                        }
                    })

                    interaction.reply({
                        content: `Tous les messages de ${target} viennent d'être effacés.`
                    });
                    break;
                }

                case 'muted_action': {
                    if(target.isCommunicationDisabled()) {
                        target.timeout(null).then(() => {
                            interaction.reply({
                                content: `Vous avez rendu la parole à ${target}.`
                            })
                        })
                    } else {
                        target.disableCommunicationUntil(Date.now() + 3600000, `Rendu muet par : ${interaction.user.username}`).then(() => {
                            interaction.reply({
                                content: `Vous avez rendu muet ${target} pour **1 heure**.`
                            })
                        })
                    }
                    break;
                }

                case 'report_action': {
                    break;
                }

                case 'kick_action': {
                    await target.kick({ reason: `Expulser par : ${interaction.user.username}` }).then(() => {
                        interaction.reply({
                            content: `Vous venez d'expulser ${target.user.username}.`
                        })
                    })
                    break;
                }

                case 'ban_action': {
                    await target.ban({ reason: `Banni par : ${interaction.user.username}` }).then(() => {
                        interaction.reply({
                            content: `Vous venez de bannir ${target.user.username}.`
                        })
                    })
                    break;
                }
            }
        }
    });

    }
}