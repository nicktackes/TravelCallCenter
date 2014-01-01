glu.defView('tc.callSummary', {
    xtype:'form',
    autoScroll:true,
    defaultType:'autofield',
    layout:{
        type:'vbox',
        align:'stretch'
    },
    defaults:{
        width:350
    },
    items:['agent', 'action', 'creationDate']
});