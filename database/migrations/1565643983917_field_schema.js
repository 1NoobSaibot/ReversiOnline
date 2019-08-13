'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FieldSchema extends Schema {
  up () {
    this.create('field', (table) => {
      table.increments()
      table.decimal('dt', 31, 0).unsigned().unique().index();
      table.integer('last_time').unsigned();
    })
  }

  down () {
    this.drop('field')
  }
}

module.exports = FieldSchema
