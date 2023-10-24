export class CreateDemoDto {
  name: string
  password: string
}

export class QueryDto {
  keyword: string
  page: number
  pageSize: number
}
