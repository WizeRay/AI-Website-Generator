import { pool } from "../config/db.js";
import openai from "../config/openai.js";
//controller function to get all projects of given user
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Set by requireAuth middleware
    
    const result = await pool.query(
      `SELECT *
       FROM website_project
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    )

    return res.status(200).json({
      projects: result.rows,
      count: result.rowCount,
    });
  } catch (err) {

    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};



//controller function to create new project
export const createNewProject = async (req, res) => {
  let userId;
  try {
    userId = req.user?.id;
    const { initial_prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    if (!initial_prompt || typeof initial_prompt !== "string" || !initial_prompt.trim()) {
      return res.status(400).json({ message: "initial_prompt is required" });
    }

    const limitedInitialPrompt =
      initial_prompt.length > 50
        ? initial_prompt.substring(0, 47) + "..."
        : initial_prompt;

    const user = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.rows[0].credits < 5) {
      return res.status(403).json({ message: "add credits to create more." });
    }

    // Atomic deduct
    const deduct = await pool.query(
      `UPDATE "user" SET credits = credits - 5, "totalCreation" = "totalCreation" + 1
       WHERE id = $1 AND credits >= 5 RETURNING credits`,
      [userId]
    );
    if (deduct.rows.length === 0) {
      return res.status(403).json({ message: "add credits to create more." });
    }

    // Create project row with a status
    const project = await pool.query(
      `INSERT INTO website_project (name, initial_prompt, user_id, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
      [limitedInitialPrompt, initial_prompt, userId]
    );
    const projectId = project.rows[0].id;

    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('user', $1, $2)`,
      [initial_prompt, projectId]
    );

    // ✅ Respond immediately — frontend can navigate now
    res.json({ projectId });

    // 🔽 Background generation — fire and forget, own error handling
    generateWebsiteInBackground(projectId, initial_prompt, userId).catch((err) => {
      console.error("Background generation failed unexpectedly:", err);
    });

  } catch (err) {
    console.error("Error creating Project:", err);
    if (userId) {
      await pool.query(`UPDATE "user" SET credits = credits + 5 WHERE id = $1`, [userId]).catch(console.error);
    }
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create Project" });
    }
  }
};

// Separate function — runs after response is sent, can't touch `res` at all
async function generateWebsiteInBackground(projectId, initial_prompt, userId) {
  try {
    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('assistant', 'Enhancing your prompt...', $1)`,
      [projectId]
    );

    const promptEnhanceResponce = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        { role: "system", content: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

    Enhance this prompt by:
    1. Adding specific design details (layout, color scheme, typography)
    2. Specifying key sections and features
    3. Describing the user experience and interactions
    4. Including modern web design best practices
    5. Mentioning responsive design requirements
    6. Adding any missing but important elements

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).` },
        { role: "user", content: initial_prompt },
      ],
    });
    const enhancedPrompt = promptEnhanceResponce.choices[0].message.content;

    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('assistant', $1, $2)`,
      [`I've enhanced your prompt to:${enhancedPrompt}`, projectId]
    );
    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('assistant', 'Now generating your website...', $1)`,
      [projectId]
    );

    const codeGenerationResponse = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        { role: "system", content: `You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

    CRITICAL REQUIREMENTS:
    - You MUST output valid HTML ONLY. 
    - Use Tailwind CSS for ALL styling
    - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    - Use Tailwind utility classes extensively for styling, animations, and responsiveness
    - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
    - Use modern, beautiful design with great UX using Tailwind classes
    - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
    - Use Tailwind animations and transitions (animate-*, transition-*)
    - Include all necessary meta tags
    - Use Google Fonts CDN if needed for custom fonts
    - Use placeholder images from https://placehold.co/600x400
    - Use Tailwind gradient classes for beautiful backgrounds
    - Make sure all buttons, cards, and components use Tailwind styling

    CRITICAL HARD RULES:
    1. You MUST put ALL output ONLY into message.content.
    2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
    3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
    4. Do NOT include markdown, explanations, notes, or code fences.
    5. Do NOT use any JavaScript framework (no React, Vue, Angular, Svelte). Plain vanilla JS only.
    6. Do NOT include import statements, ES modules, or build-tool syntax.
    7. The output must be a single static HTML file that works when opened directly in a browser via srcdoc, with zero external JS framework dependencies besides the Tailwind CDN script.

    The HTML should be complete and ready to render as-is with Tailwind CSS.` },
        { role: "user", content: enhancedPrompt || "" },
      ],
    });

    const code = codeGenerationResponse.choices[0]?.message?.content || "";
    const formatedCode = code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim();

    if (!formatedCode.startsWith("<!DOCTYPE") && !formatedCode.startsWith("<html")) {
      throw new Error("AI returned invalid HTML output");
    }
    if (/createApp|createWebHashRouter|import\s+.*\s+from/i.test(formatedCode)) {
      throw new Error("AI returned framework code instead of plain HTML");
    }

    const version = await pool.query(
      `INSERT INTO version (code, description, project_id) VALUES ($1, 'Initial version', $2) RETURNING id`,
      [formatedCode, projectId]
    );
    const versionId = version.rows[0].id;

    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('assistant', $1, $2)`,
      ["I've created your website! You can now preview it and request any changes.", projectId]
    );

    await pool.query(
      `UPDATE website_project SET current_code = $1, current_version_index = $2, status = 'ready' WHERE id = $3`,
      [formatedCode, versionId, projectId]
    );
  } catch (err) {
    console.error("Background generation error:", err);
    await pool.query(`UPDATE website_project SET status = 'failed' WHERE id = $1`, [projectId]).catch(console.error);
    await pool.query(`UPDATE "user" SET credits = credits + 5 WHERE id = $1`, [userId]).catch(console.error);
    await pool.query(
      `INSERT INTO conversation (role, content, project_id) VALUES ('assistant', 'Something went wrong while generating your website. Your credits have been refunded.', $1)`,
      [projectId]
    ).catch(console.error);
  }
}



