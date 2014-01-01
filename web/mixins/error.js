glu.defModel('tc.Error', {
	showError: function(errors) {

		var xt = new Ext.XTemplate(
			'<ul>',
			'<tpl for=".">',
			'<li>{message}</li>',
			'</tpl>',
			'</ul>')
		Ext.example = function() {
			var msgCt;

			function createBox(t, s) {
				return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
			}

			return {
				msg: function(title, format) {
					if (!msgCt) {
						msgCt = Ext.DomHelper.insertFirst(document.body, {
							id: 'msg-div'
						}, true);
					}
					var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
					var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
					var xy = m.getXY()
					m.hide();
					m.slideIn('t').ghost("t", {
						delay: 4000,
						remove: true
					});
				}
			};
		}();
		Ext.example.msg('Oops!', xt.apply(errors));
	}
})