import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Sse } from '@nestjs/common';
import { DemoService } from './demo.service';
import { CreateDemoDto, QueryDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { ApiTags } from '@nestjs/swagger';
import { Observable, interval, map } from 'rxjs';

@Controller('demo')
@ApiTags('SQL demo  练习')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  create(@Body() createDemoDto: CreateDemoDto) {
    return this.demoService.create(createDemoDto);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.demoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemoDto: UpdateDemoDto) {
    return this.demoService.update(+id, updateDemoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demoService.remove(+id);
  }

  @Sse('sse-event')
  sse() {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
