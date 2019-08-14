'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MovesSchema extends Schema {
  up () {
    this.create('moves', (table) => {
      table.integer('game_id').unsigned().notNullable()
      .references('id').inTable('game')
      .onDelete('cascade').onUpdate('cascade');
      table.tinyint('order').unsigned().notNullable();
      table.decimal('dt', 31, 0).unsigned().index();
      table.tinyint('position').unsigned().notNullable();
      table.enum('side', ['black', 'white']).notNullable();
      table.primary(['game_id', 'order']);
    })
  }

  down () {
    this.drop('moves').ifExists();
  }
}

module.exports = MovesSchema
