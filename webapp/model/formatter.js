sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			
			leadZeroRemove : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseInt(sValue, 10);
			},
			
			removeTimeFromDate : function (sValue) {
				if (!sValue) {
					return "";
				}
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});
				return oDateFormat.format(new Date(sValue));
			},
			
			calcPerUnit : function (sPieces, sPrice, sUnit) {
				if (!sPieces || !sPrice || !sUnit ) {
					return "";
				}
				return (sPrice / sPieces) + " " + sUnit + " / pizza";
			}

		};

	}
);