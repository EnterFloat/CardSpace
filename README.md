## Start
You need two terminal windows. One for the react frontend: 
```npm run start```
And one for the flask server:
```APP_SETTINGS="config.DevelopmentConfig" python manage.py runserver```

To list cards in database:
```psql postgres

\connect cardspacedb

SELECT * FROM cards;



Clear database by calling ```db_init()``` from app.py.