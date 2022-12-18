const EMOJIS = {
    jLetter: '🇯',
    cLetter: '🇨',
    spiderWeb: '🕸️',
    redRound: '🔴',
    orangeRound: '🟠',
    plus: '➕',
}

const CHANNEL_IDS = {
    ARRIVEE: '1042067928427802644', // WELCOME
    COMMUNAUTE: { GENERAL: '1042049125543321640' }
}


const ROLES = {
    nonRegistered: { name: 'nouveau-membre🐣'},
    member: { name: 'membre vérifié' },

    // LANGUAGES:
    javascript: { name: 'javascript', emojiRequirement: EMOJIS.jLetter },
    html: { name: 'html', emojiRequirement: EMOJIS.spiderWeb },
    java: { name: 'java', emojiRequirement: EMOJIS.redRound },
    c: { name: 'C', emojiRequirement: EMOJIS.cLetter },
    cPlusPlus: { name: 'C++', emojiRequirement: EMOJIS.plus },

};

const PICKABLE_ROLES = [
    ROLES.javascript,
    ROLES.html,
    ROLES.java,
    ROLES.c,
    ROLES.cPlusPlus,
]

const MAIN_MESSAGE = {
    RULE_MESSAGE_ID: '1043488446796283915',
    ROLE_PICKER_MESSAGE_ID: '1047643864762159104'
}

export { CHANNEL_IDS, ROLES, MAIN_MESSAGE, PICKABLE_ROLES }
