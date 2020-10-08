# prohod-pg

yarn db migration:create --name data-add-list

npx sequelize-cli model:generate --name Data --attributes data:text

yarn db db:migrate
yarn db db:migrate:undo