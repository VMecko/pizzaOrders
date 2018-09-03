sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	 var globalVar = "globalVar";
	return Controller.extend("com.app.controller.AddPizza", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.app.view.addPizza
		 */
		onInit: function() {
			console.log($.sap.myVar);
			console.log(sap.ui.getCore().AppContext.RandomVariable);
//			UIComponent.prototype.init.apply(this, arguments);
			// globalVar = this;
			
			// var oData = {
			// 		recipient: {
			// 			name: "World"
			// 		}
			// };
			
			// var oModel = new JSONModel(oData);       //create model
			// this.setModel(oModel, "userModel");      //set model to component
		},
		
		onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					oCrossAppNavigator.toExternal({
						target: {shellHash: "#Shell-home"}
					});
				}
		},
		
		onSubmit : function() {
			var oEntry= {};
			
			var oModel = this.getView().getModel();
			
			oEntry.Zcustname= this.byId("custName").getValue();
			oEntry.Zpname= this.byId("pizzaType").getSelectedItem().getText();
			oEntry.Zppiece= this.byId("pPiece").getValue();
			oEntry.Zprice = (oEntry.Zppiece * 7.0).toFixed(2);
			oEntry.Zpunit= "EUR";
			// oEntry.Zdate= sap.ui.model.odata.ODataUtils.formatValue(new Date(), "Edm.DateTime");
			
			oModel.read("/OrderListSet",{
				success: function(oData, responset) {
					oModel.attachRequestCompleted(function() {
						
						var pizzaID = 0;
						for(var i = 0; i < oData.results.length; i++) {
							if(Number(oData.results[i].Zoid) > pizzaID ) {
								pizzaID = Number(oData.results[i].Zoid);
							}
						}
						oEntry.Zoid = (pizzaID + 1).toString();
						oEntry.Zdate = new Date();
						oEntry.Ztime = oEntry.Zdate.getHours() + ":" + 	oEntry.Zdate.getMinutes();
						if(oEntry.Zcustname.length > 0 && oEntry.Zpname.length > 0 && oEntry.Zppiece > 0 && oEntry.Zppiece < 10) {
							oModel.create("/OrderListSet",oEntry);
							 var sPreviousHash = History.getInstance().getPreviousHash(),
							oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

							if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
								history.go(-1);
							} else {
								oCrossAppNavigator.toExternal({
									target: {shellHash: "#Shell-home"}
								});
							}
						}
						// console.log(oEntry);
					});
				}
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.app.view.addPizza
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.app.view.addPizza
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.app.view.addPizza
		 */
		//	onExit: function() {
		//
		//	}

	});

});