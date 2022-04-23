# ict4d-vxml-seed-project

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
heroku config:set DB_PASSWORD={PUT_YOUR_VALUE} --app semmali
## How to check a heroku system logs
heroku logs --tail
