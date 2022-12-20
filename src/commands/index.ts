import announce from "./announce";
import initRolePicker from "./init-role-picker";
import announceInDm from "./announce-in-dm";

const getCommands = () => {
    return [
        announce,
        initRolePicker,
        announceInDm
    ]
}

export default getCommands;
