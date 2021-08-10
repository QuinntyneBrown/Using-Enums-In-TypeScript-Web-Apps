

export enum Status {
    incomplete = "incomplete",
    completed = 2,
}

export type ToDo = {
    description: string,
    status: Status
}