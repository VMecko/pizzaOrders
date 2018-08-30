jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"com/app/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"com/app/test/integration/pages/Worklist",
		"com/app/test/integration/pages/Object",
		"com/app/test/integration/pages/NotFound",
		"com/app/test/integration/pages/Browser",
		"com/app/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.app.view."
	});

	sap.ui.require([
		"com/app/test/integration/WorklistJourney",
		"com/app/test/integration/ObjectJourney",
		"com/app/test/integration/NavigationJourney",
		"com/app/test/integration/NotFoundJourney",
		"com/app/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});