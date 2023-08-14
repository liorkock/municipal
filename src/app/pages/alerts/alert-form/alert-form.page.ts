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
  selector: 'app-alert-form',
  templateUrl: './alert-form.page.html',
  //styleUrls: ['./alert-form.page.scss'],
})


export class AlertFormPage implements OnInit {
  public mylang;
  public DB;
  public OrginalDB;
  public userRole;
  public AlertClearReasonList;

  
  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {

    this.mylang = new Lang();
    this.userRole = this.aService.getUserRole();

    this.DB = {};
    this.DB.alertId = 0;
    this.DB.alertTypeId = 0;
    this.DB.alertTypeDesc = "";
    this.DB.regNum = "";
    this.DB.movingCompanyTz = "";
    this.DB.movingCompanyName = "***";
    this.DB.alertDate = "";
    this.DB.address = "";
    this.DB.clearReasonId = -1;
    this.DB.cleardate = "";
    this.DB.remarks = "";
    this.DB.stoppingTime = "";

    this.DB.projectAddress = "";
    this.DB.clientName = "";
    this.DB.clientPhone = "";

    this.fillComboData();

    var myid = navParams.get('myid');
    var AlertClearReasonList = navParams.get('AlertClearReasonList');
    this.getdate(myid);

  }

  ngOnInit() {
    //var myid=this.activatedRoute.snapshot.paramMap.get('myid');
   // this.getdate(this.myid);
  }

  fillComboData() {
    //this.storage.get('AlertClearReasonList').then((val) => {this.AlertClearReasonList=val;});
  }

  getdate(id): any {
    console.log('getdate');
    var module = 'getAlertData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), alertId: id }
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


        if (this.DB.stoppingTime != undefined && this.DB.stoppingTime != '') {
          var time = Number(this.DB.stoppingTime);
          if (time > 60) {
            var hours = Math.floor(time / 60);
            var minutes = time % 60;
            this.DB.stoppingTime = hours + ":" + minutes + ' ' + this.mylang.General.hours;
          }
          else
            this.DB.stoppingTime = time + ' ' + this.mylang.General.minutes;
        }
      },
      err => this.displayErrorMsg(err)
    );
  }

  validateMe() {
    if (this.DB.clearReasonId == '-1')//||this.DB.barCode==''
    {
      this.displayMsg(this.mylang.Validation.Mandatory)
      return false;
    }
    return true;

  }

  save(event) {

    if (this.validateMe() == false)
      return;

    var module = 'updateAlertData';
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
      buttons: [{ text: 'OK', handler: data => {  this.modalController.dismiss(msg) } }]
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
