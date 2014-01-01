glu.defModel('tc.userSet', {
    name:'Account Management',
    accountTypeStore: {
        mtype: 'store',
        fields: ['name', 'value'],
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }],
        data:[{name:'Agent', value:'AGENT'},{name:'Administrator', value:'ADMIN'}]
    },
    userFilter:'',
    userList:{
        mtype:'glustore',
        model:'tc.models.User',
        pageSize:20,
        autoLoad:true,
        remoteFilter: true,
        remoteSort: true,
        sorters:[{property:'username', direction:'ASC'}],
        params: function(){
            return {
                filters: Ext.encode(this.userFilter)
            }
        },
        proxy:{
            type:'ajax',
            url:'/json/users',
            reader:{
                type:'glujson',
                totalProperty:'total',
                root:'rows'
            }
        }
    },
    userListPage:1,

    //will hold a record once selected...
    userSelections:[],

    //likewise
    userWithFocus:{},

    detail: {mtype:'user'},
    init:function () {
        this.refreshUserList();
    },

    //COMMANDS
    openUser:function () {
        var userWindow = this.open(this.detail);
        userWindow.load(this.userWithFocus.get('id'))
    },

//   openUserIsEnabled$:function () {
//        return this.userSelections.length==1;
//    },

    editUser:function () {
        this.openUser()
    },

    editUserIsEnabled$:function () {
        return this.userSelections.length == 1;
    },


    refreshUserList:function () {
        var params;
        if (this.userFilter) {
            var filterString = this.userFilter.toLowerCase();
            params = {params:{filters:Ext.encode([
                {value:filterString, comparator:'RE'}
            ])}};
        }
        this.userList.loadPage(this.userListPage, params);
    },


    addUser:function () {
        var newClient = {
            "id":0,
            "username":"",
            "email":"",
            "password":"",
            "type":"AGENT",
            "status":"ACTIVE"
        }
        for (var k in newClient) {
            this.detail.set(k, newClient[k])
        }
        var clientWindow = this.open(this.detail);
        clientWindow.isNew(true)
    },

    addUserIsEnabled$:function () {
        return true;
    },

    removeUsers:function () {
        this.confirm({
            title:this.localize('removeUsersTitle'),
            msg:this.localize('removeUsersMessage'),
            buttons:Ext.Msg.YESNO,
            icon:Ext.Msg.QUESTION,
            fn:function (btn) {
                if (btn !== 'yes') return;
                this.removeUsersActual();
            }
        });
    },

    //TODO: Wire up confirmation automatically by pattern?
    removeUsersActual:function () {
        this.ajax({
            url:'/json/users/action/delete',
            params:{ids:this.selectedIds()},
            success:function () { //TODO: Automatically emit removeUsersSuccess event
                this.refreshUserList();
            }
        });
    },

    removeUsersIsEnabled$:function () {
        return this.userSelections.length > 0;
    },

    //REACTIONS
    when_selected_user_changes_then_load_detail:{
        on:'userWithFocusChanged',
        action:function () {
//            if (this.userWithFocus == null) return;
//            //TODO: Allow this.parentVM.setDetail(...);
//            this.parentVM.detail.load(this.userWithFocus.get('id'))
        }
    },

    when_page_changes_then_reload_grid:{
        on:'userListPageChanged',
        action:function () {
            this.refreshUserList();
        }
    },

    when_user_filter_changes_then_reload_grid:{
        on:'userFilterChanged',
        action:function () {
            // reset the page back to one on a filter
            this.set('userListPage', 1);
            this.refreshUserList();
        }
    },

    when_user_selections_changes:{
        on:'userSelectionsChanged',
        action:function () {
//            this.parentVM.set('userViewActiveItem', (this.userSelections.length > 1 ? 1 : 0))
//            // notify the user detail panel so that any initialization can occur
//            this.parentVM.notifyUserOfSelectionChange();
        }
    },

    clearFilter:function () {
        this.set('userFilter', '');
        this.refreshUserList();
    },

    //PRIVATE
    selectedIds:function () {
        var ids = [];
        for (var i = 0; i < this.userSelections.length; i++) {
            ids.push(this.userSelections[i].get('id'));
        }
        return ids;
    },

    refreshUser: function(){
        this.refreshUserList();
    }
});