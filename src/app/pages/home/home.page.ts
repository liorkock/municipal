import { Component } from '@angular/core';
import { Router,NavigationExtras  } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
//import { Storage } from '@ionic/storage';

import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

//import { IonicStorageModule } from '@ionic/storage-angular';
//import { Storage } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage';


//import { OneSignal } from '@ionic-native/onesignal/ngx';//disableV7


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public mylang;
  
  public errmsg=''  

  public AlertClearReasonList;
  public AlertTypeList;
  public ClientTypesList;
  public MovingCompanyList;
  public MyCountainerList;
  public WasteSiteList;
  public orderStatusList;
  public orderTypesList;
  public orderTypesListAll;
  public totalAlarms="00";
  public intervalAlarmCounterId;
  public AutorityInspectorList;
  public userRole;
  public isRestrictedDriver;
  public isForeground = true;
  public loadingObj:any;
  public SupplierOrderStatusListAll ;
  public CouncilsList;
  constructor(private authenticationService:AuthenticationService,private github: GitHubService,public alertController: AlertController,
                private router: Router,private storage: Storage
                //,private oneSignal: OneSignal//disableV7
                ,private platform: Platform,public loadingController: LoadingController)
  {
    this.storage.create();
    this.mylang= new Lang();
    this.userRole=this.authenticationService.getUserRole();
    this.isRestrictedDriver = this.authenticationService.isRestrictedDriverUser();
    this.MyCountainerList=[];
    this.WasteSiteList=[];
    this.orderStatusList=[];
    this.orderTypesList =[];
    this.orderTypesListAll =[];
    this.SupplierOrderStatusListAll =[];
    this.CouncilsList=[];
    this.getAlertClearReasons();
    this.getAlertTypes();    
    this.getClientTypes();
    this.getMovingCompanies();
    this.getWasteSites();
    this.getAutorityInspectorList();   
    this.getOrderStatusList();
    this.getOrderTypesList();
    this.getOrderTypesListAll();
    this.getSupplierOrderStatus();
    this.getCouncilsList();
    if(localStorage.getItem("user_securtystring")==null || localStorage.getItem("user_securtystring")==undefined || localStorage.getItem("user_securtystring")==undefined)
    {
        this.router.navigateByUrl('/login');
        return;
    }
    
    this.totalAlarms="";

    this.intervalAlarmCounterId = setInterval(() => {    
        this.getAlertCounter();
    }, 120000);

    //clearInterval(intervalId);
     this.initOneSignal();
    //setTimeout(() => {  this.StartLoading(); }, 30);   
    //setTimeout(() => {  this.initOneSignal(); }, 50);  
   // setTimeout(() => {  this.stopLoading(); }, 1220);  
   // setTimeout(() => {  this.initOneSignal(); }, 1000);  
    //tester
    //setTimeout(() => {  this.goToAlertPageAndOpenAlert(92578); }, 1220);  

     if (this.platform.is('cordova')){
        //Subscribe on pause i.e. background
        this.platform.pause.subscribe(() => {
         this.isForeground= false;
        });

        //Subscribe on resume i.e. foreground 
        this.platform.resume.subscribe(() => {
         this.isForeground = true;
        });
       }
  }

  ionViewWillEnter() {      
    this.getAlertCounter();
   }


   async StartLoading() {
    try {
        this.loadingObj = await this.loadingController.create({message: this.mylang.General.Loading});
        this.loadingObj.present();
    }
    catch (err0) {
        //this.displayErrorMsg("we get a msg err0") ;
    }
}
    async stopLoading() {
        try {
            this.loadingObj.dismiss();
        }
        catch (err0) {
            //this.displayErrorMsg("we get a msg err0") ;
        }
    }

   //ionic documentation
   //https://ionicframework.com/docs/native/onesignal
   
  async initOneSignal() {    
    //disableV7
    /*  
    try{

      
   
      this.oneSignal.startInit('42aa175d-3086-4c3a-bdd4-ac7c3156df20', '626666719432');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);//InAppAlert,Notification
      this.oneSignal.handleNotificationReceived().subscribe(msgdata=> {
              // do something when notification is received
              //this.displayMsg(JSON.stringify(msgdata));
      });

      this.oneSignal.handleNotificationOpened().subscribe(msgdata=> {
          //this.displayMsg("handleNotificationOpened");
          try{
            if(msgdata.notification.payload!=undefined){
              var msgbody=msgdata.notification.payload.body;
             
              var action=msgdata.action.actionID;
              var alarmId=msgdata.notification.payload.additionalData.alarmId;
               var orderId=msgdata.notification.payload.additionalData.orderId;
               if(this.isForeground){
                  if(action=="ShowAlert" && alarmId!=undefined && alarmId!=null && alarmId!="0" )
                  {
                    this.goToAlertPageAndOpenAlert(alarmId);
                  }
                  if(action=="ShowOrder" && orderId!=undefined && orderId!=null && orderId!="0" )
                  {
                    this.goToOrderPagebyNotification(orderId);
                  }

               }
               else{
                  if(action=="ShowAlert" || (alarmId!=undefined && alarmId!=null && alarmId!="0" ))
                  {
                      this.goToAlertPageAndOpenAlert(alarmId);
                  }
                  
                  if(action=="ShowOrder" || (orderId!=undefined && orderId!=null && orderId!="0" ))
                  {                     
                      this.goToOrderPagebyNotification(orderId);
                  }
              }
            }
          }
          catch(err0)
          {
              //this.displayErrorMsg("we get a msg err0") ;
          }
          
      });
      this.oneSignal.endInit();
      this.oneSignal.deleteTag("userId");
      var id = this.authenticationService.getUserId()==null?'':this.authenticationService.getUserId()
    this.oneSignal.sendTag("userId",id+'');

      
      //when logOut
      //oneSignal.deleteTag("username")
    }
    catch(err) {   
       this.displayErrorMsg(" initOneSignal "+err) ;               
    }
    */
}



   goToContainers(event)
   {
       this.router.navigateByUrl('/containers');
   }

   goToProjects(event)
   {
       this.router.navigateByUrl('/projects');
   }

   goToContainerTracking(event)
   {
       this.router.navigateByUrl('/container-tracking');
   }

   goToOrderList(event)
   {
       this.router.navigateByUrl('/orders');
   }
   goToSupplierOrderList(event)
   {
       this.router.navigateByUrl('/supplier-orders');
   }
   goToDischargeControl(event)
   {
      this.router.navigateByUrl('/discharge-control');
   }
   
   goToInfoPage(event)
   {
      this.router.navigateByUrl('/about');
   }

   goToAlertPageAndOpenAlert(alertId)
   {
   let navigationExtras: NavigationExtras = {
      queryParams: {
        id1: alertId+""
      }
    };
  //  this.router.navigate(['/alerts/', alertId]);
this.router.navigate(['/alerts', { id: alertId }]);
    //this.router.navigateByUrl('/alerts');
      //this.router.navigateByUrl('/alerts/'+alertId);        
     // this.router.navigateByUrl('/open-alert/'+alertId);
   }

   goToOrderPagebyNotification(orderId)
   {
    this.router.navigate(['/orders', { id: orderId }]);
   }

   goToAlertsPage(event)
   {
    this.router.navigateByUrl('/alerts');
   }

   goToLogout(event)
  {
        try{
          //  this.oneSignal.deleteTag("userId");
        }
        catch(err) {           
        }

       this.authenticationService.logout();
       this.router.navigateByUrl('/login');
  }

  
  getAlertCounter() {
    var module = 'getTotalOpenAlerts';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS() }
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);               
            if (mydata == null)
                this.totalAlarms=""
            else
            {
                var totalAsInt=parseInt(mydata)
                this.totalAlarms = mydata;
                if(totalAsInt>100)
                    this.totalAlarms="100+";

                if(totalAsInt==0)
                    this.totalAlarms="";     
            }

        },
        err => console.log('err getAlertCounter')          
    );

  }; 


  
 getAlertClearReasons() {
  var module = 'getCodesList';
  //var params = { logInUserId: 0, securityString: '---', filterInput: "", category: "ClearReason", activeOnly: 1 }
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "ClearReason", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.AlertClearReasonList = [];
          this.AlertClearReasonList.push({ codeId: -1, codeDesc: '' })
          if (mydata == null)
              console.log('no records on getAlertClearReasons')
          else{
              this.AlertClearReasonList = mydata;
              this.AlertClearReasonList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
              }

          this.storage.set("AlertClearReasonList",  this.AlertClearReasonList);
      },
      err => console.log('err getAlertClearReasons')
     
  );

};  


