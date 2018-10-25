db:
	-psql -d postgres -c 'drop database cltracker'
	psql -d postgres -c 'create database cltracker'

schema:
	psql -d cltracker -f sql/create.sql
