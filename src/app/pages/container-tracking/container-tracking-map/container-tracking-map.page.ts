import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service'
import { GitHubService } from '../../../services/git-hub-service';
import { Lang } from '../../../services/lang';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-container-tracking-map',
  templateUrl: './container-tracking-map.page.html',
  styleUrls: ['./container-tracking-map.page.scss'],
})
export class ContainerTrackingMapPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  public mylang;
  public DB;
  public myLocationMarker = null;
  public infowindow;
  public flightPath = null;
  //public myid=0;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();
    //variable declration
    this.DB={};   
    this.DB.projectLat = -34.9290;
    this.DB.projectLng = 138.6010;
    this.DB.unloadingLat = 0;
    this.DB.unloadingLong = 0;


    this.DB.unloadingdate = "";
    this.DB.regNum = "";
    this.DB.projectAddress = "";
    this.DB.insertDate = "";
    this.DB.wasteSiteName = "";
    this.DB.movingCompanyName = "";
    var selectedItem = navParams.get('item');

    if(this.mylang.currentLang=='Heb')
    {
      this.DB.lastLat = 32.0755;
      this.DB.lastLng = 34.788;
    }
   
    if (selectedItem != null) {
      this.DB.projectLat = selectedItem.projectLat;
      this.DB.projectLng = selectedItem.projectLng;
      this.DB.unloadingLat = selectedItem.unloadingLat;
      this.DB.unloadingLong = selectedItem.unloadingLong;

      this.DB.regNum = selectedItem.regNum;
      this.DB.unloadingdate = selectedItem.unloadingdate;
      this.DB.wasteSiteName = selectedItem.wasteSiteName;
      this.DB.projectAddress = selectedItem.projectAddress;
      this.DB.insertDate = selectedItem.insertDate;
      this.DB.movingCompanyName =  selectedItem.movingCompanyName;
    }

    //this.myid=navParams.get('myid')

  }

  ngOnInit() {

  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.loadMap();
      this.getdataAndDrawwMarkerInfo();
    }, 250);
  }


  getdate(id) {
    /*
    var module='getAAAData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), alertId:id }
    this.github.getRepos(module,params).subscribe(
            data => {                
                var mydata=this.github.ParseResult(data);
                if(mydata!=null)
                {
                    this.DB.lastLat=mydata.latitude;
                   
                }   
                setInterval(this.getdataAndDrawwMarkerInfo(), 200);    
            });
    */
  }

  loadMap() {
    let latLng = new google.maps.LatLng(this.DB.projectLat, this.DB.projectLng);    
    let mapOptions = {
      center: latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  private getdataAndDrawwMarkerInfo(): any {
    var self = this;
    google.maps.event.addListenerOnce(this.map, 'idle', function () {
      let latLng = new google.maps.LatLng(self.DB.projectLat, self.DB.projectLng);
      google.maps.event.trigger(self.map, 'resize');
      //self.map.panTo( new google.maps.LatLng( self.DB.projectLat,self.DB.projectLng ) );
      var myIcon = "assets/img/mapIcons/onProjectIcon.png";
      var projectMarker = new google.maps.Marker({ position: latLng, map: self.map, icon: myIcon });
      var direction = "ltr";
      if(self.mylang.currentLang=='Heb')
        direction = "rtl";

      var movingCompanyStr = "";
        if (self.aService.getUserRole() != "MovingCompany")
          movingCompanyStr = '<p>' + self.DB.movingCompanyName + '</p>';

      var contentString = "<div style='margin-left: 15px;' dir='" + direction + "'><p><b>"+ self.DB.regNum + '</b></p>' + '<p>' + 
      self.DB.insertDate + '</p>' + '</b></p>' + '<p>' + self.DB.projectAddress + '</p>' +movingCompanyStr+ '</div>'
     

      var infowindow = new google.maps.InfoWindow({ content: contentString });
      //infowindow.open(self.map,projectMarker); 
      google.maps.event.addListener(projectMarker, 'click', (function (projectMarker, contentString, infowindow) {
        return function () {
          infowindow.setContent(contentString);
          infowindow.open(self.map, projectMarker);
        };
      })(projectMarker, contentString, infowindow));

      myIcon = "assets/img/mapIcons/legalicon.png";
      if (self.DB.wasteSiteName == "")
        myIcon = "assets/img/mapIcons/illegalicon.png";
      if (self.DB.unloadingLat != "") {

        self.map.panTo(new google.maps.LatLng(self.DB.unloadingLat, self.DB.unloadingLong));
        let latLng2 = new google.maps.LatLng(self.DB.unloadingLat, self.DB.unloadingLong);
        var unloadingtMarker = new google.maps.Marker({ position: latLng2, map: self.map, icon: myIcon });
        var contentString2 = "<div style='margin-left: 15px;' dir='" + direction + "'><p><b>" + self.DB.regNum + '</b></p>' + '<p>' + self.DB.unloadingdate + '</p>' + '</b></p>' + '<p>' + self.DB.wasteSiteName + '</p>' + '</div>'
        var infowindow2 = new google.maps.InfoWindow({ content: contentString2 });
        // infowindow2.open(self.map,unloadingtMarker); 
        google.maps.event.addListener(unloadingtMarker, 'click', (function (unloadingtMarker, contentString2, infowindow2) {
          return function () {
            infowindow2.setContent(contentString2);
            infowindow2.open(self.map, unloadingtMarker);
          };
        })(unloadingtMarker, contentString2, infowindow2));
      }
    });
  }

  //------General Funcations
  cancel(event) {
    // this.navCtrl.navigateBack('/alerts');
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

}



//helper web sites
//https://www.freakyjolly.com/ionic-4-add-google-maps-geolocation-and-geocoder-in-ionic-4-native-application/