import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProblemListsService } from './problem-lists.service';

@Controller('lists')
export class ProblemListsController {
  constructor(private readonly service: ProblemListsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post(':id/schedule')
  schedule(@Param('id') id: string) {
    return this.service.schedule(id);
  }
}

