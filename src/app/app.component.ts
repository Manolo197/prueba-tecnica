import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Users} from './modelos/Users';
import {Dates} from './modelos/Dates';
import { ServicioUsuario } from './servicios/usuario.servicio';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import * as CanvasJS from './../jss/canvasjs.min';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ServicioUsuario]
})
export class AppComponent implements OnInit{

  title = 'prueba';
  public identity:boolean;
  public user: Users;
  public token= null;
  public usuario;
  public dates: Dates;
  public kpis;
  public foot;
  public dat:Array<any>=[];
  public vis:Array<any>=[];
  public pass:Array<any>=[];
  public messageInfo:boolean=false;
  constructor(private serv: ServicioUsuario){
    this.user=new Users("", "");
    this.dates= new Dates("","","","");
  }

  ngOnInit()
  { 
    this.token=null;
    if(this.token!=null)
    {
      this.identity=true;
    }
    else
    {
      this.identity=false;
      localStorage.clear();
      localStorage.setItem('token', null);
    }
    
  }


  public onSubmit()
  {

    if(this.user.name!="" && this.user.password!="")
    {
      this.serv.login(this.user).subscribe(
        response=>
        { 

          this.identity=true;
          this.usuario= JSON.parse(JSON.stringify(response));
          //Token para mostrar el resto de la información.
          this.token= this.usuario.token;
          localStorage.setItem('token', JSON.stringify(this.token));
        }, 
        error=>
        {
          let message= error;
          if(message!=null)
          {
            localStorage.setItem('token', null);
            console.log("Ha sucedido un error: "+message);
          }
        });
    }
    else
    {
      alert("Por favor, ingresa los datos");
      
    }
  }

  public avg_stay:string;
  public clients:string;
  public frecuency;
  public impacts:string;
  public loyals:string;
  public potencial_clients;
  public registers:string;
  public visits:string;
  
  public obtenerDatos(dates)
  {
    if(dates.date1!=null ||dates.date2!=null||dates.hour1!=null||dates.hour2!=null)
    {
      this.messageInfo=false;
      this.serv.getkpis(this.token, dates).subscribe(
        res=>
        {
         
          this.kpis= JSON.parse(JSON.stringify(res));
          //console.log(this.kpis.kpis)
          this.avg_stay= this.kpis.kpis.avg_stay;
          this.clients= this.kpis.kpis.clients;
          this.frecuency= this.kpis.kpis.frequency;
          this.impacts= this.kpis.kpis.impacts;
          this.loyals= this.kpis.kpis.loyals;
          this.potencial_clients=this.kpis.kpis.potential_clients;
          this.registers= this.kpis.kpis.registers;
          this.visits= this.kpis.kpis.visits; 
        },
        err=>
        {
          let mensaje= err.error.message;
          if(mensaje=="Token is missing!")
          {
            alert("Tu sesión ha expirado, por favor vuelve a iniciar sesión.");
            this.identity=false
            localStorage.clear();
            localStorage.setItem('token', null);
          }
        });
        
        this.llenadoGrafica(dates);
    }
    else
    {
      this.messageInfo=true;
    }

  }

  public llenadoGrafica(date)
  {
    this.serv.getFoot(this.token, date).subscribe(
      res=>
      {
        let result = JSON.parse(JSON.stringify(res));
        this.foot= result;
        let dat:Array<any>=this.foot.results.visitors_daily;
        let len;
        
        if(this.dat!=[]||this.vis!=[]|| this.pass!=[])
        {
          this.reinicioGrafica();
          for(let i=0; i<=this.foot.results.visitors_daily.length; i++)
        {
          this.dat.push(dat[i][0]);
          this.vis.push(dat[i][1]);
          this.pass.push(dat[i][2]);
        }
        }
        else
        {
          for(let i=0; i<=this.foot.results.visitors_daily.length; i++)
        {
          this.dat.push(dat[i][0]);
          this.vis.push(dat[i][1]);
          this.pass.push(dat[i][2]);
        }
        }
      },
      err=>
      {
        let mensaje= err.error.message;

        if(mensaje=="Token is missing!")
        {
          alert("Tu sesión ha expirado, por favor vuelve a iniciar sesión.");
          this.identity=false
          localStorage.clear();
          localStorage.setItem('token', null);
          console.log(localStorage.getItem('token'))
        }
      });
  }
  public reinicioGrafica()
  {
    this.vis.splice(0, this.vis.length);
    this.dat.splice(0, this.dat.length);
    this.pass.splice(0, this.pass.length);
  }

  //Grafica
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = this.dat;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    { data: this.vis, label: 'Visits ' },
    { data: this.pass, label: 'Passersby' }
  ];
}
