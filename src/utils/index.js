module.exports = {
    parseUserName(msg) {
        let username = "";
        if (msg.from.first_name != undefined) {
            username = msg.from.first_name;

            if (msg.from.last_name != undefined) {
                username += " " + msg.from.last_name;
            }
            // eslint-disable-next-line no-empty
        } else {
            if (msg.from.username != undefined) {
                username = "@" + msg.from.username;
            } else {
                username = "irmão";
            }
        }

        return username;
    }
};
