export enum Status {
    incomplete = 0,
    completed = 1
}

export type ToDo = {
    description: string,
    status: Status
}