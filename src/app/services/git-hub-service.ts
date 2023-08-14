import {Injectable} from '@angular/core';  
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


@Injectable()
export class GitHubService {

    public apiUrl="http://www.ecowastenet.com/MunicipalWcf/App10GuiService.svc/";
    public apiUrl_test="http://91.202.171.239/MunicipalWCF/App10GuiService.svc/";
    //public apiUrl="http://91.202.171.239/MunicipalWCF/App10GuiService.svc/";
    //public apiUrl="http://localhost:56334/App10GuiService.svc/";
    //jamal

    

    public folderImgsUrl="http://www.ecowastenet.com/MunicipalWEB/UploadedFiles/"

    constructor(private http: HttpClient) {
    }

    public getRepos(module:any,params:any) {

        var myApiUrl=this.apiUrl;
        if(localStorage.getItem("user_server")=="test")
            myApiUrl=this.apiUrl_test;

        let body = JSON.stringify(params);

       let headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
       
        
        let options = { headers: headers };
        var url=myApiUrl+module;
           
        let repos = this.http.post(url,body,options);
        return repos;
    }



    public getPicFolder()
    {                
           return this.folderImgsUrl;
    }

    public ParseResult(res) {
        return this.firstElement(res);
    }
    
  

    private firstElement (obj) {
        return obj[Object.keys(obj)[0]];
    }


}












/*
    constructor(private http: Http,private httpClient:HttpClient) {  }

    public getRepos(module,params) {
        var myApiUrl=this.apiUrl;
        if(localStorage.getItem("user_server")=="test")
            myApiUrl=this.apiUrl_test;

        let body = JSON.stringify(params);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 
        //let repos = this.http.post(myApiUrl+module,body,options);

        let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
        let repos = this.httpClient.post(myApiUrl+module, body,{headers:httpHeaders});

        return repos;
    }

      public ParseResult_old(res) {        
        let body = res.json();        
        return this.firstElement(body);
        }
    */









/*import { Injectable } from '@angular/core';
import {Http,Headers, RequestOptions } from '@angular/http';
import {HttpHeaders,HttpClient} from  '@angular/common/http';*/






//https://developers.google.com/maps/documentation/javascript/examples/polyline-simple

//http://gonehybrid.com/build-your-first-mobile-app-with-ionic-2-angular-2-part-5/
//https://angular.io/docs/ts/latest/guide/server-communication.html
//http://gonehybrid.com/build-your-first-mobile-app-with-ionic-2-angular-2-part-5/



//use example
/*

 var url="http://localhost:56333/App10GuiService.svc/checkLogIn";
      var module='checkLogIn';
      var params = { userName: 'jamal', password: '****', dataCode: 'local' }

this.github.getRepos(module,params).subscribe(
            data => {
                console.log('data')
            },
            err => console.error(err),
            () => console.log('getRepos completed')
     );

 */


 /*
 Update your package.json to match the following dependencies (done by jamal just review) 
 remove the existing node_modules directory
 
 remove npm folder from C:\Users\[YOUR USer]\AppData\Roaming
 
upgrade
npm install -g cordova ionic
npm install -g ionic@latest
npm install 
npm install ionic-angular@latest --save  --save-exact
npm install @ionic/app-scripts@latest  --save-dev

ionic doctor check
1) Run npm uninstall --save ionic-native
2) Refer to https://ionicframework.com/docs/native for installation & usage instructions

for each row on package.json
npm install --save cordova-plugin-background-mode@latest
npm install --save @ionic-native/status-bar@latest

if needed
//npm install --save sw-toolbox
npm uninstall -D @ionic/cli-plugin-cordova
npm uninstall -D @ionic/cli-plugin-ionic-angular

 */