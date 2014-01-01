glu.regAdapter('filterpanel', {
    extend:'panel',
    applyConventions:function (config, viewmodel) {
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray:function (propName, value) {
        return propName === 'items';
    },
    hideButtonsBindings:{
        eventName:'hideButtonsChanged',
        eventConverter:function (hide) {
            return hide;
        },
        setComponentProperty:function (value, oldValue, options, control) {
            control.setHideButtons(value);
        }
    },
    filterBindings:{
        eventName:'filterChanged',
        eventConverter:function (e) {
            return e;
        },
        setComponentProperty:function (value, oldValue, options, control) {
//               control.addFilterButton(value);
            if (glu.isArray(value)) {
                oldValue = (glu.isArray(oldValue) ? oldValue : []);
                for (var i = 0; i < value.length; i++) {
                    if (Ext.Array.indexOf(oldValue,value[i]) == -1) {
                        control.addFilterButton(value[i]);
                    }
                }
                for (var i = 0; i < oldValue.length; i++) {
                    if (Ext.Array.indexOf(value, oldValue[i]) == -1) {
                        control.removeFilterButton(oldValue[i]);
                    }
                }
            }
        }
    }
});


glu.regAdapter('buttonpanel', {
    extend:'panel',
    applyConventions:function (config, viewmodel) {
        glu.provider.adapters.Panel.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray:function (propName, value) {
        return propName === 'items';
    },
    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Panel.prototype.afterCreate.apply(this, arguments);
        if (control.clickHandler) {
            control.on('render', function (c) {
                c.getEl().on('click', function () {
                    this.clickHandler();
                }, c);
            });
        }
    },
    clickHandlerBindings:{
        eventName:'clicked',
        eventConverter:function (e) {
            return e;
        },
        setComponentProperty:function (value, oldValue, options, control) {

        }
    }
});

glu.regAdapter('storemenu', {
    extend:'menu',
    applyConventions:function (config, viewmodel) {
        var g = glu.conventions;
        var listname = config.name;
        var name = glu.string(listname).until('List');
        var upperName = glu.string(name).toPascalCase();
        var selectionModelProp = viewmodel[name + 'Selections'] ? name + 'Selections' : name + 'Selection';
        var pattern = {
            store:g.expression(listname),
            selected:g.expression(selectionModelProp, {optional:true})
        };
        glu.deepApplyIf(config, pattern);
        glu.provider.adapters.Menu.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray:function (propName, value) {
        return propName === 'items';
    },
    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Menu.prototype.afterCreate.apply(this, arguments);
    },
    selectedBindings:{
        eventName:'selectionChanged',
        eventConverter:function (g, e) {
            if (g._singleSelect) {
                return e.length > 0 ? e[e.length - 1] : null;
            } else {
                return e;
            }
        },
        setComponentProperty:function (value, oldValue, options, control) {

        }
    }
});