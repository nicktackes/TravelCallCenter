//   BEGIN src/ux/ext-3.4.0/form/BreadcrumbLabel.js
Ext.namespace('Ext.ux.form');

Ext.define('Ext.ux.form.BreadcrumbLabel', {
    extend:'Ext.form.Label',
    alias:'widget.breadcrumblabel',
    // private
    initComponent:function () {
        var clickEvent = 'onclick="var bl = Ext.getCmp(\'' + this.id + '\'); bl.removeBreadcrumb();  this.parentNode.parentNode.removeChild(this.parentNode);"';
        this.data = this.data || {text:'', clickEvent:clickEvent};
        this.data.filterType = this.filterType
        this.data.filterTypeText = this.filterType == 'exclude' ? 'Exclude' : 'Include'
        this.tpl = this.tpl || '<div class="x-ux-form-hintedtextfield-button-{filterType}"><img src="/resources/custom/images/facets/{facet}_16.png" align="left">{filterTypeText}: {text}<div  {clickEvent}  class="x-ux-form-hintedtextfield-delete"></div></div>';
        if (this.text && this.data) {
            this.data.text = this.text;
            delete this.text;
        }
        if (this.facet && this.data) {
            this.data.facet = this.facet;
            delete this.facet;
        }
        Ext.ux.form.BreadcrumbLabel.superclass.initComponent.call(this);
    },
    removeBreadcrumb:function () {
        this.fireEvent('breadcrumbRemoved', this.record);
    }
});
//   END src/ux/ext-3.4.0/form/BreadcrumbLabel.js
//   BEGIN src/ux/ext-3.4.0/form/FilterPanel.js

/**
 * A custom filter panel with flow layout and a hinted filter box with filter breadcrumbs for current filters
 *
 * @class Examples.Transaction.Controls.FilterPanel
 * @extends Ext.Panel
 */
Ext.define('Ext.ux.FilterPanel', {
        extend:'Ext.panel.Panel',
        alias:'widget.filterpanel',
        baseCls:'x-toolbar',
        layout:{type:'vbox', align:'stretch'},
        hideButtons:false,
        template:{
            xtype:'breadcrumblabel',
            text:''
        },
        initComponent:function () {
            this.items = this.items || [];
            var items = [];
            items.push(
                {
                    store:this.store,
                    valueField:this.valueField,
                    displayField:this.displayField,
                    xtype:'hintedtextfield',
                    flex:1,
                    matchFieldWidth:true,
                    recType:this.recType,
                    emptyText:'Let me find a trial on my own',
                    listeners:{
                        'hintadded':function (hint) {
                            var filterExists = Ext.Array.indexOf(this.filter,hint);
                            if (filterExists == -1) {
                                var clone = this.filter.slice(0);
                                clone.push(hint);
                                this.fireEvent('filterChanged', clone);
                            }
                        }, scope:this
                    }
                }, {
                    xtype:'button',
                    hidden:this.hideButtons,
                    iconCls:'include-button',
                    text:'Include',
                    handler:function () {
                        var combo = this.ownerCt.items.items[0]
                        if (combo.getValue()) {
                            var record = combo.getStore().findRecord(combo.valueField, combo.getValue(), 0, false, false, true)
                            var data = {}
                            if (!record) {
                                data[combo.valueField] = combo.getValue()
                                data.facet = 'PHRASE'
                            }
                            else {
                                data = record.data

                            }
                            data.filterType = 'include'
                            combo.selectHint(data)
                            combo.clearValue()
                        }
                    }
                }, {
                    xtype:'button',
                    text:'Exclude',
                    hidden:this.hideButtons,
                    iconCls:'exclude-button',
                    handler:function () {
                        var combo = this.ownerCt.items.items[0]
                        if (combo.getValue()) {
                            var record = combo.getStore().findRecord(combo.valueField, combo.getValue(), 0, false, false, true)
                            var data = {}
                            if (!record) {
                                data[combo.valueField] = combo.getValue()
                                data.facet = 'PHRASE'
                            }
                            else {
                                data = record.data

                            }
                            data.filterType = 'exclude'
                            combo.selectHint(data)
                            combo.clearValue()
                        }
                    }

                }
            );

            this.items = [
                {layout:{type:'hbox', align:'center'}, items:items.concat(this.items)},
                {items:[]}
            ];
            Ext.ux.FilterPanel.superclass.initComponent.call(this);
            if (this.filter) {
                for (var i = 0; i < this.filter.length; i++) {
                    this.addFilterButton(this.filter[i]);
                }
            }
        },
        addFilterButton:function (filter) {
            if (Ext.Array.indexOf(this.filter,filter) == -1) {
                this.filter.push(filter);
            }
            var btnConfig = Ext.apply({}, this.template);
            btnConfig.filterType = filter['filterType']
            btnConfig.text = filter[this.displayField];
            btnConfig.facet = filter[this.facetField];
            btnConfig.record = filter;
            btnConfig.id = filter[this.valueField];
            this.add(btnConfig);
            this.items.items[this.items.length - 1].addListener('breadcrumbRemoved', this.removeFilter, this);
        },
        removeFilter:function (filter) {
            var idx = Ext.Array.indexOf(this.filter,filter);
            if (idx > -1) {
                var clone = this.filter.slice(0);
                clone.remove(filter);
                this.fireEvent('filterChanged', clone);
            }
        },
        removeFilterButton:function (filter) {
            var idx = Ext.Array.indexOf(this.filter,filter);
            if (idx > -1) {
                this.filter.splice(idx, 1);
            }
            var id = filter[this.valueField];
            this.remove(id);
        },
        setHideButtons:function (hide) {
            var buttons = this.query('button');
            Ext.each(buttons, function (button) {
                if (hide)button.hide();
                else button.show();
            });
        }
    }
);