getAlertTypes() {
  var module = 'getCodesList';
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "AlertType", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.AlertTypeList = [];
          this.AlertTypeList.push({ codeId: -1, codeDesc: '' })

          if (mydata == null)
              console.log('no records on getAlertTypes')
          else{
              this.AlertTypeList = mydata;
              this.AlertTypeList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
              }

          this.storage.set("AlertTypeList", this.AlertTypeList );
      },
      err => console.log('err getAlertTypes')
     
  );
};

getClientTypes() {
    var module = 'getCodesList';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "ClientTypes", activeOnly: 1 }
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.ClientTypesList = [];
            this.ClientTypesList.push({ codeId: -1, codeDesc: '' })
  
            if (mydata == null)
                console.log('no records on ClientTypesList')
            else{
                this.ClientTypesList = mydata;
               // this.ClientTypesList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
                }
  
            this.storage.set("ClientTypesList", this.ClientTypesList );
        },
        err => console.log('err ClientTypesList')
       
    );
  };


getMovingCompanies()
{
  var module = 'getCodesList';
  var params = {logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), category: "MovingCompany", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.MovingCompanyList = [];
          

          if (mydata == null)
              console.log('no records on getMovingCompanies')
          else
          {
              this.MovingCompanyList = mydata;
              //this.MovingCompanyList.push({ codeId: -1, codeDesc: '' })
              this.MovingCompanyList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
          }
          this.storage.set("MovingCompanyList", this.MovingCompanyList);
      },
      err => console.log('err getMovingCompanies')
     
  );
};


