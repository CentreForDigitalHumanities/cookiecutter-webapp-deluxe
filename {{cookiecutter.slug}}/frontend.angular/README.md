# {{cookiecutter.project_title}} frontend

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:{{cookiecutter.frontend_port}}/`. This will not start the backend, to developing with a functioning backend use `yarn start` from the project root instead. Navigate to `http://localhost:{{cookiecutter.backend_port}}/`, which will forward to the frontend.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Localize

Run `yarn serve:nl` for a Dutch version.
Run `yarn i18n` to generate a new xlf file. This XLIFF file can be localized using for example [Poedit](https://poedit.net/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
