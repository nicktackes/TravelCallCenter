glu.namespace('tc.models').calltype = {
    fields:[
        {
            name:'id',
            type:'string'
        },
        {
            name:'name',
            type:'string'
        }
    ]
};



var rowModel = glu.deepApply({
    formulas:{

    }
}, tc.models.calltype);
glu.defRowModel('tc.models.CallType', rowModel);