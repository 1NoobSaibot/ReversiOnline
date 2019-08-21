'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameSchema extends Schema {
  up () {
    this.create('game', (table) => {
      table.increments();
      table.integer('playerA_id').notNullable().unsigned();
      table.integer('playerB_id').unsigned();
      table.text('json_object').notNullable();
    })
  }

  down () {
    this.dropIfExists('game');
  }
}

module.exports = GameSchema
