const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'teams',
    description: '(💡) Dev',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "type",
            description: "Type",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: 'Remove',
                    value: 'remove'
                },
                {
                    name: 'List',
                    value: 'list'
                }
            ]
        },
        {
            name: 'user',
            description: 'Member',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: "permission",
            description: "Permission Int",
            type: ApplicationCommandOptionType.Number,
            required: false,
            choices: [
                {
                    name: 'Assistant',
                    value: 0
                },
                {
                    name: 'Moderator',
                    value: 1
                },
                {
                    name: 'Administrator',
                    value: 2
                },
                {
                    name: 'Developper',
                    value: 3
                }
            ]
        },
    ],
execute: async (client, interaction, args, con) => {
    const type = interaction.options.getString('type');
    const target = interaction.options.getMember('user');
    const permissionInt = interaction.options.getNumber('permission');

    switch(type) {
        case 'add': {
            if(!target) return interaction.reply({ content: `Vous devez fournir un membre.`, ephemeral: true });
            if(!permissionInt) return interaction.reply({ content: `Vous devez fournir un rôle d'équipe.`, ephemeral: true });

            con.query(`SELECT * FROM teams WHERE userID = '${interaction.user.id}'`, function(err, result) {
                if(!result[0] || result[0].permission !== 3) return interaction.reply({ content: `Vous n'avez pas la permission d'utiliser cette commande.`, ephemeral: true });
        
                con.query(`SELECT * FROM teams WHERE userID = '${target.id}'`, function(err, result) {
                    if(result[0]) return interaction.reply({ content: `${target} est déjà dans l'équipe de gestion.`, ephemeral: true });

                    con.query(`INSERT INTO teams (userID, permission) VALUES ('${target.id}', '${permissionInt}')`, function(err, result) {
                        interaction.reply({ content: `${target} vient d'être ajouté(e) à la liste en tant que : ${permissionInt === 0 ? 'Assistant' : permissionInt === 1 ? 'Modérateur' : permissionInt === 2 ? 'Administrateur' : 'Développeur' }`, ephemeral: true })
                    })
                });
            })
            break;
        }

        case 'remove': {
            if(!target) return interaction.reply({ content: `Vous devez fournir un membre.`, ephemeral: true });

            con.query(`SELECT * FROM teams WHERE userID = '${interaction.user.id}'`, function(err, result) {
                if(!result[0] || result[0].permission !== 3) return interaction.reply({ content: `Vous n'avez pas la permission d'utiliser cette commande.`, ephemeral: true });
        
                con.query(`SELECT * FROM teams WHERE userID = '${target.id}'`, function(err, result) {
                    if(!result[0]) return interaction.reply({ content: `${target} n'est pas dans l'équipe de gestion.`, ephemeral: true });

                    con.query(`DELETE FROM teams WHERE userID = '${target.id}'`, function(err, result) {
                        interaction.reply({ content: `${target} vient d'être retiré(e) de la liste.`, ephemeral: true })
                    })
                });
            })
            break;
        }

        case 'list': {
            con.query(`SELECT * FROM teams`, function(err, result) {
              // list with page : embed builder  
            })
            break;
        }
    }

    }
}