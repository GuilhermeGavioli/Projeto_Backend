export default class Produto{
    public owner_id: string;
    public owner_email: string;
    public product_id: string;
    public product_name: string;
    public description: string;

    constructor(owner_id: string, owner_email: string, id: string, product_name: string, description: string) {
        this.owner_id = owner_id;
        this.owner_email = owner_email;
        this.product_id = id;
        this.product_name = product_name;
        this.description = description;
    }
}