getCouncilsList  () {
    this.CouncilsList=[];
    var module = 'getCodesList';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "Councils", activeOnly: 1 }
    this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.CouncilsList = [];
          this.CouncilsList.push({ codeId: -1, codeDesc: '' })
          if (mydata == null)
              console.log('no records on getMyCountainerList')
          else
              this.CouncilsList = mydata;

          this.storage.set("CouncilsList", this.CouncilsList );
      },
      err => console.log('err getAlertClearReasons')
    
  );
}


getMyCountainerList() {
  this.MyCountainerList=[];
  var module = 'getCodesList';
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "MyCountainer", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.MyCountainerList = [];
          this.MyCountainerList.push({ codeId: -1, codeDesc: '' })
          if (mydata == null)
              console.log('no records on getMyCountainerList')
          else
              this.MyCountainerList = mydata;

          this.storage.set("MyCountainerList", this.MyCountainerList );
      },
      err => console.log('err getAlertClearReasons')
    
  );

};  


getWasteSites = function () {
  var module = 'getCodesList';
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "WasteSite", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.WasteSiteList = [];
          if (mydata == null)
              console.log('no records on getWasteSites')
          else
              this.WasteSiteList = mydata;

          this.storage.set("WasteSiteList", this.WasteSiteList );
      },
      err => console.log('err getWasteSites')
     
  );
};



getAutorityInspectorList = function () {
  var module = 'getCodesList';
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "AutorityInspector", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.AutorityInspectorList = [];
          if (mydata == null)
              console.log('no records on AutorityInspectorList')
          else
              this.AutorityInspectorList = mydata;
          
          this.storage.set("AutorityInspectorList", this.AutorityInspectorList );
      },
      err => console.log('err AutorityInspectorList')
     
  );
};


getOrderStatusList() {
  //OrderStatus
  //this.orderStatusList.push({ codeId: -1, codeDesc: '' });        
  var module = 'getCodesList';
  var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "OrderStatus", activeOnly: 1 }
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);
          this.orderStatusList = [];
          if (mydata == null)
              console.log('no records on orderStatusList')
          else
              this.orderStatusList = mydata;

          this.orderStatusList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll  })

          this.storage.set("orderStatusList", this.orderStatusList );
      },
      err => console.log('err orderStatusList')
     
  );
};
getOrderTypesList  () {      
    var module = 'getCodesList';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "OrderType", activeOnly: 1 }
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.orderTypesList = [];
            if (mydata == null)
                console.log('no records on orderTypesList')
            else
                this.orderTypesList = mydata;
            this.storage.set("orderTypesList", this.orderTypesList );
        },
        err => console.log('err orderTypesList')
    );
};

getOrderTypesListAll  () {      
    var module = 'getCodesList';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "OrderType", activeOnly: 1 }
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.orderTypesListAll = [];
            if (mydata == null)
                console.log('no records on orderTypesList')
            else
                this.orderTypesListAll = mydata;
            
                this.orderTypesListAll.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
            this.storage.set("orderTypesListAll", this.orderTypesListAll );
        },
        err => console.log('err orderTypesList')
    );
};
getSupplierOrderStatus () {
    var module = 'getCodesList';
    var params = { logInUserId: this.authenticationService.getUserId(), securityString: this.authenticationService.getUserSS(), filterInput: "", category: "SupplierOrderStatus", activeOnly: 1 }
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.SupplierOrderStatusListAll = [];
            if (mydata == null)
                console.log('no records on SupplierOrderStatus')
            else
                this.SupplierOrderStatusListAll = mydata;
            this.storage.set("SupplierOrderStatusListAll", this.SupplierOrderStatusListAll );
        },
        err => console.log('err SupplierOrderStatus')
    );

};

  displayErrorMsg(msg) {
    this.alertController.create({
      message: msg,  buttons: ['ok'] 
    }).then(alert=>{alert.present();});
  }

  displayMsg(msg) {
    this.alertController.create({
      message: msg,  buttons: ['ok'] 
    }).then(alert=>{alert.present();});
  }

}


//some information to use storage
//https://ionicframework.com/docs/building/storage