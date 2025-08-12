import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProblemListsService } from './problem-lists.service';

@Controller('lists/custom')
export class CustomListsController {
  constructor(private readonly service: ProblemListsService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.service.create(name);
  }

  @Get()
  findAll() {
    return this.service.findCustomLists();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneWithItems(id);
  }

  @Post(':id/items')
  addItems(@Param('id') id: string, @Body('problemIds') problemIds: string[]) {
    return this.service.addProblems(id, problemIds);
  }
}
