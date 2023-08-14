import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service'
import { GitHubService } from '../../services/git-hub-service';
import { Lang } from '../../services/lang';
import { AlertController, NavParams } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import {ModalController   } from '@ionic/angular';
import { TownSearchPage } from '../town-search/town-search.page';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.page.html',
 // styleUrls: ['./client-form.page.scss'],
})
export class ClientFormPage implements OnInit {


  public mylang;
  public DB;
  public OrginalDB;
  public userRole;
myMovingCompanyTz = '-1';
serviceSupplierId=-1;
clientType=1;
public ClientTypesList;
public showSSFlag=false;
public myInput_ss='';
public ss_items ;
public selectedId;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController,public modalController: ModalController,public navParams: NavParams) {
    this.mylang = new Lang();
    this.userRole = this.aService.getUserRole()
    this.showSSFlag = false;
    this.myInput_ss='';
    this.ss_items = [];
    //variable declration   
      
    this.DB = {};
    this.DB.clientId = 0;
    this.DB.clientName = "";
    this.DB.clientPhone = "";
    this.DB.clientTz = "";
    this.DB.remarks = "";
    this.DB.tel2 = "";
    this.DB.email = "";
    this.DB.city = "";
    this.DB.street = "";
    this.DB.postlCode = "";
    this.DB.fax = "";
    this.DB.clientExtNumber = "";
    this.DB.movingCompanyTz = "0";
    this.DB.ownerRole='1';
    this.DB.serviceSupplierId=0;
    this.DB.serviceSupplierName='';
    this.DB.clientType=1;
    this.DB.contactPerson='';
    this.DB.clientLastName='';
    this.DB.townId=-1;
    this.selectedId=-1;
    //role = Util.getRole('');
        if (this.userRole  == "Inspector" || this.userRole  == "Admin")
            this.DB.movingCompanyTz="-1";

        if (this.userRole  == "Inspector" && Number(this.aService.getServiceSupplierId())>0) {
            this.DB.ownerRole(2);        
        }

        if (this.userRole  == "MovingCompany" && Number(this.aService.getServiceSupplierId())>0) {
            this.DB.ownerRole(1);
        }

        if (Number(this.aService.getServiceSupplierId()) > 0) {
          this.DB.serviceSupplierId=(Number(this.aService.getServiceSupplierId()));
      }

      this.ClientTypesList=[];

      storage.get('ClientTypesList').then((val) => {this.ClientTypesList=val;});

      var myId = navParams.get('myId');
      if (myId != null && myId!= undefined && myId>0)
        this.getdate(myId);

  }

  ngOnInit() {
    //this.DB.movingCompanyTz =this.aService.getUserMovingCompanyTz();
    this.DB.movingCompanyTz = this.myMovingCompanyTz;
    this.DB.serviceSupplierId= this.serviceSupplierId;
    if(this.DB.movingCompanyTz  == null || this.DB.movingCompanyTz  =="")
      this.DB.movingCompanyTz =this.aService.getUserMovingCompanyTz();
    
    if (Number(this.aService.getServiceSupplierId()) > 0) {
        this.DB.serviceSupplierId=(Number(this.aService.getServiceSupplierId()));
      }
      this.DB.clientType = this.clientType;
      if(this.DB.serviceSupplierId==undefined)
      this.DB.serviceSupplierId=-1;

    if(this.DB.serviceSupplierId>0)
      this.setServiceSupplierData();

      if(this.DB.clientType==undefined || this.DB.clientType<1 )
      this.DB.clientType=1;
      

    /*
    var myid = parseInt(this.activatedRoute.snapshot.paramMap.get('myid'));
    this.DB.movingCompanyTz = parseInt(this.activatedRoute.snapshot.paramMap.get('mctz'));
    if (myid > 0)
      this.getdate(myid);
      */
  }
  getdate(id) {
    var module = 'getClientData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), clientId: id }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null) {
          this.displayErrorMsg("");
          return;
        }
        for (var MyVariable in this.DB) {
          this.DB[MyVariable] = mydata[MyVariable];
        }


      },
      err => this.displayErrorMsg(err)
    );
  }

  validateMe() {

    this.DB.clientAddress = this.DB.city + " " + this.DB.street;

    if (this.DB.clientName == '')//||this.DB.barCode==''
    {
      this.displayMsg(this.mylang.Validation.Mandatory +"clientName")
      return false;
    }

    if (this.DB.clientTz == '')//||this.DB.barCode==''
    {
      this.displayMsg(this.mylang.Validation.Mandatory+" clientTz")
      return false;
    }


    if (this.DB.ownerRole == 2 && this.DB.serviceSupplierId < 1) {
      this.displayMsg(this.mylang.Validation.Mandatory);
     return false;
  }
  if (this.DB.ownerRole == 1 && (this.DB.movingCompanyTz == "" || Number(this.DB.movingCompanyTz)< 0) ) {
    this.displayMsg(this.mylang.Validation.Mandatory);
    return false;
  }

  if(this.DB.serviceSupplierId >0){
    if(this.DB.townId<1){
      this.displayMsg(this.mylang.Validation.Mandatory + " townId");
    return false;
    }
  }
    return true;

  }


  save(event) {
    if (this.validateMe() == false)
      return;

    var module = 'updateClientData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), o: this.DB2Json() };

    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null || mydata == "-10"  || mydata == "-5"|| mydata < -10 || mydata.indexOf('Err') > -1) {
          this.displayResultError(mydata);
          return;
        }
        this.DB.clientId = mydata;
        this.displaySubmitCompletedAndClose(mydata);
      },
      err => this.displayErrorMsg(err)
    );

  }


  CanelNoSave(event) {
    //this.location.back();
    this.modalController.dismiss(null);
  }

  //------General Funcations
  cancel(event) {   
    this.modalController.dismiss(this.DB);
  }


  DB2Json() {
    var jsonData = {};

    for (var MyVariable in this.DB)
      jsonData[MyVariable] = this.DB[MyVariable];
    return jsonData;
  }

  displayErrorMsg(msg) {
    this.alertController.create({
      message: msg, buttons: ['ok']
    }).then(alert => { alert.present(); });
  }

  displayMsg(msg) {
    this.alertController.create({
      message: msg, buttons: ['ok']
    }).then(alert => { alert.present(); });
  }

  displaySubmitCompletedAndClose(msg) {
    this.alertController.create({
      message: this.mylang.General.saveComplete + " #" + msg,
      buttons: [{ text: 'OK', handler: data => { this.cancel(null) } }]
    }).then(alert => { alert.present(); });

  }

  displayResultError(result) {
    var msg = this.mylang.Validation.submitFail;
    if (result == "-10")
      msg = this.mylang.Validation.submitFailObjectExist;

    this.displayMsg(msg);
  }


  async selectNewTown(event) {

    const modal = await this.modalController.create({
      component: TownSearchPage
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();

    if (data == undefined || data == null)
      return;
    this.DB.townId =  data.codeId;
    this.DB.city = data.codeDesc;

  }
  
  showSSList(e) {
    this.showSSFlag = true;
    this.getServiceSupplierItems(e);
  }

  getServiceSupplierItems(e) {
    this.ss_items = [];
    this.getSSListFromDB(this.myInput_ss,false);
  }

  getSSListFromDB(myfilter: string, setDataFlag: boolean) {

    var module = 'getServiceSupplierList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('Error while geting data');
        else{
          this.ss_items = mydata;
          if(setDataFlag==true){
            for(var i=0;i<this.ss_items.length;i++){
              if(Number(this.DB.serviceSupplierId)== Number(this.ss_items[i].serviceSupplierId)){
                this.DB.serviceSupplierName = this.ss_items[i].serviceSupplierName;
                this.DB.serviceSupplierId = this.ss_items[i].serviceSupplierId;
              }
            }
          }
        }
      },
      err => this.displayMsg(err)
    );
  }

  setServiceSupplierData(){
  this.getSSListFromDB('',true);

  /*  var module = 'getServiceSupplierList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: '' }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          return;
        else{
          this.ss_items = mydata;
          for(var i=0;i<this.ss_items.length;i++){
            if(Number(this.DB.serviceSupplierId)== Number(this.ss_items[i].serviceSupplierId)){
              this.DB.serviceSupplierName = this.ss_items[i].serviceSupplierName;
              this.DB.serviceSupplierId = this.ss_items[i].serviceSupplierId;
            }
          }
        }
      },
      
    );
*/
   
   
  }

  ss_itemSelected(e, item) {
    if(this.DB.serviceSupplierId != item.serviceSupplierId){
      if (Number(this.aService.getServiceSupplierId() )> 0 || this.aService.getUserRole() == 'Admin')
      this.DB.serviceSupplierName = item.serviceSupplierName;
      this.DB.serviceSupplierId = item.serviceSupplierId;
           
           
          //  this.DB.movingCompanyTz=-1;
          //  this.DB.movingCompanyName='';
           

      }
      this.showSSFlag = false;
    }



  
}
