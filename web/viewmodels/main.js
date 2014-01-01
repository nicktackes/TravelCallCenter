glu.defModel('tc.Main', {
    mixins:['Authentication', 'Error', 'Help'],
    feature:'',
    featureStoreWithFocus:null,

    when_feature_changes_update_screen:{
        on:['featureChanged'],
        action:function () {
            if(this.feature == ''){
                this.set('currentScreen', 0)
                return
            }
            var index = Ext.Array.indexOf(this.addedScreenList, this.feature);
            if (index == -1) {
                this.screenList.add(this.model({
                    mtype:this.feature
                }))
                this.addedScreenList.push(this.feature)
                index = this.screenList.length - 1
            }
            this.set('currentScreen', index)
        }
    },
    featureStoreCount:0,
    featureIsVisible$:function () {
        return this.featureStoreCount > 0
    },
    featureStore:{
        mtype:'store',
        fields:['name', 'mtype']
    },
    addedScreenList:[],

    screenList:{
        mtype:'activatorlist',
        focusProperty:'currentScreen'
    },
    currentScreen:{
        mtype:'Landing'
    },

    init:function () {
        //Try to get the user on load in case they are already authenticated
        this.loadUser()
        this.screenList.add({
            mtype:'Landing'
        })
        this.addedScreenList.push('Landing')
        this.set('currentScreen', this.screenList.getAt(0))
    },

    openError:function (errors) {
        if (glu.testMode) return
        var xt = new Ext.XTemplate(
            '<ul>',
            '<tpl for=".">',
            '<li>{message}</li>',
            '</tpl>',
            '</ul>')
        Ext.example = function () {
            var msgCt;

            function createBox(t, s) {
                return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
            }

            return {
                msg:function (title, format) {
                    if (!msgCt) {
                        msgCt = Ext.DomHelper.insertFirst(document.body, {
                            id:'msg-div'
                        }, true);
                    }
                    var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
                    var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
                    var xy = m.getXY()
                    m.hide();
                    m.slideIn('t').ghost("t", {
                        delay:8000,
                        remove:true
                    });
                }
            };
        }();
        Ext.example.msg('Oops!', xt.apply(errors));
    },

    openMessage:function (errors) {
        if (glu.testMode) return
        var xt = new Ext.XTemplate(
            '<ul>',
            '<tpl for=".">',
            '<li>{message}</li>',
            '</tpl>',
            '</ul>')
        Ext.example = function () {
            var msgCt;

            function createBox(t, s) {
                return '<div class="msgsuccess"><h3>' + t + '</h3><p>' + s + '</p></div>';
            }

            return {
                msg:function (title, format) {
                    if (!msgCt) {
                        msgCt = Ext.DomHelper.insertFirst(document.body, {
                            id:'msgsuccess-div'
                        }, true);
                    }
                    var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
                    var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
                    var xy = m.getXY()
                    m.hide();
                    m.slideIn('t').ghost("t", {
                        delay:4000,
                        remove:true
                    });
                }
            };
        }();
        Ext.example.msg('Success!', xt.apply(errors));
    }
});