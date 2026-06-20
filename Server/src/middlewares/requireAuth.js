import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const requireAuth = async (req,res,next) => {
    try{
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),

        }); 
 
        if(!session || !session.user){
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to access this resource.',
            }) ;
        }

        req.user = session.user;
        req.session = session.session;
        // console.log(req.user.id);
        next();
    }catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error during auth check'});
    }
}

export default requireAuth;