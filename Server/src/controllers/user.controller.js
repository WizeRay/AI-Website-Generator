import { pool } from "../config/db.js";

export const getUserCredits = async (req,res) =>{
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({message:"Unauthorized Request"})
        }

        const userCredits = await pool.query(`
            SELECT credits
            FROM "user"
            WHERE id = $1
            
        `,[userId]);

        res.json( userCredits.rows,
        );

    } catch (err) {
        console.error('Error fetching credits:', err);
        res.status(500).json({ error: 'Failed to fetch credits '});
    }

}