glu.defView('tc.call', {
    xtype: 'panel',
    layout: 'fit',
    items: [{
        xtype: 'callSummary'
    }],
    // defaults: {
    //     bodyPadding: 10
    // },
    buttons: ['revert', 'save'],
    //settings when in window mode
    asWindow: {
        defaults: {
            header: false,
            border: false
        },
        modal: true,
        title: '~~inspectorTitle~~',
        width: '100%',
        height: '100%'
    }
});