import {Injectable,}  from '@angular/core';
//import {GitHubService} from '../../services/git-hub-service';
//import {LoginPage} from '../Login/LoginPage';
//import {HomePage} from '../home/home';


export class User {
  constructor(
    public email: string,
    public password: string,
    public server: string
    ) { }
}
 

 /*
var users = [
  new User('admin@admin.com','adm9'),
  new User('user1@gmail.com','a23')
];
*/
 
@Injectable()
export class AuthenticationService {
 
  constructor(){}
 
  logout() {
    localStorage.clear();
    //localStorage.removeItem("user_Email");   
  }
 
  login(user){
    //not on Use     
    return false; 
  }

  saveLogInInfo(user_e, myServer)
  {
    localStorage.setItem("user_Email", user_e.email);
    localStorage.setItem("user_securtystring", user_e.securtystring);
    localStorage.setItem("user_fullName", user_e.fullName);
    localStorage.setItem("user_userId", user_e.userId);
    localStorage.setItem("user_movingCompanyTz", user_e.movingCompanyTz);
    localStorage.setItem("user_role", user_e.role);
    localStorage.setItem("user_defaultTownId", user_e.defaultTownId);  
    localStorage.setItem("user_defaultTownDesc", user_e.defaultTownDesc);
    localStorage.setItem("user_isRestrictedDriver", user_e.isRestrictedDriver);
      

    localStorage.setItem("user_server", myServer);  

    var vehicleRegNum=user_e.vehicleRegNum;
    if(vehicleRegNum ==null)
      vehicleRegNum="";
    localStorage.setItem("user_vehicleRegNum", vehicleRegNum);  
         
  }
  isRestrictedDriverUser(){
   return localStorage.getItem("user_isRestrictedDriver");
  }
  
  getUservehicleRegNum()
  {
    return localStorage.getItem("user_vehicleRegNum");
  }

  getUserEmail()
  {
    return localStorage.getItem("user_Email");
  }

  getUserId()
  {
    return localStorage.getItem("user_userId");
  }
  
  getUserName()
  {
    return localStorage.getItem("user_fullName");
  }

 getUserMovingCompanyTz()
  {
    return localStorage.getItem("user_movingCompanyTz");
  }

  getUserSS()
  {
    return localStorage.getItem("user_securtystring");
  }

 getUserRole()
  {
    return localStorage.getItem("user_role");
  }
  getServiceSupplierId () {
    return localStorage.getItem("user_serviceSupplierId");
}
getdefaultTownId()
  {
    return localStorage.getItem("user_defaultTownId");
  }
  
  getdefaultTownDesc()
  {
    return localStorage.getItem("user_defaultTownDesc");
  }
 

getServer()
  {
    return localStorage.getItem("user_server");
  }



   checkCredentials(){
    if (localStorage.getItem("user_Email") === null){      
        return false;
    }

    return true;
  } 
}

//http://4dev.tech/2016/03/login-screen-and-authentication-with-angular2/