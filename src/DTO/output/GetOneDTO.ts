export default class GetOneOutputDTO {
    public userid;
    public full_name;
    public email;
    public user_password;
    public user_gender;
    public addr_state;
    public birth_date;
    public about_me;
    public bio;
    public user_image;
    public created_at;
    public updated_at;

    constructor(
        userid: string,
        full_name: string,
        email: string,
        password: string,
        user_gender: string,
        addr_state: string,
        birth_date: string,
        about_me: string,
        bio: string,
        created_at: string,
        updated_at: string,
        user_image: string
    ) {
        this.userid = userid;
        this.full_name = full_name;
        this.email = email;
        this.user_password = password;
        
        this.user_gender = user_gender;
        this.addr_state = addr_state;
        this.birth_date = birth_date;
        this.about_me = about_me;
        this.bio = bio;
        this.created_at = created_at;
        this.updated_at = updated_at;


        this.user_image = user_image;
     }
}