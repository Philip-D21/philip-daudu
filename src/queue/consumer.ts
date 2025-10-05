import { RabbitMQClient } from './rabbit';
import { LeaveRequestRepository } from '../repositories/leaveRequest.repository';
import { Status } from '../helpers/types';
import { differenceInDays } from 'date-fns';

interface ProcessedMessage {
    messageId: string;
    processedAt: Date;
}

class MessageIdempotency {
    private static readonly TTL = 24 * 60 * 60 * 1000; // 24 hours
    private processedMessages: Map<string, ProcessedMessage> = new Map();


    isProcessed(messageId: string): boolean {
        const processed = this.processedMessages.get(messageId);
        if (!processed) return false;

        // Check if the processed message has expired
        if (Date.now() - processed.processedAt.getTime() > MessageIdempotency.TTL) {
            this.processedMessages.delete(messageId);
            return false;
        }

        return true;
    }


    markAsProcessed(messageId: string) {
        this.processedMessages.set(messageId, {
            messageId,
            processedAt: new Date()
        });
    }
}


export class LeaveRequestConsumer {
    private static instance: LeaveRequestConsumer;
    private rabbitClient: RabbitMQClient;
    private leaveRepo: LeaveRequestRepository;
    private idempotency: MessageIdempotency;


    private constructor() {
        this.rabbitClient = RabbitMQClient.getInstance();
        this.leaveRepo = new LeaveRequestRepository();
        this.idempotency = new MessageIdempotency();
    }

    static getInstance(): LeaveRequestConsumer {
        if (!LeaveRequestConsumer.instance) {
            LeaveRequestConsumer.instance = new LeaveRequestConsumer();
        }
        return LeaveRequestConsumer.instance;
    }

    
    private async processLeaveRequest(leaveRequest: any): Promise<void> {
        const startDate = new Date(leaveRequest.startDate);
        const endDate = new Date(leaveRequest.endDate);
        const leaveDuration = differenceInDays(endDate, startDate);


        // Auto-approve if duration is 2 days or less
        const newStatus = leaveDuration <= 2 ? Status.Approved : Status.PendingApproval;

       
        await this.leaveRepo.update(leaveRequest.id, { status: newStatus });
    }


    async startConsumer() {
        await this.rabbitClient.consume('leave_requests', async (msg) => {
            if (!msg) return;

            const { messageId } = msg.properties;
            
            // Skip if message was already processed
            if (this.idempotency.isProcessed(messageId)) {
                this.rabbitClient.ack(msg);
                return;
            }

            const message = JSON.parse(msg.content.toString());
            

            try {
                await this.processLeaveRequest(message.data);
                this.idempotency.markAsProcessed(messageId);
            } catch (error) {
                console.error(`Error processing message ${messageId}:`, error);
                throw error; // Will trigger retry mechanism in RabbitMQClient
            }
        });

        console.log('Leave request consumer started');
    }
}