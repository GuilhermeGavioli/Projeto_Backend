import bcrypt from 'bcryptjs'

export default class Cryptography{
    private password: string;

    constructor(password: string) {
        this.password = password
    }

    async hash(): Promise<string> {
        const data = await bcrypt.hash(this.password, 10);
        return data;
    }

    //this.password == user password
    // hashed = right one saved on the db
    async compare(hashed: string): Promise<boolean>{
        
        return await bcrypt.compare(this.password, hashed);
    }
}