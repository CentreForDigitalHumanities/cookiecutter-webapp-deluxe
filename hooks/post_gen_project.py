import os
import os.path as op
import sys
import re
import subprocess

# import the bootstrap script from the generated project directory
sys.path.append(os.getcwd())
from bootstrap import *

def python_path():
    if 'TRAVIS' in os.environ:
        python_system_path = subprocess.check_output(['which', 'python']).decode('utf-8').rstrip()
        print(f"Python version used: {python_system_path}")
        return python_system_path
    else:
        for candidate in ['/usr/bin/python3', '/usr/local/bin/python3', '/opt/local/bin/python3']:
            if op.exists(candidate):
                return candidate
        return sys.executable

REPO_ORIGIN = '{{cookiecutter.origin}}'
REPO_ORIGIN = re.sub(r'^(https?|git)://([^/]+)/(.+)$', r'git@\2:\3', REPO_ORIGIN)
REPO_ORIGIN = re.sub(r'^github:(.+)$', r'git@github.com:\1', REPO_ORIGIN)
if re.fullmatch(r'^.+(?<!\.git)$', REPO_ORIGIN):
    REPO_ORIGIN += '.git'
LOCALIZATIONS = map(
    lambda s: s.split(':'),
    '{{cookiecutter.localizations}}'.split(','),
)
PSQL_COMMAND = '{{cookiecutter.psql_command}}'
VIRTUALENV = '{{cookiecutter.virtualenv}}'
VIRTUALENV_COMMAND = '{{cookiecutter.virtualenv_command}}'.replace('%PYTHON%', python_path())


def main(argv):
    print('\nFiles generated. Performing final steps.')
    boot_sup = bootstrap_subprojects()
    if not boot_sup:
        print(f'\nSubproject initialization failed. Please see {LOGFILE_NAME} for details.')
        return 1
    try:
        activate_frontend()
    except Exception as exception:
        print(exception)
        print("[ERROR] Activating frontend failed!!")
    if '{{cookiecutter.frontend}}' == 'backbone' and not generate_backbone_translations(): return 1


def generate_backbone_translations():
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


bootstrap_subprojects = Command(
    'Finalize subproject package configuration',
    ['docker', 'compose', '-f', 'compose-postgenerate.yml', 'up']
)

cd_into_project = Command('', ['cd', SLUG])

create_virtualenv = make_create_venv_command(VIRTUALENV_COMMAND)

activate_venv = make_activate_venv_command(VIRTUALENV)

check_version_pip = Command(
    'pip version',
    ['pip', '--version'],
)

check_version_pip_compile = Command(
    'pip-compile version',
    ['pip-compile', '--version'],
)

compile_backend_requirements = Command(
    'Compile the backend requirements',
    ['yarn', 'back', 'pip-compile'],
)

copy_backreq_to_func = Command(
    'Copy the backend requirements',
    ['cp', op.join('backend', 'requirements.txt'), 'functional-tests'],
)

compile_functest_requirements = Command(
    'Compile the functional test requirements',
    ['yarn', 'func', 'pip-compile'],
)

setup_git = Command(
    'Initialize git',
    ['git', 'init', '-b', 'main'],
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
create_db = make_create_db_command(PSQL_COMMAND)
grant_db = make_access_db_command(PSQL_COMMAND)

git_push = Command('', ['git', 'push', '-u', 'origin', 'main', 'develop'])


if __name__ == '__main__':
    sys.exit(main(sys.argv))
