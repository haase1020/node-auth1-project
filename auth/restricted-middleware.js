module.exports = (req, res,next) => {
    iff(req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ "you can go no further" });
    }
};