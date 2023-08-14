import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
//import { DriverFormPage } from '../driver-form/driver-form.page'

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
 // styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

  public mylang;
 
  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];//Array<{}>;
  
  public userRole;
  public myMovingCompanyTz;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController) 
  {
    this.mylang= new Lang();
    this.items = [];
    this.myInput2='';
  
    this.userRole=this.aService.getUserRole();
    
    //this.myMovingCompanyTz=navParams.get('movingCompanyTz');//todo check what is the use
    this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();

  }

  ngOnInit() {
  }

  ionViewWillEnter() {     
    this.getItems(null);
   }

  itemSelected(event, item) {     
    //this.navCtrl.navigateForward('/client-form/'+item.orderId+"/0");   
    this.modalController.dismiss(item);
  }

  CanelNoSave(event) {        
    this.modalController.dismiss(null);
    //this.location.back();
  } 

  /*
  async  createNew(item) {        
    //this.navCtrl.navigateForward('/client-form/0/'+this.myMovingCompanyTz);
    const modal = await this.modalController.create({
      component: DriverFormPage
    });
    await modal.present();
    var { data } = await modal.onDidDismiss();        
    this.modalController.dismiss(data);
  }
  */

   getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput2);
  }

  getListFromDB(myfilter:string){
    var module='getDriverList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, movingCompanyTz:this.myMovingCompanyTz}
    
    this.github.getRepos(module,params).subscribe(
                data => {
                    var mydata=this.github.ParseResult(data);
                    if(mydata==null)
                        this.displayErrorMsg('');
                    else
                        this.items=mydata;
                },
                err =>  this.displayMsg(err)
        );
    }


//General Functions

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
  item['userId']=-1;
  item['fullName']="";
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
    this.displayMsg(msg);
}



}

