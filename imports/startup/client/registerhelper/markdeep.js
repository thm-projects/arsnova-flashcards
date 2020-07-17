import {MeteorMathJax} from 'meteor/mrt:mathjax';
import {MarkdeepContent} from "../../../util/markdeep";


const markdeepHelper = new MeteorMathJax.Helper({
	useCache: false,
	transform: function (content) {
		return MarkdeepContent.convert(content);
	}
});

Template.registerHelper("getMaximumText", function (text) {
	const maxLength = 15;
	const textSplitted = text.split(" ");
	if (textSplitted.length > maxLength) {
		return textSplitted.slice(0, maxLength).toString().replace(/,/g, ' ') + "...";
	}
	return text;
});

Template.registerHelper('markdeep', markdeepHelper.getTemplate());
