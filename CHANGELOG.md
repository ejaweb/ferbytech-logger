# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2021-08-20
### Added
- Now forces utf-8 encoding
- Now supports console colors
- New `.log` method for quick use
- Now supports daily rotate file feature
- Now supports chaining methods (returns this)

### Changed
- Updated interfaces
- Updated husky pre-commit
- Updated ReadMe to support features
- Bumped version to 1.1.0 from 1.0.3
- Made validateLogLevel method private
- Test suite modifications for cleaner tests

### Fixed
- Logs now properly append to existing files
- Removed default export to comply with Readme

## [1.0.3] - 2021-08-18
### Added
- Changelog file
- Log level groups
- Unit tests for logger
- Timestamp option in config
- Jest coverageThreshold to 100%
- Husky pre-commit (build + test)

### Changed
- Bumped version to 1.0.3 from 1.0.2
- Test suite logger name to camelCase
- Updated ReadMe with log level/group details

### Fixed
- Fixed typos in test suite

### Removed
- Coverage report folder
