glu.defModel('tc.clientSet', {
    rootList:false,
    selModel:{
        mode:'MULTI',
        xtype:'checkboxmodel'
    },
    isSaving:false,
    columns:[
        {
            header:'Last',
            dataIndex:'lastName',
            renderer:function columnWrap(val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            editor:'textfield',
            width:220

        },
        {
            header:'First',
            dataIndex:'firstName',
            renderer:function columnWrap(val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            editor:'textfield',
            width:220
        }
    ],
    clientFilter:[],
    clientList:{
        mtype:'glustore',
        model:'tc.models.Client',
        pageSize:25,
        proxy:{
            type:'ajax',
            url:'/json/client',
            //            actionMethods:{read:'POST'},
            reader:{
                type:'glujson',
                totalProperty:'total',
                root:'rows'
            }
        }
    },
    clientListPage:1,

    //will hold a record once selected...
    clientSelections:[],

    //likewise
    clientWithFocus:{},
    filterClient:'',


    init:function () {
        this.refreshClientList();
    },

    //COMMANDS
    cellEdit:function (evt) {
        if(!this.clientWithFocus.set){return}
        this.clientWithFocus.set(evt.field, evt.value)
        this.save()
    },

    save: function() {
        this.set('isSaving', true)
        var payload = this.clientWithFocus.data;

        this.ajax({
            url: '/json/client/' + payload.id + '/action/save',
            method: 'post',
            params: payload,
            success: function(r) {
                var responseObj = Ext.decode(r.responseText)
                this.set('isSaving', false);
                if (responseObj.error) {
                    this.rootVM.openError(responseObj.error)
                    return;
                }
                this.clientList.commitChanges();
            }
        })
    },

    addClient: function(evt, _client) {
        var locatedRecord
        if(_client){
            locatedRecord = this.clientList.getById(_client.id)
        }
        else{
            _client = {
                "id": glu.guid(),
                "firstName": "",
                "lastName":""
            }
        }
        if(locatedRecord){
            locatedRecord.set(_client)
            this.clientList.update( this.clientList, locatedRecord, Ext.data.Model.EDIT, ['name'])
        }
        else{
            this.clientList.add(_client)
        }
    },
    
    refreshClientList:function () {
        var params = {
            params:{
                or:true,
                filters:Ext.encode([
                    {
                        field:'firstName',
                        comparator:'RE',
                        value:this.filterClient
                    },
                    {
                        field:'lastName',
                        comparator:'RE',
                        value:this.filterClient
                    }
                ])
            }
        };
        this.clientList.loadPage(this.clientListPage, params);
    },

    linkTerm:function () {
        var linkedTermWindow = this.open(this.rootTermPicker());
    },

    linkTermIsEnabled$:function () {
        return this.clientSelections.length == 1;
    },

    removeClients:function () {
        this.confirm({
            title:this.localize('removeClientsTitle'),
            msg:this.localize('removeClientsMessage'),
            buttons:Ext.Msg.YESNO,
            icon:Ext.Msg.QUESTION,
            fn:function (btn) {
                if (btn !== 'yes') return;
                this.removeClientsActual();
            }
        });
    },

    removeClientsActual:function () {
        this.ajax({
            url:'/json/client/action/delete',
            method:'post',
            params:{
                ids:this.selectedIds()
            },
            success:function () { //TODO: Automaticlienty emit removeClientsSuccess event
                this.refreshClientList();
            }
        });
    },

    removeClientsIsEnabled$:function () {
        return this.clientSelections.length > 0;
    },

    //REACTIONS
    when_selected_client_changes_then_load_detail:{
        on:'clientWithFocusChanged',
        action:function () {
            if (this.clientWithFocus == null) return;
            //            this.parentVM.detail.load(this.clientWithFocus.get('id'))
        }
    },

    when_filterdrug_changes_then_load_detail:{
        on:'filterClientChanged',
        action:function () {
            this.refreshClientList();
        }
    },

    when_page_changes_then_reload_grid:{
        on:'clientListPageChanged',
        action:function () {
            this.refreshClientList();
        }
    },

    when_client_filter_changes_then_reload_grid:{
        on:'clientFilterChanged',
        action:function () {
            this.refreshClientList();
        }
    },

    when_client_seletions_changes:{
        on:'clientSelectionsChanged',
        action:function () {
        }
    },

    clearFilter:function () {
        this.set('clientFilter', []);
        this.refreshClientList();
    },

    //PRIVATE
    selectedIds:function () {
        var ids = [];
        for (var i = 0; i < this.clientSelections.length; i++) {
            ids.push(this.clientSelections[i].get('id'));
        }
        return ids;
    },

    clone:function () {
        return {
            mtype:'clientSet',
            clientListPage:this.clientListPage
        };
    }
});