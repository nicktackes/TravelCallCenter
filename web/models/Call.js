glu.namespace('tc.models').call = {
    fields:[
        {
            name:'id',
            type:'string'
        },
        {
            name:'agent',
            type:'string'
        },
        {
            name:'action',
            type:'string'
        },
        {
            name:'creationDate',
            type:'date'
        }
    ]
};



var rowModel = glu.deepApply({
    formulas:{

    }
}, tc.models.call);
glu.defRowModel('tc.models.Call', rowModel);