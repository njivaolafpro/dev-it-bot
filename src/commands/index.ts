import announce from "./announce";
import initRolePicker from "./init-role-picker";
import announceDm from "./announce-dm";

const getCommands = () => {
    return [
        announce,
        initRolePicker,
        announceDm
    ]
}

export default getCommands;
