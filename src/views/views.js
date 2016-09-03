var kind = require('enyo/kind'),
	Ajax = require('enyo/Ajax'),
	Service = require('enyo-webos/LunaService'),
	Button = require('moonstone/Button'),
    Panels = require('moonstone/Panels'),
    Item = require('moonstone/Item'),
	Spinner = require('moonstone/Spinner');

module.exports = kind({
	name: "myapp.MainView",
	classes: "moon enyo-fit",
	components: [
		{ name: 'service', kind: Service, service: "luna://com.gailit.wemo.service", method: "devices", onComplete: "onComplete"},
		{ name: 'loadingIndicator', content: 'Not loaded ...'},
		{name: "panels", kind: Panels, pattern: "alwaysviewing", classes: "enyo-fit", components: [
			{name:'first', title: "wemo", components: [
				{ kind: Button, content: 'Find Devices', ontap: 'callService'}

			]},
			{name: 'devices', title: "Devices"}
		]}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	toggleSwitch: function(sender, event) {
		this.$.service.send({macAddress: sender.macAddress});
	},
	message: function(){
		//this.$.loadingIndicator.set('content', 'toggled the switch');
	},
	addDevices: function(devices) {
		var i;

		this.$.devices.destroyClientControls();

		for(i = 0; i < devices.length; i++) {
			this.$.devices.createComponent({
				kind: Item, 
				content: devices[i].friendlyName,
				macAddress: devices[i].macAddress,
				ontap: 'callService'
			}, {owner: this});
			this.render();
		}

		this.next();
		return true;
	},
	callService: function(inSender, inEvent) {
		this.$.loadingIndicator.set('content', 'Finding devices ...');
		this.$.service.send({macAddress: inSender.macAddress});
	},
	onComplete: function(inSender, inResponse) {
		if (inResponse.returnValue) {
			this.$.loadingIndicator.set('content', inResponse.devices.length);
			this.addDevices(inResponse.devices);
		} else {
			this.$.loadingIndicator.set('content', 'Oops!  There is a problem with this service');
		}
	}
});
