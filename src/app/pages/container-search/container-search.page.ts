import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController,NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-container-search',
  templateUrl: './container-search.page.html',
  //styleUrls: ['./container-search.page.scss'],
})
export class ContainerSearchPage implements OnInit {

  public mylang;
 
  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items:any[];// Array<{}>;
  
  public userRole;
  public myMovingCompanyTz;
  public category="";//MyCountainer or MyFreeCountainer

  public DB;//used to insert container to Project

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController, private navParams: NavParams) 
  {
    this.mylang= new Lang();
    this.items = [];
    this.myInput2='';

    //ths db is used to insert container to proejct
    this.DB={};
    this.DB.projectContainerId = 0;
    this.DB.projectId =0;
    this.DB.movingCompanyTz =0;
    this.DB.containerId =0;
    this.DB.insertDate ="";
    this.DB.existDate ="";
    this.DB.remarks = "";
    this.DB.regNum = "";


  
    this.userRole=this.aService.getUserRole();
    this.category=navParams.get('category');
    if(this.category=='MyFreeCountainer')
     {
      this.myMovingCompanyTz=navParams.get('movingCompanyTz');
      this.DB.movingCompanyTz=navParams.get('movingCompanyTz');
      this.DB.projectId=navParams.get('projectId');
     } 
     else if(this.category== 'MyCountainer')
     {
      this.myMovingCompanyTz=navParams.get('myMovingCompanyTz');
      this.DB.movingCompanyTz=navParams.get('myMovingCompanyTz');
     }
    else
      this.myMovingCompanyTz=1;//get only active containers
    //this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();

  }

  ngOnInit() {
   //if(this.myMovingCompanyTz == null || this.myMovingCompanyTz =="")
     // this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();
  }

  ionViewWillEnter() {     
    this.getItems(null);
   }

  itemSelected(event, item) {     
    //this.navCtrl.navigateForward('/client-form/'+item.orderId+"/0");   
    this.DB.regNum=item.codeDesc;
    this.DB.containerId=item.codeId;
    if(this.category=='MyFreeCountainer')
        this.addContainerToProject(event);
    else
      this.modalController.dismiss(item);
  }

  CanelNoSave(event) {   
    this.modalController.dismiss(null);
    //this.location.back();
  } 

  

   getItems(e)
  {    
    this.items=[];
    if(this.category== 'MyCountainer') 
     this.getListFromDBForOrder(this.myInput2);
    else
     this.getListFromDB(this.myInput2);
  }
  getListFromDBForOrder(myfilter:string) {
         var module = 'getAllowedContainersForOrder';
        var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(),filterInput: myfilter, movingCompanyTz: this.myMovingCompanyTz, showAllContainer: 'true' }; 
        this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.items = [];                
            if (mydata != null)                   
                this.items = mydata;
        },
        err => console.log('err getItems')            
    );
    }

  getListFromDB(myfilter:string){
    var module = 'getCodesList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, category: this.category, activeOnly: this.myMovingCompanyTz }
    
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.items = [];                
            if (mydata != null)                   
                this.items = mydata;
        },
        err => console.log('err getItems')            
    );
  }


  validateMe() {
    if(this.DB.regNum=='')
    {
        this.displayMsg(this.mylang.Validation.Mandatory )
        return false;
    }
    return true;
}

addContainerToProject(event) {
  if (this.validateMe() == false)
      return;
  var module = 'addProjectContainerData';
  var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), o: this.DB2Json() };
  this.github.getRepos(module, params).subscribe(
      data => {
          var mydata = this.github.ParseResult(data);

          if (mydata == null || mydata == "-10" || mydata < -10 || mydata.indexOf('Err') > -1) {
              this.displayResultError(mydata);
              return;
          }
          this.displaySubmitCompletedAndClose(mydata);
      },
      err => this.displayErrorMsg(err)
  );

}

//General Functions
  
DB2Json() {
  var jsonData={};

    for (var MyVariable in this.DB)
         jsonData[MyVariable]=this.DB[MyVariable];
    return  jsonData;
}

getItemsByFilter(ev) {      
  let val = ev.target.value;
  this.getItems(val);  
}


cancel(event) {        
  //this.navCtrl.navigateBack('/alerts');    
  this.CanelNoSave(event);
}

cancelSelected(event) {    
  var item={}
  item['codeId']=-1;
  item['codeDesc']="";
  this.modalController.dismiss(item);
}

showAdvanceFilter(event) {      
  this.showFilterFlag='Y';
}

cancelAdvanceFilter(event) {      
  this.showFilterFlag='N';
}

selectAdvanceFilter(event) {
  
     this.showFilterFlag='N';
     this.getItems(null);
 }

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

displaySubmitCompletedAndClose(msg) {   
 this.alertController.create({
    message: this.mylang.General.saveComplete+ " #"+msg,
  buttons: [ {text: 'OK', handler: data => { this.cancel(null) }}]
  }).then(alert=>{alert.present();});

}

displayResultError(result) {
    var msg=this.mylang.Validation.submitFail ;
    if(result=="-10")
        msg=this.mylang.Validation.submitFailObjectExist;

      if(result=="-11")
        msg=this.mylang.Validation.containerExsitOnThisSite;

      if(result=="-11")
        msg=this.mylang.Validation.containerExsitOnOtherProject;

      if(result=="-913")
        msg=this.mylang.Validation.containerNotBelong2u;

      if(result=="-912")
        msg=this.mylang.Validation.containerNotExist;
        
    this.displayMsg(msg);
}


}

