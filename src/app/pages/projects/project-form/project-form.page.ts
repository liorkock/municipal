import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service'
import { GitHubService } from '../../../services/git-hub-service';
import { Lang } from '../../../services/lang';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { TownSearchPage } from '../../town-search/town-search.page';
import { ProjectAddressMapPage } from '../project-address-map/project-address-map.page';
import { LocationSearchPage } from '../../location-search/location-search.page';

import { ClientsPage } from '../../clients/clients.page';


declare var google: any;


@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.page.html',
  //styleUrls: ['./project-form.page.scss'],
})
export class ProjectFormPage implements OnInit {


  public mylang;
  public DB;
  public OrginalDB;
  public userRole;
  public geocoder = null;
  public myContainerItem = null;

  public mc_items:any[] ;
  public authority_items;
  public myInput_mc = "";
  public myInput_au ="";

  public showMCsFlag = false;
  public showAuthorityFlag = false;
  public AutorityInspectorList;
  public filterServiceSupplierId;
  public myMovingCompanyId = -1;
  orders: any[];//<{}>;
  public module ='';
  public authorityName = '';
  
  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();
    this.userRole = this.aService.getUserRole()
    //variable declration
    this.mc_items = [];
    this.authority_items=[];
    this.DB = {};
    this.DB.projectId = 0;
    this.DB.movingCompanyTz = aService.getUserMovingCompanyTz();//aService
    this.DB.movingCompanyName = "";
    this.DB.clientTz = "";
    this.DB.clientName = "";
    this.DB.clientPhone = "";
    this.DB.clientAddress = "";
    this.DB.projectTownId = -1;
    this.DB.projectAddress = "";
    this.DB.buildingApprovalNumber = "";
    this.DB.remarks = "";
    this.DB.isActive = true;
    this.DB.startDate = "";
    this.DB.endDate = "";
    this.DB.barCode = "";
    this.DB.gosh = "";
    this.DB.helka = "";
    this.DB.projectType = "";
    this.DB.townDesc = '';
    this.DB.projectName = '';
    this.DB.autoInsertTypeId = '1';
    this.DB.createdBy = '';
    this.DB.inspectorId = -1;
    this.DB.postalCode = '';

    this.DB.projectLat = '';
    this.DB.projectLng = '';
    this.DB.clientId = '';
    this.DB.authorityId=-1;
    this.DB.isMovingCompanyClient = true;
    this.DB.createdByAuthority= false;
    this.DB.creatorAuthoriyName = '';
    this.OrginalDB = {};
    this.OrginalDB.projectAddress = '';
    this.OrginalDB.projectTownId = -1;
    this.OrginalDB.projectOrginalFullAddress = '';

    var selectedItem = navParams.get('item');
    this. module = navParams.get('module');
    this.filterServiceSupplierId = navParams.get('filterServiceSupplierId');

    var date1 = new Date();
    var date2 = new Date();
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    date1.setDate(date1.getDate());
    date2.setDate(date2.getDate() + 365);
    this.DB.startDate = date1;
    this.DB.endDate = date2;


    var d = new Date();
    d.setDate(d.getDate() + 365);
    this.DB.startDate = (new Date()).toISOString();
    this.DB.endDate = d.toISOString();

    if (selectedItem != null && selectedItem.projectId != undefined)
      this.getdate(selectedItem.projectId);



    if (this.userRole == "Inspector") {
      this.DB.projectTownId = this.aService.getdefaultTownId();
      this.DB.townDesc = this.aService.getdefaultTownDesc();
    }

    this.setTownAndAddressAndGeo(selectedItem);

    this.showMCsFlag = false;
this.showAuthorityFlag = false;
    if (selectedItem != null && selectedItem.movingCompanyTz != undefined && selectedItem.movingCompanyTz != null)
      this.DB.movingCompanyTz = selectedItem.movingCompanyTz;

    if (selectedItem != null && selectedItem.movingCompanyName != undefined && selectedItem.movingCompanyName != null)
      this.DB.movingCompanyName = selectedItem.movingCompanyName;

      if (selectedItem != null && selectedItem.clientId != undefined && selectedItem.clientId != null)
      this.DB.clientId = selectedItem.clientId;

      if (selectedItem != null && selectedItem.clientName != undefined && selectedItem.clientName != null)
      this.DB.clientName = selectedItem.clientName;

      if (selectedItem != null && selectedItem.clientTz != undefined && selectedItem.clientTz != null)
      this.DB.clientTz = selectedItem.clientTz;

      if (selectedItem != null && selectedItem.clientPhone != undefined && selectedItem.clientPhone != null)
      this.DB.clientPhone = selectedItem.clientPhone;

