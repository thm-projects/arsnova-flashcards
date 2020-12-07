//Leave empty to disable
let exportHeaderStyle = `https://casual-effects.com/markdeep/latest/slate.css?`;

// content for markdeepCommands style
let customCSS = `
/* slate template related fixes start here */
#md {
	left: 260px;
}

.md img {
	background-color: white;
}

.md .longTOC {
	width: 220px;
}

/* other css starts here */
.md {
	text-align: left;
	hyphens: auto;
	overflow-wrap: break-word;
}

.md h1, .md .nonumberh1 {
	page-break-before:always;
}

.md .mediumTOC {
	float: none;
	page-break-after: always;
}
`;

let markdeepCommands = `<!-- Markdeep: -->
<style class=\"fallback\">
body{visibility:hidden;white-space:pre;font-family:monospace}</style>
<style>${customCSS}</style>
<script src=\"markdeep.min.js\" charset=\"utf-8\"></script>
<script src=\"https://casual-effects.com/markdeep/latest/markdeep.min.js?\" charset=\"utf-8\"></script>
<script>window.alreadyProcessedMarkdeep||(document.body.style.visibility=\"visible\")</script>`;

let headerReplacementRegExp = `^ *\\#{1,6} +`;

module.exports = {
	exportHeaderStyle,
	markdeepCommands,
	headerReplacementRegExp
};
