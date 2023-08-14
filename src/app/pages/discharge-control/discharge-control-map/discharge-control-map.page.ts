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
  selector: 'app-discharge-control-map',
  templateUrl: './discharge-control-map.page.html',
  styleUrls: ['./discharge-control-map.page.scss'],
})
export class DischargeControlMapPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  public mylang;
  public DB;
  public myLocationMarker = null;
  public infowindow;
  public flightPath = null;
  //public myid=0;
  public showFilterFlag: string;
  public  unloadingItems=null;
  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();
    //variable declration
    this.DB = {};
    this.DB.lastLat = -34.9290;
    this.DB.lastLng = 138.6010;
    this.DB.locationDate = "";
    this.DB.regNum = "";
    this.DB.unloadingOnWasteSite = "";

    if(this.mylang.currentLang=='Heb')
    {
      this.DB.lastLat = 32.0755;
      this.DB.lastLng = 34.788;
    }
    this.showFilterFlag = navParams.get('showFilterFlag');
    if (this.showFilterFlag == 'takeFromPrevPage') {
      this.unloadingItems = navParams.get('unloadingItems');
  }

    var selectedItem = navParams.get('item');
    if (selectedItem != null) {
      this.DB.lastLat = selectedItem.latitude;
      this.DB.lastLng = selectedItem.longitude;
      this.DB.regNum = selectedItem.regNum;
      this.DB.locationDate = selectedItem.trigerDate;
      this.DB.unloadingOnWasteSite = selectedItem.unloadingOnWasteSite;
    }

    //this.myid=navParams.get('myid')

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    /*setTimeout(() => {
      this.loadMap();
      this.getdataAndDrawwMarkerInfo();
    }, 250);
*/
    if (this.showFilterFlag == 'takeFromPrevPage') {
      this.loadMap_AllContainers();
      this.DrawMapOfAllRecords();
    }
    else{
    this.loadMap();
    //this.getdate(this.myid);       
    setInterval(this.getdataAndDrawwMarkerInfo(), 300);
    }
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
    let latLng = new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng);
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
      google.maps.event.trigger(self.map, 'resize');
      let latLng = new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng);
      self.map.panTo(new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng));
      var myIcon = "assets/img/mapIcons/legalicon.png";//ok on waste site

      if (self.DB.unloadingOnWasteSite == "N")
        myIcon = "assets/img/mapIcons/illegalicon.png";


      var marker = new google.maps.Marker({ position: latLng, map: self.map, icon: myIcon });
        var direction = "ltr";
          if( self.mylang.currentLang=='Heb')
            direction = "rtl";
      var content = "<div style='margin-left: 15px;' dir='"+direction+"'><p><b>" + self.DB.regNum + '</b></p>' + '<p>' + self.DB.locationDate + '</p>' + '</div>'
      var infowindow = new google.maps.InfoWindow({ content: content });
      infowindow.open(self.map, marker);

      google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
          infowindow.setContent(content);
          infowindow.open(self.map, marker);
        };
      })(marker, content, infowindow));

    });
    this.map.panTo(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
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

  loadMap_AllContainers() {
    let latLng = new google.maps.LatLng(32.09, 34.78);
    let mapOptions = { center: latLng, zoom: 12, mapTypeId: google.maps.MapTypeId.ROADMAP }
   
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }
  DrawMapOfAllRecords = function () {
    var self = this;
    if(this.unloadingItems==null)
    {
        this.displayErrorMsg("");
        return;
    }
    var sumLat = 0;
    var sumLong = 0;
    var totalvalidRecords = 0;
    var h = window.innerHeight;
    h = h * 80 / 100 - 30;
    
    google.maps.event.addListenerOnce(this.map, 'idle', function () {
        google.maps.event.trigger(self.map, 'resize');
       
        var arrayLength = self.unloadingItems.length;
        for (var i = 0; i < arrayLength; i++) {
            if (self.unloadingItems[i].latitude != "" && self.unloadingItems[i].longitude != "") {
                var myLatLng1 = { lat: Number(self.unloadingItems[i].latitude), lng: Number(self.unloadingItems[i].longitude) };
                self.map.panTo(myLatLng1);
                var myIcon = 'assets/img/mapIcons/legalicon.png';
                if (self.unloadingItems[i].unloadingOnWasteSite == "N")
                    //myIcon = "assets/img/mapIcons/illegalIcon.png";
                    myIcon = "assets/img/mapIcons/illegalicon.png";
                var marker = new google.maps.Marker({ position: myLatLng1, map: self.map, icon: myIcon });//pinImage
                var content = '<div><p><b>' + self.unloadingItems[i].regNum + '</b></p>' + '<p>' + self.unloadingItems[i].trigerDate + '</p>' + '<p>' + self.unloadingItems[i].movingCompanyName + '</p>' + '</div>'
                var infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(self.map, marker);
                    };
                })(marker, content, infowindow));
            }
        }
    });
}

}



//helper web sites
//https://www.freakyjolly.com/ionic-4-add-google-maps-geolocation-and-geocoder-in-ionic-4-native-application/