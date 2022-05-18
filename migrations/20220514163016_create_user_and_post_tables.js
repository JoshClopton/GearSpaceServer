exports.up = function (knex) {
	return (
		knex.schema
			.createTable("users", (table) => {
				//Primary key
				table.increments("id").primary();
				//First name
				table.string("first_name").notNullable();
				table.string("last_name").notNullable();
				table.boolean("is_public").notNullable();
				table.binary("image");
				table.timestamp("updated_at").defaultTo(knex.fn.now());
			})
			// //This will be the shelves that displays on the home page load.
			// .createTable("shelves", (table) => {
			// 	//do I need an ID for shelves? Does it need to be notNullable?
			// 	table.increments("shelf_id").primary();
			// 	table.string("shelf").notNullable();
			// 	//TODO: need to add the foreign id's
			// 	table.binary("image");
			// })
			.createTable("shelves", (table) => {
				table.increments("id").primary();
				table.integer("user").notNullable();
				table.string("item").notNullable();
				//TODO: Should this be choice?
				table.string("shelf");
				table.integer("qty");
				table.string("location");
				table.string("description");
				table.string("notes");
				table.binary("image");
				table.integer("comment_id");

				// table.foreign("user").references("id").inTable("users");
				// table.foreign("comment_id").references("id").inTable("comments");
			})
			.createTable("comments", (table) => {
				table.increments("id").primary();
				table.integer("commenter_id").unsigned().notNullable();
				table.timestamp("created_at").defaultTo(knex.fn.now());
				//TODO: what is diff between string and text
				table.string("comment").notNullable();

				// table.foreign("commenter_id").references("id").inTable("users");
			})
	);
};

exports.down = function (knex) {
	return knex.schema.dropTable("comments").dropTable("users");
};
