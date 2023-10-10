require('dotenv').config()

const requiredEnvs = ['MONGO_URI','SALT_ROUNDS', 'JWT_SECRET']

const missingEnvs = requiredEnvs.filter(envName => !process.env[envName])

if(missingEnvs.length) throw new Error(`Missing Required Envs: ${missingEnvs}`)

module.exports = {
    port: Number(process.env.PORT) || 3000,
    mongoURI: process.env.MONGO_URI,
    saltRounds: Number(process.env.SALT_ROUNDS),
    jwtSecret: process.env.JWT_SECRET
}