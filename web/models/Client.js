glu.namespace('tc.models').client = {
    fields:[
        {
            name:'id',
            type:'string'
        },
        {
            name:'firstName',
            type:'string'
        },
        {
            name:'lastName',
            type:'string'
        }
    ]
};



var rowModel = glu.deepApply({
    formulas:{

    }
}, tc.models.client);
glu.defRowModel('tc.models.Client', rowModel);