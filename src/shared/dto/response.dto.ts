export class Pagination {
    total: number

    page: number

    size: number
}

export class PaginationResponseDto<T> extends Pagination {
    list: Array<T>
}