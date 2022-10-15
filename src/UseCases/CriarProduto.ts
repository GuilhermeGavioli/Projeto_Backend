export default class CriarProduto{


    public async execute() {
        
    }
}



class Singleton{
    private static instancea: Singleton | void;

    private constructor(){
        
    }

    public static getInstance(): Singleton | void {
        if (Singleton.instancea) return;
        Singleton.instancea = new Singleton();
        return Singleton.instancea;
    }
}