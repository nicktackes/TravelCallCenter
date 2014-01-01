glu.regAdapter('wizardpanel', {
    extend:'panel',
    applyConventions:function (config, viewmodel) {
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray:function (propName, value) {
        return propName === 'items';
    },
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            submitHandler:glu.conventions.expression(config.name + 'Submitted', {up:true}),
            cancelHandler:glu.conventions.expression(config.name + 'Cancelled', {up:true}),
            submitText:glu.conventions.asLocaleKey(config.submitText),
            cancelText:glu.conventions.asLocaleKey(config.cancelText)
        });
        glu.provider.adapters.Panel.prototype.applyConventions.apply(this, arguments);
    },

    /**
     * @cfg {String} text
     * The text to display on the button.
     *
     * It is usually best to let this be handled by localization:
     *
     *      text : '~~firstName~~'
     *
     * **Convention: ** &#126;&#126;*firstName*&#126;&#126;
     */
    /**
     * @cfg {Boolean} pressed
     * *two-way binding.* The pressed state of this button if a toggle button.
     *
     * **Convention: ** @?{debugIsPressed}
     */
    cancelBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            control.hide()
        }
    }
});
