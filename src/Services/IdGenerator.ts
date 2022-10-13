import { uuid  } from "uuidv4";

export abstract class IdGenerator{
    generate(): string{
        return 'dummy';
    };
}

export class UUIDLibrary extends IdGenerator {
    constructor(){
        super();
    }
    override generate(): string {
        return uuid();
    }
}
