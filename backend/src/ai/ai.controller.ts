import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Ip,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';

class CompareDto {
  query: string;
}

@Controller('api')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('compare')
  async compare(@Body() body: CompareDto, @Ip() ip: string) {
    if (!body.query || body.query.trim() === '') {
      throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
    }
    return this.aiService.compareModels(body.query, ip);
  }

  @Get('history')
  async getHistory(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.aiService.getHistory(limitNum, offsetNum);
  }

  @Get('history/:id')
  async getHistoryById(@Param('id', ParseIntPipe) id: number) {
    const log = await this.aiService.getHistoryById(id);
    if (!log) {
      throw new HttpException('History not found', HttpStatus.NOT_FOUND);
    }
    return log;
  }
}
