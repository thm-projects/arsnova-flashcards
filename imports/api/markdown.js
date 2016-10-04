import {check} from "meteor/check";

Meteor.methods({
	convertMarkdown: function (markdown) {
		check(markdown, String);
		kramed.setOptions({
			gfm: true,
			tables: true,
			breaks: true,
			katex: true,
			highlight: function (code) {
				return hljs.highlightAuto(code).value;
			}
		});
		return kramed(markdown);
	}
});
