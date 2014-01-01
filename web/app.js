Ext.onReady(function() {
	if (Ext.supports.LocalStorage) Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
	else Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.tip.QuickTipManager.init()
	glu.asyncLayouts = true
	glu.viewport('tc.Main');
});