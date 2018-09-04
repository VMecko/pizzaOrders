sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.app.controller.Weather", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.app.view.Weather
		 */
			onInit: function() {
				var oContactModel = new sap.ui.model.json.JSONModel();
				oContactModel.loadData("http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false", null, true, 'GET');
    		//	oContactModel.loadData("http://api.openweathermap.org/data/2.5/weather?id=3056508&units=metric&appid=53d2ca25149ef127169dcafa57ff9ea4", null, true, 'GET');
    			sap.ui.getCore().setModel(oContactModel);
    			console.log(oContactModel);
			}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.app.view.Weather
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.app.view.Weather
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.app.view.Weather
		 */
		//	onExit: function() {
		//
		//	}

	});

});