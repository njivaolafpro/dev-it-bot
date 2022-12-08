
import * as Discord from 'discord.js';
import { MAIN_MESSAGE } from '../common';
import postReactInRules from '../repository/post-react-in-rules';

let client:Discord.Client<boolean>;

const handler = async (reaction: Discord.MessageReaction, user:Discord.User | Discord.PartialUser) => {
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

    console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);

    const isReactionInRule = MAIN_MESSAGE.RULE_MESSAGE_ID === reaction.message.id;

    if (isReactionInRule) {
        await postReactInRules(reaction, user);
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
