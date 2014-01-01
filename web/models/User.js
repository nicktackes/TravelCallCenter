glu.namespace('tc.models').user = {
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'username',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'password',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'passwordConfirm',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'email',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'type',
        type: 'string',
        defaultValue: 'PATIENT'
    }, {
        name: 'status',
        type: 'string',
        defaultValue: 'PENDING'
    }]
};

var rowModel = glu.deepApply({
    formulas: {}
}, tc.models.user);
glu.defRowModel('tc.models.User', rowModel);