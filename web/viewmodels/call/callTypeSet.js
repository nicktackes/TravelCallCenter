glu.defModel('tc.callTypeSet', {
    rootList:false,
    selModel:{
        mode:'MULTI',
        xtype:'checkboxmodel'
    },
    isSaving:false,
    columns:[
        {
            header:'Type',
            dataIndex:'name',
            renderer:function columnWrap(val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            editor:'textfield',
            width:250

        }
    ],
    calltypeFilter:[],
    calltypeList:{
        mtype:'glustore',
        model:'tc.models.CallType',
        pageSize:25,
        proxy:{
            type:'ajax',
            url:'/json/calltype',
            //            actionMethods:{read:'POST'},
            reader:{
                type:'glujson',
                totalProperty:'total',
                root:'rows'
            }
        }
    },
    calltypeListPage:1,

    //will hold a record once selected...
    calltypeSelections:[],

    //likewise
    calltypeWithFocus:{},
    filterCallType:'',


    init:function () {
        this.refreshCallTypeList();
    },

    //COMMANDS
    refreshCallTypeList:function () {
        var params = {}
        if(this.filterCallType){
            params = {
                params:{
                    or:true,
                    filters:Ext.encode([
                        {
                            field:'name',
                            comparator:'RE',
                            value:this.filterCallType
                        }
                    ])
                }
            };
        }
        this.calltypeList.loadPage(this.calltypeListPage, params);
    },

    cellEdit:function (evt) {
        if(!this.calltypeWithFocus.set){return}
        this.calltypeWithFocus.set(evt.field, evt.value)
        this.save()
    },

    save: function() {
        this.set('isSaving', true)
        var payload = this.calltypeWithFocus.data;

        this.ajax({
            url: '/json/calltype/' + payload.id + '/action/save',
            method: 'post',
            params: payload,
            success: function(r) {
                var responseObj = Ext.decode(r.responseText)
                this.set('isSaving', false);
                if (responseObj.error) {
                    this.rootVM.openError(responseObj.error)
                    return;
                }
                this.calltypeList.commitChanges();
            }
        })
    },

    addCallType: function(evt, _callType) {
        var locatedRecord
        if(_callType){
            locatedRecord = this.calltypeList.getById(_callType.id)
        }
        else{
            _callType = {
                "id": glu.guid(),
                "name": ""
            }
        }
        if(locatedRecord){
            locatedRecord.set(_callType)
            this.calltypeList.update( this.calltypeList, locatedRecord, Ext.data.Model.EDIT, ['name'])
        }
        else{
            this.calltypeList.add(_callType)
        }
    },

    removeCallTypes:function () {
        this.confirm({
            title:this.localize('removeCallTypesTitle'),
            msg:this.localize('removeCallTypesMessage'),
            buttons:Ext.Msg.YESNO,
            icon:Ext.Msg.QUESTION,
            fn:function (btn) {
                if (btn !== 'yes') return;
                this.removeCallTypesActual();
            }
        });
    },

    removeCallTypesActual:function () {
        this.ajax({
            url:'/json/calltype/action/delete',
            method:'post',
            params:{
                ids:this.selectedIds()
            },
            success:function () { //TODO: Automaticalltypey emit removeCallTypesSuccess event
                this.refreshCallTypeList();
            }
        });
    },

    removeCallTypesIsEnabled$:function () {
        return this.calltypeSelections.length > 0;
    },

    //REACTIONS
//    when_selected_calltype_changes_then_load_detail:{
//        on:'calltypeWithFocusChanged',
//        action:function () {
//            if (this.calltypeWithFocus == null) return;
//            //            this.parentVM.detail.load(this.calltypeWithFocus.get('id'))
//        }
//    },

    when_filterdrug_changes_then_load_detail:{
        on:'filterCallTypeChanged',
        action:function () {
            this.refreshCallTypeList();
        }
    },

    when_page_changes_then_reload_grid:{
        on:'calltypeListPageChanged',
        action:function () {
            this.refreshCallTypeList();
        }
    },

    when_calltype_filter_changes_then_reload_grid:{
        on:'calltypeFilterChanged',
        action:function () {
            this.refreshCallTypeList();
        }
    },

//    when_calltype_seletions_changes:{
//        on:'calltypeSelectionsChanged',
//        action:function () {
//
//        }
//    },

    clearFilter:function () {
        this.set('calltypeFilter', []);
        this.refreshCallTypeList();
    },

    //PRIVATE
    selectedIds:function () {
        var ids = [];
        for (var i = 0; i < this.calltypeSelections.length; i++) {
            ids.push(this.calltypeSelections[i].get('id'));
        }
        return ids;
    },

    clone:function () {
        return {
            mtype:'calltypeSet',
            calltypeListPage:this.calltypeListPage
        };
    }
});