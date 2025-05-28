export interface ChatMessageDto {
    id: number; 
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    timestampt: string;
    senderUsername: string;
    receiverUsername: string;
}      


