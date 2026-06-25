import { pool } from "../config/db.js";
import openai from "../config/openai.js";

//Controller Function to make Revision
export const makeRevision = async (req,res) => {
    //Add transaction
    const userId = req.user.id;
    try {
        
        const {projectId} = req.params;
        const {message} = req.body;

        const user = await pool.query(`
            SELECT credits
            FROM "user"
            WHERE id = $1
        `,[userId]);

        if(!userId || user.rows.length === 0){
            return res.status(401).json({ message: "Unauthorized"});
        }

        const userCredits = user.rows[0].credits;

        if(userCredits<5){
            return res.status(403).json({message:'Add more credits to make changes'});
        }

        if(!message || message.trim() === ""){
            return res.status(400).json({message:'Please enter a valid prompt'});
        }

        const currentProject = await pool.query(`
            SELECT current_code
            FROM website_project
            WHERE id = $1 AND user_id = $2
            `,[projectId,userId]);

        if( currentProject.rows.length === 0 ){
            return res.status(404).json({ message: "Project not found"});
        }

        await pool.query(`
            INSERT INTO conversation ( role,content,project_id)
            VALUES (
            'user',
            $1,
            $2,
            )
            `,[message,projectId]);
         
        await pool.query(`
            UPDATE "user"
            SET credits = credits - 5
            WHERE id = $1`,[userId]);

        // Enhance user prompt
        const promptEnhanceResponse = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:`You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

                                Enhance this by:
                                1. Being specific about what elements to change
                                2. Mentioning design details (colors, spacing, sizes)
                                3. Clarifying the desired outcome
                                4. Using clear technical terms

                            Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
                },{
                    role:'user',
                    content:`Users's request: "${message}"`
                }
            ]
        })

        const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

        await pool.query(`
            INSERT INTO conversation (role,content,project_id)
            VALUES (
            'assistant',
            $1,
            $2)`,[enhancedPrompt,projectId]);
        
        await pool.query(`
            INSERT INTO conversation (role,content,project_id)
            VALUES (
            'assistant',
            'Now making changes to website',
            $1)
            `,[projectId]);

        // Generate website code

        const codeGenerationResponse = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:`
                        You are an expert web developer. 

                        CRITICAL REQUIREMENTS:
                        - Return ONLY the complete updated HTML code with the requested changes.
                        - Use Tailwind CSS for ALL styling (NO custom CSS).
                        - Use Tailwind utility classes for all styling changes.
                        - Include all JavaScript in <script> tags before closing </body>
                        - Make sure it's a complete, standalone HTML document with Tailwind CSS
                        - Return the HTML Code Only, nothing else

                        Apply the requested changes while maintaining the Tailwind CSS styling approach.
                    `
                },
                {
                    role:"user",
                    content:`
                    Here is the current website code: "${currentProject.rows[0].current_code}" The user wants this change : "${enhancedPrompt}"`
                }
            ]

        });

        const code = codeGenerationResponse.choices[0].message.content || '';
        const formatedCode = 
                code.replace(/```[a-z]*\n?/gi, '')
                .replace(/```$/g, '')
                .trim();

        const version = await pool.query(`
            INSERT INTO version (code,description,project_id)
            VALUES (
            $1,
            'changes made',
            $2)
            RETURNING id
            
            `,[formatedCode,projectId]);
        const versionId = version.rows[0].id;
        await pool.query(`
            INSERT INTO conversation (role,content,project_id)
            VALUES (
            'assistant',
            'I've made the changes to your website! You can now preview it',
            $1)
            `,[projectId])
        
        await pool.query(`
            UPDATE website_project
            SET 
                current_code = $1,
                current_version_index =$2
            WHERE id = $3
        `,[formatedCode,versionId,projectId])
         
          return res.status(200).json({message: 'Changes made successfully'})                                                                                                                                                  
    } catch (err) {
        await pool.query(`
            UPDATE "user"
            SET credits = credits + 5
            WHERE id = $1`,[userId]);
        console.error('Error revising project:', err);
        res.status(500).json({ error: 'Failed to revise project '});
    }
}
//Controller Function to rollback to previous version
export const rollbackToPrevVersion = async (req,res) => {
    try {
        // Add transactions later..
        const userId = req.user.id;
        
        const { projectId, versionId } = req.params;

        const project = await pool.query(`
            SELECT id
            FROM website_project
            WHERE id =$1 AND user_id = $2
        `,[projectId,userId]);

        if(project.rows.length === 0){
            return res.status(404).json({ message: "Project not found."})
        }

        const versionResult = await pool.query(
            `
            SELECT *
            FROM version
            WHERE id = $1
            AND project_id = $2
            `,
            [versionId, projectId]
        );
        if(versionResult.rows.length === 0){
            return res.status(404).json({message: "version not found"});
        }
        const version = versionResult.rows[0];

        await pool.query(`
        UPDATE website_project
        SET current_code = $1,
            current_version_index = $2,
            updated_at = NOW()
        
        WHERE id = $3 AND user_id = $4
        `,[ version.code,version.id,projectId,userId ]);

        await pool.query(`
            INSERT INTO conversation (role,content,project_id)
            VALUES (
            'assistant',
            'I've rolled back your website to selected version. You can now preview it',
            $1
            )
        `,[projectId])

        return res.status(200).json({message : 'Version rolled back'});

    } catch (err) {
        console.error('Failed to rollback to previous version:', err);
        res.status(500).json({ error: 'Failed to rollback to selected version '}); 
    }
    
}
//Controler Function to Delete Project
export const deleteProject = async (req,res) => {
    try {
        const userId = req.user.id;
        const {projectId} = req.params;

        if(!userId){
            return res.status(401).json({message:"Unauthorized"});
        }

        const projectResult = await pool.query(`
           DELETE FROM website_project
           WHERE id = $1 AND user_id =$2
            
        `,[projectId,userId]);

        if(projectResult.rowCount === 0){
            return res.status(404).json({message: "Project not found"}) 
        }

        return res.status(200).json({message: "Project deleted successfully"})

    } catch (err) {
         console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Error deleting project'});
    }
}