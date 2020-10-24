let consts = require("driftrage/configs/counter_json.js");
let driftConsts = require("driftrage/configs/drifting_json.js");

let levels = require("driftrage/levels.js");


const timerBarLib = require("timerbars");

let timerBars =
{
	score: new timerBarLib.TimerBar("SCORE"),
	time: new timerBarLib.TimerBar("TIME"),
	speed: new timerBarLib.TimerBar("SPEED (KM/h)"),
	inactivity: new timerBarLib.TimerBar("INACTIVITY", true),
	
	init: function()
	{		
		this.score.text = "0";
		this.score.textColor = [114, 204, 114, 255];
		
		this.time.text = "00:00";
		this.speed.text = "0";
		
		this.inactivity.progress = 0.0;
		this.inactivity.pbarFgColor = [224, 50, 50, 255];
		this.inactivity.pbarBgColor = [112, 25, 25, 255];
	},
	
	show: function(toggle)
	{
		this.time.visible = toggle;
		this.score.visible = toggle;
		this.speed.visible = toggle;
		
		if(!toggle)
		{
			this.inactivity.visible = toggle;
		}
	}
};

timerBars.init();
timerBars.show(false);

let counter =
{
	currentScore: 0,
	startTimestamp: 0,
	
	allScore: 0,
	currentLevel: 0,
	
	init: function()
	{
		dr.driftMngr.addCallback(this.start.bind(this), 0);
		dr.driftMngr.addCallback(this.end.bind(this), 1);
		dr.driftMngr.addCallback(this.process.bind(this), 2);
	},
	
	start: function()
	{
		this.currentScore = 0;
		this.startTimestamp = Date.now();
		
		timerBars.show(true);
	},
	
	end: function(reason)
	{
		timerBars.show(false);
		
		if(reason === driftConsts.DriftEndReason.LowSpeed || reason === driftConsts.DriftEndReason.LowAngle)
		{
			let calculatedLevel = levels.levelFromXP(this.allScore);
            if (this.currentLevel != calculatedLevel) {
                this.currentLevel = calculatedLevel;
            }			
			
			updateRankBar(levels.requiredExperiences[this.currentLevel - 1], levels.requiredExperiences[this.currentLevel], this.allScore, this.allScore + this.currentScore, this.currentLevel);
			//mp.game.stats.statSetInt(mp.game.joaat("SP0_TOTAL_CASH"), this.allScore, true);

			this.allScore += this.currentScore;					
			
			if(this.currentScore >= consts.FinishResults.Low)
			{
				if(this.currentScore >= consts.FinishResults.High)
				{
					// show a message?
				}
				else if(this.currentScore >= consts.FinishResults.Mid)
				{
				}
				else
				{
				}
			}
		}
		else
		{
		}
	},
	
	process: function(angle, speed, active, stopProgress)
	{
		if(active)
		{
			let score = (((angle - driftConsts.MinAngle) * consts.AngleMultiply)
				+ ((speed - driftConsts.MinSpeed) * consts.SpeedMultiply));
				
			let timePassed = Date.now() - this.startTimestamp;
			
			if(timePassed > consts.TimeBonusStart)
			{
				score *= ((timePassed - consts.TimeBonusStart) * consts.TimeMultiply);
			}
			
			score *= 0.02;
			
			this.currentScore += score;
			
			timerBars.score.text = this.currentScore.toFixed(0);
			
			timerBars.inactivity.visible = false;
		}
		
		timerBars.inactivity.progress = stopProgress;
		timerBars.inactivity.visible = true;
		
		let d = new Date(Date.now() - this.startTimestamp);
		
		let m = d.getMinutes().toString();
		let s = d.getSeconds().toString();
		
		if(m.length === 1) m = "0" + m;
		if(s.length === 1) s = "0" + s;
		
		timerBars.time.text = `${m}:${s}`;
		
		let speedStr = (speed*3.6).toFixed(0);
		
		while(speedStr.length < 3) speedStr = "0" + speedStr;
		
		timerBars.speed.text = `${speedStr}`;
		
	}
};

setInterval(() =>
{
	mp.events.callRemote("updateXPData", counter.allScore >> 0);
}, 10000);

mp.events.add("loadXPData", (exp) =>
{
	counter.allScore = exp;
});

counter.init();

dr.counter = counter;