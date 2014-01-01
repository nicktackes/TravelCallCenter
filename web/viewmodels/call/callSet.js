glu.defModel('tc.callSet', {
    rootList:false,
    selModel:{
        mode:'MULTI',
        xtype:'checkboxmodel'
    },
    isSaving:false,
    columns:[
        {
            header: 'Creation Date',
            dataIndex: 'creationDate',
            xtype: 'datecolumn',
            format: 'F j, Y, g:i a T',
            width: 130,
            renderer: function(value) {
                if (!value) {
                    return value;
                }
                // Get timezone offset in ms
                var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;

                parsed = Date.parse(value);
                var newDate = new Date(parsed - timezoneOffset)
                // Add PST timezone offset in milliseconds.
                return Ext.util.Format.date(newDate, 'F j, Y, g:i a T');
            }
        },
        {
            header:'Agent',
            dataIndex:'agent',
            renderer:function columnWrap(val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            width:120

        },
        {
            header:'Action',
            dataIndex:'action',
            renderer:function columnWrap(val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            width:200

        }
    ],
    callFilter:[],
    callList:{
        mtype:'glustore',
        model:'tc.models.Call',
        pageSize:25,
        proxy:{
            type:'ajax',
            url:'/json/call',
            //            actionMethods:{read:'POST'},
            reader:{
                type:'glujson',
                totalProperty:'total',
                root:'rows'
            }
        }
    },
    callListPage:1,
    detail:{
        mtype:'call'
    },

    //will hold a record once selected...
    callSelections:[],

    //likewise
    callWithFocus:{},
    filterCall:'',


    init:function () {
        this.refreshCallList();
    },

    //COMMANDS
    openCall:function () {
        var callWindow = this.open({
            mtype:'call'
        });
        callWindow.load(this.callWithFocus.get('id'))
    },

    refreshCallList:function () {
        var params = {
            params:{
                or:true,
                filters:Ext.encode([
                    {
                        field:'agent',
                        comparator:'RE',
                        value:this.filterCall
                    },
                    {
                        field:'action',
                        comparator:'RE',
                        value:this.filterCall
                    },
                    {
                        field:'creationDate',
                        comparator:'RE',
                        value:this.filterCall
                    }
                ])
            }
        };
        this.callList.loadPage(this.callListPage, params);
    },


    newCall:function () {
        var newClient = {
            "id":0,
            "agent":'',
            "action":''
        }
        for (var k in newClient) {
            this.detail.set(k, newClient[k])
        }
        var clientWindow = this.open(this.detail);
    },

    detailIsExpanded$:function () {
        return this.callSelections.length == 1 && !this.rootList;
    },

    newCallIsEnabled$:function () {
        return true;
    },

    linkTerm:function () {
        var linkedTermWindow = this.open(this.rootTermPicker());
    },

    linkTermIsEnabled$:function () {
        return this.callSelections.length == 1;
    },

    editCall:function () {
        this.openCall()
    },

    editCallIsEnabled$:function () {
        return this.callSelections.length == 1;
    },

    removeCalls:function () {
        this.confirm({
            title:this.localize('removeCallsTitle'),
            msg:this.localize('removeCallsMessage'),
            buttons:Ext.Msg.YESNO,
            icon:Ext.Msg.QUESTION,
            fn:function (btn) {
                if (btn !== 'yes') return;
                this.removeCallsActual();
            }
        });
    },

    removeCallsActual:function () {
        this.ajax({
            url:'/json/call/action/delete',
            method:'post',
            params:{
                ids:this.selectedIds()
            },
            success:function () { //TODO: Automatically emit removeCallsSuccess event
                this.refreshCallList();
            }
        });
    },

    removeCallsIsEnabled$:function () {
        return this.callSelections.length > 0;
    },

    //REACTIONS
    when_selected_call_changes_then_load_detail:{
        on:'callWithFocusChanged',
        action:function () {
            if (this.callWithFocus == null) return;
            //            this.parentVM.detail.load(this.callWithFocus.get('id'))
        }
    },

    when_filterdrug_changes_then_load_detail:{
        on:'filterCallChanged',
        action:function () {
            this.refreshCallList();
        }
    },

    when_page_changes_then_reload_grid:{
        on:'callListPageChanged',
        action:function () {
            this.refreshCallList();
        }
    },

    when_call_filter_changes_then_reload_grid:{
        on:'callFilterChanged',
        action:function () {
            this.refreshCallList();
        }
    },

    when_call_seletions_changes:{
        on:'callSelectionsChanged',
        action:function () {
            if (this.callWithFocus == null || this.rootList) return;
            this.detail.load(this.callWithFocus.get('id'))
            //            this.parentVM.set('callViewActiveItem', (this.callSelections.length > 1 ? 1 : 0))
        }
    },

    clearFilter:function () {
        this.set('callFilter', []);
        this.refreshCallList();
    },

    //PRIVATE
    selectedIds:function () {
        var ids = [];
        for (var i = 0; i < this.callSelections.length; i++) {
            ids.push(this.callSelections[i].get('id'));
        }
        return ids;
    },

    clone:function () {
        return {
            mtype:'callSet',
            callListPage:this.callListPage
        };
    }
});