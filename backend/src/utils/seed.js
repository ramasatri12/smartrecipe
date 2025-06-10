// backend/scripts/seed.js
const pool = require('../config/db');

async function seedDatabase() {
    console.log('🌱 Starting to seed the database...');
    try {
        await pool.query('DELETE FROM recipe_ingredients; DELETE FROM recipes; DELETE FROM ingredients;');
        console.log('🧹 Old data cleared.');

        const ingredientsData = [
            { name: 'Telur', unit: 'butir' }, { name: 'Nasi Putih', unit: 'gram' },
            { name: 'Bawang Merah', unit: 'siung' }, { name: 'Bawang Putih', unit: 'siung' },
            { name: 'Kecap Manis', unit: 'sdm' }, { name: 'Garam', unit: 'sdt' },
            { name: 'Minyak Goreng', unit: 'sdm' },
        ];

        const ingredientRes = await pool.query(
            `INSERT INTO ingredients (name, unit) SELECT * FROM UNNEST($1::text[], $2::text[]) RETURNING ingredient_id, name`,
            [ingredientsData.map(i => i.name), ingredientsData.map(i => i.unit)]
        );
        const ingredientsMap = new Map(ingredientRes.rows.map(row => [row.name, row.ingredient_id]));
        console.log('✅ Ingredients seeded.');

        const recipesData = [
            { title: 'Nasi Goreng Sederhana', instructions: '1. Tumis bawang. 2. Masukkan telur, orak-arik. 3. Masukkan nasi, kecap, dan garam, aduk rata.'},
            { title: 'Telur Dadar Bawang', instructions: '1. Kocok telur, campur irisan bawang dan garam. 2. Panaskan minyak, tuang adonan telur. Masak hingga matang.'},
        ];

        const recipeRes = await pool.query(
            `INSERT INTO recipes (title, instructions) SELECT * FROM UNNEST($1::text[], $2::text[]) RETURNING recipe_id, title`,
            [recipesData.map(r => r.title), recipesData.map(r => r.instructions)]
        );
        const recipesMap = new Map(recipeRes.rows.map(row => [row.name, row.recipe_id]));
        console.log('✅ Recipes seeded.');

        const recipeIngredientsData = [
            { recipe: 'Nasi Goreng Sederhana', ingredient: 'Nasi Putih', qty: 200 }, { recipe: 'Nasi Goreng Sederhana', ingredient: 'Telur', qty: 1 },
            { recipe: 'Nasi Goreng Sederhana', ingredient: 'Bawang Merah', qty: 2 }, { recipe: 'Nasi Goreng Sederhana', ingredient: 'Kecap Manis', qty: 2 },
            { recipe: 'Telur Dadar Bawang', ingredient: 'Telur', qty: 2 }, { recipe: 'Telur Dadar Bawang', ingredient: 'Bawang Merah', qty: 3 },
        ];

        for (const item of recipeIngredientsData) {
            const recipeId = recipesMap.get(item.recipe);
            const ingredientId = ingredientsMap.get(item.ingredient);
            if (recipeId && ingredientId) {
                await pool.query('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [recipeId, ingredientId, item.qty]);
            }
        }
        console.log('✅ Recipe-ingredient relations seeded.');
        console.log('🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await pool.end();
    }
}

seedDatabase();