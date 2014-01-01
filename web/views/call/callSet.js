glu.defView('tc.callSet', {
    title:'~~tabTitle~~',
    layout:'border',
    region:'center',
    items:[
        {    region:'center',
            anchor:'100% 100%',
            xtype:'grid',
            selModel:'@{selModel}',
            selType:'checkboxmodel',
            name:'callList',
            columns:'@{columns}',
            dockedItems:[
                {
                    xtype:'pagingtoolbar',
                    dock:'bottom',
                    store:'@{..callList}',
                    page:'@{..callListPage}',
                    refreshHandler:'@{refreshCallList}',
                    displayInfo:true
                },
                {
                    xtype:'toolbar',
                    dock:'top',
                    items:[
                        {name:'newCall', hidden:'@{rootList}'},
                        {name:'editCall', hidden:'@{rootList}'},
                        {name:'removeCalls', hidden:'@{rootList}'},
                        {name:'filterCall', flex:1, hideLabel:true, xtype:'textfield', emptyText:'Search...',
                            plugins:['clearbutton']}
                    ]
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