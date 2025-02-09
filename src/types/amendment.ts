export type Amendment = {
    _id: string
    title: string,
    pageNo: string,
    description: string,
    misconstrue: string,
    amendment: string,
    bookId: string,
    createdAt: string
}

export type IAmendmentForm = {
    title: string,
    pageNo: string,
    description: string,
    misconstrue: string,
    amendment: string,
    bookId: string,
}