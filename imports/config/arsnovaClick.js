import {Session} from "meteor/session";

let sessionURL =  `https://arsnova.click/quiz/${Session.get('arsnovaClickSessionID').replace(/\s/g, "")}`;

module.exports = {
	sessionURL
};
