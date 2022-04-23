#!/bin/sh

if [ "$NODE_ENV" == "production" ] ; then
  yarn run start
else
  yarn run dev
fi
