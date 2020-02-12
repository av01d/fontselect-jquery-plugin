# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.9] - 2020-02-12
### Changes
- The list of Google Fonts wasn't complete: there were more Google Fonts than
  this plugin would show. 
  This release fixes this: all available Google fonts (977 of them, at the time of writing) are now included.
- Minified css and js files are now included.

## [0.8] - 2019-10-16
### Changed
- Calling `trigger('setFont')` would automatically trigger the `change` event on the
  original input box. This isn't always expected/desired behavior.
  In this version, the `change` event is no longer triggered automatically when `setFont`
  is called.
  If you want to both set a font and trigger the `change` event, you now have to do it like so:
  ```
  $('#font1').trigger('setFont','Geo').trigger('change');
  ```

## [0.7] - 2019-08-27
### Fixed
- Fixed issue #4: Searching for a non-existing font would load all fonts.

## [0.6] - 2019-07-31
### Fixed
- List items can no longer wrap on whitespace (caused ugly line breaks in the dropdown).
- Upon opening the dropdown, the default selected font wasn't always shown correctly.

### Changed
- List of default Google Fonts has been extended quite a bit.
- Added `Verdana` to default system fonts.

### Added
- Besides system fonts and Google fonts, you can now present local custom fonts as well.
  In order to support most browsers, the local fonts must be available in .woff format.
  You can use a tool like [Transfonter](https://transfonter.org/) to convert .ttf files
  to .woff.
  Use `options.localFonts = ['Action+Man','Bubble','Bauer']`, and make sure that
  `options.localFontsUrl` (default: `/fonts/`) contains the path to the directory
  that holds your .woff fonts.
  See the [demo page](https://av01d.github.io/fontselect-jquery-plugin/index.html) for an example.

## [0.5] - 2019-07-24
### Fixed
- Fixed issue 3: Calling `setFont` would change the font family for all fontSelect components, instead of just one. Thanks Liam Donnelly for reporting.

## [0.4] - 2019-07-16
### Added
- New option `placeholderSearch`, which defines the placeholder for the
  search box.

### Changed
- Renamed `toggleDrop` to `toggleDropdown`.
- Font-search input no longer auto-focuses, as this is very annoying
  on touch screen devices: the virtual keyboard pops up whenever the dropdown
  menu is accessed.
- Font dropdowns are now more intelligently shown.
