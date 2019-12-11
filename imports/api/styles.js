import {Meteor} from "meteor/meteor";
import * as serverConf from "../config/server.js";
import * as backgroundsConf from "../config/backgrounds.js";
import {Session} from "meteor/session";


export let ServerStyle = class ServerStyle {

	static getFirstAppTitle () {
		return this.getConfig().welcome.title.first;
	}

	static getLastAppTitle () {
		return this.getConfig().welcome.title.last;
	}

	static getAppSlogan () {
		let config  = this.getConfig();
		switch (config.language.client) {
			case "de":
				return this.getConfig().welcome.title.slogan_de;
			case "en":
				return this.getConfig().welcome.title.slogan_en;
		}
	}

	static getAboutButton (isMobile = false) {
		let config  = this.getConfig();
		if (isMobile) {
			switch (config.language.client) {
				case "de":
					return this.getConfig().welcome.button.about.mobile_de;
				case "en":
					return this.getConfig().welcome.button.about.mobile_en;
			}
		} else {
			switch (config.language.client) {
				case "de":
					return this.getConfig().welcome.button.about.default_de;
				case "en":
					return this.getConfig().welcome.button.about.default_en;
			}
		}
	}

	static getConfig () {
		switch (Meteor.settings.public.dynamicSettings) {
			case "debug":
				return serverConf.debug;
			case "linux":
				return serverConf.linux;
			case "review":
				return serverConf.review;
			case "staging":
				return serverConf.staging;
			default:
				return serverConf.defaultSettings;
		}
	}

	static getBackground (type) {
		if (Session.get('theme') !== "default") {
			return "none";
		}
		let backgrounds;
		let backgroundSring = "";
		switch (this.getConfig().backgrounds) {
			case "linux":
				backgrounds = backgroundsConf.linuxBackgrounds;
				break;
			default:
				backgrounds = backgroundsConf.defaultBackgrounds;
		}
		switch (type) {
			case "landing-page":
				backgroundSring = backgrounds["landing-page"];
				break;
			case "internal":
				backgroundSring = backgrounds.internal;
				break;
			case "demo":
				backgroundSring = backgrounds.demo;
				break;
			case "presentation":
				backgroundSring = backgrounds.presentation;
				break;
			case "learning":
				backgroundSring = backgrounds.learning;
				break;
			case "backend":
				backgroundSring = backgrounds.backend;
				break;
			case "editor":
				backgroundSring = backgrounds.editor;
				break;
			case "transcriptBonus":
				backgroundSring = backgrounds.transcriptBonus;
		}
		if (backgroundSring === "none") {
			return backgroundSring;
		} else {
			return "url('" + backgroundSring + "')";
		}
	}

	static gotPublicCardset () {
		let config  = this.getConfig();
		return config.index.public.cardsets.enabled;
	}

	static isLoginEnabled (loginType) {
		let settings = this.getConfig();
		switch (loginType) {
			case "cas":
				return settings.login.cas;
			case "guest":
				return settings.login.guest;
			case "pro":
				return settings.login.pro;
			case "google":
				return settings.login.google;
			case "twitter":
				return settings.login.twitter;
			case "facebook":
				return settings.login.facebook;
			case "backdoor":
				return Meteor.settings.public.backdoorEnabled;
		}
	}

	static getClientLanguage () {
		return this.getConfig().language.client;
	}

	static getDemoFolder () {
		return this.getConfig().demo.folder;
	}

	static getServerLanguage () {
		return this.getConfig().language.server;
	}

	static gotTranscriptsEnabled () {
		return this.getConfig().transcripts.enabled;
	}

	static getUserRolesWithCreatePermission () {
		let usersWithPermission = this.getConfig().roles.create;
		let list = ['admin', 'editor'];
		if (usersWithPermission.standard === true) {
			list.push('standard');
		}
		if (usersWithPermission.edu === true) {
			list.push('university');
		}
		if (usersWithPermission.lecturer === true) {
			list.push('lecturer');
		}
		if (usersWithPermission.pro === true) {
			list.push('pro');
		}
		return list;
	}
};
