import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UserProblemsService } from './user-problems.service';
import { RateRecallDto } from './dto/rate-recall.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';
import { UpdateCodeDto } from './dto/update-code.dto';

@Controller()
export class UserProblemsController {
  constructor(private readonly userProblemsService: UserProblemsService) {}

  @Get('reviews/today')
  getDueToday(@Query('userId') userId?: string) {
    return this.userProblemsService.getDueReviews(userId);
  }

  @Post('reviews/:id')
  rateRecall(@Param('id') id: string, @Body() dto: RateRecallDto) {
    return this.userProblemsService.rateRecall(id, dto.quality);
  }

  @Patch('user-problems/:id/notes')
  updateNotes(@Param('id') id: string, @Body() dto: UpdateNotesDto) {
    return this.userProblemsService.updateNotes(id, dto.notes);
  }

  @Patch('user-problems/:id/code')
  updateCode(@Param('id') id: string, @Body() dto: UpdateCodeDto) {
    return this.userProblemsService.updateCode(id, dto.code);
  }
}
