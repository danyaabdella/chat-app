import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const { username, content } = createMessageDto;
    
    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: { username },
      });
    }
    
    // Create message
    const message = await this.prisma.message.create({
      data: {
        content,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
    
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      username: user.username,
    };
  }

  async getRecentMessages(limit = 50) {
    const messages = await this.prisma.message.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
    
    return messages.reverse().map(message => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      username: message.user.username,
    }));
  }
}