# iRun Shop - Angular v21

This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.5 and has been updated to **Angular 21.0** (CLI 21.0.6).

## Prerequisites

- **Node.js**: v20.11.1 or higher (v24+ recommended)
- **npm**: 11.6.0 or higher
- **TypeScript**: 5.9+

## Installation

```bash
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag is required due to some third-party dependencies that haven't updated their peer dependency requirements yet.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/i-run-v21` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Technology Stack

- **Angular**: 21.1.3
- **Angular Material**: 21.1.3
- **TypeScript**: 5.9.3
- **RxJS**: 7.8.2
- **Zone.js**: 0.15.1
- **Firebase**: 9.15.0 (with @angular/fire compat)
- **Bootstrap**: 5.2.3
- **Google Maps**: Angular Google Maps 21.1.3

## Update History

**February 2026**: Updated from Angular 15 to Angular 21
- Migrated through Angular versions 16 → 17 → 18 → 19 → 20 → 21
- Updated TypeScript from 4.8 to 5.9
- Updated Zone.js from 0.12 to 0.15
- Added `standalone: false` to all components (maintaining NgModule architecture)
- Updated to new provider APIs (`provideZoneChangeDetection`, `provideAnimationsAsync`)
- Fixed deprecated `browserTarget` → `buildTarget` in angular.json

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
