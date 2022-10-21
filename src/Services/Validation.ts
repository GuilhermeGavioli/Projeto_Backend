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
    private confirmPassword?: string
    private gender?: string

    constructor(
        name?: string | null,
        email?: string | null,
        password?: string | null,
        confirmPassword?: string | null,
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
        this.confirmPassword = confirmPassword?.toString().toLocaleLowerCase();
        this.gender = gender?.toString();
    }

     public validate(): OutputCadastrarDTO | void {
        const whichOnesToValidate = [];
        if (this.name) whichOnesToValidate.push("name");
        if (this.email) whichOnesToValidate.push("email");
        if (this.password) whichOnesToValidate.push("password");
        if (this.gender) whichOnesToValidate.push("gender");

        for (let i = 0; i < whichOnesToValidate.length; i++) {
            if (whichOnesToValidate[i].toString() == "name") {
                const isNameValid = this.validateName(this.name);
                if (!isNameValid) return new OutputCadastrarDTO("Name is invalid", 403, true)
            }

            if (whichOnesToValidate[i].toString() == "email") {
                const isEmailValid = this.validateEmail(this.email);
                if (!isEmailValid) return new OutputCadastrarDTO("Email is invalid", 403, true)
            }

            if (whichOnesToValidate[i].toString() == "password") {
                const isPasswordValid = this.validatePassword(this.password);
                if (!isPasswordValid) return new OutputCadastrarDTO("Password is invalid", 403, true)
            }

            if (whichOnesToValidate[i].toString() == "gender") {
                const isGenderValid = this.validateGender(this.gender);
                if (!isGenderValid) return new OutputCadastrarDTO("Gender field is must be one of the three types", 403, true)
            }
        }
         
         return new OutputCadastrarDTO("ok", 200, false);
         
    }

    private validateName(name?: string): boolean | null {
        if (!name) return null;
        if (name.length < 4 || name.length > 100) return false;
        return true;
    }
    
    private validateEmail(email?: string): boolean | null {
        if (!email) return null;
        if (email.length < 6 || email.length > 100) return false;
        return true;
    }

    private validatePassword(password?: string): boolean | null {
        if (!password) return null;
        if (password.length < 5 || password.length > 25) return false;
        return true;
    }

    private validateGender(gender?: string): boolean | null {
        if (!gender) return null;
        if (gender !== "0" && gender !== "1" && gender !== "2") return false;
        return true;
     }

}




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


//nome //email //password, //genero

console.log(
    new UserValidation("guilherme", null, "151515", "2").validate()
);