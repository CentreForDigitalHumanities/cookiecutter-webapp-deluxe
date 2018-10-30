import os
import os.path as op
import sys
import subprocess
import shlex
import re

SLUG = '{{cookiecutter.slug}}'
REPO_ORIGIN = '{{cookiecutter.origin}}'
REPO_ORIGIN = re.sub(r'^(https?|git)://([^/]+)/(.+)$', r'git@\2:\3', REPO_ORIGIN)
REPO_ORIGIN = re.sub(r'^(github:.+)$', r'git@\1', REPO_ORIGIN)
if re.fullmatch(r'^.+(?<!\.git)$', REPO_ORIGIN):
    REPO_ORIGIN += '.git'
LOCALIZATIONS = map(
    lambda s: s.split(':'),
    '{{cookiecutter.localizations}}'.split(','),
)
PSQL_COMMAND = '{{cookiecutter.psql_command}}'
VIRTUALENV = '{{cookiecutter.virtualenv}}'
VIRTUALENV_ABS = op.abspath(VIRTUALENV)
VIRTUALENV_COMMAND = '{{cookiecutter.virtualenv_command}}'
LOGFILE_NAME = 'bootstrap.log'


class Command(object):
    """ Representation of a command to be run in project setup.

        We create a bunch of these to implement most of the steps in main.
    """

    @classmethod
    def get_log(cls):
        if not hasattr(cls, 'log'):
            cls.log = open(LOGFILE_NAME, 'w', buffering=1)
        return cls.log

    def __init__(self, description, command, *args, **kwargs):
        self.description = description
        if isinstance(command, str):
            command = shlex.split(command)
        self.command = command
        self.args = args
        if 'stdout' not in kwargs:
            kwargs['stdout'] = self.get_log()
        if 'stderr' not in kwargs:
            kwargs['stderr'] = subprocess.STDOUT
        self.kwargs = kwargs

    def __call__(self, venv=None):
        command = self.command.copy()
        log = self.get_log()
        if venv:
            command[0] = '{}/bin/{}'.format(venv, command[0])
        print('{}... '.format(self.description), end='', flush=True)
        log.write('$ {}\n\n'.format(self))
        try:
            exit_code = subprocess.call(command, *self.args, **self.kwargs)
            if exit_code != 0:
                print('failed ({}).'.format(exit_code))
                return False
            print('success.')
            log.write('\n\n')
            return True
        except Exception as e:
            print(e)
            log.write('never ran (exception)\n\n')
            return False

    def __str__(self):
        representation = ' '.join(map(shlex.quote, self.command))
        if 'cwd' in self.kwargs:
            return '(cd {} ; {})'.format(self.kwargs['cwd'], representation)
        return representation


def main(argv):
    print('\nFiles generated. Performing final steps.')
    if not generate_translations(): return 1
    venv = create_virtualenv()
    pip_tools = backreq = backpack = clone_req = funcreq = funcpack = False
    if venv:
        pip_tools = install_pip_tools(VIRTUALENV_ABS)
        if pip_tools:
            backreq = compile_backend_requirements(VIRTUALENV_ABS)
            if backreq:
                backpack = install_backend_packages(VIRTUALENV_ABS)
                clone_req = copy_backreq_to_func()
                if clone_req:
                    funcreq = compile_functest_requirements(VIRTUALENV_ABS)
                    if funcreq:
                        funcpack = install_functest_packages(VIRTUALENV_ABS)
    frontpack = install_frontend_packages()
    git = setup_git()
    gitflow = develop = stage = commit = remote = False
    if git:
        gitflow = setup_gitflow()
        if not gitflow:
            develop = create_develop_branch()
        if funcreq and frontpack:
            stage = git_add()
            if stage:
                commit = initial_commit()
        remote = add_remote()
    db = create_db()
    migrate = superuser = False
    if db and backpack:
        migrate = run_migrations(VIRTUALENV_ABS)
        if migrate:
            superuser = create_superuser(VIRTUALENV_ABS)
    print('\nAlmost ready to go! Just a couple more commands to run:')
    print(cd_into_project)
    if not venv: print(create_virtualenv)
    print(activate_venv)
    if not pip_tools: print(install_pip_tools)
    if not backreq: print(compile_backend_requirements)
    if not backpack: print(install_backend_packages)
    if not clone_req: print(copy_backreq_to_func)
    if not funcreq: print(compile_functest_requirements)
    if not funcpack: print(install_functest_packages)
    if not frontpack: print(install_frontend_packages)
    if not git: print(setup_git)
    if not gitflow and not develop: print(create_develop_branch)
    if not stage: print(git_add)
    if not commit: print(initial_commit)
    if not remote: print(add_remote)
    if not db: print(create_db)
    if not migrate: print(run_migrations)
    if not superuser: print(create_superuser)
    print(git_push)
    print(yarn_start)


