import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  //styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public mylang;
  public WasteSiteList ;

  selectedItem: any;
  myInput:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];// Array<{}>;
  
  public userRole;
  public myMovingCompanyTz=0;

  public MovingCompanyList:any[];//=[];
  public movingCompanyFilter;

  public statusList:any[];//=[];
  public statusFilter=-1;
  public orderTypeFilter=-1;
 public orderTypesListAll:any[];// = [];
  public showForAllDrivers=false;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,private location:Location,public modalController:ModalController,private activatedRoute: ActivatedRoute) {

    this.mylang= new Lang();
    this.items = [];
    this.myInput='';
  
    this.userRole=this.aService.getUserRole(); 
    console.log(this.userRole)   ;
    storage.get('orderStatusList').then((val) => {this.statusList=val;});
    storage.get('orderTypesListAll').then((val) => {this.orderTypesListAll=val;});
    storage.get('MovingCompanyList').then((val) => {this.MovingCompanyList=val;});
    storage.get('myMovingCompanyTz').then((val) => {this.myMovingCompanyTz=val;});

    this.showFilterFlag='N';
    this.statusFilter=-1;
this.orderTypeFilter =-1;
    var d0 = new Date();
    d0.setDate(d0.getDate()-1);
    this.fromDate= d0.toISOString();

    var d = new Date();
    d.setDate(d.getDate()+8);
    this.toDate= d.toISOString();

    //////////////////////////
    var id1 ="";
    try{
      id1=this.activatedRoute.snapshot.paramMap.get('id');
      if( id1!=undefined && id1!=null && id1!="0")
      {
        var orderItem={orderId:id1};
        this.itemSelected(null,orderItem);
      }
    }
    catch(e)
    {
      this.displayMsg(e);
    }
    
  }

  ngOnInit() {
  }

  ionViewWillEnter() {     
    this.getItems(null);
   }

  itemSelected(event, item) {     
    this.navCtrl.navigateForward('/order-form/'+item.orderId+"/0");   
  }

  CanelNoSave(event) {        
    //this.viewCtrl.dismiss(null);
    //this.location.back();
    this.navCtrl.navigateBack('/home'); 
  } 

  createNew(item) {   
    var  mymc=this.aService.getUserMovingCompanyTz();     
    this.navCtrl.navigateForward('/order-form/0/'+mymc);
  }

   getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput);
  }

  getListFromDB(myfilter:string){
    var module='getOrderList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,clientId:-1,filterOrderStatus:this.statusFilter,filterOrderType:this.orderTypeFilter
        ,fromDate:this.fromDate, toDate:this.toDate,timeZone:"Asia/Jerusalem",movingCompanyTz:'',filterMovingCompanyId:this.movingCompanyFilter,showForAllDrivers:this.showForAllDrivers}
    //showAllOrderFilterFlag
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
  cancel(event) {        
    this.navCtrl.navigateBack('/home');    
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
