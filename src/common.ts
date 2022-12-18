const EMOJIS = {
    jLetter: '🇯',
    cLetter: '🇨',
    spiderWeb: '🕸️',
    redRound: '🔴',
    orangeRound: '🟠',
    blueRound: '🔵',
    highRight: '↗️',
    elephant: '🐘',
    whale2: '🐋',
    snake: '🐍',
    camera: '📷',
}

const CHANNEL_IDS = {
    ARRIVEE: '1042067928427802644', // WELCOME
    COMMUNAUTE: { GENERAL: '1042049125543321640' }
}


const ROLES = {
    nonRegistered: { name: 'nouveau-membre🐣'},
    member: { name: 'membre vérifié' },

    // LANGUAGES:
    javascript: { name: 'Javascript', emojiRequirement: EMOJIS.jLetter },
    typescript: { name: 'Typescript', emojiRequirement: EMOJIS.blueRound },
    html: { name: 'Html', emojiRequirement: EMOJIS.spiderWeb },
    java: { name: 'Java', emojiRequirement: EMOJIS.redRound },
    c: { name: 'C', emojiRequirement: EMOJIS.cLetter },
    cPlusPlus: { name: 'C++', emojiRequirement: EMOJIS.highRight },
    php: { name: 'Php', emojiRequirement: EMOJIS.elephant },
    mySql: { name: 'MySql', emojiRequirement: EMOJIS.whale2 },
    python: { name: 'Python', emojiRequirement: EMOJIS.snake },
    gfx: { name: 'Gfx', emojiRequirement: EMOJIS.camera },

};

const PICKABLE_ROLES = [
    ROLES.javascript,
    ROLES.typescript,
    ROLES.java,
    ROLES.c,
    ROLES.cPlusPlus,
    ROLES.php,
    ROLES.python,
    ROLES.mySql,
    ROLES.html,
    ROLES.gfx,
]

const MAIN_MESSAGE = {
    RULE_MESSAGE_ID: '1043488446796283915',
    ROLE_PICKER_MESSAGE_ID: '1054148316914532364'
}

export { CHANNEL_IDS, ROLES, MAIN_MESSAGE, PICKABLE_ROLES }
