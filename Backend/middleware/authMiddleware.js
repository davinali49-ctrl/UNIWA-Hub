const jwt = require('jsonwebtoken');

// Memeriksa token login
function authenticateToken(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: 'Silakan login terlebih dahulu'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.sub,
            role: decoded.role
        };

        next();

    } catch (err) {
        return res.status(401).json({
            message: 'Token tidak valid atau kedaluwarsa'
        });
    }
} // PENTING: authenticateToken ditutup di sini!

// Memeriksa hak akses
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Akses ditolak'
            });
        }

        next();
    };
}

// Ekspor kedua fungsi
module.exports = {
    authenticateToken,
    authorize
};