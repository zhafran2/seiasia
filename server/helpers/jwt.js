import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET

export function signToken(payload) {
    const token = jwt.sign(payload, secret)
    return token
}

export function verifyToken(token) {
    const decoded = jwt.verify(token, secret)
    return decoded
}