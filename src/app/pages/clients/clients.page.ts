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
import { ClientFormPage } from '../client-form/client-form.page'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  //styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  public mylang;
  public WasteSiteList ;

  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];//Array<{}>;
  public serviceSupplierId;
  public clientType;
  public userRole;
  public myMovingCompanyTz;
  mcTZ = "-1";
  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController,public loadingController: LoadingController) 
  {
    this.mylang= new Lang();
    this.items = [];
    this.myInput2='';
  
    this.userRole=this.aService.getUserRole();
    
    //this.myMovingCompanyTz=navParams.get('movingCompanyTz');
   //serviceSupplierId

  }

  ngOnInit() {
   if(this.myMovingCompanyTz == null || this.myMovingCompanyTz =="")
      this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();
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

  async  createNew(item) {        
    //this.navCtrl.navigateForward('/client-form/0/'+this.myMovingCompanyTz);
    const modal = await this.modalController.create({
      component: ClientFormPage,
       componentProps: { 
        myMovingCompanyTz:  this.myMovingCompanyTz,
        serviceSupplierId: this.serviceSupplierId,
        clientType:this.clientType
      }
    });
    await modal.present();
    var { data } = await modal.onDidDismiss();        
    this.modalController.dismiss(data);
  }

  async  editClient(item) {        
    //this.navCtrl.navigateForward('/client-form/0/'+this.myMovingCompanyTz);
    const modal = await this.modalController.create({
      component: ClientFormPage,
       componentProps: { 
        myMovingCompanyTz:  this.myMovingCompanyTz,
        serviceSupplierId: this.serviceSupplierId,
        clientType:this.clientType
      }
    });
    await modal.present();
    var { data } = await modal.onDidDismiss();        
    this.modalController.dismiss(data);
  }

  cancelSelected(event) {    
    var item={}
    item['clientId']=-1;
    item['clientName']="";
    this.modalController.dismiss(item);
  }
  


   getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput2);
  }

  async getListFromDB(myfilter:string){
   try{
  const loading = await this.loadingController.create({message: this.mylang.General.Loading});
    loading.present();
    var module='getClientList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, movingCompanyTz:this.myMovingCompanyTz,serviceSupplierId:-1,clientType:''}

if(this.myMovingCompanyTz!='' &&this.myMovingCompanyTz!='0'){
     module='getClientList';
     params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, movingCompanyTz:this.myMovingCompanyTz,serviceSupplierId:-1,clientType:''}
    }
    if(this.serviceSupplierId>0){
       module='getServiceSupplierClientList';
       params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(),movingCompanyTz:-1,serviceSupplierId:this.serviceSupplierId,clientType: this.clientType ,filterInput: myfilter}
  
    }
    this.github.getRepos(module,params).subscribe(
                data => {
                    var mydata=this.github.ParseResult(data);
                    loading.dismiss();
                    if(mydata==null)
                        this.displayErrorMsg('');
                    else
                        this.items=mydata;
                },
                err =>  {loading.dismiss();this.displayMsg(err);}
               
        );
        }catch (e) {}
    }




//General Functions
cancel(event) {          
  this.modalController.dismiss(null);
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
