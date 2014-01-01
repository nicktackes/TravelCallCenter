//   BEGIN src/ux/ext-3.4.0/form/BreadcrumbLabel.js
Ext.namespace('Ext.ux');

/**
 * A custom filter panel with flow layout and a hinted filter box with filter breadcrumbs for current filters
 *
 * @class Examples.Transaction.Controls.FilterPanel
 * @extends Ext.Panel
 */
Ext.define('Ext.ux.WizardPanel', {
        extend:'Ext.form.Panel',
        alias:'widget.wizardpanel',
        toolbarDock:'top',
        constructor:function (config) {
            this.callParent(arguments);
            this.insert(0,{
//                docked:this.toolbarDock,
                xtype:'toolbar',
                ui:'light',
                items:[
                    {
                        xtype:'button',
                        text: this.initialConfig.submitText,
                        handler: (this.initialConfig.submitHandler?this.initialConfig.submitHandler:function(){}),
                        ui:'round'
                    },
                    {
                        xtype:'spacer'
                    },
                    {
                        xtype:'button',
                        text:this.initialConfig.cancelText,
                        handler: (this.initialConfig.cancelHandler?this.initialConfig.cancelHandler:function(){}),
                        ui:'round'
                    }
                ]
            })
        }
    }
);


