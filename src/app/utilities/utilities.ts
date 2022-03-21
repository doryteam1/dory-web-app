export class Utilities{
    static dateTimeNow():string{
        let today = new Date();
        return today.toISOString().substring(0, 10)+today.getDay()+" "+today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()
    }

    static dateToISOString(date:string){
        return new Date(date).toISOString().substring(0, 10);
    }

    static parseJwt (token:string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      
        return JSON.parse(jsonPayload);
      };
}