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
        this.tpl = this.tpl || '<div class="x-ux-form-hintedtextfield-button-{filterType}"><img src="/resources/images/icons/{type}_16.png" align="left">{type2} {text}<div  {clickEvent}  class="x-ux-form-hintedtextfield-delete"></div></div>';
        if (this.text && this.data) {
            this.data.text = this.text;
            delete this.text;
        }
        if (this.type && this.data) {
            this.data.type = this.type;
            switch (this.data.type) {
                case 'SUBSITE':
                case 'SITE':
                    this.data.type2 = 'Disease Site, '
                    break;
                case 'GENE':
                    this.data.type2 = 'Gene, '
                    break;
                case 'PHRASE':
                    this.data.type2 = 'Containing, '
                    break;
                case 'MUTATIONAA':
                    this.data.type2 = 'Mutation AA, '
                    break;
                case 'DRUG':
                    this.data.type2 = 'Intervention, '
                    break;
                case 'HISTOLOGY':
                case 'SUBHISTOLOGY':
                    this.data.type2 = 'Histology, '
                    break;
            }
            delete this.type;
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
        layout:'column',
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
                    width:400,
                    matchFieldWidth:true,
                    recType:this.recType,
                    listeners:{
                        'hintadded':function (hint) {
                            var filterExists = this.filter.indexOf(hint);
                            if (filterExists == -1) {
                                var clone = this.filter.slice(0);
                                clone.push(hint);
                                this.fireEvent('filterChanged', clone);
                            }
                        }, scope:this
                    }
//                }, {
//                    xtype:'button',
//                    text:'Include',
//                    enableToggle:true,
//                    toggleHandler:function (btn, state) {
////                        btn.el.removeCls('x-button-action');
//                        btn.text == 'Include' ? btn.el.addCls('exclude-filter') : btn.el.removeCls('exclude-filter');
//                        btn.setText((state ? 'Exclude' : 'Include'))
//                    }
//
                }
            );

            this.items = items.concat(this.items);
            Ext.ux.FilterPanel.superclass.initComponent.call(this);
            if (this.filter) {
                for (var i = 0; i < this.filter.length; i++) {
                    this.addFilterButton(this.filter[i]);
                }
            }
        },
        addFilterButton:function (filter) {
            if (this.filter.indexOf(filter) == -1) {
                this.filter.push(filter);
            }
            var btnConfig = Ext.apply({}, this.template);
            btnConfig.filterType = filter['filterType'];//this.items.items[1].text.toLowerCase()
            btnConfig.text = filter[this.displayField];
            btnConfig.type = filter[this.typeField];
            btnConfig.record = filter;
            btnConfig.id = filter[this.valueField];
            this.add(btnConfig);
            this.items.items[this.items.length - 1].addListener('breadcrumbRemoved', this.removeFilter, this);
        },
        removeFilter:function (filter) {
            var idx = this.filter.indexOf(filter);
            if (idx > -1) {
                var clone = this.filter.slice(0);
                clone.remove(filter);
                this.fireEvent('filterChanged', clone);
            }
        },
        removeFilterButton:function (filter) {
            var idx = this.filter.indexOf(filter);
            if (idx > -1) {
                this.filter.splice(idx, 1);
            }
            var id = filter[this.valueField];
            this.remove(id);
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
    queryMode:'remote',
    forceSelection:true,

    hints:[],
    // private
    initComponent:function () {
        var textId = this.id
        this.listConfig={
            resizable:true,
            width:220,
            getInnerTpl:function () {
                // here you place the images in your combo
                var tpl = '<div>' +
                    '<img src="/resources/images/icons/{type}_16.png" align="left">&nbsp;&nbsp;' +
                    '{' + this.displayField + '}<span style="float: right"><div class="exclude-button" onclick="Ext.getCmp(\''+textId+'\').hintExclude=true;"></div></span><span style="float: right;"><div class="include-button"  onclick="Ext.getCmp(\''+textId+'\').hintExclude=false;"></div></span></div>';
                return tpl;
            }
        };
        this.addListener('select', function (combo, records, eOpts) {
            records[0].data.filterType = (combo.hintExclude?'exclude':'include')
            combo.selectHint(records[0].data)
            combo.clearValue();
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