import { registerUser} from "../services/auth.service.js"

export async function register(req, res) {
    try {
        const newUser = await registerUser(req.body);

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}