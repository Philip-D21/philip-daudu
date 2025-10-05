import { RabbitMQClient } from './rabbit';
import { LeaveRequestAttributes } from '../helpers/types';

export class LeaveRequestProducer {
    private static instance: LeaveRequestProducer;
    private rabbitClient: RabbitMQClient;

    private constructor() {
        this.rabbitClient = RabbitMQClient.getInstance();
    }

    
    static getInstance(): LeaveRequestProducer {
        if (!LeaveRequestProducer.instance) {
            LeaveRequestProducer.instance = new LeaveRequestProducer();
        }
        return LeaveRequestProducer.instance;
    }


    async publishLeaveRequest(leaveRequest: LeaveRequestAttributes) {
        try {
            await this.rabbitClient.publishMessage({
                id: leaveRequest.id,
                type: 'leave.requested',
                data: leaveRequest,
                timestamp: new Date().toISOString()
            });
            console.log(`Published leave request: ${leaveRequest.id}`);
        } catch (error) {
            console.error('Failed to publish leave request:', error);
            throw error;
        }
    }
}