      if (selectedItem != null && selectedItem.clientAddress != undefined && selectedItem.clientAddress != null)
      this.DB.clientAddress = selectedItem.clientAddress;

    //console.log(selectedItem);
    this.AutorityInspectorList = navParams.get('AutorityInspectorList');


  }

  ngOnInit() {
  }


  getdate(id) {

    this.OrginalDB.projectAddress = '';
    this.OrginalDB.projectTownId = -1;
    this.OrginalDB.projectOrginalFullAddress = '';

    if (id < 0)
      return;

    var module = 'getprojectData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), projectId: id }
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

        this.OrginalDB.projectAddress = this.DB.projectAddress;
        this.OrginalDB.projectTownId = this.DB.projectTownId;

        this.OrginalDB.projectOrginalFullAddress = this.DB.townDesc + this.DB.projectAddress;
        this.getOrderListFromDB('');

      },
      err => this.displayErrorMsg(err)
    );
  }

  validateMe() {

    //18032017
    //this.DB.clientTz==''|| this.DB.clientName==''||
    if (this.DB.movingCompanyTz == '' || this.DB.movingCompanyTz == '0')//||this.DB.barCode==''
    {
      this.displayMsg(this.mylang.Validation.Mandatory)
      return false;
    }

    if (this.DB.startDate == '' || this.DB.endDate == '')//||this.DB.barCode==''
    {
      this.displayMsg(this.mylang.Validation.Mandatory)
      return false;
    }

    if (this.DB.projectLat == "" || this.DB.projectLng == "") {
      this.displayMsg(this.mylang.Validation.pleaseCheckLocationOnMap);
      return false;
    }

    return true;
  }


  save(event) {
    if (this.validateMe() == false)
      return;
      this.DB.createdByAuthority = false;
      this.DB.createdBySystem= false;
    var module = 'updateprojectData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), o: this.DB2Json() };

    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null || mydata == "-10" || mydata == "-5" || mydata < -10 || mydata.indexOf('Err') > -1) {
          this.displayResultError(mydata);
          return;
        }
        
        //this.addCountainerToProject(mydata);
        if(this.module=='SupplierOrder'){
          this.DB.projectId = mydata;

          var result =  this.DB2Json();
         // this.displaySubmitCompletedAndClose(mydata);
          this.modalController.dismiss(result);
        }
        else{
          this.displaySubmitCompletedAndClose(mydata);
          this.modalController.dismiss(mydata);
        }

      },
      err => this.displayErrorMsg(err)
    );

  }

  //------General Funcations
  cancel(event) {
    //this.navCtrl.pop();
    //this.location.back();
    //this.navCtrl.navigateBack('/alerts');    
    this.modalController.dismiss(null);
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


    if (result == "-5")
      msg = this.mylang.Validation.cannotOpenProjectOutOfArea;

    if (result == "-11")
      msg = this.mylang.Validation.containerExsitOnThisSite;

    if (result == "-12")
      msg = this.mylang.Validation.containerExsitOnOtherProject;

    if (result == "-913")
      msg = this.mylang.Validation.containerNotBelong2u;

    if (result == "-912")
      msg = this.mylang.Validation.containerNotExist;
    this.displayMsg(msg);
  }


  //extra functions
  getOrderListFromDB(myfilter: string) {
    var module = 'getOrderList';
    var params = {
      logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, clientId: -1, filterOrderStatus: ''
      , fromDate: '', toDate: '', timeZone: "Asia/Jerusalem", movingCompanyTz: this.DB.movingCompanyTz, projectId: this.DB.projectId, showForAllDrivers: true
    }
    //showAllOrderFilterFlag
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('');
        else
          this.orders = mydata;
      },
      err => this.displayMsg(err)

    );
  }

  async selectNewTown(event) {

    const modal = await this.modalController.create({
      component: TownSearchPage
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();

    if (data == undefined || data == null)
      return;
    this.DB.projectTownId = data.codeId;
    this.DB.townDesc = data.codeDesc;

  }


  async openAddressMap(event) {


    const modal = await this.modalController.create({
      component: ProjectAddressMapPage,
      componentProps: {
        projectLat: this.DB.projectLat, projectLng: this.DB.projectLng, townDesc: this.DB.townDesc, projectAddress: this.DB.projectAddress
        , projectOrginalFullAddress: this.OrginalDB.projectOrginalFullAddress, postalCode: this.DB.postalCode, postalTown: this.DB.townDesc
      }
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();

    if (data == undefined || data == null)
      return;


    this.DB.projectLat = data["projectLat"];
    this.DB.projectLng = data["projectLng"];
    this.DB.projectAddress = data["projectAddress"];
    if (this.mylang.currentLang != 'Heb') {
      this.DB.townDesc = data["postalTown"];
      this.DB.postalCode = data["postalCode"];
      this.getTownId(this);
      //setInterval(mySelf.DecodePostalFromMap(), 50);
    }


  }


  async selectPostalCode(event) {

    const modal = await this.modalController.create({
      component: LocationSearchPage
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();

    if (data == undefined || data == null)
      return;
    try {
      this.DB.projectTownId = -1;
      this.DB.postalCode = '';
      this.DB.townDesc = '';
      this.DB.projectAddress = data.description;

      this.DB.projectLat = data.lat;
      this.DB.projectLng = data.lng;
      this.DB.postalCode = data.postalCode;
      this.DB.townDesc = data.postalTown;
      this.getTownId(this);
    }
    catch (err) {
      console.log(err);
    }
  }


  async showClientList(e) {
    const modal = await this.modalController.create({
      component: ClientsPage,
      componentProps: { 
        myMovingCompanyTz:  this.DB.movingCompanyTz
       
      }
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();

    if (data == undefined || data == null)
      return;
    this.DB.clientId = data.clientId;
    this.DB.clientName = data.clientName;
    this.DB.clientTz = data.clientTz;
    this.DB.clientPhone = data.clientPhone;
    this.DB.clientAddress = data.clientAddress;

  }

  addCountainerToProject(pId) {
    if (pId > 0 && this.myContainerItem != null) {
      var module = 'addProjectContainerDataByContainerId';
      var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), projectId: pId, containerId: this.myContainerItem.containerId };
      this.github.getRepos(module, params).subscribe(
        data => {
          var mydata = this.github.ParseResult(data);
          if (mydata == null || mydata == "-10" || mydata < -10 || mydata.indexOf('Err') > -1) {
            this.displayResultError(mydata);
          }
        },
        err => this.displayErrorMsg(err)
      );

    }
  }

  setTownAndAddressAndGeo(containerItem) {
    this.myContainerItem = null;
    var HebrewChars = new RegExp("^[\u0590-\u05FF ]+$");
    var HebrewAndNumbersChars = new RegExp("^[\u0590-\u05FF 0-9]+$");

    if (containerItem != null && containerItem != undefined && containerItem.lastLat != undefined && containerItem.lastLat > 0) {
      this.myContainerItem = containerItem;
      //console.log("setTownAndAddressAndGeo "+containerItem.lastLat)
      this.DB.projectLat = containerItem.lastLat;
      this.DB.projectLng = containerItem.lastLng;
      //reversve lanandLong
      this.geocoder = new google.maps.Geocoder();
      var self = this;
      var reversLatlng = new google.maps.LatLng(self.DB.projectLat, self.DB.projectLng);
      self.geocoder.geocode({ 'latLng': reversLatlng, 'region': "he" }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          var city = "";
          var street = "";
          var hn = "";
          var formatted_address;
          var zipCode = "";

          for (var k = 0; k < results.length; k++) {
            for (var i = 0; i < results[k].address_components.length; i++) {
              if (results[k].address_components[i].types[0] == "locality" || results[k].address_components[i].types[0] == "postal_town")
                city = results[k].address_components[i]["long_name"];
              if (results[k].address_components[i].types[0] == "route" || results[k].address_components[i].types[0] == "premise")
                street = results[k].address_components[i]["long_name"];
              if (results[k].address_components[i].types[0] == "street_number")
                hn = results[k].address_components[i]["long_name"];
              if (results[k].address_components[i].types[0] == "postal_code")
                zipCode = results[k].address_components[i]["long_name"];
            }
            formatted_address = results[k].formatted_address;

            if (HebrewChars.test(city) || self.mylang.currentLang != 'Heb')
              break;
          }

          self.DB.postalCode = zipCode;
          //if (formatted_address.includes("Unnamed")==false)
          if (HebrewChars.test(city)) {
            if (street != undefined && (HebrewAndNumbersChars.test(street) || self.mylang.currentLang != 'Heb'))
              self.DB.projectAddress = street;
            if (hn != "" && hn != undefined)
              self.DB.projectAddress = self.DB.projectAddress + " " + hn;
            self.DB.townDesc = city;
            self.getTownId(self);
          }

        } else
          self.DB.projectAddress = "";
      });
    }

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
if(this.module=='SupplierOrder' ) return this.getMCListForSupplierOrder(myfilter);
    var module = 'getMovingCompanyList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, showArhive: false,filterServiceSupplierId:this.filterServiceSupplierId }
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

  getMCListForSupplierOrder(myfilter: string){
  
  var module = 'getSearchFormList';
  var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(),moduleName:'MovingCompany', filterInput: myfilter, showArhive: false,filterServiceSupplierId:this.filterServiceSupplierId }
  this.github.getRepos(module, params).subscribe(
    data => {
      var mydata = this.github.ParseResult(data);
      if (mydata == null)
        this.displayErrorMsg('Error while geting data');
      else{
          for(var i =0; i<mydata.length;i++){
            var item ={movingCompanyName:mydata[i].codeDesc,movingCompanyTz:mydata[i].col2,MovingCompanyId:mydata[i].codeId}
            this.mc_items .push(item);
          }
      }
    //  this.mc_items = mydata;
  },
  err => this.displayMsg(err)
);
  }



  mc_itemSelected(e, item) {
  if(this.DB.movingCompanyTz != item.movingCompanyTz){
    this.DB.movingCompanyTz = item.movingCompanyTz;
    this.DB.movingCompanyName = item.movingCompanyName;
    this.myMovingCompanyId = item.MovingCompanyId;

    if (this.filterServiceSupplierId != null && this.filterServiceSupplierId != undefined && this.filterServiceSupplierId >0){

    }
    else{
      this.DB.clientId = 0;
      this.DB.clientTz = "";
      this.DB.clientName = "";
      this.DB.clientPhone = "";
      this.DB.clientAddress = "";
    }

        this.getMCAuthorityList('');
        this.DB.authorityId= -1;
    }
    this.showMCsFlag = false;
  }

  showAuthorityList(e){
  this.showAuthorityFlag = true;
  this.getMCAuthorityList(this.myInput_au);
  }

  getMCAuthorityList = function (e) {
    this.authority_items=[];
    var MCId =this.myMovingCompanyId;

    if (this.userRole == "MovingCompany") {
      MCId=0;
       
    }
    var module = 'getMC_AuthorityList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: e, movingCompanyId: "0" }
       
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('Error while geting data');
        else{
           this.authority_items = mydata;
        }
        //  this.mc_items = mydata;
      },
      err => this.displayMsg(err)
    );
   
   
};


au_itemSelected(e, item){
  this.DB.authorityId = item.authorityId;
  this.authorityName = item.authorityName;
  this.showAuthorityFlag = false;
}

  //geoSelectedPostal()
  geoSelectedPostal(mySelf) {
    // var mySelf= this;
    mySelf.geocoder = new google.maps.Geocoder();
    try {
      mySelf.geocoder.geocode({ 'address': mySelf.DB.projectAddress }, (results, status) => {
        mySelf.DB.projectLat = results[0].geometry.location.lat();
        mySelf.DB.projectLng = results[0].geometry.location.lng();
        mySelf.ParseSelectedPostalResult(mySelf, results, status);
      });
      //console.log( data);                   
    }
    catch (err) {
      console.log(err);
    }
  }

  ParseSelectedPostalResult(mySelf, results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var city = "";
      var street = "";
      var hn = "";
      var formatted_address;
      var zipCode = "";

      for (var k = 0; k < results.length; k++) {
        for (var i = 0; i < results[k].address_components.length; i++) {
          if (results[k].address_components[i].types[0] == "locality" || results[k].address_components[i].types[0] == "postal_town")
            city = results[k].address_components[i]["long_name"];
          if (results[k].address_components[i].types[0] == "route" || results[k].address_components[i].types[0] == "premise")
            street = results[k].address_components[i]["long_name"];
          if (results[k].address_components[i].types[0] == "street_number")
            hn = results[k].address_components[i]["long_name"];
          if (results[k].address_components[i].types[0] == "postal_code")
            zipCode = results[k].address_components[i]["long_name"];
        }
        formatted_address = results[k].formatted_address;
        break;
      }

      mySelf.DB.postalCode = zipCode;
      mySelf.DB.townDesc = city;
      mySelf.getTownId(mySelf);
    }
  }

  getTownId(mySelf) {
    var module = 'getTownIdByName';
    var params = { logInUserId: mySelf.aService.getUserId(), securityString: mySelf.aService.getUserSS(), townName: mySelf.DB.townDesc };
    mySelf.github.getRepos(module, params).subscribe(
      data => {
        var mydata = mySelf.github.ParseResult(data);
        if (mydata != null)
          mySelf.DB.projectTownId = mydata;
      }
    );
  }


  compareWithFn = (o1, o2) => {
    if(o1==null || o2==null)
      return false;
    return o1.toString()==o2.toString()? true:false;    
    //return o1 && o2 ? o1.codeId === o2.codeId : o1 === o2;    
  }
  
  compareWith = this.compareWithFn;

}
