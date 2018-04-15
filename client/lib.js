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
		var wrapped = $(this).wrap('<div class="lightbox-container"><a href="' + imageUrl + '" class="lightbox-img" title="' + imageTitle + '" target="_blank" data-lightbox="' + imageUrl + '"></a></div>').parent().prop('outerHTML');
		$(this).text(wrapped);
	});

	//NOTE:
	// The jQueryObject -content- needs to be wrapped in an seperate element,
	// otherwise only the first element in content will be returned by .html()
	return $('<div/>').append(element).html();
}
