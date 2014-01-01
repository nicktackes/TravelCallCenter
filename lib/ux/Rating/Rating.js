/**
 * Displays a rating field with stars to indicate user votes.
 */
Ext.define('RS.wiki.infobar.control.RatingField', {
	extend: 'Ext.form.Field',
	alias: 'widget.ratingfield',
	requires: ['Ext.form.field.VTypes', 'Ext.layout.component.field.Text'],

	/**
	 * The number of stars to display
	 */
	numberOfStars: 5,

	/**
	 * The css class to use when the star is marked
	 */
	ratingClassOn: 'starOn',

	/**
	 * The css class to use when the star is initially marked (showing the global rating for example)
	 */
	ratingClassInitial: 'starInitial',

	/**
	 * The css class to use when the star is unmarked
	 */
	ratingClassOff: 'starOff',

	/**
	 * The css class to use when the rating is reset
	 */
	ratingClassReset: 'starReset',

	/**
	 * The css class to use when the star is clicked (this is only when the user clicks the star, see {@link RS.wiki.RatingField#ratingClassOn} for the class to display when the star is marked)
	 */
	ratingClassSelected: 'starClicked',

	/**
	 * Position of the reset button - valid values are 'right', 'left', and 'none' (defaults to 'none')
	 */
	resetButtonPosition: 'none',

	/**
	 * True to display the detail rating after the stars - for example  *** (3.5 of 5)
	 */
	displayTextRating: false,

	/**
	 * Display text to display if the {@link RS.wiki.RatingField#displayTextRating} is true
	 */
	displayText: '({0} of {1})',

	/**
	 * The css class to use to display the rating text
	 */
	displayTextCls: 'ratingDisplayText',

	/**
	 * @cfg initialValue
	 * Sets the initial value of star ratings to be displayed (to show global setting for example).  If a value is provided, then that value is used to display the stars instead
	 */

	onRender: function(ct, position) {
		this.callParent(arguments);
		if(!Ext.isDefined(this.initialValue)) this.initialValue = this.value;

		this.bodyEl.update('');

		if(this.resetButtonPosition === 'left') {
			this.createCancelButton();
		}

		this.stars = [];
		for(var i = 1; i <= this.numberOfStars; i++) {
			var starElement = document.createElement('div');
			starElement.setAttributeNode(this.createHtmlAttribute('key', i));
			var star = new Ext.Element(starElement);
			if(!this.value && i <= this.initialValue) star.addCls(this.ratingClassInitial);
			else if(i <= this.value) star.addCls(this.ratingClassOn);
			else star.addCls(this.ratingClassOff);
			this.bodyEl.appendChild(star);
			this.stars[i - 1] = star;
		}

		if(this.resetButtonPosition === 'right') {
			this.createCancelButton();
		}

		if(this.displayTextRating) {
			var textElement = document.createElement('div');
			var displayText = new Ext.Element(textElement);
			displayText.update(Ext.String.format(this.displayText, this.value || this.initialValue, this.numberOfStars));
			displayText.addCls(this.displayTextCls);
			this.bodyEl.appendChild(displayText);
		}

		var inputElement = document.createElement('input');
		inputElement.setAttributeNode(this.createHtmlAttribute('type', 'hidden'));
		inputElement.setAttributeNode(this.createHtmlAttribute('name', this.getName()));
		// this.hiddenField = new Ext.Element(inputElement);
		// this.hiddenField.addCls('starHiddenClearMode');
		// this.bodyEl.appendChild(this.hiddenField);
		// this.reset();
	},
	/**
	 * Create and append the reset button for the field
	 * @return nothing
	 * Private function
	 */
	createCancelButton: function() {
		var cancelButtonElement = document.createElement('div');
		cancelButtonElement.id = 'test';
		this.cancelButton = new Ext.Element(cancelButtonElement);
		this.cancelButton.addCls(this.ratingClassReset);
		this.bodyEl.appendChild(this.cancelButton);
	},
	/**
	 * Initialise event listeners
	 * @return nothing
	 * Private function
	 */
	initEvents: function() {
		this.callParent(arguments);
		if(!this.readOnly) {
			for(var i = 0; i < this.stars.length; i++) {
				this.stars[i].on('mouseenter', this.showStars, this);
				this.stars[i].on('mouseleave', this.hideStars, this);
				this.stars[i].on('click', this.selectStars, this);
			}
			if(this.resetButtonPosition === 'right' || this.resetButtonPosition === 'left') this.cancelButton.on('click', this.reset, this);
		}
	},
	/**
	 * Reset the stars and content of the field to 0
	 * @return nothing
	 */
	reset: function() {
		for(var i = 0; i < this.stars.length; i++) {
			if(this.stars[i].hasCls(this.ratingClassOn) === true && this.stars[i].hasCls(this.ratingClassSelected) === true) {
				this.stars[i].replaceCls(this.ratingClassOn, this.ratingClassOff);
				this.stars[i].removeCls(this.ratingClassSelected);
			}
		}
		this.setValue(0);
		// this.hiddenField.set({
		// 'value' : 0
		// }, true);
	},
	/**
	 * Based on click event, mark the amount of stars selected
	 * @param {Ext.EventObject} e
	 * @param {HTMLElement} t
	 * @return nothing
	 */
	selectStars: function(e, t) {
		var i = 0;
		var limitStar = t.getAttribute('key');

		this.setValue(limitStar);
		// this.hiddenField.set({
		// 'value' : limitStar
		// }, true);
		for(i = 0; i < this.stars.length; i++) {
			this.stars[i].removeCls(this.ratingClassSelected);
		}

		for(i = 0; i < limitStar; i++) {
			if(this.stars[i].hasCls(this.ratingClassOn) === false) {
				this.stars[i].replaceCls(this.ratingClassOff, this.ratingClassOn);
			}
			this.stars[i].addCls(this.ratingClassSelected);
		}
	},
	/**
	 * Allows us to set the initial value after the field has been rendered.  This is useful for when we want to render the screen, but are still waiting on the server for data
	 */
	setInitialValue: function(value) {
		this.initialValue = value;
		var i = 0;
		if(this.rendered) {
			for(i = 0; i < value; i++) {
				this.stars[i].addCls(this.ratingClassInitial);
				this.stars[i].removeCls(this.ratingClassOn);
				this.stars[i].removeCls(this.ratingClassOff);
				this.stars[i].removeCls(this.ratingClassSelected);
			}
			for(; i < this.stars.length; i++) {
				this.stars[i].removeCls(this.ratingClassInitial);
				this.stars[i].removeCls(this.ratingClassOn);
				this.stars[i].removeCls(this.ratingClassSelected);
				this.stars[i].addCls(this.ratingClassOff);
			}

			if(this.displayTextRating) {
				var displays = this.getEl().query('div.ratingDisplayText');
				Ext.each(displays, function(displayText) {
					Ext.fly(displayText).update(Ext.String.format(this.displayText, this.value || this.initialValue, this.numberOfStars));
				}, this);
			}
		}
	},
	/**
	 * Based on hover, show the amount of stars that will be selected
	 * @param {Ext.EventObject} e
	 * @param {HTMLElement} t
	 * @return nothing
	 */
	showStars: function(e, t) {
		var limitStar = t.getAttribute('key');
		for(var i = 0; i < limitStar; i++) {
			if(this.stars[i].hasCls(this.ratingClassOn) === false && this.stars[i].hasCls(this.ratingClassSelected) === false) {
				this.stars[i].replaceCls(this.ratingClassOff, this.ratingClassOn);
				this.stars[i].removeCls(this.ratingClassInitial);
			}
		}
	},
	/**
	 * Based on hover out, hide the amount of stars showed
	 * @return nothing
	 */
	hideStars: function() {
		for(var i = 0; i < this.stars.length; i++) {
			if(this.stars[i].hasCls(this.ratingClassOff) === false && this.stars[i].hasCls(this.ratingClassSelected) === false) {
				if(!this.value && i + 1 <= this.initialValue) this.stars[i].replaceCls(this.ratingClassOn, this.ratingClassInitial);
				else if(this.value && i + 1 <= this.value) {
					//do nothing because we're showing the proper class
				} else this.stars[i].replaceCls(this.ratingClassOn, this.ratingClassOff);
			}
		}
	},
	/**
	 * Private function, that ads a html attribute to a dom element
	 * @param {string} name The name of the attribute
	 * @param {string} value The value of the attribute
	 * @return {HTMLAttribute}
	 */
	createHtmlAttribute: function(name, value) {
		var attribute = document.createAttribute(name);
		attribute.nodeValue = value;
		return attribute;
	},

	setValue: function(value) {
		if(this.rendered && Ext.isNumber(value)) {
			for(var i = 0; i < value; i++) {
				if(this.stars[i].hasCls(this.ratingClassOn) === false && this.stars[i].hasCls(this.ratingClassSelected) === false) {
					this.stars[i].replaceCls(this.ratingClassOff, this.ratingClassOn);
					this.stars[i].removeCls(this.ratingClassInitial);
				}
			}
			for(; i < this.stars.length; i++) {
				if(this.stars[i].hasCls(this.ratingClassOn) === true && this.stars[i].hasCls(this.ratingClassSelected) === true) {
					this.stars[i].replaceCls(this.ratingClassOn, this.ratingClassOff);
					this.stars[i].removeCls(this.ratingClassInitial);
				}
			}
		}
		this.callParent(arguments);
	}
});