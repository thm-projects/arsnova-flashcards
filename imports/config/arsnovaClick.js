function getURL(url) {
	return `https://arsnova.click/quiz/${url.replace(/\s/g, "")}`;
}

module.exports = {
	getURL
};
