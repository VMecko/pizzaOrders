sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.app.controller.GeoMap", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.app.view.GeoMap
		 */
		onInit: function() {
			var accessTokenMapbox = "pk.eyJ1Ijoidm1lY2tvIiwiYSI6ImNqbGhyYWFuNzFnamYzcHFnMHJmd3YxM3oifQ.bZfkXNGoZ8e5tHwqBPinlA";
			
			
			// MAP CONF CEZ MAPBOX API
			
			// var defaultUrlMBA = accessTokenMapbox == "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{LOD}/{X}/{Y}@2x?access_token=" + accessTokenMapbox ;
			// var defaultCopyrightMB = accessTokenMapbox == "NOT CONFIGURED" | undefined ? "Tile courtesy of OpenStreetMap" : "{LINK|© Mapbox}&nbsp;<a href='http://www.openstreetmap.org/copyright'>© OpenStreetMap<\/a>&nbsp;<a href='https://www.mapbox.com/map-feedback/'>Improve this map<\/a>&nbsp;&nbsp;&nbsp;{LINK|IMG}" ;
			// var mapConf = {
			// 	"MapProvider": [
			// 		{
			// 			"name": "MAPBOX_STARTER",
			// 			"description": "Test",
			// 			"tileX": "256",
			// 			"tileY": "256",
			// 			"maxLOD": "20",
			// 			"copyright": defaultCopyrightMB,
			// 			"copyrightLink": "https://www.mapbox.com/about/maps",
			// 			"Source":[
			// 				{
			// 					"id": "s1",
			// 					"url": defaultUrlMBA
			// 				}	
			// 			]
			// 		}
			// 	],
			// 	"MapLayerStacks": [
			// 		{
			// 			"name": "def",
			// 			"MapLayer": [
			// 				{
			// 					"name": "layer1",
			// 					"refMapProvider": "MAPBOX_STARTER",
			// 					"opacity": "1",
			// 					"colBkgnd": "RBG(255,255,255)"
			// 				}
			// 			]
			// 		},{}
			// 	]
			// };
		
		// MAP CONF CEZ OPEN STREET MAP API
		var mapConf = { 
            "MapProvider":[
              {
              	"Id" : "OSM",
                "name" : "Open Street Map",
                "tileX" : "256",
                "tileY" : "256",
                "minLOD" : "1",
                "maxLOD" : "19",
                "copyright" : "OpenStreetMap",
                "Source" : [{
                	"id" : "opStrMap",
                  "url" : "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
                }]
              }
            ],
            "MapLayerStacks": 
            [
              {  
              	"name" : "Default",
                "MapLayer": [
                	{
                  	"name": "Default",
                		"refMapProvider": "Open Street Map",
                		"opacity": "1.0",
                		"colBkgnd": "RGB(255,255,255)" 
                  }
                ]  
              }
            ]
			};
			
			var geoMap = this.getView().byId("geoMap");
			geoMap.setMapConfiguration(mapConf);
			//@TODO: Change initial position
			console.log(geoMap.getInitialPosition());
			
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.app.view.GeoMap
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.app.view.GeoMap
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.app.view.GeoMap
		 */
		//	onExit: function() {
		//
		//	}

	});

});