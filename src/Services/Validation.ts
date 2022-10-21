import OutputCadastrarDTO from '../DTO/output/cadastrar'

interface Validation{

    public validate(): boolean; // false = invalid;
    

    
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

    constructor(
        name?: string,
        email?: string,
        password?: string,
        gender?: string,
        address?: string,
        birthDate?: Date,
        aboutMe?: string,
        bio?: string,
        user_image: string,
    ) {
        this.name = name?.toString().toLocaleLowerCase();
        this.email = email?.toString().toLocaleLowerCase();
    }

    public validate(): boolean {
        if (this.name) this.validateName();
        if (this.email) this.validateEmail();


        return true;
    }

    private validateName(): OutputCadastrarDTO { 
       
        if (this.name?.length < 4) return new OutputCadastrarDTO("", 400, true);
        if (this.name?.includes("/", 0)) return false;

        // includes invalid characters 
        this.name?.split('').map( character => { 

        })


        if (this.name?.length < 6) return false;
       
        return true;
    }
    
    public validateEmail(): boolean {

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
if (date.length > 9) //error 
if (date.toString().substring(0,3))