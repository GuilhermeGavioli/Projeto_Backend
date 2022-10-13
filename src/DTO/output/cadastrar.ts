export default class OutputCadastrarDTO{
    public message: string;
    public error: boolean;
    public status: number;

    constructor(message: string, status: number, error: boolean ) {
        this.message = message;
        this.error = error;
        this.status = status;
    }
}