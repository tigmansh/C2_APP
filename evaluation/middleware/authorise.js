const authorise = (rolee) => {
    return (req,res,next)=> {
        const user_role = req.user.role;
        if(rolee.includes(user_role)) {
            next();
        } else {
            res.send("You are Unauthorized to access this route");
        }
    }
}

module.exports = { authorise };