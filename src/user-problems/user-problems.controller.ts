import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserProblemsService } from './user-problems.service';
import { RateRecallDto } from './dto/rate-recall.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';
import { UpdateCodeDto } from './dto/update-code.dto';

@ApiTags('user-problems')
@Controller()
export class UserProblemsController {
  constructor(private readonly userProblemsService: UserProblemsService) {}

  @Get('reviews/today')
  @ApiQuery({ name: 'userId', required: false })
  getDueToday(@Query('userId') userId?: string) {
    return this.userProblemsService.getDueReviews(userId);
  }

  @Post('reviews/:id')
  @ApiParam({ name: 'id', description: 'UserProblem identifier' })
  @ApiBody({ type: RateRecallDto })
  rateRecall(@Param('id') id: string, @Body() dto: RateRecallDto) {
    return this.userProblemsService.rateRecall(id, dto.quality);
  }

  @Patch('user-problems/:id/notes')
  @ApiParam({ name: 'id', description: 'UserProblem identifier' })
  @ApiBody({ type: UpdateNotesDto })
  updateNotes(@Param('id') id: string, @Body() dto: UpdateNotesDto) {
    return this.userProblemsService.updateNotes(id, dto.notes);
  }

  @Patch('user-problems/:id/code')
  @ApiParam({ name: 'id', description: 'UserProblem identifier' })
  @ApiBody({ type: UpdateCodeDto })
  updateCode(@Param('id') id: string, @Body() dto: UpdateCodeDto) {
    return this.userProblemsService.updateCode(id, dto.code);
  }
}
