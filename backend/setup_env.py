#!/usr/bin/env python3
import os
import subprocess
import sys
import venv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_DIR = os.path.join(BASE_DIR, '.venv')

if not os.path.exists(VENV_DIR):
    print('Creating virtual environment...')
    venv.create(VENV_DIR, with_pip=True)

pip_exe = os.path.join(VENV_DIR, 'Scripts' if os.name == 'nt' else 'bin', 'pip')
cmd = [pip_exe, 'install', '-r', os.path.join(BASE_DIR, 'requirements.txt')]
print('Installing dependencies...')
subprocess.check_call(cmd)
print('Virtual environment ready.')
