# cookiecutter-webapp-deluxe

[![Actions Status](https://github.com/UUDigitalHumanitiesLab/cookiecutter-webapp-deluxe/workflows/Tests/badge.svg)](https://github.com/UUDigitalHumanitiesLab/cookiecutter-webapp-deluxe/actions)

A boilerplate for full-fledged web applications with [Django][1] backend, [Angular][2] frontend and [Selenium][3] functional tests.

[1]: https://www.djangoproject.com
[2]: https://angular.io
[3]: https://www.selenium.dev/documentation/webdriver/


## Before you start

You need to install *at least* the following software:

 - Python 3.8 - 3.10
 - [Cookiecutter][4] (install using pip in a virtualenv using Python 3)
 - virtualenv
 - Git (if you use this cookiecutter directly from GitHub)

This is the minimum for Cookiecutter to be able to do its work, i.e., generate a tree of source files. However, cookiecutter-webapp-deluxe includes a post-generation script that automates the other work that comes with starting up a new project, such as creating a new database and installing packages. In order for it to be able to do as much as possible for you, it is recommended that you also install all of the following software before generating a project:

 - Git
 - [gitflow][5] (by default included with [Git for Windows][6])
 - PostgreSQL >= 9.3, client, server and C libraries
 - [Visual C++ for Python][7] (Windows only)
 - Node.js >= 8
 - Yarn

After generating a new project with this cookiecutter, you'll find a README in the root of the project that mentions two more dependencies not yet listed above. The post-generation script does not depend on them, but you'll likely need them at some later point while developing or deploying the generated project.

 - [WebDriver][8] for at least one browser (for functional testing)
 - WSGI-compatible webserver (for deployment)

These are all the external dependencies you'll need during or after project generation that have to be installed manually.

[4]: https://pypi.python.org/pypi/cookiecutter
[5]: https://github.com/nvie/gitflow
[6]: https://gitforwindows.org
[7]: https://wiki.python.org/moin/WindowsCompilers
[8]: https://pypi.org/project/selenium/#drivers


## Usage

### Quickstart

```console
$ cd to/parent/directory/that/contains/all/your/projects/
$ cookiecutter gh:UUDigitalHumanitieslab/cookiecutter-webapp-deluxe --checkout develop
# (the plan is to change the latter command into `dh init`)
```

This will first ask you for the template parameter values, then generate a file tree and finally run the post-generation script.


### Template parameters that will be asked

#### project_title

The "pretty" name of your project, intended for human audiences.


#### slug

The "technical" name of your project, intended for file names, package names, variable names, etcetera. Should match the regular expression `^[a-z][a-z0-9_]*$`. The root directory of the generated project will have this name, too.

### app_prefix

The [app prefix](https://angular.io/guide/styleguide#component-custom-prefix) to use in Angular.

#### description

A one-liner that describes what your project is about.


#### author

The name(s) of the person(s) or legal entity that will initially own the copyright over the generated project. Please note that a BSD 3-Clause license is generated; if you wish to use a different license, you have to replace it manually.


#### origin

The URL of the main public Git repository where your project will be hosted and where you'll be pushing your local branches to. The repository need not exist yet; the post-generation script will not attempt to push to it. You can use the [NPM package.json repository URL shorthand][9] for GitHub.

[9]: https://docs.npmjs.com/files/package.json#repository


#### database_{name,user,password}

Respectively the database name for your local development database and the name and password of the local database user that will be granted access to that database. The names and password will be hardcoded into your source tree, so other developers will be using the same values for their local development databases. The values are not used for deployment, so you can keep different, secret names and password in production.

There is, in fact, no reason why you'd need to override these values; the parameters will likely be removed from the interactive asker in the future.


#### localizations

Frontend languages for which you'd like to generate localization files initially. You can still add more languages later. The parameter is encoded as `code:name` pairs separated by commas, where each `code` must be an IETF language tag that [i18next can recognize][10] and each `name` a speaking, human-recognizable slug that can be used as a variable name.

[10]: https://www.i18next.com/principles/translation-resolution#languages

#### frontend

The frontend framework to use.

#### {frontend,backend}_port

The default port to use when locally running a frontend or backend server.

#### psql_command

A command that can be called in order to run SQL queries against your local PostgreSQL server. This will be used to set up your local development database.
This command is not stored in the repository; other people who clone your project will have to enter their own `psql_command`.

It is important that this command can be run with your own account, i.e., without elevated privileges. In other words, it should not start with `sudo`.

The default of `psql` only works if `psql` is in your `PATH` environment variable and you have configured the PostgreSQL server such, that your own OS username is also your PostgreSQL username, you have a *default database* by the same name *and* you can login with peer authentication. Otherwise, you may have to provide the fully-qualified path to your `psql` executable and/or use options such as `-U` and `-d`.

If all of this is abacadabra to you, don't worry and just ignore the parameter. If the command fails, it is easy to fix afterwards. This is discussed in the section on the [post-generation script](#post-generation-script).


#### virtualenv

Path to the virtualenv that will be created for your local clone of the project. If you provide a relative path, it will be resolved against the root of the generated project. An absolute path is also allowed. The path is not stored in the repository; people who clone your project can put their own virtualenvs in different locations.

Many people create a `.env` inside the root of each project. For this reason, this path is suggested as the default. `.env` is also in the `.gitignore` of the generated project, so it will not be committed to VCS by accident. However, any other path will work equally well, especially if you place it outside of the project root. If you have a central place for storing all your virtualenvs, by all means use it.

The post-generation script needs to know the path to your virtualenv, but you are still in full control of how the virtualenv will be created. For example, you can use Anaconda if you so wish. This is the purpose of the next parameter.


#### virtualenv_command

The command that will generate the virtualenv in the location that you provided in the previous parameter. This command will run with the root of the generated project as its working directory. It is important that you can run this command as yourself, i.e., without `sudo`.

The virtualenv must have Python version >= 3.8, <= 3.10. If your virtualenv-creating command uses a different version by default, make sure to add an option to rectify this. The most commonly used command, `virtualenv`, has the `-p` option, so you can for example append `-p python3.10`.


### Post-generation script

After asking the parameters, Cookiecutter generates your project in an instant and then immediately continues executing the post-generation script. Since you don't get the opportunity to inspect the project before the script starts, we discuss the script first.

The post-generation script attempts to execute all of the following steps for you automatically, so you can get started developing your new project as soon as possible:

 - generate the initial translation files
 - create a virtualenv
 - install pip-tools
 - run `pip-compile`
 - install Python packages
 - install Node packages
 - run `git init` and `git flow init`
 - make the initial commit
 - add the `origin` remote to your repository
 - create a local development database for you
 - run initial database migrations
 - create a backend superuser (will prompt for a name and password)

The script is capable of *graceful degradation*. If any step fails, it will continue with other steps that don't depend on it. A log of all automated commands is kept in case you need to debug failed steps (`bootstrap.log`).

In the end, the script will list the commands that still have to be executed by you. There will be at least four such commands, because the script always leaves four steps to you. If any of the automated steps failed, there will be more commands for you to be executed. More on this below.

Some of the automated steps, such as creating a virtualenv, installing packages and creating a development database, also have to be executed by teammates when they clone your project. For them, a similar script called `bootstrap.py` is included in the root of the generated project. In fact, the post-generation script imports common functionality from the generated `bootstrap.py`.


#### Running the post-post-generation commands

The commands that the script lists for you are supposed to work if you copy them verbatim in the order shown. You should execute them **one at a time**, because a command may depend on external conditions which haven't been met or which the script cannot check for you. In some cases, you may also need to modify a command in order to make it work.

The commands all rely on external software and documenting them in full detail is beyond the scope of this README. The most important gotchas are listed below.

 - `yarn django migrate` is a command that the post-generation script would normally automate for you. If it is listed for you to execute manually, this means that automatic database migration failed. In nearly all cases, this is due to the previous step (database *creation*) also having failed. The post-generation script cannot be aware of this because `psql` does not follow the convention of returning a non-zero exit status on failure. So, before you run `yarn django migrate`, first search for a line starting with `psql` in the `bootstrap.log`, read the debug output following that line and get the database created. You may wish to consult the [PostgreSQL documentation][11] as you go.
 - `git push -u origin master develop` requires the `origin` remote repository to exist. If it doesn't, create it first. If you create a new repository on GitHub or a similar hosting service, opt out of initializing it with a README, a `.gitignore`, a license or anything like that; the cookiecutter already takes care of all of those things.

[11]: https://www.postgresql.org/docs/9.6/index.html


### The generated project

The generated project is a directory with the name that you entered as the `slug`. This directory is placed within the working directory in which you invoked the cookiecutter.

The root directory of the generated project contains a `bootstrap.py` which teammates can use after cloning the repository. If you ran either the post-generation script or the `bootstrap.py`, the project root also contains a `bootstrap.log` with details about the automated setup steps.

The project root contains many more things, one of them being the project's very own README. Please consult that README for further information on working with the project.


## Development

While in theory, it is possible to develop this cookiecutter with a test-driven approach, it is almost certainly less work to just make your changes, generate a test project and keep adjusting until you get the desired result. This may change once the design is modularized into multiple smaller cookiecutters within an overarching command line utility (`dh init`). For now, some tips are provided for the "trial and error" approach.

In any case, you will need to make a local clone of the cookiecutter. When generating a test project, use your local clone instead of the one on GitHub. It's as simple as passing the path to the Cookiecutter command:

```console
$ cookiecutter path/to/your/local/clone/of/cookiecutter-webapp-deluxe
```

If you are going to generate many test projects in quick succession, the following tricks can help to make your work efficient and cleanup easy:

 - Make a dedicated directory to contain your test projects, i.e., a directory that doesn't contain anything else.
 - Use short, systematic project names, such as p1, p2, etcetera.
 - Press the return key on all the other asked parameters in order to use the default values. Besides being fast, this ensures that the database and database user have the same name as the project directory and that the virtualenv is placed inside the project directory.
 - If you do all of the above, you can use the following command or something similar to quickly cleanup all generated test projects in one go:
   ```
   $ for name in `ls`; do dropdb $name ; dropuser $name ; rm -rf $name ; done
   ```
 - If you want database creation to work while using the default `psql_command`, as well as the above cleanup command, make sure to configure PostgreSQL correctly so the client commands are in your `PATH` and you can use peer authentication.

