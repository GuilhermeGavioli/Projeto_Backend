import OutputCadastrarDTO from '../DTO/output/cadastrar'

export default interface Validation{

    validate(): OutputCadastrarDTO; // false = invalid;
    

    
}

export class UserValidation implements Validation{
   
    
    private static invalidNameCharacters: string[] = [
        "/", "$", "&", "<", ">", "#", "%", "*", "+", "-", "!", "[", "]", "(", ")"
    ];

    private static invalidPasswordCharacters = [
        "'", '"', "="
    ]

    private static invalidCharactersJoin = UserValidation.invalidPasswordCharacters.concat(UserValidation.invalidNameCharacters);


    
    

    private name?: string;
    private email?: string;
    private password?: string;
    private confirmPassword?: string;
    private gender?: number;
    private address?: string;
    private birthDate?: string;
    private aboutMe?: string;
    private bio?: string;
    private user_image?: string;

    constructor(
        name?: string | null,
        email?: string | null,
        password?: string | null,
        confirmPassword?: string | null,
        gender?: number | null,
        address?: string | null,
        birthDate?: Date | null,
        aboutMe?: string | null,
        bio?: string | null,
        user_image?: string | null,
    ) {
        for (let i = 0; i < UserValidation.invalidCharactersJoin.length; i++){
            if (name?.includes(UserValidation.invalidCharactersJoin[i])) throw new Error(`Nome contem caracter invalido: ${UserValidation.invalidCharactersJoin[i]}`);
            if (email?.includes(UserValidation.invalidCharactersJoin[i])) throw new Error(`Nome contem caracter invalido: ${UserValidation.invalidCharactersJoin[i]}`);
            if (password?.includes(UserValidation.invalidPasswordCharacters[i])) throw new Error(`Senha contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            
            if (address?.includes(UserValidation.invalidPasswordCharacters[i])) throw new Error(`Endereço/cidade contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            if (aboutMe?.includes(UserValidation.invalidPasswordCharacters[i])) throw new Error(`Descricao contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            if (bio?.includes(UserValidation.invalidPasswordCharacters[i])) throw new Error(`Bio contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
        }

        this.name = name?.toLowerCase() || undefined;
        this.email = email?.toLowerCase() || undefined;
        this.password = password?.toLowerCase() || undefined;
        this.confirmPassword = confirmPassword?.toLowerCase() || undefined;
        this.gender = gender || undefined;
        this.address = address?.toLowerCase() || undefined;
        this.birthDate = birthDate?.toString() || undefined;
        this.aboutMe = aboutMe?.toLowerCase() || undefined;
        this.bio = bio?.toLowerCase() || undefined;
        this.user_image = user_image?.toLowerCase() || undefined;
    }

     public validate(): OutputCadastrarDTO {
        const whichOnesToValidate = [];
        if (this.name) whichOnesToValidate.push("name");
        if (this.email) whichOnesToValidate.push("email");
        if (this.password) whichOnesToValidate.push("password");
        if (this.confirmPassword) whichOnesToValidate.push("confirmpassword");
        if (this.gender) whichOnesToValidate.push("gender");
        if (this.address) whichOnesToValidate.push("address");
        if (this.birthDate) whichOnesToValidate.push("birthDate");
        if (this.aboutMe) whichOnesToValidate.push("aboutMe");
         if (this.bio) whichOnesToValidate.push("bio");
         
         if (( whichOnesToValidate.includes('confirmpassword') && !whichOnesToValidate.includes('password') ) || 
             ( !whichOnesToValidate.includes('confirmpassword') && whichOnesToValidate.includes('password') )
         ) { 
             return new OutputCadastrarDTO("Campo senha e confirmar senha são obrigatórios.", 403, true);
         }

        for (let i = 0; i < whichOnesToValidate.length; i++) {
            if (whichOnesToValidate[i] == "name") {
                const isNameValid = this.validateName(this.name);
                if (!isNameValid) return new OutputCadastrarDTO("Nome invalido", 403, true)
            }

            if (whichOnesToValidate[i] == "email") {
                const isEmailValid = this.validateEmail(this.email);
                if (!isEmailValid) return new OutputCadastrarDTO("Email invalido", 403, true)
            }

            if (whichOnesToValidate[i] == "password") {
                const isPasswordValid = this.validatePassword(this.password);
                if (!isPasswordValid) return new OutputCadastrarDTO("Senha invalida", 403, true)
            }

            if (whichOnesToValidate[i] == "confirmpassword") {
                const isPasswordValid = this.password === this.confirmPassword
                if (!isPasswordValid) return new OutputCadastrarDTO("Senhas devem ser iguais", 403, true)
            }

            if (whichOnesToValidate[i] == "gender") {
                const isGenderValid = this.validateGender(this.gender);
                if (!isGenderValid) return new OutputCadastrarDTO("Genero inválido", 403, true)
            }

            if (whichOnesToValidate[i] == "address") {
                const isGenderValid = this.validateAddress(this.address);
                if (!isGenderValid) return new OutputCadastrarDTO("Endereço/cidade inválido", 403, true)
            }
            if (whichOnesToValidate[i] == "birthDate") {
                const isBirthDateValid = this.validateBirthDate(this.birthDate);
                if (!isBirthDateValid) return new OutputCadastrarDTO("Data de nascimento inválida", 403, true)
            }
            if (whichOnesToValidate[i] == "aboutMe") {
                const isAboutMeValid = this.validateAboutMe(this.aboutMe);
                if (!isAboutMeValid) return new OutputCadastrarDTO("Campo Sobre mim é inválido", 403, true)
            }
            if (whichOnesToValidate[i] == "bio") {
                const isBioValid = this.validateBio(this.bio);
                if (!isBioValid) return new OutputCadastrarDTO("Campo Bio inválida", 403, true)
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
        if (!email.includes("@")) return false;
        if (!email.includes(".com")) return false;
        if (email.includes(" ")) return false;
        if (email.length < 6 || email.length > 100) return false;
        return true;
    }

    private validatePassword(password?: string): boolean | null {
        if (!password) return null;
        if (password.length < 5 || password.length > 25) return false;
        return true;
    }

    private validateGender(gender?: number): boolean | null {
        if (!gender) return null;
        if (gender !== 0 && gender  !== 1 && gender  !== 2) return false;
        return true;
    }

    private validateAddress(address?: string): boolean | null {
        if (!address) return null;
        if (address.length < 5) return false;
        return true;
    }
    
    private validateBirthDate(birthDate?: string): boolean | null {
        if (!birthDate) return null;

        const date = new Date();
        const CURRENT_YEAR = date.getFullYear();
        console.log(CURRENT_YEAR)

        try {   
            const year = Number(birthDate.substring(0, 4));
            const month = Number(birthDate.substring(5, 7));
            const day = Number(birthDate.substring(8, 10));
            console.log(year, day , month)
            if (birthDate.length < 8 || birthDate.length > 10  || year >= CURRENT_YEAR || year < 1910 || day > 31 || day < 0 || month > 12 || month < 0) return false;
            return true;
        } catch (err) {
            throw new Error();
        }
    }

    private validateBio(bio?: string): boolean | null {
        if (!bio) return null;
        if (bio.length > 200) return false;
        return true;
    }

    private validateAboutMe(AboutMe?: string): boolean | null {
        if (!AboutMe) return null;
        if (AboutMe.length > 600) return false;
        return true;
    }

}


export class ProductValidation implements Validation {
    validate(): OutputCadastrarDTO { 
        return new OutputCadastrarDTO('ok', 200, false);
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