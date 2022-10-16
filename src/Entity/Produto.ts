export default class Produto{
    public owner_id: string;
    public product_id: string;
    public product_name: string;
    public description: string;
    public image: string;

    constructor(owner_id: string, id: string, product_name: string, description: string, image: string) {
        this.owner_id = owner_id;
        this.product_id = id;
        this.product_name = product_name;
        this.description = description;
        this.image = image;
    }
}