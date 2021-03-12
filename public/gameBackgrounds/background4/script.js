/*
	If you want to use this code on your site, download the video
	https://www.dropbox.com/s/7zqthe2s4pbk4xv/smoke.mp4?dl=0
	Upload it to your server, and replace the source of the video element in the HTML.

	Don't use the video from my server. Hotlinking is blocked. So it WILL NOT work. You may be able to see the video because the browser serves it from cache. But your site's visitors, WON'T see it.
	
	Also, I'd be pleased if you share links to the pages where you've used the pen in the comments.
	
	Thanks ;)
*/

// There is a Chrome bug preventing text from being shown. I don't really know how to properly work around it. This helps I guess.
setTimeout(() => {
	document.querySelector('.heading-first').style.top = '2px';
	document.querySelector('.heading-first').getBoundingClientRect();
	document.querySelector('.heading-first').style.top = '';
}, 100);