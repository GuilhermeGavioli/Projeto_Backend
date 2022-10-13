
export default class InputAlterarPerfilDTO{
    public email: string;
    public name: string;
    public city: string;
    public password: string;
    public gender: string;
    public birthDate: string; //date
    public aboutMe?: string;
    public bio?: string;
    public image ?: string;


    constructor(email: string, name: string, city: string, password: string, gender: string, birthDate: string, aboutMe?: string, bio?: string, image?: string) {
        this.email = email;
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