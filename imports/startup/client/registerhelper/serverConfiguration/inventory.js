import {ServerInventoryTools} from "../../../../api/serverInventoryTools";

Template.registerHelper("getServerInventory", function (type) {
	return ServerInventoryTools.getServerInventory(type);
});

Template.registerHelper("gotInventoryData", function (dataCount) {
	return dataCount > 0;
});
