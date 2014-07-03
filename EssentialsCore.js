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
	Essentials.DepsMet = function(plug){
		if(!this.Enabled) return false;
		for(var i = 0; i < plug.Dependencies; i++){
			if(DataStore.Get(this.DStable, plug.Dependencies[i][0]) == undefined) { return false;} // dependency plugin is not registered
			if(DataStore.Get(this.DStable, plug.Dependencies[i][0]) < plug.Dependencies[i][1]){ return false; } // low version
		}
		return true;
	};
	Essentials.ShowOnline = function(Player) { //works
		try {
			if(!this.Enabled) return;
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
			this.ErrorHandler("Essentials.ShowOnline( Magma.Player{" + Player.Name + "} )", err);
		}
	};
	Essentials.RegPlugin = function(plug){ // if I stringify them, I can store them in the ds
		try {
			if(!this.Enabled) return;
				var version = DataStore.Get(this.DStable, plug.Name);
				if(version == plug.VersionNum) return; // already registered
				UnityEngine.Debug.Log(plug.Name + " (v" + plug.Version + ") was " + version === undefined ? "registered" : "updated" + " succesfully!");
				DataStore.Add(this.DStable, plug.Name, plug.VersionNum);
		} catch (err) {
			Essentials.ErrorHandler("Essentials.RegPlugin( Essentials.Plugin{" + plug.Name + "} )", err);
		}
	};
	Essentials.PersonalMessage = function(sender, targetPlayerName, msg) { // works
		try {
			if(!this.Enabled) return;
			var targetPlayer = Magma.Player.FindByName(targetPlayerName);
			if(!targetPlayer) { sender.Message("Can't find: " + targetPlayerName); return;}
			if(!msg){ sender.Message("[color #CC3400]Your message can't be: " + msg); return;}
			if(sender.Name == targetPlayer.Name) return; // you can't pm yourself
			targetPlayer.MessageFrom("[" + sender.Name + " -> You]", msg);
		} catch (err) {
			Essentials.ErrorHandler("Essentials.PersonalMessage( Magma.Player{" + sender.Name + "}, " + targetPlayerName + ", " + msg + ")", err);
		}
	};
	Essentials.ShowMOTD = function(Player) {	// probably a list off commands, stored in the ds, and a way for other plugins to add their own
		try {						// probably not showing everything in one msg, start a timer, call it once and kill
			if(!this.Enabled) return;
			Player.Message("Welcome, " + Player.Name); 
			Player.Message("This server is running Magma(v."+Magma.Bootstrap.Version+") and "  + this.Name+"(v."+this.Version+")");
			this.ShowOnline(Player);
		} catch (err) {
			Essentials.ErrorHandler("Essentials.ShowMOTD( Magma.Player{" + Player.Name + "} )", err);
		}
	};
	Essentials.ArgsToText = function(args, separator) {
		try {
			if(!this.Enabled) return;
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
			this.ErrorHandler("Essentials.ArgsToText( args{" + this.ArgsToText(args, ", ") + "}, separator('" + separator + "')", err);
		}
	};
	Essentials.ArgsToTextFromTo = function(args, from, to, separator) { //need test
		try {
			if(!this.Enabled) return;
			if(to > args.Length || from > to) return undefined;
			if (args.Length == 1) {
				return args[0];
			} else {
				if(separator == undefined) separator = " ";
				var text;
				for (var l = (from - 1); l < to; l++) {
					if (text != undefined) text += separator + args[l]; // args is from c#-land I don't remember how to join a c# array, I will do it later
					if (text == undefined) text += args[l];
				}
				return text;
			}
		} catch (err) {
			this.ErrorHandler("Essentials.ArgsToTextFromTo( args{" + this.ArgsToText(args, ", ") + "} , " + from + ", " + to + ", " + "separator('" + separator + "')", err);
		}
	};
	Essentials.ArrayOfWordsToLines = function(arr, words, separator) { //need test
		try {
			if(!this.Enabled) return;
			if(!separator) separator = " ";
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
			this.ErrorHandler("Essentials.ess_arrayOfWordsToLines( args{" + this.ArgsToText(args, ", ") + "} , " + words + ", " + "separator('" + separator + "')", err);
		}
	};
	Essentials.ErrorHandler = function(cause, err){
		try {
			if(!this.Enabled) return;
			UnityEngine.Debug.Log(cause + " -> " + String(err));
			Plugin.Log(cause.substr(0, cause.indexOf("(")), cause + " -> " + String(err));
		} catch(err){
			this.ErrorHandler("Essentials.ErrorHandler(" + cause + ", " + String(err) + ")", err);
		}
	};
}());

function On_PluginInit(){
	if(Essentials.Enabled === undefined){
		Essentials.Enabled = true;
	}
}

function On_Command(Player, cmd, args){ // this could be added to a handler, with other plugin's commands
	try{
		if(!Essentials.Enabled) return;
		switch(cmd){
			case "players":
				Essentials.ShowOnline(Player);
			break;
			case "pm":
				Essentials.PersonalMessage(Player, args[0], args[1]); // I'm lazy now
			break;
		}
	} catch(err) {
		Essentials.ErrorHandler("Essentials.On_Command( Magma.Player{" + Player.Name + "} , " + cmd + ", args{" + Essentials.ArgsToText(args, ", ") + "} )", err);
	}
}
