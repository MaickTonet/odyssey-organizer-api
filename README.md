# Odyssey Organizer API

for more, check the [odyssey organizer project](https://github.com/MaickTonet/odyssey-organizer)

<br>
<br>

### Steps to run this project:

1. Run `npm i` command to install the dependencies <br><br>
2. Setup database settings inside `data-source.ts` file <br><br>
3. Run `npm run migration` to update the database <br><br>
4. Run `npm start` command to start the API <br><br>

### Add migrations

To add migrations to the project, you need to run the command

`typeorm migration:create ./src/migration/<table_name>`

to create a new migration file. Then, edit the file with the database migration changes, and afterward, run the command

`npm run migration`
