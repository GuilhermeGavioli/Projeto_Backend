"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Produto {
    constructor(user_id, p_id, p_tags, p_name, p_isOrganic, p_description, p_price, p_unity, p_category, p_image) {
        this.user_id = user_id;
        this.p_id = p_id;
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
exports.default = Produto;
