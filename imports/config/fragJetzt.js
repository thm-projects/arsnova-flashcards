function getURL(url) {
	return `https://frag.jetzt/participant/room/${url.replace(/\s/g, "")}`;
}

module.exports = {
	getURL
};
