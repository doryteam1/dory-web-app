const eigthChar = /.{8}/;
const capitalcase = /[A-Z]{1}/;
const lowercase = /[a-z]{1}/;
const number = /[0-9]{1}/;

export class RegExpUtils{
    
    static eigthCharTest(cad:string){
        return eigthChar.test(cad);
    }

    static capitalcaseTest(cad:string){
        return capitalcase.test(cad);
    }

    static lowercaseTest(cad:string){
        return lowercase.test(cad);
    }

    static numberTest(cad:string){
        return number.test(cad);
    }

    static eigthChar(){
        return eigthChar;
    }

    static capitalcase(){
        return capitalcase;
    }

    static lowercase(){
        return lowercase;
    }

    static number(){
        return number;
    }
}
