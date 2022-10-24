
export default class InputAlterarPerfilDTO{
    public name: string;
    public city: string;
    public password: string;
    public gender: number;
    public birthDate: string; //date
    public aboutMe?: string;
    public bio?: string;
    public image?: string;


    constructor(name: string,  password: string, gender: number, city: string, birthDate: string, aboutMe?: string, bio?: string, image?: string) {
        this.name = name;
        this.city = city;
        this.password = password;
        this.gender = gender;
        this.birthDate = birthDate;
        this.aboutMe = aboutMe;
        this.bio = bio;
        this.image = image;
    }
}