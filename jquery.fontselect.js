/*
 * jQuery.fontselect - A font selector for system fonts, local fonts and Google Web Fonts
 *
 * Made by Arjan Haverkamp, https://www.webgear.nl
 * Based on original by Tom Moor, http://tommoor.com
 * Copyright (c) 2011 Tom Moor, 2019 Arjan Haverkamp
 * MIT Licensed
 * @version 0.7 - 2019-08-27
 * @url https://github.com/av01d/fontselect-jquery-plugin
 */

(function($){

	var fontsLoaded = {};

	$.fn.fontselect = function(options) {
		var __bind = function(fn, me) { return function(){ return fn.apply(me, arguments); }; };

		var settings = {
			style: 'font-select',
			placeholder: 'Select a font',
			placeholderSearch: 'Search...',
			searchable: true,
			lookahead: 2,
			googleApi: 'https://fonts.googleapis.com/css?family=',
			localFontsUrl: '/fonts/',
			systemFonts: 'Arial|Helvetica+Neue|Courier+New|Times+New+Roman|Comic+Sans+MS|Verdana|Impact'.split('|'),
			googleFonts: 'Abril+Fatface|Aclonica|Alfa+Slab+One|Allan|Amarante|Annie+Use+Your+Telescope|Anonymous+Pro|Allerta+Stencil|Allerta|Amaranth|Anton|Arbutus|Architects+Daughter|Archivo+Black|Arimo|Artifika|Arvo|Asset|Astloch|Audiowide|Bangers|Baumans|Bentham|Bevan|Bigshot+One|Black+Ops+One|Bowlby+One|Bowlby+One+SC|Brawler|Bubblegum+Sans|Buda:300|Butcherman|Butterfly+Kids|Cabin|Caesar+Dressing|Calligraffitti|Candal|Cantarell|Cardo|Carter+One|Caudex|Cedarville+Cursive|Changa+One|Cherry+Cream+Soda|Chewy|Coda|Codystar|Comfortaa|Coming+Soon|Copse|Corben|Cousine|Covered+By+Your+Grace|Crafty+Girls|Crimson+Text|Crushed|Cuprum|Damion|Dancing+Script|Dawning+of+a+New+Day|Days+One|Didact+Gothic|Diplomata|Droid+Sans|Droid+Serif|EB+Garamond|Ewert|Expletus+Sans|Faster+One|Fontdiner+Swanky|Forum|Francois+One|Fredoka+One|Fugaz+One|Glass+Antiqua|Geo|Give+You+Glory|Goblin+One|Gorditas|Goudy+Bookletter+1911|Gravitas+One|Gruppo|Hammersmith+One|Hanalei|Henny+Penny|Holtwood+One+SC|Homemade+Apple|Inconsolata|Indie+Flower|Irish+Grover|Istok+Web|Josefin+Sans|Josefin+Slab|Judson|Jura|Just+Another+Hand|Just+Me+Again+Down+Here|Kameron|Kenia|Kranky|Kreon|Kristi|La+Belle+Aurore|Lato|League+Script|Lekton|Limelight|Lobster|Lobster+Two|Lora|Love+Ya+Like+A+Sister|Loved+by+the+King|Luckiest+Guy|Maiden+Orange|Mako|Maven+Pro|Maven+Pro:900|Meddon|MedievalSharp|Megrim|Merriweather|Metrophobic|Michroma|Miltonian+Tattoo|Miltonian|Modern+Antiqua|Monofett|Molengo|Montserrat:300|Montserrat|Montserrat:700|Mountains+of+Christmas|Muli:300|Muli|Mystery+Quest|Neucha|Neuton|News+Cycle|Nixie+One|Nobile|Nova+Cut|Nova+Flat|Nova+Mono|Nova+Oval|Nova+Round|Nova+Script|Nova+Slim|Nova+Square|Nunito|Old+Standard+TT|Open+Sans:300|Open+Sans|Open+Sans:600|Open+Sans:800|Open+Sans+Condensed:300|Orbitron|Orbitron:500|Orbitron:700|Orbitron:900|Oswald|Over+the+Rainbow|Piedra|Prociono|Questrial|Reenie+Beanie|Pacifico|Patrick+Hand|Paytone+One|Permanent+Marker|Philosopher|Play|Playfair+Display|Podkova|Poiret+One|Press+Start+2P|Puritan|Quattrocento|Quattrocento+Sans|Racing+Sans+One|Radley|Raleway:100|Redressed|Ribeye|Ribeye+Marrow|Risque|Rock+Salt|Rokkitt|Ruslan+Display|Schoolbell|Shadows+Into+Light|Shanti|Sigmar+One|Six+Caps|Slackey|Smythe|Sniglet|Sniglet:800|Special+Elite|Stardos+Stencil|Sue+Elen+Francisco|Sunshiney|Swanky+and+Moo+Moo|Syncopate|Tangerine|Tenor+Sans|Terminal+Dosis+Light|The+Girl+Next+Door|Tinos|Ubuntu|Ultra|Unkempt|UnifrakturCook:bold|UnifrakturMaguntia|Varela|Varela+Round|Vast+Shadow|Vibur|Vollkorn|VT323|Waiting+for+the+Sunrise|Wallpoet|Walter+Turncoat|Wire+One|Yanone+Kaffeesatz|Yeseva+One|Zeyada'.split('|')
		};

		var Fontselect = (function(){

			function Fontselect(original, o) {
				if (!o.systemFonts) { o.systemFonts = []; }
				if (!o.localFonts) { o.localFonts = []; }
				if (!o.googleFonts) { o.googleFonts = []; }
				this.options = o;
				this.$original = $(original);
				this.setupHtml();
				this.getVisibleFonts();
				this.bindEvents();
				this.query = '';
				this.keyActive = false;
				this.searchBoxHeight = 0;

				var font = this.$original.val();
				if (font) {
					this.updateSelected();
					this.addFontLink(font);
				}
			}

			Fontselect.prototype = {
				keyDown: function(e) {

					function stop(e) {
						e.preventDefault();
						e.stopPropagation();
					}

					this.keyActive = true;
					if (e.keyCode == 27) {// Escape
						stop(e);
						this.toggleDropdown('hide');
						return;
					}
					if (e.keyCode == 38) {// Cursor up
						stop(e);
						var $li = $('li.active', this.$results), $pli = $li.prev('li');
						if ($pli.length > 0) {
							$li.removeClass('active');
							this.$results.scrollTop($pli.addClass('active')[0].offsetTop - this.searchBoxHeight);
						}
						return;
					}
					if (e.keyCode == 40) {// Cursor down
						stop(e);
						var $li = $('li.active', this.$results), $nli = $li.next('li');
						if ($nli.length > 0) {
							$li.removeClass('active');
							this.$results.scrollTop($nli.addClass('active')[0].offsetTop - this.searchBoxHeight);
						}
						return;
					}
					if (e.keyCode == 13) {// Enter
						stop(e);
						$('li.active', this.$results).trigger('click');
						return;
					}
					this.query += String.fromCharCode(e.keyCode).toLowerCase();
					var $found = $("li[data-query^='"+ this.query +"']").first();
					if ($found.length > 0) {
						$('li.active', this.$results).removeClass('active');
						this.$results.scrollTop($found.addClass('active')[0].offsetTop);
					}
				},

				keyUp: function(e) {
					this.keyActive = false;
				},

				bindEvents: function() {
					var self = this;

					$('li', this.$results)
					.click(__bind(this.selectFont, this))
					.mouseover(__bind(this.activateFont, this));

					this.$select.click(__bind(function() { self.toggleDropdown('show') }, this));

					// Call like so: $("input[name='ffSelect']").trigger('setFont', [fontFamily, fontWeight]);
					this.$original.on('setFont', function(evt, fontFamily, fontWeight) {
						fontWeight = fontWeight || 400;

						var fontSpec = fontFamily.replace(/ /g, '+') + (fontWeight == 400 ? '' : ':'+fontWeight);

						var $li = $("li[data-value='"+ fontSpec +"']", self.$results);
						if ($li.length == 0) {
							fontSpec = fontFamily.replace(/ /g, '+');
						}
						$li = $("li[data-value='"+ fontSpec +"']", self.$results);
						$('li.active', self.$results).removeClass('active');
						$li.addClass('active');

						self.$original.val(fontSpec);
						self.updateSelected();
						self.addFontLink($li.data('value'));
						//$li.trigger('click'); // Removed 2019-10-16
					});
					this.$original.on('change', function() {
						self.updateSelected();
						self.addFontLink($('li.active', self.$results).data('value'));
					});

					if (this.options.searchable) {
						this.$input.on('keyup', function() {
							var q = this.value.toLowerCase();
							// Hide options that don't match query:
							$('li', self.$results).each(function() {
								if ($(this).text().toLowerCase().indexOf(q) == -1) {
									$(this).hide();
								}
								else {
									$(this).show();
								}
							})
						})
					}

					$(document).on('click', function(e) {
						if ($(e.target).closest('.'+self.options.style).length === 0) {
							self.toggleDropdown('hide');
						}
					});
				},

				toggleDropdown: function(hideShow) {
					if (hideShow === 'hide') {
						// Make inactive
						this.$element.off('keydown keyup');
						this.query = '';
						this.keyActive = false;
						this.$element.removeClass('font-select-active');
						this.$drop.hide();
						clearInterval(this.visibleInterval);
					} else {
						// Make active
						this.$element.on('keydown', __bind(this.keyDown, this));
						this.$element.on('keyup', __bind(this.keyUp, this));
						this.$element.addClass('font-select-active');
						this.$drop.show();

						this.visibleInterval = setInterval(__bind(this.getVisibleFonts, this), 500);
						this.searchBoxHeight = this.$search.outerHeight();
						this.moveToSelected();

						/*
						if (this.options.searchable) {
							// Focus search box
							$this.$input.focus();
						}
						*/
					}
				},

				selectFont: function() {
					var font = $('li.active', this.$results).data('value');
					this.$original.val(font).change();
	 				this.updateSelected();
					this.toggleDropdown('hide'); // Hide dropdown
				},

				moveToSelected: function() {
					var font = this.$original.val().replace(/ /g, '+');
					var $li = font ? $("li[data-value='"+ font +"']", this.$results) : $li = $('li', this.$results).first();
					this.$results.scrollTop($li.addClass('active')[0].offsetTop - this.searchBoxHeight);
				},

				activateFont: function(e) {
					if (this.keyActive) { return; }
					$('li.active', this.$results).removeClass('active');
					$(e.target).addClass('active');
				},

				updateSelected: function() {
					var font = this.$original.val();
					$('span', this.$element).text(this.toReadable(font)).css(this.toStyle(font));
				},

				setupHtml: function() {
					this.$original.hide();
					this.$element = $('<div>', {'class': this.options.style});
					this.$select = $('<span tabindex="0">' + this.options.placeholder + '</span>');
					this.$search = $('<div>', {'class': 'fs-search'});
					this.$input = $('<input>', {type:'text'});
					if (this.options.placeholderSearch) {
						this.$input.attr('placeholder', this.options.placeholderSearch);
					}
					this.$search.append(this.$input);
					this.$drop = $('<div>', {'class': 'fs-drop'});
					this.$results = $('<ul>', {'class': 'fs-results'});
					this.$original.after(this.$element.append(this.$select, this.$drop));
					this.options.searchable && this.$drop.append(this.$search);
					this.$drop.append(this.$results.append(this.fontsAsHtml())).hide();
				},

				fontsAsHtml: function() {
					var i, r, s, style, h = '';
					var systemFonts = this.options.systemFonts;
					var localFonts = this.options.localFonts;
					var googleFonts = this.options.googleFonts;

					for (i = 0; i < systemFonts.length; i++){
						r = this.toReadable(systemFonts[i]);
						s = this.toStyle(systemFonts[i]);
						style = 'font-family:' + s['font-family'];
						if ((localFonts.length > 0 || googleFonts.length > 0) && i == systemFonts.length-1) {
							style += ';border-bottom:1px solid #444'; // Separator after last system font
						}
						h += '<li data-value="'+ systemFonts[i] +'" data-query="' + systemFonts[i].toLowerCase() + '" style="' + style + '">' + r + '</li>';
					}

					for (i = 0; i < localFonts.length; i++){
						r = this.toReadable(localFonts[i]);
						s = this.toStyle(localFonts[i]);
						style = 'font-family:' + s['font-family'];
						if (googleFonts.length > 0 && i == localFonts.length-1) {
							style += ';border-bottom:1px solid #444'; // Separator after last local font
						}
						h += '<li data-value="'+ localFonts[i] +'" data-query="' + localFonts[i].toLowerCase() + '" style="' + style + '">' + r + '</li>';
					}

					for (i = 0; i < googleFonts.length; i++){
						r = this.toReadable(googleFonts[i]);
						s = this.toStyle(googleFonts[i]);
						style = 'font-family:' + s['font-family'] + ';font-weight:' + s['font-weight'];
						h += '<li data-value="'+ googleFonts[i] +'" data-query="' + googleFonts[i].toLowerCase() + '" style="' + style + '">' + r + '</li>';
					}

					return h;
				},

				toReadable: function(font) {
					return font.replace(/[\+|:]/g, ' ');
				},

				toStyle: function(font) {
					var t = font.split(':');
					return {'font-family':"'"+this.toReadable(t[0])+"'", 'font-weight': (t[1] || 400)};
				},

				getVisibleFonts: function() {
					if(this.$results.is(':hidden')) { return; }

					var fs = this;
					var top = this.$results.scrollTop();
					var bottom = top + this.$results.height();

					if (this.options.lookahead){
						var li = $('li', this.$results).first().height();
						bottom += li * this.options.lookahead;
					}

					$('li:visible', this.$results).each(function(){
						var ft = $(this).position().top+top;
						var fb = ft + $(this).height();

						if ((fb >= top) && (ft <= bottom)){
							fs.addFontLink($(this).data('value'));
						}
					});
				},

				addFontLink: function(font) {
					if (fontsLoaded[font]) { return; }
					fontsLoaded[font] = true;

					if (this.options.googleFonts.indexOf(font) > -1) {
						$('link:last').after('<link href="' + this.options.googleApi + font + '" rel="stylesheet" type="text/css">');
					}
					else if (this.options.localFonts.indexOf(font) > -1) {
						font = this.toReadable(font);
						$('head').append("<style> @font-face { font-family:'" + font + "'; font-style:normal; font-weight:400; src:local('" + font + "'), url('" + this.options.localFontsUrl + font + ".woff') format('woff'); } </style>");
					}
					// System fonts need not be loaded!
				}
			}; // End prototype

			return Fontselect;
		})();

		return this.each(function() {
			// If options exist, merge them
			if (options) { $.extend(settings, options); }

			return new Fontselect(this, settings);
		});
	};
})(jQuery);
