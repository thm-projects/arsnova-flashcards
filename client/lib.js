import {Tracker} from 'meteor/tracker';

export const markdownRenderingTracker = new Tracker.Dependency();

/** Parses a code block
 *  @author arsnova.click
 *  @param {string} result - Text that contains the code block
 *  @param {number} i - Beginning of the block
 * */
export function parseCodeBlock(result, i) {
	let tmpNewItem = result[i].replace(/\s/g, "") + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		tmpNewItem += result[j] + "\n";
		if (/^```/.test(result[j])) {
			mergeEndIndex = j;
			break;
		}
	}
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, tmpNewItem);
}

/** Parses an ordered list
 *  @author arsnova.click
 *  @param {string} result - Text that contains the ordered list
 *  @param {number} i - Beginning of the ordered list
 * */
export function parseOrderedList(result, i) {
	let tmpNewItem = result[i] + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		if (!/^[0-9]*./.test(result[j])) {
			mergeEndIndex = j - 1;
			break;
		}
		tmpNewItem += result[j] + "\n";
	}
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, tmpNewItem);
}

/** Parses an unordered list
 *  @author arsnova.click
 *  @param {string} result - Text that contains unordered list
 *  @param {number} i - Beginning of the unordered list
 * */
export function parseUnorderedList(result, i) {
	let tmpNewItem = result[i] + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		if (!/^(  )[*-+] /.test(result[j]) && !/^[0-9]*./.test(result[j])) {
			mergeEndIndex = j - 1;
			break;
		}
		tmpNewItem += result[j] + "\n";
	}
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, tmpNewItem);
}

/** Parses a comment block
 *  @author arsnova.click
 *  @param {string} result - Text that contains comment block
 *  @param {number} i - Beginning of the block
 * */
export function parseCommentBlock(result, i) {
	let tmpNewItem = result[i] + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		if (!/^> /.test(result[j])) {
			mergeEndIndex = j - 1;
			break;
		}
		tmpNewItem += result[j] + "\n";
	}
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, tmpNewItem);
}

/** Parses a strikethrough block
 *  @author arsnova.click
 *  @param {string} result - Text that contains the strikethrough block
 *  @param {number} i - Beginning of the block
 * */
export function parseStrikeThroughBlock(result, i) {
	result[i].match(/~~[^~{2}]*~~/gi).forEach(function (element) {
		result[i] = result[i].replace(element, "<del>" + element.replace(/~~/g, "") + "</del>");
	});
	return result[i];
}

/** Parses an emoji block
 *  @author arsnova.click
 *  @param {string} result - Text that contains the emoji block
 *  @param {number} i - Beginning of the block
 * */
export function parseEmojiBlock(result, i) {
	const wrapper = $("<div class='emojiWrapper'/>");
	let lastIndex = 0;
	result[i].match(/:([a-z0-9_\+\-]+):/g).forEach(function (emoji) {
		const emojiPlain = emoji.replace(/:/g, "");
		wrapper.append("<span>" + result[i].substring(lastIndex, result[i].indexOf(emoji)) + "</span>");
		lastIndex = result[i].indexOf(emoji) + emoji.length;
		wrapper.append("<img class='emojiImage' src='/img/emojis/" + emojiPlain + ".png' alt='" + emojiPlain + ".png' aria-label='" + emojiPlain + "' />");
	});
	wrapper.append("<span>" + result[i].substring(lastIndex, result[i].length) + "</span>");
	result[i] = wrapper.prop("outerHTML");
}

/** Parses a latex block
 *  @author arsnova.click
 *  @param {string} result - Text that contains latex block
 *  @param {number} i - Beginning of the block
 *  @param {string} endDelimiter - End of the block
 * */
export function parseMathjaxBlock(result, i, endDelimiter) {
	let tmpNewItem = result[i] + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		tmpNewItem += (result[j] + "\n");
		if (result[j].endsWith(endDelimiter)) {
			mergeEndIndex = j;
			break;
		}
	}
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, $("<div/>").append((tmpNewItem)).prop("outerHTML"));
}

/** Wraps image files inside a lightbox-img class
 *  @param {string} content - Text that contains the image
 *  @returns {string} - The wrapped text
 * */
export function setLightBoxes(content) {
	var element = $(content);
	$(element).find('img').each(function () {
		var imageTitle = $(this).attr('alt');
		var imageUrl = $(this).attr('src');
		$(this).attr('data-type', 'cardImage');
		var wrapped = $(this).wrap('<div class="card-image"><a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '" target="_blank" data-lightbox="' + imageUrl + '"></a></div>').parent().prop('outerHTML');
		$(this).text(wrapped);
	});

	//NOTE:
	// The jQueryObject -content- needs to be wrapped in an seperate element,
	// otherwise only the first element in content will be returned by .html()
	return $('<div/>').append(element).html();
}

/** Parses the card text for mathjax
 *  @author arsnova.click
 *  @param {string} result - The text to adjust for mathjax
 *  @param {boolean} overrideLineBreaks - Overrides line breaks for selected blocks
 *  @returns {string} - The mathjax-formatted text
 * */
export function parseGithubFlavoredMarkdown(result, overrideLineBreaks = true) {
	for (let i = 0; i < result.length; i++) {
		switch (true) {
			case /^\$\$/.test(result[i]) && overrideLineBreaks:
				parseMathjaxBlock(result, i, "$$");
				break;
			case /^\\\[/.test(result[i]) && overrideLineBreaks:
				parseMathjaxBlock(result, i, "\\]");
				break;
			case /^<math/.test(result[i]) && overrideLineBreaks:
				parseMathjaxBlock(result, i, "</math>");
				break;
			case /\$/.test(result[i]) || /\\\(/.test(result[i]):
				break;
			case /^```/.test(result[i]) && overrideLineBreaks:
				parseCodeBlock(result, i);
				break;
			case /^([0-9]*\.)?(-)?(\*)? \[x\] /.test(result[i]):
				result[i] = ("<input class='markdownCheckbox' type='checkbox' checked='checked' disabled='disabled' aria-label='ToDo (checked)' />" + result[i].replace(/([0-9]*\.)?(-)?(\*)? \[x\] /, ""));
				break;
			case /^([0-9]*\.)?(-)?(\*)? \[ \] /.test(result[i]):
				result[i] = ("<input class='markdownCheckbox' type='checkbox' disabled='disabled' aria-label='ToDo (unchecked)' />" + result[i].replace(/^([0-9]*\.)?(-)?(\*)? \[ \] /, ""));
				break;
			case /^[\s]*1\./.test(result[i]):
				parseOrderedList(result, i);
				break;
			case /^[*-+] /.test(result[i]):
				parseUnorderedList(result, i);
				break;
			case /^> /.test(result[i]):
				parseCommentBlock(result, i);
				break;
			case /~~.*~~/.test(result[i]):
				parseStrikeThroughBlock(result, i);
				break;
			case overrideLineBreaks && result[i].length === 0:
				result.splice(i, 0, "<br/>");
				i++;
				break;
			case /:[^\s]*:/.test(result[i]) && /:([a-z0-9_\+\-]+):/g.test(result[i]):
				parseEmojiBlock(result, i);
				break;
		}
	}
	result = result.join("\n");
	markdownRenderingTracker.changed();
	return result;
}
