export default class Produto{
    public owner_id: string;
    public product_id: string;
    public product_name: string;
    public description: string;
    public image: string;

    constructor(id: string, product_name: string, image: string, description: string, owner_id: string) {
        this.product_id = id;
        this.product_name = product_name;
        this.image = image;
        this.description = description;
        this.owner_id = owner_id;
    }
}