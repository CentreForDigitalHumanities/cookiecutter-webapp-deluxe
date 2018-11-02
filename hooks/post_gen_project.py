import os
import os.path as op
import platform
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
WINDOWS = (platform.system() == 'Windows')
VIRTUALENV = '{{cookiecutter.virtualenv}}'
VIRTUALENV_COMMAND = '{{cookiecutter.virtualenv_command}}'
VIRTUALENV_BINDIR = 'Scripts' if WINDOWS else 'bin'
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

    def __call__(self):
        log = self.get_log()
        print('{}... '.format(self.description), end='', flush=True)
        log.write('$ {}\n\n'.format(self))
        try:
            exit_code = subprocess.call(self.command, *self.args, **self.kwargs)
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
        adopt_virtualenv()
        pip_tools = install_pip_tools()
        if pip_tools:
            backreq = compile_backend_requirements()
            if backreq:
                backpack = install_backend_packages()
                clone_req = copy_backreq_to_func()
                if clone_req:
                    funcreq = compile_functest_requirements()
                    if funcreq:
                        funcpack = install_functest_packages()
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
        migrate = run_migrations()
        if migrate:
            superuser = create_superuser()
    print('\nAlmost ready to go! Just a couple more commands to run:')
    print(cd_into_project)
    if not venv: print(create_virtualenv)
    print(activate_venv)
    if not pip_tools: print(install_pip_tools)
    if not backreq: print(compile_backend_requirements)
    if not clone_req: print(copy_backreq_to_func)
    if not funcreq: print(compile_functest_requirements)
    if not (backpack and frontpack and funcpack): print(install_all_packages)
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


def adopt_virtualenv():
    """ Enable the virtualenv for our own subprocesses. """
    # this is a quick imitation of a local bin/activate script
    venv_abs = op.abspath(VIRTUALENV)
    os.environ['VIRTUAL_ENV'] = venv_abs
    python_bindir = op.join(venv_abs, VIRTUALENV_BINDIR)
    os.environ['PATH'] = os.pathsep.join([python_bindir, os.environ['PATH']])
    os.environ.pop('PYTHONHOME', None)


cd_into_project = Command('', ['cd', SLUG])

activate_helper = ([] if WINDOWS else ['source'])
activate_venv = Command(
    '',
    activate_helper + [op.join(VIRTUALENV, VIRTUALENV_BINDIR, 'activate')],
)

create_virtualenv = Command(
    'Create the virtualenv',
    VIRTUALENV_COMMAND,
)

install_pip_tools = Command(
    'Install pip-tools',
    ['yarn', 'preinstall'],
)

compile_backend_requirements = Command(
    'Compile the backend requirements',
    ['yarn', 'back', 'pip-compile'],
)

install_backend_packages = Command(
    'Install the backend requirements',
    ['yarn', 'install-back'],
)

copy_backreq_to_func = Command(
    'Copy the backend requirements',
    ['cp', op.join('backend', 'requirements.txt'), 'functional-tests'],
)

compile_functest_requirements = Command(
    'Compile the functional test requirements',
    ['yarn', 'func', 'pip-compile'],
)

install_functest_packages = Command(
    'Install the functional test requirements',
    ['yarn', 'install-func'],
)

install_frontend_packages = Command(
    'Install the frontend packages',
    ['yarn', 'fyarn'],
)

install_all_packages = Command('Install all packages', ['yarn'])

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
    PSQL_COMMAND + ' -f ' + op.join('backend', 'create_db.sql'),
)

run_migrations = Command(
    'Run the initial migrations',
    ['yarn', 'django', 'migrate'],
)

create_superuser = Command(
    'Create the superuser',
    ['yarn', 'django', 'createsuperuser'],
    stdout=None, # share stdout and stderr with this process
    stderr=None,
)

git_push = Command('', ['git', 'push', '-u', 'origin', 'master', 'develop'])

yarn_start = Command('', ['yarn', 'start'])


if __name__ == '__main__':
    sys.exit(main(sys.argv))
