
import * as Discord from 'discord.js';
import { MAIN_MESSAGE } from '../common';
import postReactInRolePicker from '../repository/post-react-in-role-picker';
import postReactInRules from '../repository/post-react-in-rules';

let client:Discord.Client<boolean>;

const handler = async (reaction: Discord.MessageReaction | Discord.PartialMessageReaction, user:Discord.User | Discord.PartialUser) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    console.log(`${reaction.message.author?.username}'s message gained a reaction!`);

    if (reaction.message.id === MAIN_MESSAGE.RULE_MESSAGE_ID) {
        await postReactInRules(reaction, user);
        return;
    }

    if (reaction.message.id === MAIN_MESSAGE.ROLE_PICKER_MESSAGE_ID){
        await postReactInRolePicker(reaction, user);
        return;
    }

    console.log('unrecognized reaction rule')   // todo remove that afterwards

    return;
}

const build = (_client: Discord.Client<boolean>) => {
    client = _client;
    return handler;
}
export { build };
