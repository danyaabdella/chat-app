import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage, // 👈 ADD THIS
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server; // This is fine now with strictPropertyInitialization: false

  private logger: Logger = new Logger('ChatGateway');

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const messages = await this.chatService.getRecentMessages();
    client.emit('initialMessages', messages);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ✅ CORRECT: Use @SubscribeMessage for incoming events
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: CreateMessageDto,
  ) {
    try {
      const message = await this.chatService.createMessage(payload);
      // Broadcast to all clients (including sender)
      this.server.emit('message', message);
    } catch (error) {
      this.logger.error('Error handling message:', error.stack);
      client.emit('error', { message: 'Failed to send message' });
    }
  }
}