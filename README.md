# ict4d-vxml-seed-project

# Voice Service

## Deploy
Deploy www folder by logging into voxeo FTP using FileZilla.

## Test Information
Check the Development Setting document in the team space

# Web service


## Local development
### Run postgre container
docker-compose up
### Install dependencies
yarn
### Run a service
yarn run dev

## DB information
DB is currently using Heroku postgre.

## Heroku CLI installation
### Macos
brew tap heroku/brew && brew install heroku

## Connect Heroku
heroku git:remote -a semmali

## Deploy
git push heroku main

## Environment variable setting
heroku config:set DB_USER={PUT_YOUR_VALUE} --app semmali
heroku config:set DB_HOST={PUT_YOUR_VALUE} --app semmali
heroku config:set DB_DATABASE={PUT_YOUR_VALUE} --app semmali
heroku config:set DB_PASSWORD={PUT_YOUR_VALUE} --app semmali
## How to check a heroku system logs
heroku logs --tail
