glu.defModel('tc.SignUp', {
    isSaving:false,
    modelType:'user',
	height: 175,
	width: 400,

	title$: function() {
		return this.localize('signUpUser')
	},

	init: function() {},

	notnow: function() {
		this.doClose()
	},

    signUpIsEnabled$:function(){
        return this.isDirty && this.isValid && !this.isSaving;
    },

    emailIsValid$:function(){
        return Ext.data.validations.email({}, this.get('email'))?true:this.localize('valid_email');
    },

    passwordIsValid$:function(){
        var result = true
        if(this.changePassword){
            if(this.get('passwordConfirm').length == 0 || this.get('password')!=this.get('passwordConfirm')){
                result = false
            }
        }
        return result
    },


	signUp: function() {
        this.set('isSaving', true)
        var payload = this.asObject();
        delete payload.passwordConfirm
        this.ajax({
            url:'/json/users/0/action/save',
            method:'post',
            params:payload,
            success:function (r) {
                var responseObj = Ext.decode(r.responseText)
                this.set('isSaving',false);
                if(responseObj.error){
                    this.rootVM.openError(responseObj.error)
                    return;
                }
                this.doClose()
                this.rootVM.openMessage(responseObj.success);
            }
        })
//		this.doClose()
	}
})