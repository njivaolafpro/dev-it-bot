


import * as Discord from 'discord.js';
import { EmbedBuilder } from 'discord.js';

import { CHANNEL_IDS, ROLES } from '../common';

let client: Discord.Client<boolean>;

const handler = async (member: Discord.GuildMember) => {
    console.log('added a new guild member')
    const user = await client.users.fetch(member.id);

    // 1. Assign the user to non-registered;
    const roleNonRegistered = member.guild.roles.cache.find(r => r.name === ROLES.nonRegistered.name);
    if (!roleNonRegistered) return;
    await member.guild.members.addRole({ user: member, role: roleNonRegistered })


    // 2. Message sur arrivée
    const arriveeChannelID = CHANNEL_IDS.ARRIVEE;
    const channel:any = await client.channels.cache.get(arriveeChannelID);
    const embed = new EmbedBuilder()
        .setTitle(`Bienvenue sur Dev-It-Out`)
        .setColor(0xff0000)
        .setDescription(`${member.displayName}, toute l'équipe te souhaite la bienvenue ✨`)
        .setFooter({ text: `N'oubliez pas de respecter les règles du serveur Discord.` })
        .setThumbnail(user.displayAvatarURL());

    channel?.send({ embeds: [embed] });

    // 2. Message sur general commu
    const communauteGeneralID = CHANNEL_IDS.COMMUNAUTE.GENERAL;
    const channelCommu:any = await client.channels.fetch(communauteGeneralID);

    const embedInCommunaute = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${member.displayName} vient de rejoindre le serveur ✨`)
        .setFooter({ text: `Souhaitez lui la bienvenue !.` })

    channelCommu?.send({ embeds: [embedInCommunaute] }); // TODO Fix
}

/**
 * @param {Discord.Client} client 
 */
const build = (_client: Discord.Client) => {
    client = _client;
    return handler;
}

export { build };
