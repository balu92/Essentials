var Essentials = {
	Name:		"Essentials",
	Version:	"0.0.1",
	Author:		"The Magma Essentials Team",
	DStable:	"Essentials_Core",
	VersionNum:	0.01,
	get Enabled () { return DataStore.Get(this.DStable, "Enabled");},
	set Enabled (bool) { DataStore.Add(this.DStable, "Enabled", bool);}
};

(function(){
	Essentials.DepsMet	= function(plug){
		if(!this.Enabled) return false;
		for(var i = 0; i < plug.Dependencies; i++){
			if(DataStore.Get(this.DStable, plug.Dependencies[i][0]) == undefined) { return false;}
			if(DataStore.Get(this.DStable, plug.Dependencies[i][0]) < plug.Dependencies[i][1]){ return false; }
		}
		return true;
	};
	Essentials.RegPlugin= function(plug){
		if(!this.Enabled) return;
		if(DataStore.Get(this.DStable, "Plugins") == undefined){
			var _plugins = [];
			_plugins.push(plug);
			DataStore.Add(this.DStable, "Plugins", _plugins);
			DataStore.Add(this.DStable, plug.Name, plug.VersionNum);
			UnityEngine.Debug.Log(plug.Name + " (v" + plug.Version + ") was registered succesfully!");
		} else {
			var _plugins = DataStore.Get(this.DStable, "Plugins");
			switch(DataStore.Get(this.DStable, plug.Name)){
				case undefined:
					_plugins.push(plug);
					UnityEngine.Debug.Log(plug.Name + " (v" + plug.Version + ") was registered succesfully!");
					DataStore.Add(this.DStable, plug.Name, plug.VersionNum);
				break;
				case plug.VersionNum:
				break;
				default:
					for(var i = 0; i < _plugins.length;i++){
						if(_plugins[i].Name == plug.Name){
							_plugins[i] = plug;
							UnityEngine.Debug.Log(plug.Name + " was updated succefully (v" + plug.Version + ")!");
							DataStore.Add(this.DStable, plug.Name, plug.VersionNum);
							continue;
						}
					}
				break;
			}
			DataStore.Add("Essentials", "Plugins", _plugins);
		}
	};
}());

function On_PluginInit(){
	if(Essentials.Enabled == undefined){
		Essentials.Enabled(true);
	}
}

function ess_showMOTD(Player) {
	Player.Message("Welcome, " + Player.Name);
	Player.Message("This server is running Essentials V0.0.1");
	ess_showOnline(Player);
}

function On_Command(Player, cmd, args){
	try{
		if(cmd == "getit"){
			var plugs = DataStore.Get(Essentials.DStable, "Plugins");
			Player.Message(plugs.length);
			for(var i = 0; i < plugs.length; i++){
				Player.Message(plugs[i].Name);
			}
		}
		if(cmd == "delit"){
			DataStore.Flush(Essentials.DStable);
		}
		if(cmd == "saveds"){
			DataStore.Save();
		}
		if(cmd == "players"){
			ess_showOnline(Player);
		}
		if(cmd == "pm"){
			ess_personalMessage(Player, args[0], args[1]);
		}
	} catch(err) {
		ess_errorHandler("Essentials.On_Command(" + Player.Name + ", " + cmd + ", args{" + ess_argsToText(args, ", ") + "})", err);
	}
}

function ess_showOnline(Player) { //works
    try {
		var PC;
		if(!Util.TryFindType("PlayerClient", PC)) return;
		if(PC.All.Count == 1){
			Player.Message("You are alone!"); return;
		}
		Player.Message("There are " + PC.All.Count + " players online:");
		var numA = 0; // number of players/line | don't		| change -> if(numA > 6)
		var numB = 0; // max number of lines	| change	| change -> if(numB >= 50)
		var str = ""; //						| these
		for(var playerclient in PC.All){
			numB++;
			if(numB >= 50){ numA = 0; break;
			} else { str += playerclient.userName + ", "; if(numA > 6) { numA = 0; Player.Message(str); str = "";} else numA++; }
		}
		if(numA == 0) return;
		Player.Message(str);
    } catch (err) {
		ess_errorHandler("Essentials.ess_showOnline( Magma.Player{" + Player.Name + "})", err);
    }
}

function ess_personalMessage(sender, targetPlayerName, msg) { // works
    try {
        var targetPlayer = Magma.Player.FindByName(targetPlayerName);
		if(targetPlayer == undefined) { sender.Message("Couldn't find: " + targetPlayerName); return;}
		if(!msg){ sender.Message("[color #CC3400]Your message can't be: " + msg); return;}
		if(sender.Name == targetPlayer.Name) return;// you can't pm yourself
        targetPlayer.MessageFrom("[" + sender.Name + " -> You]", msg);
    } catch (err) {
		ess_errorHandler("Essentials.ess_personalMessage( Magma.Player{" + sender.Name + "}, " + targetPlayerName + ", " + msg + ")", err);
    }
}
function ess_argsToText(args, separator) {
    try {
		if (args.Length == 1) {
			return args[0];
		} else {
			if(separator == undefined) separator = " ";
			var text;
			for (var l = 0; l < args.Length; l++) {
				if (text != undefined) text += separator + args[l];
				if (text == undefined) text += args[l];
			}
			return text;
		}
    } catch (err) {
		ess_errorHandler("Essentials.ess_argsToText( args{" + ess_argsToText(args, ", ") + "}, separator('" + separator + "')", err);
    }
}

function ess_argsToTextFromTo(args, from, to, separator) { //need test
    try {
		if(to > args.Length || from > to) return undefined;
		if (args.Length == 1) {
			return args[0];
		} else {
			if(separator == undefined) separator = " ";
			var text;
			for (var l = (from - 1); l < to; l++) {
				if (text != undefined) text += separator + args[l];
				if (text == undefined) text += args[l];
			}
			return text;
		}
    } catch (err) {
		ess_errorHandler("Essentials.ess_argsToTextFromTo( args{" + ess_argsToText(args, ", ") + "}, " + from + ", " + to + ", " + "separator('" + separator + "')", err);
    }
}

function ess_arrayOfWordsToLines(arr, words, separator) { //need test
    try {
		if(separator == undefined) separator = " ";
		var lines = [];
		var line;
		var plus = 0;
		var arrlen = 0; if(arr.hasOwnProperty("length")) arrlen = arr.length; else if (arr.hasOwnProperty("Length")) arrlen = arr.Length; else return;
		for(var i = 0; i < (arrlen/words); i++) { //probably we will need to check if its length or Length (js object or native)
			for(var j = plus; j < words; i++) {
				if(arr[j] != undefined) {
					if (line != undefined) line += separator + arr[j];
					if (line == undefined) line += arr[j];
				}
			}
			lines.push(line);
			line = undefined;
			plus += words;
		}
		return lines;
    } catch (err) {
		ess_errorHandler("Essentials.ess_arrayOfWordsToLines( args{" + ess_argsToText(args, ", ") + "}, " + words + ", " + "separator('" + separator + "')", err);
    }
}

function ess_errorHandler(cause, err){
	try {
		UnityEngine.Debug.Log(cause + " -> " + err.ToString());
		Plugin.Log(cause.substr(0, cause.indexOf("(")), cause + " -> " + err.ToString());
	} catch(err){
		ess_errorHandler("ess_errorHandler(" + cause + ", " + err.ToString() + ")", err);
	}
}
