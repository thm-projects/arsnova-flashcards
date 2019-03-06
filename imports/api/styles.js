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
			case "informatik":
				return serverConf.informatik;
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
		}
		if (backgroundSring === "none") {
			return backgroundSring;
		} else {
			return "url('" + backgroundSring + "')";
		}
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
			case "legacy":
				return settings.login.legacyMode.enabled;
			case "google":
				return settings.login.legacyMode.google;
			case "twitter":
				return settings.login.legacyMode.twitter;
			case "facebook":
				return settings.login.legacyMode.facebook;
			case "backdoor":
				return Meteor.settings.public.backdoorEnabled;
		}
	}

	static getClientLanguage () {
		return this.getConfig().language.client;
	}

	static getServerLanguage () {
		return this.getConfig().language.server;
	}
};
