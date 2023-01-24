# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]
### Changed 


## [0.1.1] - 2023-01-24
### Added
- Add optional 'highseal://' prefix support.

## [0.1.0] - 2022-12-18
### Added
- Added improved key derivation and made it the default.
- Added example code to readme.
- Added security note.
### Changed 
- Changed unseal to return errors instead of boolean to simplify debugging.
- Simplified code.
- Improved comments.
- Improve tests.
## Deprecated
- Old key derivation, seals starting with 'A.'

## [0.0.3] - 2022-12-15
### Added
- Add isSealed to verify sealed value format.
### Changed 
- Improved unit tests.
### Fixed
- Remove example signed value that was overflowing into the sidebar on NPM.

## [0.0.2] - 2022-12-15
### Fixed
- Updated readme to link to Highseal CLI.

## [0.0.1] - 2022-12-13
### Added
- Working seal and unseal.
- Initial release.