// end of file
//   END src/ux/ext-3.4.0/form/FilterPanel.js
//   BEGIN src/ux/ext-3.4.0/form/HintedTextField.js
Ext.namespace('Ext.ux.form');

Ext.define('Ext.ux.form.HintedTextField', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.hintedtextfield',
    hideTrigger:true,
    hideLabel:true,
    typeAhead:true,
    enableKeyEvents:true,
    minChars:0,
    matchFieldWidth:false,
    listConfig:{
        resizable:true,
        minWidth:300,
        getInnerTpl:function () {
            // here you place the images in your combo
            var tpl = '<div>' +
                '<img src="/resources/custom/images/facets/{facet}_16.png" align="left">&nbsp;&nbsp;' +
                '{' + this.displayField + '}</div>';
            return tpl;
        }
    },
    queryMode:'remote',
    forceSelection:false,

    hints:[],
    // private
    initComponent:function () {
        this.addListener('select', function (combo, records, eOpts) {
            // combo.selectHint(records[0].data)
//            combo.clearValue();
        });
        this.callParent(arguments);
    },
    selectHint:function (hint) {
        this.fireEvent('hintadded', hint);
        this.reset();
    }
});
//   END src/ux/ext-3.4.0/form/HintedTextField.js

Ext.define('Ext.ux.ButtonPanel', {
        extend:'Ext.panel.Panel',
        alias:'widget.buttonpanel',
        baseCls:'x-feature1-selected',
        overCls:'x-feature1-over',
        labelHtml:'',
        descriptionHtml:'',
        width:200,
        height:200,
        layout:{
            type:'hbox',
            align:'center',
            pack:'center'
        },
        initComponent:function () {
            this.items = [
                {
                    xtype:'panel',
                    border:false,
                    bodyBorder:false,
                    baseCls:'x-feature',
                    layout:{
                        type:'vbox',
                        align:'center',
                        pack:'center'
                    },
                    items:[
                        {
                            xtype:'label',
                            baseCls:'x-feature-label',
                            width:180,
                            html:this.labelHtml
                        },
                        {
                            xtype:'label',
                            baseCls:'x-feature-description',
                            width:180,
                            html:this.descriptionHtml
                        },
                        {
                            xtype:'panel',
                            baseCls:this.featureCls,
                            border:false,
                            bodyBorder:false,
                            width:80,
                            height:70
                        }
                    ]
                }
            ];


            this.callParent();
        }
    }
);

