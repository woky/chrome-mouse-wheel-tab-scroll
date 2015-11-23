"use strict";

document.addEventListener("DOMContentLoaded", () => {
	chrome.storage.sync.get(["minOffset", "direction"], o => init(o));
});

function init(o)
{
	let edit = document.getElementById("minOffset");
	let v = o.minOffset || 0;
	edit.value = v;

	let rightScroll = document.getElementById("rightScroll");
	let leftScroll = document.getElementById("leftScroll");
	if (!o.direction || o.direction == 1)
		rightScroll.checked = true;
	else
		leftScroll.checked = true;

	let save = document.getElementById("save");
	save.addEventListener("click", () => {
		chrome.storage.sync.set({
			minOffset: parseInt(edit.value, 10),
			direction: rightScroll.checked ? 1 : -1
		});
	});
}
