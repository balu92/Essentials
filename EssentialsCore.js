/*
 * EssentialsCore
 * V0.0.1
 * Made by The Magma Essentials Team
 *
 */
 

function ess_showMOTD(Player) {
	Player.Message("Welcome, " + Player.Name);
	Player.Message("This server is running Essentials V0.0.1");
	ess_showOnline(Player);
}
function ess_showOnline(Player) { //need test
	var onlinePlayers = "";
	for (player in Server.Players) {
		if (player != Server.Players[Server.Players.Length - 1]) {
			onlinePlayers += player.Name + ", ";
		} else if (player == Server.Players[Server.Players.Length - 1]) {
			onlinePlayers += player.Name;
		}
	var numOfOnlinePlayers = Server.Players.Length;
	Player.Message("There are " + numOfOnlinePlayers + " players online:");
	Player.Message(onlinePlayers);
}
/******/
function ess_kickPlayer(targetPlayer) { //do we really need a separate functions to execute one line?
	targetPlayer.Disconnect();
}
function ess_killPlayer(targetPlayer) {
	targetPlayer.Kill();
}
function ess_tpToPlayer(Player, targetPlayer) {
	Player.TeleportTo(targetPlayer);
}
/******/

function ess_messagePlayer(sender, msg) { //need test
    try {
        var targetPlayer = Magma.Player.FindByName(args[0]);
        var msg = ess_argsToText(args);
        targetPlayer.Message("[color #F8D03B][[color #E11A1A] " + sender.Name + "[color #FFFFFF] -> [color #F9D03B]You][color #FFFFFF]: " + msg);
    } catch (err) {
        if (targetPlayer == undefined) {
            sender.Message("Could not find player");
        }
        if (msg == undefined) {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        } else {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        }
    }
}

function ess_messagePlayerByArgs(sender, args) { //need test -- if args[0] is playername, playernames with space could mean trouble
    try {
        var targetPlayer = Magma.Player.FindByName(args[0]);
        var msg = ess_msgArgsToText(args);
        targetPlayer.Message("[color #F8D03B][[/color][color #E11A1A] " + sender.Name + "[/color][color #FFFFFF] ->[/color] [color #F9D03B]You][/color][color #FFFFFF]:[/color] " + msg);
    } catch (err) {
        if (targetPlayer == undefined) {
            sender.Message("Could not find player");
        }
        if (msg == undefined) {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        } else {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        }
    }
}

/*DO NOT USE messagePlayerByName FOR THE MOMENT*/
function ess_messagePlayerByName(sender, targetPlayerName, msg) { //need test
    try {
        var targetPlayer = Magma.Player.FindByName(targetPlayerName);
        targetPlayer.Message("[" + sender.Name + " -> You]: " + msg);
    } catch (err) {
        if (targetPlayer == undefined) {
            sender.Message("Could not find player");
        }
        if (msg == undefined) {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        } else {
            sender.Message("Valid Syntax: /msg (Player) (Message)");
        }
    }
}
function ess_argsToText(args) {
    if (args.Length == 1) {
        return args[0];
    } else {
		var text;
        for (var l = 0; l < args.Length; l++) {
            if (text != undefined) text += " " + args[l];
			if (text == undefined) text += args[l];
        }
		return text;
    }
}

function ess_ArgsToTextFromTo(args, from, to) { //need test
    if(to > args.Length || from > to) return undefined;
	if (args.Length == 1) {
        return args[0];
    } else {
		var text;
        for (var l = (from - 1); l < to; l++) {
            if (text != undefined) text += " " + args[l];
			if (text == undefined) text += args[l];
        }
		return text;
    }
}

function ess_ArrayOfWordsToLines(arr, words) { //need test
	var lines = [];
	var line;
	var plus = 0;
	for(var i = 0; i < (arr.Length/words); i++) { //probably we will need to check if its length or Length (js object or native)
		for(var j = plus; j < words; i++) {
			if(arr[j] != undefined) {
				if (line != undefined) line += " " + arr[j];
				if (line == undefined) line += arr[j];
			}
		}
		lines.push(line);
		line = undefined;
		plus += words;
	}
	return lines;
}
