#!/bin/bash

echo "Waiting for MySQL..."
while ! nc -z $DATABASE_HOST 3306; do
  sleep 0.1
done
echo "MySQL started"
exec "$@"
