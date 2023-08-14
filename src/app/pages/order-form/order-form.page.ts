import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'

import { ModalController } from '@ionic/angular';
import { ClientsPage } from '../clients/clients.page';
import { DriversPage } from '../drivers/drivers.page';
import { ContainerSearchPage } from '../container-search/container-search.page';
import { ProjectSearchPage } from '../project-search/project-search.page';
import { SignaturePage } from '../signature/signature.page';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
 // styleUrls: ['./order-form.page.scss'],
})
export class OrderFormPage implements OnInit {

  
  public mylang;
  public DB;
  public OrginalDB;
  public userRole;
  public statusList;
  public orderTypesList;
  public showMCsFlag = false;
  public mc_items = null;
  public myInput_mc = "";
public orderTypeDesc="";
  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private activatedRoute: ActivatedRoute,private location: Location,private navCtrl: NavController,public modalController:ModalController, private launchNavigator:LaunchNavigator) 
  {

    this.mylang= new Lang();
    this.userRole=this.aService.getUserRole()
    var self=this;
    //variable declration  
    this.DB={};   
    this.DB.orderId =-1;
    this.DB.orderNumber ="";
    this.DB.projectId =-1;
    this.DB.projectName ="";
    this.DB.projectAddress ="";
    this.DB.createdBy ="";
    this.DB.remarks ="";
    this.DB.movingCompanyName ="";
    this.DB.clientId ="";
    this.DB.movingCompanyTz ="";
    this.DB.movingCompanyId = -1;
    this.DB.regNum ="";
    this.DB.containerId = -1;
    this.DB.volume ="";
    this.DB.status =1;
    this.DB.vehicleRegNum ="";
    this.DB.vehicleId = -1;
    this.DB.receiverName ="";
    this.DB.orderDate ="";
    this.DB.createdDate ="";
    this.DB.receiveDate ="";

    this.DB.clientName ="";
    this.DB.driverName ="";
    this.DB.driverId = -1;
    this.DB.projectLat = -1;
    this.DB.projectLng = -1;
    this.DB.isSigned =false;
    this.DB.clientSignature ="";
    this.DB.OrderType = 1;
    this.orderTypeDesc="";

    storage.get('orderStatusList').then((val) => {this.statusList=val;});
    storage.get('orderTypesList').then((val) => {this.orderTypesList=val;});
    var d = new Date();
    d.setDate(d.getDate()+0);        
    this.DB.orderDate= (new Date()).toISOString();

    
    this.DB.vehicleRegNum= aService.getUservehicleRegNum();

    if(this.DB.vehicleRegNum!="")
    {
      this.DB.driverId = aService.getUserId();
      this.DB.driverName =  aService.getUserName();
    }
  }

  ngOnInit() {
    var myid=parseInt(this.activatedRoute.snapshot.paramMap.get('myid'));
    this.DB.movingCompanyTz= parseInt(this.activatedRoute.snapshot.paramMap.get('mctz'));
    if(myid>0)   
      this.getdate(myid);
  }
  ionViewDidEnter() {
    for(var i=0;i<this.orderTypesList.length;i++ ){
      if(this.orderTypesList[i]['codeId']==this.DB.OrderType)
      this.orderTypeDesc= this.orderTypesList[i]['codeDesc'];
    }
  }
  setOrderTypeDesc(object){
    this.orderTypeDesc= object.codeDesc;
  }
  getdate(id) {
    var module='getOrderData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), orderId:id }
    this.github.getRepos(module,params).subscribe(
            data => {                   
                var mydata=this.github.ParseResult(data);
                console.log(mydata);
                
                if(mydata==null)
                    {
                        this.displayErrorMsg("");
                        return;
                    }
                    for (var MyVariable in this.DB) {                          
                            this.DB[MyVariable]=mydata[MyVariable];
                    }
                    //this.DB.OrderType=1;
                    this.DB.OrderType =  parseInt(this.DB.OrderType);
            },
            err => this.displayErrorMsg(err)
    );
  }

  validateMe() {       
      if(this.DB.clientName=='')
      {
          this.displayMsg(this.mylang.Validation.Mandatory )
          return false;
      }

      if(this.DB.regNum=='')
      {
          this.displayMsg(this.mylang.Validation.Mandatory )
          return false;
      }
    
      if(this.DB.volume==''|| this.DB.volume<1 )//||this.DB.barCode==''
      {
          this.displayMsg(this.mylang.Validation.Mandatory )
          return false;
      }
      if (parseInt(this.DB.OrderType)== 2 ||parseInt(this.DB.OrderType) == 3) {
        if (parseInt(this.DB.projectId) < 1) {
          this.displayMsg(this.mylang.Validation.Mandatory )
          return false;
        }
    }
      return true;
  }


  save(event) {
    if(this.validateMe()==false)
        return;
 
    var module='updateOrderData';
    var params = { logInUserId:this.aService.getUserId(), securityString: this.aService.getUserSS(), o:this.DB2Json() };

    this.github.getRepos(module,params).subscribe(
                    data => {
                        var mydata=this.github.ParseResult(data);
                        if(mydata==null || mydata=="-10" || mydata<0 || mydata.indexOf('Err')>-1)
                            {
                                this.displayResultError(mydata);
                                return;
                            }
                        this.displaySubmitCompletedAndClose(mydata);
                    },
                    err => this.displayErrorMsg(err)
            );
  }

  CanelNoSave(event) {        
    //this.viewCtrl.dismiss(null);
    //this.navCtrl.navigateBack('/alerts'); 
    this.location.back();
  }


  async  showClientList(e)
  {
  //myMovingCompanyTz
    //this.navCtrl.navigateForward('/clients');     
    const modal = await  this.modalController.create({
      component: ClientsPage,
      componentProps: { 
        myMovingCompanyTz:  this.DB.movingCompanyTz
       
      }
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();

    if(data == undefined || data==null)
      return;
    this.DB.clientId=data.clientId;                    
    this.DB.clientName=data.clientName;

  }


  async  showDriverList(e)
  {    
    const modal = await  this.modalController.create({
      component: DriversPage
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
        
    if(data == undefined || data==null)
      return;
      this.DB.driverId=data.userId;                    
      this.DB.driverName=data.fullName;

  }

  async  showContainerList(e)
  {
        
    const modal = await  this.modalController.create({
      component: ContainerSearchPage,
      componentProps: {category:'MyCountainer',myMovingCompanyTz: this.DB.movingCompanyTz}
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
        
    if(data == undefined || data==null)
      return;
    this.DB.containerId=data.codeId;                    
    this.DB.regNum=data.codeDesc;

  }


  async showProjectList(e)
  {
    
    const modal = await  this.modalController.create({
      component: ProjectSearchPage,
      componentProps: { movingCompanyTz: this.DB.movingCompanyTz,filterClientId:this.DB.clientId}
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
        
    if(data == undefined || data==null)
      return;
    this.DB.projectId=data.codeId;                    
    this.DB.projectName=data.codeDesc;
  }

  async showSignaturePad(e)
  { 
    const modal = await  this.modalController.create({
      component: SignaturePage
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
        
    if(data == undefined || data==null)
      return;

    this.DB.clientSignature =data;   
    if(data.length>4200)
      this.DB.isSigned  =true;   
  }


  wazeIt(e)
  {  
    let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
    this.launchNavigator.navigate([ this.DB.projectLat , this.DB.projectLng ])//,options
    .then(
        success => console.log('Launched navigator'),
        error =>   this.displayErrorMsg(error)  
    );
  }

   //------General Funcations
   cancel(event) {    
    //this.navCtrl.pop();
    this.location.back();
    //this.navCtrl.navigateBack('/alerts');    
  }

  
  DB2Json() {
    var jsonData={};

      for (var MyVariable in this.DB)
           jsonData[MyVariable]=this.DB[MyVariable];
      return  jsonData;
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

  showMCsList(e) {
    this.showMCsFlag = true;
    this.getMovingCompanyItems(e);
  }




  getMovingCompanyItems(e) {
    this.mc_items = [];
    this.getListFromDB(this.myInput_mc);
  }

    getListFromDB(myfilter: string) {

    var module = 'getMovingCompanyList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, showArhive: false }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('Error while geting data');
        else
          this.mc_items = mydata;
      },
      err => this.displayMsg(err)
    );
  }

    mc_itemSelected(e, item) {
    if(this.DB.movingCompanyTz != item.movingCompanyTz){

    this.DB.movingCompanyTz = item.movingCompanyTz;
    this.DB.movingCompanyName = item.movingCompanyName;
    
    this.DB.clientId = 0;
    this.DB.clientName = "";
    this.DB.projectId =-1;
    this.DB.projectName ="";
    this.DB.projectAddress ="";
    this.DB.containerId=-1;                    
    this.DB.regNum="";
    }
    this.showMCsFlag = false;
  }

}
