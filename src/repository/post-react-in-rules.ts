import * as Discord from 'discord.js';
import { ROLES } from "../common";

const EMOJIS = {
    RULES_ACCEPTATION: 'white_check_mark',
};

const POST_REACTION_DM_MESSAGE = `Merci d'avoir accepté les conditions d'accès au serveur.`;


const postReactInRules = async (reaction: Discord.MessageReaction | Discord.PartialMessageReaction, user: Discord.User | Discord.PartialUser) => {
    console.log('post reacting in rules');
    if (user.bot) return;   // GUARD
    if (!reaction.message.guild) {
        return;
    }
    const emojiName = reaction.emoji.name;
    console.log('reaction in RULES -> ', { emojiName });
    const guild = reaction.message.guild;
    const roleMembre = guild.roles.cache.find(r => r.name === ROLES.member.name);
    const roleNonRegister = guild?.roles.cache.find(r => r.name === ROLES.nonRegistered.name);

    /* Get the member that reacted originally. */
    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member || !roleNonRegister || !roleMembre) {
        console.log('some missing information when reacting to rules.')
        return;
    }

    await guild.members.removeRole({ user: member, role: roleNonRegister })
    await guild.members.addRole({ user: member, role: roleMembre })

    if (emojiName === EMOJIS.RULES_ACCEPTATION) {
        await user.send(POST_REACTION_DM_MESSAGE);
    }
}

export default postReactInRules;
