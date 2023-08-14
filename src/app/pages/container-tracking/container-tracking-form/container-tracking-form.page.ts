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

@Component({
  selector: 'app-container-tracking-form',
  templateUrl: './container-tracking-form.page.html',
  //styleUrls: ['./container-tracking-form.page.scss'],
})
export class ContainerTrackingFormPage implements OnInit {

  public mylang;
  public DB;
  public DB_Original;
  public WasteSiteList;
  public userRole;
  public orginal_unloadingdate;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();
    this.userRole = this.aService.getUserRole();

    this.orginal_unloadingdate = "";
    //variable declration
    this.DB = {};
    this.DB.projectContainerId = 0;
    this.DB.movingCompanyTz = aService.getUserMovingCompanyTz();//aService
    this.DB.movingCompanyName = aService.getUserMovingCompanyTz();//aService
    this.DB.wasteSiteId = -1;
    this.DB.wasteSiteName = "";
    this.DB.unloadingdate = "";
    this.DB.regNum = "";
    this.DB.volume = "";
    this.DB.weight = "";
    this.DB.remarks = "";
    this.DB.barCode = "";
    this.DB.clientName = "";
    this.DB.clientTz = "";
    this.DB.insertDate = "";
    this.DB.existDate = "";
    this.DB.unloadingRemark = "";
    this.DB.projectTown = "";
    this.DB.projectAddress = "";
    this.DB.driverName = "";
    this.DB.weightUpdatedWthinSiteArea = "";

    this.DB.wasteSiteName_auto = "";
    this.DB.unloadingdate_automatic = "";


    this.DB.projectName = "";
    this.DB.AutoInsertToProjectTypeDesc = "";



    this.DB_Original = {};
    this.DB_Original.wasteSiteId = -1;
    this.DB_Original.volume = "";
    this.DB_Original.weight = "";

    var selectedItem = navParams.get('item');
    this.WasteSiteList = navParams.get('WasteSiteList');
    if (selectedItem != null)
      this.getdata(selectedItem.projectContainerId);


  }

  ngOnInit() {
  }

  fillComboData() {
    //his.storage.get('AlertClearReasonList').then((val) => {this.AlertClearReasonList=val;});
  }


  getdata(id) {
    var module = 'getProjectContainerData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), projectContainerId: id }
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

        //this.DB_Original.wasteSiteId=-1;
        //this.DB_Original.volume="";
        this.DB_Original.weight = this.DB.weight;
        if (this.DB.weight == '')
          this.DB.weightUpdatedWthinSiteArea = "2";

        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        //if(this.DB.unloadingdate=="")
        //    this.DB.unloadingdate= (new Date(Date.now() - tzoffset)).toISOString();
        //<ion-datetime displayFormat="HH:mm DD/MM/YYYY" [(ngModel)]="DB.unloadingdate" ></ion-datetime>
        //<ion-input type="text" [(ngModel)]="DB.unloadingdate" style="direction: ltr;" readonly="true"></ion-input>
        if (this.DB.unloadingdate != "") {
          var d = new Date(this.DB.unloadingdate);
          this.orginal_unloadingdate = new Date(d.getTime() - tzoffset).toISOString();
          this.DB.unloadingdate = new Date(d.getTime() - tzoffset).toISOString();
          //this.DB.unloadingdate=this.convertDate(this.DB.unloadingdate);
        }
        //this.DB.unloadingdatenew = new Date((new Date(this.DB.unloadingdate))- tzoffset).toISOString();
      },
      err => this.displayErrorMsg(err)
    );
  }


  convertDate(inputFormat) {
    var d = new Date(inputFormat);
    var result = [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join('-') + " " + this.pad(d.getHours()) + ":" + this.pad(d.getMinutes());
    return result;
  }

  pad(s) {
    return (s < 10) ? '0' + s : s;
  }



  validateMe() {
    if (this.DB.regNum == '' || this.DB.volume == '' || this.DB.weight == '' || this.DB.wasteSiteId < 1) {
      this.displayMsg(this.mylang.Validation.Mandatory)
      return false;
    }
    return true;
  }



  save(event) {
    if (this.validateMe() == false)
      return;
    var tmp_unloadingDate = this.DB.unloadingdate;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    if (this.DB.unloadingdate != "") {
      var d = new Date(this.DB.unloadingdate);
      this.DB.unloadingdate = (new Date(d.getTime() + tzoffset)).toISOString();
    }

    //this.DB.unloadingdate=this.orginal_unloadingdate;

    var module = 'updateProjectContainerUnloadingData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), o: this.DB2Json() };
    this.DB.unloadingdate = tmp_unloadingDate;//return back the orginal value


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
    this.displayMsg(msg);
  }
  compareWithFn = (o1, o2) => {
    return o1.toString()==o2.toString()? true:false;    
    //return o1 && o2 ? o1.codeId === o2.codeId : o1 === o2;    
  }
  
  compareWith = this.compareWithFn;

}
