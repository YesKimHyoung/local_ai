import { Injectable, Logger } from '@nestjs/common';
import { Ollama } from 'ollama';
import { PrismaService } from '../prisma/prisma.service';

export interface ModelResponse {
  model: string;
  response: string;
  time: number;
  error?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollama: Ollama;
  private readonly models = [
    'deepseek-r1:8b',
    'qwen2.5:14b',
    'gemma3:4b',
    'llama3.1:8b',
  ];

  constructor(private readonly prisma: PrismaService) {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    });
  }

  async compareModels(query: string, ipAddress?: string): Promise<ModelResponse[]> {
    const startTime = Date.now();

    const promises = this.models.map(async (model) => {
      const modelStart = Date.now();
      try {
        const response = await this.ollama.chat({
          model,
          messages: [{ role: 'user', content: query }],
        });
        return {
          model,
          response: response.message.content,
          time: (Date.now() - modelStart) / 1000,
        };
      } catch (error) {
        this.logger.error(`Error with model ${model}: ${error.message}`);
        return {
          model,
          response: '',
          time: (Date.now() - modelStart) / 1000,
          error: error.message || 'Unknown error',
        };
      }
    });

    const responses = await Promise.all(promises);
    const duration = (Date.now() - startTime) / 1000;

    // Save to database
    await this.prisma.queryLog.create({
      data: {
        query,
        ipAddress,
        responses: responses as any,
        duration,
      },
    });

    return responses;
  }

  async getHistory(limit = 50, offset = 0) {
    return this.prisma.queryLog.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        query: true,
        createdAt: true,
        duration: true,
      },
    });
  }

  async getHistoryById(id: number) {
    return this.prisma.queryLog.findUnique({
      where: { id },
    });
  }
}
