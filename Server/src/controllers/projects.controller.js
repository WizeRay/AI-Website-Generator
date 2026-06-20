import { pool } from "../config/db.js";

export const getProjects = async (req,res) => {
   try {
    const userId = req.user.id; // Set by requireAuth middleware
    console.log(req.user);
    const result = await pool.query(
      `SELECT id, name, initial_prompt,current_code, created_at, updated_at
       FROM website_project
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      projects: result.rows,
      count: result.rowCount,
    });

  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  } 
}

export const createNewProject = async (req,res) => {
    const userId = req.user.id;
    try {
        const {initial_prompt} = req.body;
        const limitedInitialPrompt = initial_prompt.length >50 ? initial_prompt.substring(0,47) + '...' : initial_prompt;

        if(!userId){
            return res.status(401).json({ message: 'Unauthorized User'});
        }

        const user = await pool.query(`
            SELECT *
            FROM "user"
            WHERE id = $1
            RETURNING id,credits
        `,[userId]);

        if(user && user.credits<5){
            return res.status(403).json({ message: 'add credits to create more.'})
        }

        // Create a new project

        const project = await pool.query(`
            INSERT INTO website_project (name,initial_prompt,user_id)
            VALUE (
                $1,
                $2,
                $3,
            )
            RETURNING id
        `,[limitedInitialPrompt,initial_prompt,userId]);
        const projectId = project.rows[0].id;
        //Update User's Total Creation

        await pool.query(`
            UPDATE "user"
            SET totalCreation = totalCreation + 1
            WHERE id = $1
        `,[userId]);

        //Update conversation.
        await pool.query(`
            INSERT INTO conversation (
                role,
                content,
                project_id
            )
            VALUES (
                'user',
                $1,
                $2,
            )
        `,[initial_prompt,projectId]);

        res.json({
            projectId: projectId,
        })

    } catch (err) {
        console.error('Error creating Project:', err);
        res.status(500).json({ error: 'Failed to create Project '});
    }
}