exports.up = function (knex) {
	return knex.schema
		.createTable("users", (table) => {
			table.increments("id").primary();
			table.string("google_id").notNullable();
			table.string("first_name").notNullable();
			table.string("last_name").notNullable();
			table.string("email").notNullable();
			table.boolean("is_public").notNullable();
			table.binary("profile_image").notNullable();
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.createTable("shelves", (table) => {
			table.increments("id").primary();
			table.integer("user").unsigned().notNullable();
			table.string("item").notNullable();
			table.string("shelf");
			table.integer("qty");
			table.string("location");
			table.string("notes");
			table.string("image");

			table.foreign("user").references("id").inTable("users");
		})
		.createTable("comments", (table) => {
			table.increments("id").primary();
			table.integer("shelf_id").unsigned().notNullable();

			table.integer("commenter_id").unsigned().notNullable();
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.string("comment").notNullable();
			table.foreign("shelf_id").references("id").inTable("shelves");
			table.foreign("commenter_id").references("id").inTable("users");
		});
};

exports.down = function (knex) {
	return knex.schema.dropTable("shelves").dropTable("users");
};
