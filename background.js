"use strict";

chrome.runtime.onMessage.addListener((req, sender, cb) => {
	let ret = false;

	switch (req.type) {
		case "isgtk":
			chrome.runtime.getPlatformInfo(p => {
				cb(p.os == "linux" || p.os == "openbsd");
			});
			ret = true;
			break;
		case "scroll":
			chrome.tabs.query({currentWindow: true}, tabs => {
				let idx = (sender.tab.index + req.dir + tabs.length) % tabs.length;
				chrome.tabs.update(tabs[idx].id, {active: true});
			});
			break;
	}

	return ret;
});
