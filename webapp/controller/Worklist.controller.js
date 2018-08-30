sap.ui.define([
		"com/app/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"com/app/model/formatter",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV",
		"sap/m/MessageBox"
	], function (BaseController, JSONModel, History, formatter, MessageToast, Filter, FilterOperator, Export, ExportTypeCSV, MessageBox) {
		"use strict";

		return BaseController.extend("com.app.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");
					
				//open menu btn 
				this.byId("openMenu").attachBrowserEvent("tab keyup", function(oEvent){
				this._bKeyboard = oEvent.type == "keyup";
				}, this);

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				this._oTable = oTable;
				// keeps the search state
				this._oTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},
			
			handlePressOpenMenu: function(oEvent) {
				var oButton = oEvent.getSource();
	
				// create menu only once
				if (!this._menu) {
					this._menu = sap.ui.xmlfragment(
						"com.app.fragmentViews.Worklist",
						this
					);
					this.getView().addDependent(this._menu);
				}
	
				var eDock = sap.ui.core.Popup.Dock;
				this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
			},
		

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},


			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will navigate to the shell home
			 * @public
			 */
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

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("worklistView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var oTableSearchState = [];
					var sQuery = oEvent.getParameter("query");
					if (sQuery && sQuery.length > 0) {
						oTableSearchState.push(new Filter("Zoid", FilterOperator.Contains, sQuery));
					}
					this._applySearch(oTableSearchState);
				}

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("Zoid")
				});
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {object} oTableSearchState an array of filters for the search
			 * @private
			 */
			_applySearch: function(oTableSearchState) {
				var oTable = this.getView().byId("table"),
					oViewModel = this.getModel(),
				oBinding = oTable.getBinding("items");
				oBinding.filter(oTableSearchState);
				// changes the noDataText of the list in case there are no filter results
				if (oTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			},
			
			onQuickFilter: function(oEvent) {
				// var sKey = oEvent.getParameter("key"),
				// oFilter = this._pizzaPriceFilters[sKey],
				// oBinding = this._oTable.getBinding("items");
				// console.log(sKey);
				// oBinding.filter(oFilter);
				
				var sKey = oEvent.getParameter("key");
				var oModel = this.getView().getModel();
				var resultData = [];
				
				oModel.read("/OrderListSet",{
					success: function(oData_verified, responset_verified) {
						
						if(sKey === "below15"){
							for(var i = 0; i < oData_verified.results.length;i++) {
								if(Number(oData_verified.results[i].Zprice) < 15) {
									resultData.push(oData_verified.results[i]);
								}
							}
						}
						
						if(sKey === "above15"){
							for(var i = 0; i < oData_verified.results.length;i++) {
								if(Number(oData_verified.results[i].Zprice) > 15) {
									resultData.push(oData_verified.results[i]);
								}
							}
						}
						
					}
					
				});
			},
			
			addOrder: function(oEvent) {
				this.getRouter().navTo("addPizza");
			},
			
			showGeoMap: function(oEvent) {
				this.getRouter().navTo("geoMap");	
			},
			
			exportPDF: function(oEvent) {
				var columns = [
					"Order ID",
                    "Customer's name",
                    "Pizza name",
                    "Pieces",
                    "Price",
                    "Unit",
                    "Date",
                    "Time"
                    ];
			
            	var fnFail = function() {  };  
            
        		var oModel = this.getView().getModel();
        		oModel.read("/OrderListSet",{
        			success: function(oData, responset) {
        				var data = [];  
	                    for(var i = 0; i<oData.results.length; i++)   
	                    {  
	                        data[i] = [oData.results[i].Zoid,
	                        		oData.results[i].Zcustname,
	                        		oData.results[i].Zpname,
	                        		oData.results[i].Zppiece,
	                        		oData.results[i].Zprice,
	                        		oData.results[i].Zpunit,
	                        		oData.results[i].Zdate,
	                        		oData.results[i].Ztime];  
	                    }  
    					 //console.log(data);
		                 var doc = new jsPDF('p', 'pt');  
		                 console.log(doc);
		                 //doc.autoTable(columns, data);  
		                 doc.save("TableExport.pdf");  
        			}	
        		}); 
      
                                  
			},  
			
			exportXLS: sap.m.Table.prototype.exportData || function(oEvent) {
				var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({
					separatorChar : ";"
				}),

				// Pass in the model created above
				models : this.getView().getModel(),

				// binding information for the rows aggregation
				rows : {
					path : "/OrderListSet"
				},

				// column definitions with column name and binding info for the content

				columns : [{
					name : "Order ID",
					template : {
						content : "{Zoid}"
					}
				}, {
					name : "Customer's name",
					template : {
						content : "{Zcustname}"
					}
				}, {
					name : "Pizza name",
					template : {
						content : "{Zpname}"
					}
				},{
					name : "Pizza pieces",
					template : {
						content : "{Zppiece}"
					}
				},{
					name : "Price",
					template : {
						content : "{Zprice}"
					}
				},{
					name : "Unit",
					template : {
						content : "{Zpunit}"
					}
				},{
					name : "Date",
					template : {
						content : "{Zdate}"
					}
				},{
					name : "Time",
					template : {
						content : "{Ztime}"
					}
				}]
			});
			
			// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});

			},
			
			highestPrice: function(oEvent) {
				var oModel = this.getView().getModel();
				var oRouter= sap.ui.core.UIComponent.getRouterFor(this);
				
				oModel.read("/OrderListSet",{
					success: function(oData, responset) {
						oModel.attachRequestCompleted( function() {
							var oHighest = oData.results[0];
							for (var i = 0; i < oData.results.length; i++) {
								if(Number(oData.results[i].Zprice) > oHighest.Zprice) {
									oHighest = oData.results[i];
								}
							}
							oRouter.navTo("object",
							{objectId: oHighest.Zoid}, 
							true);
						});
					}
				});
			}

		});
	}
);