var kind = require('enyo/kind'),
	Ajax = require('enyo/Ajax'),
	Button = require('moonstone/Button'),
    Panels = require('moonstone/Panels'),
    Item = require('moonstone/Item');

module.exports = kind({
	name: "myapp.MainView",
	classes: "moon enyo-fit",
	components: [
		{ name: 'loadingIndicator', content: 'Not loaded ...', allowHtml: true},
		{name: "panels", kind: Panels, pattern: "alwaysviewing", classes: "enyo-fit", components: [
			{name:'first', title: "wemo", components: [
				{ kind: Button, content: 'Find Devices', ontap: 'fetch'},

			]},
			{name: 'devices', title: "Devices"}
		]}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	fetch: function() {
		this.$.loadingIndicator.set('content', 'Loading items ...');
		var ajax = new Ajax({
			url: 'http://192.168.1.6:3000/api/devices'
		});
		ajax.go();
		ajax.response(this, 'gotResponse');
	},
	toggleSwitch: function(sender, event) {
		this.$.loadingIndicator.set('content', 'http://192.168.1.6:3000/api/devices/'+sender.macAddress);
		var ajax = new Ajax({
			url: 'http://192.168.1.6:3000/api/devices/'+sender.macAddress
		});
		ajax.go();
		ajax.response(this, 'message');

	},
	message: function(){
		//this.$.loadingIndicator.set('content', 'toggled the switch');
	},
	gotResponse: function(sender, inResponse) {
		var i;

		this.$.devices.destroyClientControls();

		for(i = 0; i < inResponse.devices.length; i++) {
			this.$.devices.createComponent({
				kind: Item, 
				content: inResponse.devices[i].friendlyName,
				macAddress: inResponse.devices[i].macAddress,
				ontap: 'toggleSwitch'
			}, {owner: this});
			this.render();
		}
		this.$.loadingIndicator.set('content', '');
		this.next();
		return true;
	}
});
