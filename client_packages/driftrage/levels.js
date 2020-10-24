const hudComponentID = 19;
const rankBarColor = 116; // HUD_COLOUR_FREEMODE, https://wiki.rage.mp/index.php?title=Fonts_and_Colors

const requiredExperiences = require("driftrage/configs/xp_json.js");
const maxLevel = requiredExperiences.length - 1;
const maxExperience = requiredExperiences[maxLevel];

const clamp = (value, min, max) => {
    return value <= min ? min : value >= max ? max : value;
};

const levelFromXP = (xp) => {
    return clamp(requiredExperiences.findIndex(lvlXP => lvlXP >= xp), 1, maxLevel);
};

mp.game.graphics.requestHudScaleform(hudComponentID);
		
// credits to rootcause
function updateRankBar(limit, nextLimit, previousXP, currentXP, currentLevel)
{
    if (!mp.game.graphics.hasHudScaleformLoaded(hudComponentID))
	{
        mp.game.graphics.requestHudScaleform(hudComponentID);
        while (!mp.game.graphics.hasHudScaleformLoaded(hudComponentID)) mp.game.wait(0);

        mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(hudComponentID, "SET_COLOUR");
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(rankBarColor);
        mp.game.graphics.popScaleformMovieFunctionVoid();
    }

    mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(hudComponentID, "SET_RANK_SCORES");
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(limit);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(nextLimit);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(previousXP);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(currentXP);
    mp.game.graphics.pushScaleformMovieFunctionParameterInt(currentLevel);
    mp.game.graphics.popScaleformMovieFunctionVoid();
}

exports = { updateRankBar: updateRankBar, levelFromXP: levelFromXP, requiredExperiences: requiredExperiences, maxLevel: maxLevel, maxExperience: maxExperience };