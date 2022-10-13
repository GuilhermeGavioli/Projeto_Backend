export default class PayloadInfoDTO {
    public user_id: string;
    public user_image: string;
    public name: string;
    public email: string;

    constructor(id: string, name: string, email: string, image: string) {
        this.user_id = id;
        this.name = name;
        this.email = email;
        this.user_image = image;
    }

    public getPayloadObject(): any {
        return {
            user_id: this.user_id,
            user_image: this.user_image,
            name: this.name,
            email: this.email,
        }
    }
}