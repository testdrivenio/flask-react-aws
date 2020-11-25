#!/bin/sh


python manage.py recreate_db

exec "$@"
