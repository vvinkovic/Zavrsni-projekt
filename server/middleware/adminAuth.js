const jwt = require('jsonwebtoken');

function provjeriAdmina(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ poruka: 'Niste prijavljeni kao admin' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ poruka: 'Sesija je istekla, prijavite se ponovno' });
  }
}

module.exports = provjeriAdmina;