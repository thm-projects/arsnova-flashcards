import {Tracker} from 'meteor/tracker';

export const markdownRenderingTracker = new Tracker.Dependency();

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

export function parseLinkBlock(result, i) {
	const startIndex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/.exec(result[i]);
	const linkStr = startIndex[0] || result[i];
	const link = !/^https?:\/\//.test(linkStr) ? "http://" + linkStr : linkStr;
	const prevLinkContent = result[i].substring(0, startIndex.index);
	const postLinkContent = result[i].indexOf(" ", startIndex.index) > -1 ? result[i].substring(result[i].indexOf(" ", startIndex.index)) : "";
	result[i] = prevLinkContent + "<a href='" + link + "' target='_blank'>" + linkStr + "</a>" + postLinkContent;
}

export function parseStrikeThroughBlock(result, i) {
	result[i].match(/~~[^~{2}]*~~/gi).forEach(function (element) {
		result[i] = result[i].replace(element, "<del>" + element.replace(/~~/g, "") + "</del>");
	});
	return result[i];
}

export function parseTableBlock(result, i) {
	let tmpNewItem = result[i] + "\n";
	let mergeEndIndex = result.length;
	for (let j = i + 1; j < result.length; j++) {
		if (!/[\s:]?\|[\s:]?/.test(result[j])) {
			mergeEndIndex = j - 1;
			break;
		}
		tmpNewItem += (result[j] + "\n");
	}
	const tmpNewItemElement = $("<table><thead></thead><tbody></tbody></table>");
	let tableHasHeader = /[-]+[\s:]?|[\s:]?[-]+/.test(tmpNewItem);
	const tableHeaderMetadata = [];
	if (tableHasHeader) {
		tmpNewItem.match(/([\|]?)([\s:]+[-]+[\s:]+)([\|]?)/g).forEach(function (element) {
			element = element.replace(/\|/g, "");
			const hasLeftAlign = element.startsWith(":") || (element.startsWith(" ") && element.endsWith(" "));
			const hasRightAlign = element.endsWith(":");
			if (hasLeftAlign && hasRightAlign) {
				tableHeaderMetadata.push({align: "center"});
			} else {
				if (hasLeftAlign) {
					tableHeaderMetadata.push({align: "left"});
				} else if (hasRightAlign) {
					tableHeaderMetadata.push({align: "right"});
				}
			}
		});
	}
	let columnCounter = 0;
	tmpNewItem.split(/[\s:]?\|[\s:]?/).forEach(function (element) {
		if (element === "") {
			columnCounter = 0;
			return;
		}
		if (/~~.*~~/.test(element)) {
			element = parseStrikeThroughBlock([element], 0);
		}
		if (/[\*\_]{2}.*[\*\_]{2}/.test(element)) {
			element = "<strong>" + element.replace(/[\*\_]/g, "") + "</strong>";
		}
		if (/[\*\_]{1}.*[\*\_]{1}/.test(element)) {
			element = "<em>" + element.replace(/[\*\_]/g, "") + "</em>";
		}
		if (/[\W]+[-]+[\W]+/.test(element)) {
			tableHasHeader = false;
			columnCounter = 0;
		} else {
			if (tableHasHeader) {
				tmpNewItemElement.find("thead").append($("<th style='text-align: " + tableHeaderMetadata[columnCounter].align + ";'/>").html(element));
			} else {
				if (columnCounter === 0) {
					tmpNewItemElement.find("tbody").append($("<tr/>"));
				}
				tmpNewItemElement.find("tbody").find("tr").last().append($("<td style='text-align: " + tableHeaderMetadata[columnCounter].align + ";'/>").html(element));
			}
			columnCounter++;
		}
	});
	result.splice(i, mergeEndIndex - i + 1);
	result.splice(i, 0, tmpNewItemElement.prop('outerHTML'));
}

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

export function setLightBoxes(content) {
	$(content).find('img').each(function () {
		var imageTitle = $(this).attr('alt');
		var imageUrl = $(this).attr('src');
		content = $(this).wrap('<a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '"></a>').parent().prop('outerHTML');
	});
	return content;
}

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
			case !/(^!)?\[.*\]\(.*\)/.test(result[i]) && /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/.test(result[i]) && !(/youtube/.test(result[i]) || /youtu.be/.test(result[i]) || /vimeo/.test(result[i])):
				parseLinkBlock(result, i);
				break;
			case overrideLineBreaks && result[i].length === 0:
				result.splice(i, 0, "<br/>");
				i++;
				break;
			case /[\s:]?\|[\s:]?/.test(result[i]):
				parseTableBlock(result, i);
				break;
			case /:[^\s]*:/.test(result[i]) && /:([a-z0-9_\+\-]+):/g.test(result[i]):
				parseEmojiBlock(result, i);
				break;
		}
	}
	markdownRenderingTracker.changed();
}
