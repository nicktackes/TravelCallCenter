glu.defModel('tc.dataManagement', {
    modelSetList: {
        mtype: 'activatorlist',
        focusProperty: 'modelSetWithFocus'
    },
    modelSetWithFocus: 0,
    processPage: 0,
    init: function() {
        this.modelSetList.add(this.model({
            mtype: 'clientSet'
        }))
        this.modelSetList.add(this.model({
            mtype: 'callTypeSet'
        }))
        this.set('modelSetWithFocus', this.modelSetList.getAt(0))
    }
});