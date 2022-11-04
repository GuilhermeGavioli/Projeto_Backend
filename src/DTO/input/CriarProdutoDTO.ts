export default class InputCriarProdutoDTO{
    public user_id: string;
    public p_image: string;
    public p_tags: string;
    public p_name: string;
    public p_isOrganic: string;
    public p_description: string;
    public p_price: string;
    public p_unity: string;
    public p_category: string;

    constructor(
        user_id: string,
        p_tags: string,
        p_name: string,
        p_isOrganic: string,
        p_description: string,
        p_price: string,
        p_unity: string,
        p_category: string,
        p_image: string,
    ) {
        this.user_id = user_id;
        this.p_tags = p_tags;
        this.p_name = p_name;
        this.p_isOrganic = p_isOrganic;
        this.p_description = p_description;
        this.p_price = p_price;
        this.p_unity = p_unity;
        this.p_category = p_category;
        this.p_image = p_image;
    }
}