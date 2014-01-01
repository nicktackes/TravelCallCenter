glu.defModel('tc.call', {
    modelType: 'call',
    isSaving: false,

    isExpanded$: function() {
        return true;
    },

    save: function() {
        this.set('isSaving', true)
        var payload = this.asObject();

        this.ajax({
            url: '/json/call/' + this.id + '/action/save',
            method: 'post',
            params: payload,
            success: function(r) {
                var responseObj = Ext.decode(r.responseText)
                this.set('isSaving', false);
                if (responseObj.error) {
                    this.rootVM.openError(responseObj.error)
                    return;
                }
                this.commit();
                this.parentVM.refreshCallList();
                this.close()
            }
        })
    },

    saveIsEnabled$: function() {
        return this.isDirty && !this.isSaving;
    },

    revertIsEnabled$: function() {
        return this.isDirty && !this.isSaving;
    },

    //PRIVATE
    load: function(id) {
        this.ajax({
            url: '/json/call/' + id,
            success: function(r) {
                var response = Ext.decode(r.responseText)
                if (response.error) {
                    this.close()
                    this.rootVM.openError(response.error);
                    return;
                }
                this.loadData(response);
            }
        })
    },
    refresh: function() {
        this.load(this.id);
    }
});