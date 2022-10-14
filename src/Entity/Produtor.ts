
export default class Produtor{
    private id: string;
    private email: string;
    private name: string;
    public  city: string;
    private password: string;
    private gender: string;
    private birthDate: string; //date

    public aboutMe?: string;
    public bio?: string;
    public image?: string;



    constructor(id: string, name: string, email: string, password: string, gender: string, city: string, birthDate: string,
        aboutMe?: string,
        bio?: string,
        image?: string,
    ){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.city = city;
        this.birthDate = birthDate;
        this.aboutMe = aboutMe;
        this.bio = bio;
        this.image = image;
    }

    public getId(): string {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getPassword(): string {
        return this.password;
    }
    public getEmail(): string {
        return this.email;
    }
}