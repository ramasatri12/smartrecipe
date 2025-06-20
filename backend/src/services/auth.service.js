import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function registerUser({ username, email, password }) {
    const client = await pool.connect();
    try {
        const checkQuery = `SELECT * FROM users WHERE email = $1 OR username = $2`;
        const checkResult = await client.query(checkQuery, [email, username]);
        
        if (checkResult.rows.length > 0) {
            const error = new Error('Username or email already in use');
            error.statusCode = 409;
            throw error;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertQuery = `
            INSERT INTO users (username, email, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING user_id, username, email, created_at
        `;

        const insertResult = await client.query(insertQuery, [username, email, hashedPassword]);

        return insertResult.rows[0];

    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

export async function loginUser({ email, password }) {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await client.query(query, [email]);

        const user = result.rows[0];

        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        const payload = {
            userId: user.user_id,
            username: user.username
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { token };

    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}