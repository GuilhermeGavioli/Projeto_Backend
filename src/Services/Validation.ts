import OutputCadastrarDTO from '../DTO/output/cadastrar'

interface Validation{

    validate(): OutputCadastrarDTO | void; // false = invalid;
    

    
}

class UserValidation implements Validation{
    private InvalideNameCharacters = [
        "/", "!", "#", "$", "%", "¨", "&", "*", "(", ")", "=", "+", "-", ".", "(", ")", "[", "]", ""
    ]

    private validNameCharacters = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ]

    private name?: string;
    private email?: string
    private password?: string
    private gender?: string

    constructor(
        name?: string | null,
        email?: string | null,
        password?: string | null,
        gender?: string | null,
        address?: string,
        birthDate?: Date,
        aboutMe?: string,
        bio?: string,
        user_image?: string,
    ) {
        this.name = name?.toString().toLocaleLowerCase();
        this.email = email?.toString().toLocaleLowerCase();
        this.password = password?.toString().toLocaleLowerCase();
        this.gender = gender?.toString().toLocaleLowerCase();
    }

    public validate(): OutputCadastrarDTO | void {
        const whichOnesToValidate = [];
        if (this.name) whichOnesToValidate.push("name");
        if (this.email) whichOnesToValidate.push("email");
        if (this.password) whichOnesToValidate.push("password");
        if (this.gender) whichOnesToValidate.push("gender");


        whichOnesToValidate.forEach(item => { 
            if (item == "name") { 
                const isNameValid = this.validateName(this.name);
                if (!isNameValid) return new OutputCadastrarDTO("Name is invalid", 403, true)
            }
            if (item == "email") return this.validateName(this.email);
            if (item == "password") return this.validateName(this.password);
        })

        // areFieldsValids.forEach(boolField => { 
        //     if (!boolField) return new OutputCadastrarDTO('Invalid field', 403, true)
        // })
    }

    private validateName(name: string | undefined): boolean | null {
        if (!name) return null;
        if (name.length < 4 || name.length > 100) return false;
        return true;
    }
    
    public validateEmail(email: string | undefined): boolean | null {
        if (!email) return null;
        if (email.length < 5 || email.length > 100) return false;
        return true;
    }

    public validateEmail(email: string | undefined): boolean | null {
        if (!email) return null;
        if (email.length < 5 || email.length > 100) return false;
        return true;
     }

}

// userid  VARCHAR(255) NOT NULL UNIQUE,
//     full_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     user_password VARCHAR(255) NOT NULL,
//     user_gender INT NOT NULL,
//     addr_state VARCHAR(255) NOT NULL,
//     birth_date DATE NOT NULL,
//     about_me VARCHAR(255),
//     bio VARCHAR(255),
//     user_image VARCHAR(255),

//     created_at DATE NOT NULL,
//     updated_at DATE,
//     PRIMARY KEY(userid),
//     -- FOREIGN KEY(addr_state) REFERENCES addressState(id),
//     FOREIGN KEY(user_gender) REFERENCES gender(g_id)



//*touppercase vs tolowercase
// isemail / email length /
// passwords match // passwords length // password contains letters and numbers (and special characters)
// name length (>4)
// gender == male || gender == female
//

// data de nascimento

// passwords match


//gender == 1 || 2
//validate if date is in correct format

// yyyy-mm-dd
// 2020-10-10
// if (date.length > 9) //error
// if (date.toString().substring(0,3))


new UserValidation("gu", null, "151515").validate()