import {Session} from "meteor/session";

let sessionURL =  `https://frag.jetzt/participant/room/${Session.get('fragJetztSessionID').replace(/\s/g, "")}/comments`;

module.exports = {
	sessionURL
};
