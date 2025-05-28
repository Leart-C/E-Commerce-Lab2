export interface ChatMessageDto {
  Id: string;
  SenderId: string;
  ReceiverId: string;
  Message: string;
  Timestamp: string;
  SenderUsername: string;
  IsRead: boolean;
}
