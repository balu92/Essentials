var Permissions = {
	Name:		"Permissions",
	Author:		"The Magma Essentials Team",
	Version:	"0.1.3",
	VersionNum:	0.13,
	Dependencies:	[
						["Essentials", 0.01]
					],
	DStable:	"Essential_Permissions",
	Flags:		[ "essentials.admin",
				  "essentials.mute",
			      "essentials.unmute",
				  "essentials.teleport",
				  "essentials.kill",
				  "essentials.kick",
				  "essentials.ban",
				  "essentials.unban",
				  "essentials.loadout",
				  "essentials.announce",
				  "essentials.give.self",
				  "essentials.give.player",
				  "essentials.give.*",
				  "essentials.god",
				  "essentials.save",
				  "essentials.reload",
				  "essentials.instako",
				  "essentials.mod",
				  "essentials.info"
				],
	_flags:		[],
	get Enabled () { return DataStore.Get(this.DStable, "Enabled");},
	set Enabled (bool) { DataStore.Add(this.DStable, "Enabled", bool);},
	GetFlags:	function(){
		var flagnum = parseInt(this.Ini.Get("Flags", "Flags", "count"));
		for(var i = 0; i < flagnum; i++){
			var j = i+1;
			_flags.push(this.Ini.Get("Flags", "Flags", j));
		}
		return _flags;
	},
	Init:		function(){
		if(!Plugin.IniExists("Flags")){
			Util.ConsoleLog("[color #33d356]Permissions: first time initialization...", true);
			var ini = Plugin.CreateIni("Flags");
			var count;
			for(var i = 1; i < (this.Flags.length + 1); i++){
				ini.AddSetting("Flags", i, this.Flags[i]);
				count = i;
			}
			ini.AddSetting("Flags", "count", count);
			ini.Save();
			Util.ConsoleLog("[color #33d356]Permissions: Permissions.ini created successfully", true);
			DataStore.Add(this.DStable, "reserved", "reserved");
		}
	},
	PlayerFlags: function(Player){
		// return a string, an array, or just do a player.message of the flags
		// if its a string or playermsg and its too long, need to break it into lines
		if(DataStore.Get(this.DStable, Player.SteamID) != undefined){
			var str = DataStore.Get(this.DStable, Player.SteamID);
			var flags = Data.Substring(str, 1, str.length -2).replace(/\|/g, ", ");
			return flags;
		}
		return Player.Name + " has no flags!";
	},
	IsAdmin:	function(Player){
		if(Player.Admin || this.HasFlag(Player, "essentials.admin"))
			return true;
		return false;
	},
	IsValidFlag:function(Flag){
		var flags = this.GetFlags();
		for(var i = 0; i < this.flags.length; i++)
			if(Data.ToLower(this.flags[i]) == Data.ToLower(Flag))
				return true;
		return false;
	},
	HasFlag:	function(Player, Flag){
		Flag = Data.ToLower(Flag);
		if(DataStore.Get(this.DStable, Player.SteamID) == undefined){
			return false;
		}
		if(DataStore.Get(this.DStable, Player.SteamID).Contains("|" + Flag + "|"))
			return true;
		return false;
	},
	AddFlag:	function(Player, Flag){
		Flag = Data.ToLower(Flag);
		if(!this.IsValidFlag(Flag)){
			return Flag + " is not a valid flag!"; //false
		}
		if(!this.HasFlag(Player, Flag)){
			if(DataStore.Get(this.DStable, Player.SteamID) != undefined){
				DataStore.Add(this.DStable, Player.SteamID, DataStore.Get(this.DStable, Player.SteamID) + Flag + "|");
				this.Ini.Add("Permissions", "Flags", Player.SteamID, this.Ini.Get("Permissions", "Flags", Player.SteamID) + Flag + "|");
				return Player.Name + " now has " + Flag + " flag"; //true
			} else {
				DataStore.Add(this.DStable, Player.SteamID, "|" + Flag + "|");
				this.Ini.Add("Permissions", "Flags", Player.SteamID, "|" + Flag + "|");
				return Player.Name + " now has " + Flag + " flag"; //true
			}
		} else {
			return Player.Name + " already has " + Flag + " flag!"; //false?
		}
	},
	UnFlag:		function(Player, Flag){
		Flag = Data.ToLower(Flag);
		if(!this.IsValidFlag(Flag))
			return Flag + " is not a valid flag!"; //false
		if(this.HasFlag(Player, Flag)){
			DataStore.Add(this.DStable, Player.SteamID, DataStore.Get(this.DStable, Player.SteamID).replace("|" + Flag, ""));
			this.Ini.Add("Permissions", "Flags", Player.SteamID, this.Ini.Get("Permissions", "Flags", Player.SteamID).replace("|" + Flag, ""));
			return Player.Name + " does not have " + Flag + " flag anymore."; //true
		} else {
			return Player.Name + " doesn't have " + Flag + " flag."; //true?
		}
	},
	FlushFlags:	function(){
		DataStore.Flush(this.DStable);
		Plugin.DeleteLog("Permissions");
	},
	Ini:		{
		Add:		function(file_name, tbl_name, key, value){
			if(!Plugin.IniExists(file_name)){
				var ini = Plugin.CreateIni(file_name);
				ini.AddSetting(tbl_name, key, value);
				ini.Save();
				return;
			}
			var ini = Plugin.GetIni(file_name);
			ini.AddSetting(tbl_name, key, value);
			ini.Save();
		},
		Get:		function(file_name, tbl_name, key){
			if(Plugin.IniExists(file_name)){
				var ini = Plugin.GetIni(file_name);
				return ini.GetSetting(tbl_name, key);
			}
			return undefined;
		},
		Remove:		function(file_name, tbl_name, key){
			if(Plugin.IniExists(file_name)){
				var ini = Plugin.GetIni(file_name);
				ini.DeleteSetting(tbl_name, key);
				ini.Save();
			}
			return;
		}/*, //i didn't tested this yet
		Ds2Ini:		function(){
			var tbl = DataStore.GetTable(Permissions.DStable);
			var keys = DataStore.Keys(Permissions.DStable);
			for(var i = 0; i < keys.Length; i++)
				this.Add("Flags", keys[i], tbl[keys[i]]);
		}*/
	}
}

