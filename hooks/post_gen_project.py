import os
import os.path as op
import sys
import re

# import the bootstrap script from the generated project directory
sys.path.append(os.getcwd())
from bootstrap import *

def python_path():
    for candidate in ['/usr/bin/python3', '/usr/local/bin/python3']:
        op.exists(candidate)
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
    try:
        activate_frontend()
    except Exception as exception:
        print(exception)
        print("[ERROR] Activating frontend failed!!")
    if '{{cookiecutter.frontend}}' == 'backbone' and not generate_backbone_translations(): return 1
    venv = create_virtualenv()
    pip_tools = backreq = backpack = clone_req = funcreq = funcpack = False
    if venv:
        adopt_virtualenv(VIRTUALENV)
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
    if not all([superuser, remote, commit, gitflow, funcpack]):
        print('\nPlease read {} for information on failed commands.'.format(LOGFILE_NAME))
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


cd_into_project = Command('', ['cd', SLUG])

create_virtualenv = make_create_venv_command(VIRTUALENV_COMMAND)

activate_venv = make_activate_venv_command(VIRTUALENV)

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
    ['git', 'init'],
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

git_push = Command('', ['git', 'push', '-u', 'origin', 'master', 'develop'])


if __name__ == '__main__':
    sys.exit(main(sys.argv))
