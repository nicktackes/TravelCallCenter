glu.defView('tc.clientSet', {
    title:'~~tabTitle~~',
    layout:'border',
    region:'center',
    items:[
        {    region:'center',
            anchor:'100% 100%',
            xtype:'grid',
            selModel:'@{selModel}',
            selType:'checkboxmodel',
            name:'clientList',
            columns:'@{columns}',
            dockedItems:[
                {
                    xtype:'pagingtoolbar',
                    dock:'bottom',
                    store:'@{..clientList}',
                    page:'@{..clientListPage}',
                    refreshHandler:'@{refreshClientList}',
                    displayInfo:true
                },
                {
                    xtype:'toolbar',
                    dock:'top',
                    items:[
                        {
                            name:'addClient',
                            iconCls:'icon-large icon-plus',
                            tooltip:'Add Client',
                            text:''
                        },
                        {
                            name:'removeClients',
                            iconCls:'icon-large icon-remove',
                            text:'',
                            tooltip:'Remove Clients',
                            hidden:'@{rootList}'
                        },
                        {name:'filterClient', flex:1, hideLabel:true, xtype:'textfield', emptyText:'Search...',
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
    ]
    ,
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