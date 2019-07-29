const { Keystone } = require("@keystone-alpha/keystone");
const { KnexAdapter: _KnexAdapter } = require("@keystone-alpha/adapter-knex");
const { Text } = require("@keystone-alpha/fields");
const { GraphQLApp } = require("@keystone-alpha/app-graphql");
const { AdminUIApp } = require("@keystone-alpha/app-admin-ui");
const { StaticApp } = require("@keystone-alpha/app-static");

class KnexAdapter extends _KnexAdapter {
  async _connect(...args) {
    let ret = await super._connect(...args);
    await this.knex.raw(`CREATE SCHEMA IF NOT EXISTS ${this.schemaName}`);
    return ret;
  }
}

const keystone = new Keystone({
  name: "Keystone To-Do List",
  adapter: new KnexAdapter()
});

keystone.createList("Todo", {
  schemaDoc: "A list of things which need to be done",
  fields: {
    name: {
      type: Text,
      schemaDoc: "This is the thing you need to do"
    }
  }
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: "/", src: "public" }),
    // Setup the optional Admin UI
    new AdminUIApp({ enableDefaultRoute: true })
  ]
};
