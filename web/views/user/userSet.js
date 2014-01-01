glu.defView('tc.userSet', {
    name: 'userList',
    region: 'center',
    title: '@{name}',
    xtype: 'grid',
    anchor: '100% 100%',
    selType: 'checkboxmodel',
    tbar: [{
        xtype: 'button',
        cls: 'x-form-search-trigger'
    }, {
        xtype: 'textfield',
        hideLabel: true,
        width: 300,
        emptyText: 'Filter',
        name: 'userFilter'
    }, {
        xtype: 'button',
        handler: '@{clearFilter}',
        cls: 'x-form-clear-trigger'
    }, {
        xtype: 'tbfill'
    }],
    closable: false, //'@{..closeUserSetIsEnabled}',
    columns: [{
        header: 'Username',
        dataIndex: 'username',
        width: 130
    }, {
        header: 'Email',
        dataIndex: 'email',
        width: 220
    }, {
        header: 'User Type',
        dataIndex: 'type'

    }, {
        header: 'User Status',
        hidden:true,
        dataIndex: 'status'

    }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        store: '@{userList}',
        page: '@{userListPage}',
        refreshHandler: '@{refreshUserList}',
        displayInfo: true
    }, {
        xtype: 'toolbar',
        dock: 'top',
        items: ['addUser', 'editUser', 'removeUsers']
    }]
});