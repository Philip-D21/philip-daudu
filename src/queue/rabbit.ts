import * as amqp from 'amqplib';
import { config } from '../config';

export class RabbitMQClient {
    private static instance: RabbitMQClient;
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    private constructor() {}

    static getInstance(): RabbitMQClient {
        if (!RabbitMQClient.instance) {
            RabbitMQClient.instance = new RabbitMQClient();
        }
        return RabbitMQClient.instance;
    }

    async initialize() {
        try {
            this.connection = await amqp.connect(config.rabbitmq_url);
            if (!this.connection) {
                throw new Error('Failed to establish RabbitMQ connection');
            }
            
            this.channel = await this.connection.createChannel();
            if (!this.channel) {
                throw new Error('Failed to create RabbitMQ channel');
            }
            
            // Ensure queue exists
            await this.channel.assertQueue('leave_requests', {
                durable: true, // queue survives broker restart
                arguments: {
                    'x-message-ttl': 24 * 60 * 60 * 1000, // 24 hours TTL
                    'x-dead-letter-exchange': 'leave_requests_dlx' // Dead letter exchange for failed messages
                }
            });

            // Setup dead letter exchange and queue
            await this.channel.assertExchange('leave_requests_dlx', 'direct');
            await this.channel.assertQueue('leave_requests_failed', {
                durable: true
            });
            await this.channel.bindQueue('leave_requests_failed', 'leave_requests_dlx', '');

            console.log('RabbitMQ connected and initialized');
        } catch (error) {
            console.error('Failed to initialize RabbitMQ:', error);
            throw error;
        }
    }

    async publishMessage(message: any) {
        if (!this.channel) {
            throw new Error('RabbitMQ not initialized');
        }

        const messageId = message.id || Date.now().toString();
        await this.channel.publish('', 'leave_requests', Buffer.from(JSON.stringify(message)), {
            persistent: true,
            messageId,
            headers: {
                'x-retry-count': 0
            }
        });
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage | null) => Promise<void>) {
        if (!this.channel) {
            throw new Error('RabbitMQ not initialized');
        }

        await this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    await callback(msg);
                    this.channel?.ack(msg);
                } catch (error) {
                    const headers = msg.properties.headers ?? {};
                    const retryCount = (headers['x-retry-count'] || 0) + 1;
                    
                    if (retryCount <= 3) { // Max 3 retries
                        // Requeue with incremented retry count
                        const message = JSON.parse(msg.content.toString());
                        await this.channel?.publish('', 'leave_requests', msg.content, {
                            ...msg.properties,
                            headers: {
                                ...msg.properties.headers,
                                'x-retry-count': retryCount
                            }
                        });
                        this.channel?.ack(msg);
                    } else {
                        // Move to dead letter queue after max retries
                        this.channel?.reject(msg, false);
                    }
                }
            }
        });
    }

    async ack(msg: amqp.ConsumeMessage) {
        if (!this.channel) {
            throw new Error('RabbitMQ not initialized');
        }
        this.channel.ack(msg);
    }

     async close() {
        if (this.channel) {
            await this.channel.close();
            this.channel = null;
        }
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
        console.log('🔌 RabbitMQ connection closed');
    }
}