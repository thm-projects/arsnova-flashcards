import {MeteorMathJax} from 'meteor/mrt:mathjax';
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../config/dompurify.js";
import "/client/thirdParty/markdeep/markdeep.min.js";
import * as config from "../config/markdeep.js";
import * as exportConfig from "../config/markdeepExport.js";
import plantuml from "/client/thirdParty/asciidoctor/plantuml/asciidoctor-plantuml.min.js";
import Asciidoctor from "/client/thirdParty/asciidoctor/asciidoctor.min.js";
import {Session} from "meteor/session";
import {Route} from "./route";
import XRegExp from 'xregexp';
import {PDFViewer} from "./pdfViewer";
import {AdminSettings} from "../api/subscriptions/adminSettings";

let asciidoctor = new Asciidoctor();
plantuml.register(asciidoctor.Extensions);

MeteorMathJax.sourceUrl = config.MathJaxSourceUrl;
MeteorMathJax.defaultConfig = config.defaultMathJaxConfig;

export let MarkdeepContent = class MarkdeepContent {
	/** Wraps image files inside a lightbox-img class
	 *  @param {string} content - Text that contains the image
	 *  @returns {string} - The wrapped text
	 * */
	static setSSLAndLightBoxes (content) {
		var element = $(content);
		let item_id = Math.random().toString(36).substr(2);
		$(element).find('img').each(function () {
			let imageTitleElement = $(this).closest('.image');
			imageTitleElement = imageTitleElement.last();
			let imageTitle = imageTitleElement.text();
			let imageUrl = $(this).attr('src');
			if (imageUrl !== undefined) {
				imageUrl = imageUrl.replace("http://", "https://");
				$(this).attr('src', imageUrl);
				$(this).attr('data-type', 'cardImage');
				$(this).css('border', $(this).attr('border') + "px solid");
				let wrapped = $(this).wrap('<div class="lightbox-container"><a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '" target="_blank" data-lightbox="' + item_id + '"></a></div>').parent().prop('outerHTML');
				$(this).text(wrapped);
			}
		});

		//NOTE:
		// The jQueryObject -content- needs to be wrapped in an seperate element,
		// otherwise only the first element in content will be returned by .html()
		return $('<div/>').append(element).html();
	}

	static adjustIframe (content) {
		let element = $(content);
		$(element).find('iframe').each(function () {
			$(this).addClass('embed-responsive-item');
			$(this).parent('.image').addClass('iframe-parent');
			//Adjust the variables in cardVisuals.js if you change the aspect ratio
			let wrapped = $(this).wrap('<div class="responsive-iframe-container"><div class="embed-responsive embed-responsive-16by9"></div></div>');
			$(this).text(wrapped);
		});
		return $('<div/>').append(element).html();
	}

	static addCustomMathJax () {
		let mathJaxJoinString = '\\newcommand';
		let mathJaxCostumCommands = '<span style="display:none">$$';
		mathJaxCostumCommands += (mathJaxJoinString + config.customMathJaxDefinitions.join(mathJaxJoinString));
		return (mathJaxCostumCommands + '$$\n</span>\n');
	}

	static displayMediaControls (content) {
		let element = $(content);
		$(element).find('video').each(function () {
			$(this).attr('controls', true);
		});
		$(element).find('audio').each(function () {
			$(this).attr('controls', true);
		});
		return $('<div/>').append(element).html();
	}

	/** Adds target _blank to all links
	 *  @param {string} content - Text that contains the href
	 *  @returns {string} - The modified text
	 * */
	static setLinkTarget (content) {
		var element = $(content);
		$(element).find('a').each(function () {
			let href = $(this).attr('href');
			if (/^#/.test(href) === false && /^mailto/.test(href) === false) {
				$(this).attr('target', '_blank');
			}
		});
		return $('<div/>').append(element).html();
	}

	static expandHeader (content) {
		return content.replaceAll(new XRegExp(exportConfig.headerReplacementRegExp, "gm"), function (match) {
			return "##" + match;
		});
	}

	static convertUML (content, isMarkdeepExport = false) {
		let url = "";
		if (isMarkdeepExport) {
			url = config.plantUML.exportMarkdeepURL;
		} else {
			let urlSetting = AdminSettings.findOne({name: "plantUMLServerSettings"});
			if (urlSetting !== undefined) {
				url = urlSetting.url;
			}
		}
		let preOutput = config.plantUML.output.preUrl + url + config.plantUML.output.postUrl;
		content = content.replace(new XRegExp(config.plantUML.regexp.pre + config.plantUML.regexp.content + config.plantUML.regexp.post, "gs"), function (match) {
			match = match.replace(new XRegExp(config.plantUML.regexp.pre, "gs"), preOutput);
			match = match.replace(new XRegExp(config.plantUML.regexp.post, "gs"), config.plantUML.output.post);
			let result = asciidoctor.convert(match);
			let doc = new DOMParser().parseFromString(result, "text/html");
			if (doc.getElementsByTagName("img").length) {
				if (Route.isPresentation() || Route.isEditMode()) {
					doc.getElementsByTagName("img")[0].style.width = Session.get('currentZoomValue') + "%";
				} else {
					doc.getElementsByTagName("img")[0].style.width = "100%";
				}
				if (doc.getElementsByTagName("h2").length) {
					let item = doc.getElementsByTagName("h2")[0];
					item.parentNode.removeChild(item);
				}
				return doc.documentElement.innerHTML;
			} else {
				return result;
			}
		});
		return content;
	}

	static convert (content) {
		content = this.convertUML(content);
		content += "\n\n";
		content = window.markdeep.format(content, true);
		content = DOMPurify.sanitize(content, DOMPurifyConfig);
		content = this.setSSLAndLightBoxes(content);
		content = this.displayMediaControls(content);
		content = this.adjustIframe(content);
		content = this.setLinkTarget(content);
		content += this.addCustomMathJax();
		return content;
	}

	static initializeStylesheet () {
		$('head').append(window.markdeep.stylesheet());
	}

	static getLinkTarget (event) {
		let link = $(event.currentTarget).attr("href");
		let targetType = link.substring(link.lastIndexOf("."));
		if (targetType.substring(1, 4) === "pdf") {
			event.preventDefault();
			Session.set('activePDF', PDFViewer.enforcePageNumberToURL(link));
			PDFViewer.openModal();
		} else {
			this.anchorTarget(event);
		}
	}

	static anchorTarget (event) {
		let targetName = event.target.getAttribute('href');
		if (/^#/.test(targetName) === true) {
			event.preventDefault();
			let parent = $(event.target).closest('.md');
			let target = $(parent).find("a[name='" + targetName.substring(1) + "'][class='target']");
			if (target.length) {
				$(target)[0].scrollIntoView();
			}
			return true;
		} else {
			return false;
		}
	}
};
