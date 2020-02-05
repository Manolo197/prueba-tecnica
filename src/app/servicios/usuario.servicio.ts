import {Injectable} from "@angular/core";
import { HttpClientModule, HttpClient, HttpResponse, HttpHeaders, HttpParams}    from '@angular/common/http'
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { Global } from './Global';
import { Users } from '../modelos/Users';
import { element } from 'protractor';

@Injectable()
export class ServicioUsuario
{
    public url:string;
    public data: any;
    public token;

    constructor(private _http:HttpClient,)
    {
        this.url=Global.URL;    
    }

    public login(usuario: Users)
    {
       //NAME
       let fulln= JSON.stringify(usuario.name);
       let letras= fulln.split("\"");
       let nam=letras[1];
       //PASS
       let fullp= JSON.stringify(usuario.password);
       let letrasp= fullp.split("\"");
       let pass=letrasp[1];
        
        let header = new HttpHeaders().set('Authorization',' Basic '+ btoa(nam+":"+pass) );

        return this._http.get(this.url+"/login", {params: {name: nam, password: pass}, 
        headers: header});

    }


    public getkpis(token,dates)
    {

        //NAME
       let full= JSON.stringify(dates.date1);
       let date1= full.split("\"");
       
       let full2= JSON.stringify(dates.date2);
       let date2= full.split("\"");
       

        let headert = new HttpHeaders().set('x-access-token', token);

        return this._http.get(this.url+"/get_kpis/1159/"+date1[1]+"/"+date2[1]+"/"+dates.hour1+"/"+dates.hour2, {headers:headert});

    }

    public getFoot(token, dates)
    {
        let headert = new HttpHeaders().set('x-access-token', token);
        return this._http.get(this.url+"/fetch_daily_footprint/1159/"+dates.date1+"/"+dates.date2+"/"+dates.hour1+"/"+dates.hour2, {headers: headert});
    }

}