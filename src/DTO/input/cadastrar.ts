export default class InputCadastrarDTO{
    public name: string;
    public city: string;
    public email: string;
    public password: string;
    public gender: string;
    public birthDate: string; //date

    constructor(name: string, city: string,email: string, password: string, gender: string, birthDate: string ) {
        this.name = name;
        this.city = city;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.birthDate = birthDate;
    }
}