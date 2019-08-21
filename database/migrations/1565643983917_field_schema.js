'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FieldSchema extends Schema {
  up () {
    this.create('field', (table) => {
      table.decimal('dt', 32, 0).unsigned().primary();
      table.integer('last_time').unsigned();
      table.text('options').notNullable();
    })
  }

  down () {
    this.dropIfExists('field');
  }
}

module.exports = FieldSchema
