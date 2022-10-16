export default class InputCriarProdutoDTO{
    public user_id: string;
    public p_name: string;
    public p_description: string;
    public p_image: string;

    constructor(user_id: string, p_name: string, p_description: string, p_image: string) {
        this.user_id = user_id;
        this.p_name = p_name;
        this.p_description = p_description;
        this.p_image = p_image;
    }
}