# Fontselect jQuery Plugin

A font selector to choose from fonts from the Google Web Fonts api, as well as system fonts. 
Let users easily select and preview a font from Google's large range of free fonts.
This plugin mimics an original select element as closely as possible, even keyboard
navigation is built in:

- Up/Down cursor keys navigate through options.
- Enter key selects on option.
- Type a few letters to jump to the option starting with the typed letters.

## Demo

[Live demo](https://av01d.github.io/fontselect-jquery-plugin/index.html).

## Documentation

To create a font selector simply run the plugin on a standard html input element.

### How to use

```
   $('input.fonts').fontselect();
```

### Options

Fontselect has one argument, an options object that you might want to customise:

* style: the class to give the new font selector
* placeholder: text to use when no font is selected yet
* lookahead: a number of fonts to try and preload ahead in the select box
* searchable: whether or not to show a search box
* systemFonts: an array of system fonts to present in the select box
* googleFonts: an array of Google fonts to present in the select box

```
   $('input.fonts').fontselect({
      style: 'font-select',
      placeholder: 'Select a font',
      placeholderSearch: 'Search...',
      lookahead: 2,
      searchable: true,
      systemFonts: ['Helvetica', 'Comic+Sans+MS'],
      googleFonts: ['Pacifico', 'Press+Start+2P', 'Changa:200', 'Changa:400', 'Changa:700']
   });
```

### Methods

Programmatically select an option via the `setFont` trigger on the original input element:
```
   $('#font').trigger('setFont','Geo'); // Select 'Geo' font
```
or
```
   $('#font').trigger('setFont',['Orbitron', 900]); // Select 'Orbitron:900' font
```

### Events

Fontselect triggers the change event on the original element when a font is selected. 
An example is included to show how this could be used to update the font on the current page.

```
   $('input.fonts').fontselect().on('change', function(){
      // Replace + signs with spaces for css
      var font = this.value.replace(/\+/g, ' ');

      // Split font into family and weight
      font = font.split(':');
      var fontFamily = font[0];
      var fontWeight = font[1] || 400;

      console.log('Font family', fontFamily, 'Font weight', fontWeight);
   });
```

## License / Credits

This plugin is based on the original [Fontselect jQuery plugin](https://github.com/tommoor/fontselect-jquery-plugin) by [Tom Moor](https://github.com/tommoor).

This plugin is released under the MIT license. It is simple and easy to understand and places almost no restrictions on what you can do with the code.
[More Information](http://en.wikipedia.org/wiki/MIT_License)
