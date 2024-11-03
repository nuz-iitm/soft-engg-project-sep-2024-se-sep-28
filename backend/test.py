import os
basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)
size = len(basedir)
maindir = basedir[:size-11]
print(maindir)
db_dir = os.path.join(basedir, "db_directory")
print(db_dir)