def generate_translations():
    print('Generate empty translation files... ', end='', flush=True)
    target_dir = op.join('frontend', 'src', 'i18n')
    os.remove(op.join(target_dir, '.placeholder'))
    for code, name in LOCALIZATIONS:
        print('{} '.format(name), end='', flush=True)
        json_name = '{}.json'.format(code)
        target_path = op.join(target_dir, json_name)
        try:
            target_file = open(target_path, 'w')
            target_file.write('{\n    \n}\n')
            target_file.close()
        except:
            print('failed, exiting.')
            return False
    print('success.')
    return True


cd_into_project = Command('', ['cd', SLUG])

activate_venv = Command('', ['source', '{}/bin/activate'.format(VIRTUALENV)])

create_virtualenv = Command(
    'Create the virtualenv',
    VIRTUALENV_COMMAND,
)

# For now, this command includes psyopg2 in order to silence its warning.
# We can remove psycopg2 again when version 2.8 of psycopg2 is released.
install_pip_tools = Command(
    'Install pip-tools',
    ['pip', 'install', 'pip-tools', 'psycopg2', '--no-binary', 'psycopg2'],
)

compile_backend_requirements = Command(
    'Compile the backend requirements',
    ['pip-compile'],
    cwd='backend',
)

install_backend_packages = Command(
    'Install the backend requirements',
    ['pip', 'install', '-r', 'requirements.txt'],
    cwd='backend',
)

copy_backreq_to_func = Command(
    'Copy the backend requirements',
    ['cp', 'backend/requirements.txt', 'functional-tests'],
)

compile_functest_requirements = Command(
    'Compile the functional test requirements',
    ['pip-compile'],
    cwd='functional-tests',
)

install_functest_packages = Command(
    'Install the functional test requirements',
    ['pip', 'install', '-r', 'requirements.txt'],
    cwd='functional-tests',
)

install_frontend_packages = Command(
    'Install the frontend packages',
    ['yarn', 'fyarn'],
)

setup_git = Command(
    'Initialize git',
    ['git', 'init'],
)

setup_gitflow = Command(
    'Initialize git-flow',
    ['git', 'flow', 'init', '-d'],
)

create_develop_branch = Command(
    'Emulate git-flow (create a develop branch)',
    ['git', 'checkout', '-b', 'develop'],
)

git_add = Command(
    'Stage files for the initial commit',
    ['git', 'add', '.'],
)

initial_commit = Command(
    'Make the initial commit',
    ['git', 'commit', '-m', 'Scaffold an empty application using cookiecutter-webapp-deluxe'],
)

add_remote = Command(
    'Register remote origin',
    ['git', 'remote', 'add', 'origin', REPO_ORIGIN],
)

# psql does not properly indicate failure; it always exits with 0.
# Fortunately, it is one of the last commands.
create_db = Command(
    'Create the database',
    PSQL_COMMAND + ' -f backend/create_db.sql',
)

run_migrations = Command(
    'Run the initial migrations',
    ['python', 'manage.py', 'migrate'],
    cwd='backend',
)

create_superuser = Command(
    'Create the superuser',
    ['python', 'manage.py', 'createsuperuser'],
    cwd='backend',
    stdout=None, # share stdout and stderr with this process
    stderr=None,
)

git_push = Command('', ['git', 'push', '-u', 'origin', 'master', 'develop'])

yarn_start = Command('', ['yarn', 'start'])


if __name__ == '__main__':
    sys.exit(main(sys.argv))
