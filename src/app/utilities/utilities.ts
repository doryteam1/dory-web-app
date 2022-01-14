export class Utilities{
    static dateTimeNow():string{
        let today = new Date();
        return today.toISOString().substring(0, 10)+today.getDay()+" "+today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()
    }

    static dateToISOString(date:string){
        return new Date(date).toISOString().substring(0, 10);
    }
}