if [[ $DISABLE_MIGRATIONS = true ]]
then
  npm run start:prod
else
  npm run start:migrate:prod
fi
