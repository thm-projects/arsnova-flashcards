import {MeteorMathJax} from 'meteor/mrt:mathjax';
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "./dompurify";
import "/client/thirdParty/markdeep.min.js";

let customMathJaxDefinitions = [
	"{\\n}{\\hat{n}}",
	"{\\thetai}{\\theta_\\mathrm{i}}",
	"{\\thetao}{\\theta_\\mathrm{o}}",
	"{\\d}[1]{\\mathrm{d}#1}",
	"{\\w}{\\hat{\\omega}}",
	"{\\wi}{\\w_\\mathrm{i}}",
	"{\\wo}{\\w_\\mathrm{o}}",
	"{\\wh}{\\w_\\mathrm{h}}",
	"{\\Li}{L_\\mathrm{i}}",
	"{\\Lo}{L_\\mathrm{o}}",
	"{\\Le}{L_\\mathrm{e}}",
	"{\\Lr}{L_\\mathrm{r}}",
	"{\\Lt}{L_\\mathrm{t}}",
	"{\\O}{\\mathrm{O}}",
	"{\\degrees}{{^{\\large\\circ}}}",
	"{\\T}{\\mathsf{T}}",
	"{\\mathset}[1]{\\mathbb{#1}}",
	"{\\Real}{\\mathset{R}}",
	"{\\Integer}{\\mathset{Z}}",
	"{\\Boolean}{\\mathset{B}}",
	"{\\Complex}{\\mathset{C}}",
	"{\\un}[1]{\\,\\mathrm{#1}}"
];

MeteorMathJax.sourceUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-AMS_SVG';

MeteorMathJax.defaultConfig = {
	TeX: {equationNumbers: {autoNumber: "AMS"}},
	menuSettings: {
		zoom: "Hover",
		zscale: "250%",
		locale: "de"
	},
	messageStyle: "none"
};

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
		mathJaxCostumCommands += (mathJaxJoinString + customMathJaxDefinitions.join(mathJaxJoinString));
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
};
