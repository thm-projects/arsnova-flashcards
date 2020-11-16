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

let MathJaxSourceUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/latest.js?config=TeX-AMS_SVG';

let defaultMathJaxConfig = {
	TeX: {equationNumbers: {autoNumber: "AMS"}},
	menuSettings: {
		zoom: "Hover",
		zscale: "250%",
		locale: "de"
	},
	messageStyle: "none"
};

let plantUML = {
	regexp: {
		pre: "[`]{3}\\s*plantuml\\s*@startuml",
		content: "(.*?)",
		post: "@enduml\\s*[`]{3}"
	},
	output: {
		preUrl: "== PlantUML\n:plantuml-server-url: ",
		postUrl: "\n[plantuml.plantuml-diagram, PlantUML Diagram, svg]\n----",
		post: "----"
	},
	exportMarkdeepURL: "https://projects.thm.de/plantuml"
};

module.exports = {
	customMathJaxDefinitions,
	MathJaxSourceUrl,
	defaultMathJaxConfig,
	plantUML
};