function On_PluginInit(){
	try{
		Permissions.Init();
		Essentials.RegPlugin(Permissions);
		if(Permissions.Enabled == undefined){
			Permissions.Enabled = true;
		}
		Util.ConsoleLog("[color #33d356]Permissions: loaded !", true);
		UnityEngine.Debug.Log("Essentials:Permission loaded!");
		Server.Broadcast("Essentials Development Preview Loaded");
	}catch(err){
			Essentials.ErrorHandler("Permissions.On_PluginInit( )", err);
	}
}

function On_Command(Player, cmd, args){
	try{
		if(Essentials.Enabled && Permissions.Enabled){
			switch(cmd){
				case "addflag":
					if(Permissions.IsAdmin(Player)){
						if(args.Length > 1){
							var argsmin2 = (args.Length -2);
							var user = Magma.Player.FindByName(Essentials.ArgsToTextFromTo(args, 0, argsmin2));
							if(user == null){
								Player.MessageFrom("Essentials", Essentials.ArgsToTextFromTo(args, 0, argsmin2) + " is not a valid player name or the player is offline!");
								return;
							}
							var msg = Permissions.AddFlag(user, args[args.Length - 1]);
							Player.MessageFrom("Essentials", msg);
						} else {
							Player.MessageFrom("Essentials", "/addflag <playername> <flag>");
						}
					}
				break;
				case "unflag":
					if(args.Length > 1){
						if(Permissions.HasFlag(Player, "canunflag")){
							var user = Magma.Player.FindByName(Essentials.ArgsToTextFromTo(args, 0, argsmin2));
							if(user == null){
								Player.MessageFrom("Essentials", Essentials.ArgsToTextFromTo(args, 0, argsmin2) + " is not a valid player name or the player is offline!");
								return;
							}
							var msg = Permissions.UnFlag(user, args[args.Length - 1]);
							Player.MessageFrom("Essentials", msg);
						} else {
							Player.MessageFrom("Essentials", "Valid syntax: /unflag (player) (flag)");
						}
					}
				break;
				case "myflags":
					Player.MessageFrom("Essentials", Permissions.PlayerFlags(Player));
				break;
				case "kick":
					if(Permissions.HasFlag(Player, "essentials.kick")) {
						if (args.Length >= 1) {
							var playaName = Essentials.ArgsToText(args, " ");
							var targetPlayer = Magma.Player.FindByName(playaName);
							if(targetPlayer) targetPlayer.Disconnect();
							else Player.MessageFrom("Essentials", "Player: '" + String(playaName) + "' not found!");
						} else {
							Player.MessageFrom("Essentials", "Valid syntax: /kick (player)");
						}
					} else {
						Player.Message("[color #b0171f]Permission denied.");
					}
				break;
				case "kill":
					if(Permissions.HasFlag(Player, "essentials.kill")) {
						if (args.Length >= 1) {
							var playaName = Essentials.ArgsToText(args, " ");
							var targetPlayer = Magma.Player.FindByName(playaName);
							if(targetPlayer) targetPlayer.Kill();
							else Player.MessageFrom("Essentials", "Player: '" + String(playaName) + "' not found!");
						} else {
							Player.MessageFrom("Essentials", "Valid syntax: /kill (player_name)");
						}
					} else {
						Player.Message("[color #b0171f]Permission denied.");
					}
				break;
			}
		}
	}catch(err){
		Essentials.ErrorHandler("Permissions.On_Command( Magma.Player{" + Player.Name + "} , " + cmd + ", args{" + Essentials.ArgsToText(args, ", ") + "} )", err);
	}
}


function On_PlayerConnected(Player) { // this should be in the core !!
	Essentials.ShowMOTD(Player);
}
