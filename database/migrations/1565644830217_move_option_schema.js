'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MoveOptionSchema extends Schema {
  up () {
    this.create('move_option', (table) => {
      table.integer('field_id').unsigned()
        .references('id').inTable('field')
        .onDelete('cascade').onUpdate('cascade');
      table.tinyint('xy').unsigned();
      table.smallint('win').unsigned();
      table.smallint('draw').unsigned();
      table.smallint('lose').unsigned();
      table.primary(['field_id', 'xy']);
    })
  }

  down () {
    this.drop('move_option')
  }
}

module.exports = MoveOptionSchema
