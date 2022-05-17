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
			//This will be the shelves that displays on the home page load.
			.createTable("shelves", (table) => {
				//do I need an ID for shelves? Does it need to be notNullable?
				table.increments("shelf_id").primary();
				table.string("shelf").notNullable();
				//TODO: need to add the foreign id's
				table.binary("image");
			})
			.createTable("user_shelves", (table) => {
				table.incremennts("id").primary();
				table.string("item").notNullable();
				table.number("Qty");
				table.string("location");
				table.string("description");
				table.string("notes");
				table.binary("image");
				table.string("comments");
				table.integer("commenter_id");
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
			})
	);
};

exports.down = function (knex) {
	return knex.schema.dropTable("posts").dropTable("users");
};
