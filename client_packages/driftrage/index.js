global.dr = {};

require("driftrage/drifting.js");
require("driftrage/driftCounter.js");
require("driftrage/mainmenu.js");

mp.events.add("render", () =>
{
	dr.driftMngr.pulseDrift();
});


setInterval(() =>
{
	dr.driftMngr.pulse();
}, 250);

mp.gui.chat.safeMode = false;
mp.gui.chat.push("Welcome to RAGE Multiplayer Drift server.<br/>Available hotkeys:<br/>- F1: Main Menu<br/>- F4: Vehicle Spawn Menu<br/>- F5: Vehicle Tuning Menu<br/>Available commands:<br/>- /outfit [id] - change your outfit");
mp.gui.chat.safeMode = true;