//controller function to get single project
export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const [projectResult, conversationResult, versionResult] = await Promise.all([
      pool.query(
        `SELECT * FROM website_project WHERE id = $1 AND user_id = $2`,
        [projectId, userId]
      ),
      pool.query(
        `SELECT * FROM conversation WHERE project_id = $1 ORDER BY timestamp ASC`,
        [projectId]
      ),
      pool.query(
        `SELECT * FROM version WHERE project_id = $1 ORDER BY timestamp ASC`,
        [projectId]
      ),
    ]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: "Project unavailable" });
    }

    const projectData = {
      ...projectResult.rows[0],
      conversation: conversationResult.rows,
      versions: versionResult.rows,
    };

    return res.status(200).json({ project: projectData });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

//Controller function to toggle Project Publish
export const toggleProjectPublish = async (req,res) => {
     try {
        const userId = req.user.id;
        const {projectId} = req.params;

        const isPublishedQuery = await pool.query(`
            UPDATE website_project
            SET is_published = NOT is_published
            WHERE id = $1 AND user_id = $2
            RETURNING is_published
        `,[projectId,userId]);

        if(isPublishedQuery.rows.length === 0){
            return res.status(404).json({ message: "Project not found."});
        }

        const isPublished = isPublishedQuery.rows[0].is_published;

        return res.status(200).json({ 
            message: isPublished ? "Project Published" : "Project Unpublished",
            isPublished,
        })



     } catch (err) {
        console.error('Error while updating toggle:', err);
        return res.status(500).json({ error: 'Failed to update project status'});
     }
}
//Controller to save project
 export const saveProjectCode = async (req,res) => {
    try {
      //making new version is left
        const {projectId} = req.params;
        const userId = req.user.id;
        const {code} = req.body;
        //validation required
        if (typeof code !== "string" || code.trim() === "") {
          return res.status(400).json({
              message: "Code is required"
          });
}

        const result = await pool.query(`
            UPDATE website_project
            SET
                current_code = $1,
                updated_at = NOW()
            WHERE id = $2
              AND user_id = $3
            `,
            [code, projectId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        return res.status(200).json({message: "Project updated"});

    } catch (err) {
      console.error('Error saving project:', err);
        res.status(500).json({ error: 'Failed to save project'});
    }
 }