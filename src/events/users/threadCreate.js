const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");
const moment = require('moment');
const OpenAI = require("../../../handlers/functions/openAI");

module.exports = {
	name: 'threadCreate',
	once: false,
execute: async (thread, newlyCreated, client, con) => {
    switch(thread.parentId) {
        case '1303467544178462795': {
            try {
                const starterMessage = await thread.fetchStarterMessage();
                console.log(starterMessage.content)
                
            } catch(err) {
                console.error(err)
            }   
        }
    }
    }
}