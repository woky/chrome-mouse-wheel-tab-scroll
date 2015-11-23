(function () {
"use strict";

let minOffset = 0;
let direction = 1;

function syncSettings(items) {
	let v = items["minOffset"];
	if (v)
		minOffset = v;
	v = items["direction"];
	if (v)
		direction = v;
}
chrome.storage.onChanged.addListener(syncSettings);
chrome.storage.sync.get(["minOffset", "direction"], syncSettings);

/* GTK+ shows context-menu on mouse press. It could be easily disabled here but
   that'd be too intrusive and so only Shift modifier will work. */

chrome.runtime.sendMessage({type: "isgtk"}, gtk => {
	if (gtk)
		initGtk();
	else
		initWindows();
});

let offset = 0;

function handleWheelScroll(ev)
{
	offset += ev.deltaY + ev.deltaX; // got X on Linux, Y on Windows
	let d;
	if (offset > minOffset)
		d = -1;
	else if (offset < -minOffset)
		d = 1;
	else
		return;
	chrome.runtime.sendMessage({type: "scroll", dir: d * direction});
	offset = 0;
}

function initGtk()
{
	window.addEventListener("wheel", ev => {
		if (!ev.shiftKey)
			return;
		handleWheelScroll(ev);
		ev.preventDefault();
	});
}

function initWindows()
{
	let mouseDown = false;
	let preventMenu = false;

	window.addEventListener("wheel", ev => {
		if ((ev.buttons & 2) == 0 && !ev.shiftKey)
			return;
		handleWheelScroll(ev);
		ev.preventDefault();
		preventMenu = true;
	});

	/* It'd be nice to prevent context-menu with ev.stopPropagation() in
	   "mouseup" handler but I couldn't get it to work. */

	window.addEventListener("mousedown", ev => {
		if (ev.button != 2)
			return;
		mouseDown = true;
		preventMenu = false;
	});

	window.addEventListener("mouseup", ev => {
		if (ev.button != 2)
			return;
		if (!mouseDown)
			preventMenu = true;
		else
			mouseDown = false;
	});

	window.addEventListener('contextmenu', ev => {
		if (preventMenu) {
			ev.preventDefault();
			preventMenu = false;
		}
	});
}

})();
