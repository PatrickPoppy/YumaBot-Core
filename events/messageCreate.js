/*
messageCreate event, autogenerated by the framework, coded by Vex
*/

var Cleverbot = require("cleverbot-node");
var cleverbot = new Cleverbot();

function sendHelpMessage(bot, msg, suffix, commands, config){
	if(msg.channel.guild){
		bot.createMessage(msg.channel.id, " Alright! Check your PM :thumbsup: ");
	};
	var cmdlen = 0;
	if(!suffix){
		var tags = {};
		var other = [];
		var msgArray = [];
    	var keys = Object.keys(commands);
    	for(var key in commands){
			if(!commands[key].tag || commands[key].tag == undefined){
				other.push(key);
			}else{
				if(!tags[commands[key].tag]){
					tags[commands[key].tag] = [];
				}
				tags[commands[key].tag].push(key)
			}
		}
		var datMsg = "";
		for(var key in tags){
			datMsg += `**${key}**: ${tags[key].join(", ")}\n`;
		}

		if(other.length !== 0){
			msgArray.push(datMsg + `**Other: **${other}`);
		}else{
			msgArray.push(datMsg);
		}
		msgArray.push("\n**Tag Info**\n`Basic`: Most basic commands"); /* This is not a generatable string, this is also actually not that necessary, edit/delete this line if needed */
		msgArray.push("\n\n**Want more information on the command?\nTry `>help <command-name>`**");
		bot.getDMChannel(msg.author.id).then(c => {c.createMessage(msgArray.join("\n"))})
	}
	if(suffix){
		if(!msg.guild){
			if(commands[suffix]){
				bot.createMessage(msg.channel.id, commands[suffix].help);
			}else{
				bot.createMessage(msg.channel.id, msg.author.username+", There is no such\""+suffix+"\" command!");
				return;
			}
			bot.createMessage(msg.channel.id, msgArr.join("\n"));
		}else{
			bot.createMessage(msg.channel.id, "Please execute this in DM")
		}
	}
}

module.exports = {
    execute(bot, msg, config, commands, logger, plugins){
        if(!msg.channel.guild){
    		if(/(^https?:\/\/discord\.gg\/[A-Za-z0-9]+$|^https?:\/\/discordapp\.com\/invite\/[A-Za-z0-9]+$)/.test(msg.content)){
    			if(config.clientID && config.clientID !== "") msg.channel.createMessage("**Please use this to invite me to your server: ** https://discordapp.com/oauth2/authorize?client_id="+config.clientID+"&scope=bot");
    		}
    	}
        if(msg.author.bot){
        	return;
        }
        if(msg.author.id != bot.user.id && (msg.content.startsWith(config.prefix) || msg.content.indexOf(bot.user.mention) == 0)){
            var cmdtxt = msg.content.split(" ")[0].substring(config.prefix.length);
            var suffix = msg.content.substring(config.prefix.length + cmdtxt.length + 1);
            if(msg.content.indexOf(bot.user.mention) == 0){
                if(msg.content.length == bot.user.mention.length){
                    bot.createMessage(msg.channel.id, "Yeah?");
                }else{
					if(config.cleverbot && config.cleverbot == false) return;
					Cleverbot.prepare(function(){
						bot.sendChannelTyping(msg.channel.id);
						cleverbot.write(suffix, function(response){
							bot.createMessage(msg.channel.id, response.message);
							bot.cleverResponses++;
						});
					});
					logger.logCommand(msg);
                }
            }
            var cmd;
            for(let name in commands){
                if(name == cmdtxt || (commands[name].aliases && commands[name].aliases.includes(cmdtxt))){
                    cmd = name;
                }
            }
			if(commands[cmdtxt]) cmd = cmdtxt;
            if(commands[cmd]){
                commands[cmd].exec(bot, msg, suffix, plugins, logger);
            }

			if(cmdtxt == "help" || cmdtxt == "halp"){
				sendHelpMessage(bot, msg, suffix, commands, config)
			}
        }
    }
}
