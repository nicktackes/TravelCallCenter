glu.defView('tc.callTypeSet', {
    title:'~~tabTitle~~',
    layout:'border',
    region:'center',
    items:[
        {    region:'center',
            anchor:'100% 100%',
            xtype:'grid',
            selModel:'@{selModel}',
            selType:'checkboxmodel',
            name:'calltypeList',
            columns:'@{columns}',
            dockedItems:[
                {
                    xtype:'pagingtoolbar',
                    dock:'bottom',
                    store:'@{..calltypeList}',
                    page:'@{..calltypeListPage}',
                    refreshHandler:'@{refreshCallTypeList}',
                    displayInfo:true
                },
                {
                    xtype:'toolbar',
                    dock:'top',
                    items:[
                        {
                            name:'addCallType',
                            iconCls:'icon-large icon-plus',
                            tooltip:'Add Call Type',
                            text:''
                        },
                        {
                            name:'removeCallTypes',
                            iconCls:'icon-large icon-remove',
                            text:'',
                            tooltip:'Remove Call Types',
                            hidden:'@{rootList}'
                        },
                        {name:'filterCallType', flex:1, hideLabel:true, xtype:'textfield', emptyText:'Search...',
                            plugins:['clearbutton']}
                    ]
                }
            ],
            listeners:{
                edit:'@{cellEdit}'
            },
            plugins:[
                {
                    ptype:'cellediting',
                    clicksToEdit:1
                }
            ],
            closable:false
        }
    ],
    asWindow:{
        defaults:{
            header:false,
            border:false
        },
        modal:false,
        title:'~~tabTitle~~',
        width:600,
        height:300
    }
});