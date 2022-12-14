import * as Discord from 'discord.js';
import { PICKABLE_ROLES } from "../common";

const postReactInRolePicker = async (reaction: Discord.MessageReaction | Discord.PartialMessageReaction, user: Discord.User | Discord.PartialUser, isAddingRole: boolean) => {
    console.log('post reacting in rules');
    if (user.bot) return;   // GUARD
    if (!reaction.message.guild) {
        return;
    }
    const emojiName = reaction.emoji.name;
    console.log('reaction in RULES -> ', { emojiName });

    const foundPickedRole = PICKABLE_ROLES.find(r => r.emojiRequirement === emojiName);

    if (!foundPickedRole) {
        console.warn('picked role is not found, emoji used ->', emojiName);
    }
    const guild = reaction.message.guild;

    /* Get the member that reacted originally. */
    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) {
        console.log('some missing information when reacting to rules. Missing member')
        return;
    }

    const selectedRole = guild.roles.cache.find(r => r.name === foundPickedRole?.name);

    if (!selectedRole) {
        console.warn('role is not found in cache');
        return;
    }
    if (isAddingRole) {
        await guild.members.addRole({ user: member, role: selectedRole });
        return;
    }
    await guild.members.removeRole({ user: member, role: selectedRole })

}

export default postReactInRolePicker;
