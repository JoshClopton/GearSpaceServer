exports.up = function (knex) {
	return knex.schema
		.createTable("users", (table) => {
			table.increments("id").primary();
			table.string("name").notNullable();
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.createTable("posts", (table) => {
			table.increments("id").primary();
			table.integer("user_id").unsigned().notNullable();
			table.string("title", 75).notNullable();
			table.text("content").notNullable();
			table.timestamp("updated_at").defaultTo(knex.fn.now());
			//the next info is setting up relationship to users table
			table
				//this is a foreign id for the users table
				.foreign("user_id")
				//this is saying to reference id in the users table
				.references("id")
				//here it is declaring the users table
				.inTable("users")
				.onUpdate("CASCADE")
				.onDelete("CASCADE");
		});
};

exports.down = function (knex) {
	return knex.schema.dropTable("posts").dropTable("users");
};
