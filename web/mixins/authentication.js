glu.defModel('tc.Authentication', {
    user:null,
    when_user_changes_update_features:{
        on:['userChanged'],
        action:function () {
            if (this.user && this.user.type) {
                switch (this.user.type.toLowerCase()) {
                    case 'admin':
                        this.user.features = [
                            {
                                name:this.localize('ManageAccounts'),
                                mtype:'userSet'
                            },
                            {
                                name:this.localize('ManageData'),
                                mtype:'dataManagement'
                            },
                            {
                                name:this.localize('Calls'),
                                mtype:'callSet'
                            },
                            {
                                name:this.localize('Jobs'),
                                mtype:'testsuiteSet'
                            }
                        ]
                        break;
                    case 'agent':
                        this.user.features = [
                            {
                                name:this.localize('AccountSettings'),
                                mtype:'accountSettings'
                            },
                            {
                                name:this.localize('CallTracker'),
                                mtype:'callSet'
                            },
                            {
                                name:this.localize('JobQueue'),
                                mtype:'Queue'
                            }
                        ]
                        break;
                }
                this.user.features = this.user.features || []
                this.featureStore.loadData(this.user.features)
                this.set('featureStoreCount', this.user.features.length)
                if(this.user && this.user.features && this.user.features.length>0){
                    this.set('feature',this.user.features[0].mtype)
                }
            } else {
                this.featureStore.removeAll()
                this.set('featureStoreCount', 0)
            }
        }
    },

    userIsAdminOrExpert$:function () {
        return this.user && Ext.Array.indexOf(['expert', 'admin'], this.user.type) > -1
    },

    greeting$:function () {
        return this.user != null ? this.localize('hello') + this.user.name : ''
    },
    email:'',
    emailIsVisible$:function () {
        return !this.authenticated
    },
    password:'',
    passwordIsVisible$:function () {
        return !this.authenticated
    },

    login:function () {
        if (this.email && this.password) {
            this.ajax({
                url:'/json/sessions',
                method:'POST',
                params:{
                    email:this.email,
                    password:this.password
                },
                success:function (data) {
                    var response = Ext.decode(data.responseText)
                    if (response.error) {
                        this.showError(response.error);
                        return;
                    }
                    this.set('password', '')
                    this.set('email', '')
                    this.loadUser()
                }
            })
        }
    },
    isAdmin$:function () {
        if (!this.user) {
            return false
        }
        var type = this.user.type
        return type == 'ADMIN'
    },
    loadUser:function () {
        this.ajax({
            url:'/json/user',
            success:function (r) {
                var response = Ext.decode(r.responseText || '{}')
                if (!response.error) this.set('user', response)
            }
        })
    },
    authenticated$:function () {
        return this.user != null && this.user.type
    },
    loginIsVisible$:function () {
        return !this.authenticated
    },
    logout:function () {
        this.ajax({
            url:'/json/sessions/action/delete',
            method:'GET',
            success:function (data) {
                this.set('user', null);
                this.set('feature','')
                this.featureStore.removeAll()
                this.set('featureStoreCount', 0)
            },
            failure:function () {
                this.set('user', null)
            }
        });
    },
    logoutIsVisible$:function () {
        return this.authenticated
    }
})