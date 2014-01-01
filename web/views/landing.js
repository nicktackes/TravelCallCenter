glu.defView('tc.Landing', {
    hideMode: 'offsets',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    defaults: {
        border: false
    },
    items: [{
            html: '<img src="/resources/custom/images/adtlogo.png" width="420" height="296">',

            //            html: '<span style="font-family: Arial, sans-serif;font-size:60px;text-align:center;white-space:nowrap;">Molecular <font style="color: #00a0b1;"><b>Match</b></font></span>™',
            padding: '50px 0px',
            width: '100%',
            style: 'text-align:center'
        }
    ],
    bbar: {
        xtype: 'toolbar',
        padding: '0px 20px 10px 0px',
        items: ['->', {
            xtype: 'tbtext',
            text: Ext.String.format('<a class="footer-link" href="/about.html">{0}</a>', 'About Travel <font style="color:#00a0b1">Tracker</font>')
        }]
    }
})