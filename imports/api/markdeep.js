import {MeteorMathJax} from 'meteor/mrt:mathjax';
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../config/dompurify.js";
import "/client/thirdParty/markdeep.min.js";
import * as config from "../config/markdeep.js";
import {CardType} from "./cardTypes";

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
			imageUrl = imageUrl.replace("http://", "https://");
			$(this).attr('src', imageUrl);
			$(this).attr('data-type', 'cardImage');
			$(this).css('border', $(this).attr('border') + "px solid");
			let wrapped = $(this).wrap('<div class="lightbox-container"><a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '" target="_blank" data-lightbox="' + item_id + '"></a></div>').parent().prop('outerHTML');
			$(this).text(wrapped);
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

	static convert (content) {
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

	static exportContent (cards, cardset, whitelist) {
		let newline = " \n\n ";
		let pagebreak = newline + "\\pagebreak" + newline;
		let content = '<meta charset=\"utf-8\" emacsmode=\"-*- markdown -*-\">\n\n';
		content += "(#) " + cardset.name + newline;
		content += pagebreak;
		let sideOrder = CardType.getCardTypeCubeSides(cardset.cardType);
		let filteredSides = [];
		for (let i = 0; i < sideOrder.length; i++) {
			if (whitelist.includes(sideOrder[i].contentId)) {
				filteredSides.push(sideOrder[i]);
			}
		}
		for (let i = 0; i < cards.length; i++) {
			for (let s = 0; s < filteredSides.length; s++) {
				let sideContent = cards[i][CardType.getContentIDTranslation(filteredSides[s].contentId)];
				if (sideContent !== undefined && sideContent.trim().length > 0) {
					content += "(##) " + cards[i].subject + " (" + TAPi18n.__('card.cardType' + cardset.cardType + '.content' + filteredSides[s].contentId) + ")" + newline;
					content += sideContent;
					content += pagebreak;
				}
			}
		}
		return content + '<!-- Markdeep: --><style class=\"fallback\">body{visibility:hidden;white-space:pre;font-family:monospace}</style><script src=\"markdeep.min.js\" charset=\"utf-8\"></script><script src=\"https://casual-effects.com/markdeep/latest/markdeep.min.js?\" charset=\"utf-8\"></script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility=\"visible\")</script>';
	}
};