/**
 * Ext.ux.menu.StoreMenu  Addon
 *
 * Inspired from the Ext.ux.menu.StoreMenu for ExtJs 3 by Marco Wienkoop
 *
 * This version is a complete rewrite and enhanced for ExtJs 4 with some of the old features removed.
 * @author Joe Kuan
 * @docauthor Joe Kuan
 * Joe Kuan <kuan.joe@gmail.com>
 *
 * #Demo and Download
 * Here are the links for the online [demo](http://joekuan.org/demos/StoreMenu_ExtJs_4/) and [github](http://github.com/JoeKuan/StoreMenu_ExtJs_4)
 * download. For usage, see [license](http://github.com/JoeKuan/StoreMenu_ExtJs_4/blob/master/License).
 *
 * #Creating &amp; Applying StoreMenu
 *
 * Suppose we define a JSON Store for a list of menus as follows:
 *
 *      @example
 *      Ext.define('Menu', {
 *          extend: 'Ext.data.Model',
 *          fields: [ 'id', 'text', 'iconCls' ]
 *      });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'Menu',
 *         proxy: {
 *             type: 'ajax',
 *             url: 'demo/menu.php',
 *             reader: {
 *                type: 'json',
 *                root: 'root'
 *             }
 *         }
 *     });
 *
 *  The *id*, *text* and *iconCls* fields are mapped to menu item config.
 *
 *  Assume the file menu.php returns the following in JSON:
 *     @example
 *     { "success": true,
 *       "root": [{
 *                  "id": 1, "text": "Menu 1"
 *                 },{
 *                  "id": 2, "text": "Menu 2", "iconCls": "calendar"
 *                 },{
 *                  "id": 3, "text": "Menu 3"
 *                 }
 *        ]
 *     }
 *
 *  To produce a simple Window with store menu inside a toolbar, here is the code
 *     @example
 *     Ext.create('Ext.window.Window', {
 *         height: 380,
 *         width: 450,
 *         title: 'Menu Store for ExtJs 4',
 *         tbar: [{
 *            menu: Ext.create('Ext.ux.menu.StoreMenu', {
 *                      store: store,
 *                      itemsHandler: function(item, evt) {
 *                           Ext.example.msg("Store Menu",
 *                                           "You click on item with id " + item.id);
 *                      }
 *                  }),
 *            text: 'Menu Demo 1'
 *         }]
 *     }).show();
 *
 * Clicking any of the menus dynamically generated will call itemsHandler. To differeniate
 * between the menus, each menu item is created with the id option which is taken from the
 * id field of the store
 *
 * #Creating Specific Menus
 * For more specific menus, StoreMenu supports object specifier through single field name, *config*.
 * Store record with *config* field is expected to contain required options for creating menu objects, such as xtype.
 * Menus like: menucheckitem, separator can be specified through this scheme.
 * Moreover, this can be mixed with normal menu item creation which the data model definition
 * includes both field name schemes. The following shows an example for creating specific menus along with default
 * menu item through the store.
 *     @example
 *     Ext.define('Menu', {
 *         extend: 'Ext.data.Model',
 *         fields: [ 'id', 'text', 'iconCls', 'config' ]
 *     });
 *
 * The server side is configured to return the following menus in JSON:
 *     @example
 *     { "root": [{ "config": { "id": "2A", "text": "Menu 2A", "xtype": "menucheckitem"} },
 *                { "config": { "xtype": "menuseparator"} },
 *                { "id": "2C", "text": "Menu 2C" }
 *               ]
 *     }
 *
 * #Creating Submenus
 * The StoreMenu also supports submenu entries (single level only). The server will need to
 * return additional fields for including submenu entries (see menuField) and id string for
 * their handlers (see smHandlers).
 * The following is what the server side should return for submenus
 *     @example
 *     { "root": [{ "id": "3A", "text": "Menu 3A",
 *                  "menu": [{  "id": "3A-1", "text": "Submenu 3A-1", "smHandler": "submenu3A1" },
 *                           {  "id": "3A-2", "text": "Submenu 3A-2", "smHandler": "submenu3A2" }
 *               ]
 *     }
 * To bind with the submenu handlers, we can create the StoreMenu as follows:
 *     @example
 *     var menu3 = Ext.create('Ext.ux.menu.StoreMenu', {
 *         store: store,
 *         smHandlers: {
 *             submenu3A1: function(item) {
 *                 Ext.example.msg("Third Menu Store", "This is submenu handler specific for menu 3A-1");
 *             },
 *             submenu3A2: function(item) {
 *                 Ext.example.msg("Third Menu Store", "This is submenu handler specific for menu 3A-2");
 *             }
 *         }
 *     });
 *
 */
