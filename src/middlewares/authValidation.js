import jwt, { decode } from 'jsonwebtoken'

export const requireSignIn = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access: No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' })
  }
}

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Not an admin.' })
  }
  next()
}

export const isMaid = (req, res, next) => {
  if (req.user.role !== 'maid') {
    return res.status(403).json({ message: 'Access denied: Only maids can accept bookings.' })
  }
  next()
}
