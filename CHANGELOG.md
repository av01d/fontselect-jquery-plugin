# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5] - 2019-07-24
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
