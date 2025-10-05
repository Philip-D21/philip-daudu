import * as dotenv from 'dotenv'
dotenv.config()
import {  DatabaseConfig } from '../helpers/types'


export const config: DatabaseConfig = {
	username: process.env.DB_USER || '',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || '',
	host: process.env.DB_HOST || '',
	dialect: process.env.DB_DIALECT || '',
	port: process.env.DB_PORT || '',
	rabbitmq_url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
}
