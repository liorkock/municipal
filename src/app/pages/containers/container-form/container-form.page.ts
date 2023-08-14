import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../services/authentication-service'
import {GitHubService} from '../../../services/git-hub-service';
import {Lang} from '../../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController,NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-container-form',
  templateUrl: './container-form.page.html',
 // styleUrls: ['./container-form.page.scss'],
})


export class ContainerFormPage implements OnInit {
  public mylang;
  public DB;
  public userRole;
  
  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private activatedRoute: ActivatedRoute,private location: Location,private navCtrl: NavController,public modalController: ModalController,public navParams: NavParams) { 
        
    this.mylang= new Lang();
    this.userRole=this.aService.getUserRole()

    //variable declration
    this.DB={};
    this.DB.containerId=0;
    this.DB.movingCompanyTz=aService.getUserMovingCompanyTz();//aService
    this.DB.movingCompanyName="";
    this.DB.regNum="";
    this.DB.imeiNumber="";
    this.DB.totalvolume="";
    this.DB.allowedWeight="";
    this.DB.tera="";
    this.DB.lastLat="";
    this.DB.lastLng="";
    this.DB.locationDate="";
    this.DB.remarks="";
    this.DB.containerColor="";
    this.DB.picFile="";
    this.DB.installationDate ="";
    this.DB.tiltingAngle=""; 
    this.DB.devicelocation="";
    this.DB.mapIcon="";
    this.DB.GeoFenceSettings="3";
    this.DB.GeoFenceCenterLat=0;
    this.DB.GeoFenceRad=0;
    this.DB.UseGeoFence=true;

    this.DB.MCGeoFenceCenterLat=0;
    this.DB.MCGeoFenceCenterLng=0;
    this.DB.MCGeoFenceRad=0;
    this.DB.MCUseGeoFence=true;

    //var date1 = new Date();
    //date1.setHours(0, 0, 0, 0);
    //date1.setDate(date1.getDate());
    //this.DB.installationDate = date1;
    this.DB.installationDate = (new Date()).toISOString();
    this.fillComboData();

    var myid=navParams.get('myid')
    this.getdate(myid);

  }

  ngOnInit() {
    //var myid=this.activatedRoute.snapshot.paramMap.get('myid');
    //this.getdate(myid);
  }

  fillComboData()
  {
   //this.storage.get('aaaa').then((val) => {this.aaaa=val;});
  }

  getdate(id) {
    var module='getContainerData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), containerId:id }
    this.github.getRepos(module,params).subscribe(
            data => {

                var mydata=this.github.ParseResult(data);
                if(mydata==null)
                    {
                        this.displayErrorMsg("");
                        return;
                    }
                    for (var MyVariable in this.DB) {
                        this.DB[MyVariable]=mydata[MyVariable];
                    }

                    if(this.DB.picFile!="")
                        this.DB.picFile= this.github.getPicFolder()+this.DB.picFile;
            },
            err => this.displayErrorMsg(err)
    );
}

validateMe() {
  if(this.DB.regNum==''||this.DB.totalvolume==''||this.DB.imeNumber=='')
  {
      this.displayMsg(this.mylang.Validation.Mandatory )
      return false;
  }
  return true;
}

save(event) {
  if(this.validateMe()==false)
      return;

  var module='updateContainerData';
  var params = { logInUserId:this.aService.getUserId(), securityString: this.aService.getUserSS(), o:this.DB2Json() };

  this.github.getRepos(module,params).subscribe(
                  data => {
                      var mydata=this.github.ParseResult(data);
                      if(mydata==null || mydata=="-10" || mydata<-10 || mydata.indexOf('Err')>-1)
                          {
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
    //this.navCtrl.navigateBack('/containers');    
    this.modalController.dismiss(null);
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

}
