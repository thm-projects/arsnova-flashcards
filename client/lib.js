/** Wraps image files inside a lightbox-img class
 *  @param {string} content - Text that contains the image
 *  @returns {string} - The wrapped text
 * */
export function setLightBoxes(content) {
	var element = $(content);
	let item_id = Math.random().toString(36).substr(2);
	$(element).find('img').each(function () {
		let imageTitleElement = $(this).closest('.image');
		imageTitleElement = imageTitleElement.last();
		let imageTitle = imageTitleElement.text();
		console.log(imageTitle);
		let imageUrl = $(this).attr('src');
		$(this).attr('data-type', 'cardImage');
		let wrapped = $(this).wrap('<div class="lightbox-container"><a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '" target="_blank" data-lightbox="' + item_id + '"></a></div>').parent().prop('outerHTML');
		$(this).text(wrapped);
	});

	//NOTE:
	// The jQueryObject -content- needs to be wrapped in an seperate element,
	// otherwise only the first element in content will be returned by .html()
	return $('<div/>').append(element).html();
}

export function displayVideoControls(content) {
	var element = $(content);
	$(element).find('video').each(function () {
		$(this).attr('controls', true);
	});
	return $('<div/>').append(element).html();
}

/** Adds target _blank to all links
 *  @param {string} content - Text that contains the href
 *  @returns {string} - The modified text
 * */
export function setLinkTarget(content) {
	var element = $(content);
	$(element).find('a').each(function () {
		let href = $(this).attr('href');
		if (/^#/.test(href) === false && /^mailto/.test(href) === false) {
			$(this).attr('target', '_blank');
		}
	});
	return $('<div/>').append(element).html();
}