Ext.define("Ext.ux.menu.StoreMenu", {
    extend:'Ext.menu.Menu',
    alias:'widget.storemenu',

    config:{
        /***
         * message shown next to the store menu when it is loading
         */
        loadingText:'Loading...',
        /**
         *  offset is to use with static menus, i.e. the offset position for
         *  the dynamic menus to start. E.g. if two static menus are included inside the items
         *  option, by setting *offset* to 2 the dynamic menus start below the static
         *  menus. Also a separator is added between static and dynamic menus
         */
        offset:0,
        /**
         *  reload the store everytime the top menu is expanded
         */
        autoReload:true,
        /**
         *  nameField is to map the field for the menu title returning from the
         *  store.
         */
        nameField:'text',
        /**
         *  idField is to map the menu id entry from the store
         */
        idField:'id',
        /**
         *  iconField is to map the menu icon (iconCls)
         */
        iconField:'iconCls',
        /**
         *  itemsHandler is the general menu handler for the __first level__ menus.
         *  For submenu handler, see subMenuHandler
         */
        itemsHandler:Ext.emptyFn,
        /**
         *  configField is used for specific menu types other than
         *  menu item (default). The config field returned from the server
         *  side is expected to hold all the required options to create the
         *  specific menu
         */
        configField:'config',
        /**
         *  the field name containing the list of submenu entries in the store
         */
        menuField:'menu'
    },

    /***
     * @property {Object} store
     * Data store for the menus &amp; submenus entries
     */
    store:null,

    // Keep track of what menu items have been added
    storeMenus:[],

    loaded:false,
    loadMask:null,

    onMenuLoad:function () {
        if (!this.loaded || this.autoReload) {
            this.store.load();
        }
    },

    updateMenuItems:function (loadedState, records) {

        for (var i = 0; i < this.storeMenus.length; i++) {
            this.remove(this.storeMenus[i]);
        }
        this.storeMenus = [];

        if (loadedState) {

            // If offset is specified, it means we have to put the
            // dynamic menus after the static menus. We put a separator
            // to separate both
            var count = 0;
            if (this.offset) {
                this.storeMenus.push(this.insert(this.offset, { xtype:'menuseparator' }));
                count = 1;
            }

            Ext.each(records, function (record, index) {

                var menuSettings = {};
                    menuSettings = {
                        id:record.data[this.idField],
                        text:record.data[this.nameField],
                        iconCls:record.data[this.iconField],
                        handler:function () {
                            var res = {}
                            res[this.ownerCt.idField]=this.id
                            res[this.ownerCt.nameField]=this.text
                            this.ownerCt.fireEvent('selectionChanged', this.ownerCt, res);
                        }
                    };

                if (record.data[this.menuField]) {
                    menuSettings.menu = { items:[] };
                    Ext.each(record.data[this.menuField], function (menuitem) {
                        // Make sure the handler name is defined
                        menuSettings.menu.items.push(Ext.apply({
                            id:menuitem[this.idField],
                            text:menuitem[this.nameField],
                            iconCls:menuitem[this.iconField],
                            handler:function () {
                                var res = {_parent:{}}
                                res[this.parentMenu.parentMenu.idField]=this.id
                                res[this.parentMenu.parentMenu.nameField]=this.text
                                res._parent[this.parentMenu.parentMenu.idField]=this.parentMenu.ownerItem.id
                                res._parent[this.parentMenu.parentMenu.nameField]=this.parentMenu.ownerItem.text
                                this.parentMenu.parentMenu.fireEvent('selectionChanged', this.parentMenu.parentMenu, res);
                            }
                        }, this.defaults));
                    }, this);
                }

                var x = this.insert(this.offset + count, menuSettings)
                if(this.tpl){
                x.setText(this.tpl.apply(record.data))
                }
                this.storeMenus.push(Ext.apply(x,this.defaults));
                count++;
            }, this)

        } else {
            this.storeMenus.push(this.insert(this.offset, {menu:{ items:[] }}));
        }

        this.loaded = loadedState;
    },

    onBeforeLoad:function (store) {
        this.updateMenuItems(false);
    },

    onLoad:function (store, records) {
        this.updateMenuItems(true, records);
    },

    /***
     * Set a submenu handler.
     * @param handlerType {String} the id value for the handler function
     * @param handler {Function} the handler implementation - See menuitem handler for function parameters
     */
    setSubMenuHandler:function (handlerType, handler) {
        this.smHandlers[handlerType] = handler;
    },

    /**
     *  A utility method for changing parameters of the underlying
     *  JSON store. Values inside params object will overwrite the store's
     *  existing parameters with the same name
     *  @param {Object} params an object of parameters to be set in the store
     */
    setParams:function (params) {
        Ext.apply(this.store.getProxy().extraParams, params);
    },

    setStore:function (store) {
        this.store = store;
    },

    /**
     * @cfg smHandlers {Object} is an object holding all the submenu handler implementations.
     * Inside the object, option name is the identifier for the handler function which is the option value.
     * (See the [submenu section] (#submenu) for example)
     */
    smHandlers:{},

    constructor:function (config) {

        config.listeners = config.listeners || {};
        config.defaults = config.defaults || {}
        if(config.handler){
            config.defaults.listeners = config.defaults.listeners || {}
            config.defaults.listeners.click = config.handler
        }
        // In ExtJs 4, menu doesn't fire 'show' event
        config.listeners.beforeshow = this.onMenuLoad;
        this.initConfig(config);

        this.callParent(arguments);

        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);
        return this;
    }

});