# ict4d-vxml-seed-project

# Deploy
brew tap heroku/brew && brew install heroku
heroku create -a semmali

git push heroku main

heroku config:get PORT
