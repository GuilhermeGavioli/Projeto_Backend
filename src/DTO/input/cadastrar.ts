export default class InputCadastrarDTO{
    public name: string;
    public city: string;
    public email: string;
    public password: string;
    public gender: number;
    public birthDate: string; //date

    constructor(name: string, email: string, password: string, gender: number, city: string, birthDate: string ) {
        this.name = name;
        this.city = city;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.birthDate = birthDate;
    }
}