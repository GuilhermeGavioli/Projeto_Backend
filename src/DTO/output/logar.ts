export default class OutputCadastrarDTO{
    public message: string;
    public error: boolean;
    public status: number;
    public token?: string;

    constructor(message: string, status: number, error: boolean, token?: string ) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.token = token;
    }
}