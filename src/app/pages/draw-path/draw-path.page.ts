//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';

import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { ModalController, NavParams } from '@ionic/angular';

//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
declare var google: any;
@Component({
  selector: 'app-draw-path',
  templateUrl: './draw-path.page.html',
 // styleUrls: ['./draw-path.page.scss'],
})
export class DrawPathPage implements OnInit {
  @ViewChild('map',{ static: true }) mapElement: ElementRef;
    map: any;
    public mylang;
    public DB;
  
    public myLocationMarker = null;
    
    public flightPath = null;
    public isFirstLoad = "Y";
    public titleFromTo = "";
    public myid = -1;
  
    public fromDate;
    public toDate;
    public showFilterFlag: string;
  
    public filterInput = '';
    public filterMovingCompanyId = '';
    public filterContainerState = '';
    public userRole;
    public findInArround;
    public currentLocationLat;
    public currentLocationLng;
  public  geocoder = null;
public self = this;
public PathLines = [];
public btnPauseEnable = true;
public btnNextEnable = true;
public PlaySpeed = 100;
//var geocoder = null;
//var map = null;
// var speedLimit = 0;
public forTimer = 1000;
//var mapStartDate = null;
//var mapEndDate = null;
public index = 0;
public forTime = null;
public zoomIn = true;
public insideAuthorityArea = 0;
public lastMarker = null;
public pathPoints = [];
public pointColor = [];
public allMarker = [];
public Lines = [];
public infowindow = null;
public allDistance = 0;
 public lastDistanceLat = null;
  public lastDistanceLng = null;
public inforwindowArr = [];
public endDate=null;
public endLat = null;
public endLong=null;
public pathType = null;
public unloadingOnWasteSite='N';
public myUnloadingIcon ='';

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams,private geoloc: Geolocation, private launchNavigator:LaunchNavigator) { 
    this.mylang = new Lang();
    this.DB = {};
    this.DB.containerId = 0;
    this.DB.lastLat = -34.9290;
    this.DB.lastLng = 138.6010;
    this.DB.locationDate = "";
    this.DB.regNum = "";
    this.DB.mapIcon = "";
    this.DB.movingCompanyName ="";
    this.DB.endLat= 32.21;
    this.DB.endLong= 34.2;
    this.DB.endDate = null;
    this.DB.LastStopTime = 10;
    this.userRole=aService.getUserRole();
    this. PathLines = [];
    this. btnPauseEnable = true;
    this. btnNextEnable = true;
    this. PlaySpeed = 30;
    //var geocoder = null;
    //var map = null;
    // var speedLimit = 0;
    var forTimer = 1000;
    //var mapStartDate = null;
    //var mapEndDate = null;
    this. index = 0;
    this. forTime = null;
    this. zoomIn = true;
    this. insideAuthorityArea = 0;
    this. lastMarker = null;
    this. pathPoints = [];
    this. pointColor = [];
    this. allMarker = [];
    this. Lines = [];
    this. infowindow = null;
    this. allDistance = 0, this.lastDistanceLat = null, this.lastDistanceLng = null;
    this. inforwindowArr = [];
    this.myUnloadingIcon ="";

    var d = new Date();
    d.setDate(d.getDate() - 1);
    this.fromDate = d.toISOString();
    this.toDate = new Date().toISOString();
    this.showFilterFlag = 'N';
    this.myid = navParams.get('myid');
    this.endDate = navParams.get('endDate');
    this.endLat = navParams.get('endLat');
    this.endLong = navParams.get('endLong');
    this.pathType = navParams.get('pathType');
this.unloadingOnWasteSite = navParams.get('unloadingOnWasteSite');
    this.showFilterFlag = navParams.get('showFilterFlag');

        this.geocoder= new google.maps.Geocoder();

    if (this.showFilterFlag == 'takeFromPrevPage') {
      this.titleFromTo=this.mylang.Container.mapAllContainersTitle;
      this.filterInput = navParams.get('filterInput');
      this.filterMovingCompanyId = navParams.get('filterMovingCompanyId');
      this.filterContainerState = navParams.get('filterContainerState');
      this.findInArround = navParams.get('findInArround');
      this.currentLocationLat = navParams.get('currentLocationLat');
      this.currentLocationLng = navParams.get('currentLocationLng');
    }

  }

  ngOnInit() {
  
  }

  ionViewDidEnter() {
    this.loadMap();

    //'myid': item.alertId,'showFilterFlag':'N','endDate':item.alertDate,'endLat':item.latitude,'endLong':item.longitude,'pathType':'Alert'
    if(this.pathType =="Alert"){
        this.showFilterFlag = 'takeFromPrevPage';
        this.drawUnloadingPathForAlert(this.myid,this.endDate,this.endLat,this.endLong)
    }
    else if(this.pathType =="Unloading"){
        this.showFilterFlag = 'takeFromPrevPage';
        this.drawUnloadingPathForUnloading(this.myid,this.endDate,this.endLat,this.endLong,this.unloadingOnWasteSite)
    }
    else{
    this.getdate(this.myid);

    if (this.showFilterFlag == 'takeFromPrevPage') {
     // this.loadMap_AllContainers();
     // this.DrawAllContainers();
    }
    else {
    //  this.loadMap();
    //  this.getdate(this.myid);
    }
}
  }

  refreshPath(){
        this.DrawPath(this.fromDate,this.toDate);
  }
  drawUnloadingPathForUnloading  ( id, alertDate, latitude, longitude, unloadingOnWasteSite) {
    this.DB.endDate=(alertDate);
    this.DB.endLat=(latitude);
    this.DB.alertId=(id);
    this.DB.endLong=(longitude);
    this.DB.LastStopTime=(10);
    this.myUnloadingIcon = "assets/img/mapIcons/legalicon.png";//ok on waste site
    if (this.unloadingOnWasteSite == "N")
    this.myUnloadingIcon = "assets/img/mapIcons/illegalicon.png";
   
    this.DrawPath(this.fromDate, this.toDate);
}


  drawUnloadingPathForAlert( id, alertDate, latitude, longitude) {
    this.DB.endLat=(latitude);
    this.DB.alertId=(id);
    this.DB.endLong=(longitude);
    this.DB.endDate=(alertDate);
   this.myUnloadingIcon = 'assets/img/mapIcons/illegalicon.png';
    this.DB.LastStopTime=(10);
    var self = this;
    this.DrawPath(this.fromDate, this.toDate);
  
}

 getdate(id) {
    var module = 'getContainerData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), containerId: id }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata != null) {
          this.DB.containerId = mydata.containerId;
          this.DB.lastLat = mydata.lastLat;
          this.DB.lastLng = mydata.lastLng;
          this.DB.regNum = mydata.regNum;
          this.DB.locationDate = mydata.locationDate;
          this.DB.mapIcon = mydata.mapIcon;
        }
        setInterval(this.getdataAndDrawwMarkerInfo(), 200);
        //this.showFilterFlag = 'N';
    this.DrawPath(this.fromDate, this.toDate);
      });
  }
  showAdvanceFilter(event) {
    this.showFilterFlag = 'Y';
  }

  cancelAdvanceFilter(event) {
    this.showFilterFlag = 'N';
  }

  selectAdvanceFilter(event) {

    this.showFilterFlag = 'N';
    this.DrawPath(this.fromDate, this.toDate);
  }
  show2datesFilter(event) {
    this.showAdvanceFilter(event);   
  }


  DrawPath(fromD, toD){

    this.titleFromTo = fromD.substring(0, 10) + " => " + toD.substring(0, 10);
    //let mapOptions = {center: new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng), zoom: 11,mapTypeId: google.maps.MapTypeId.ROADMAP  }   
    //if(this.DB.lastLat==0||this.DB.lastLat=="0")
    let mapOptions = { center: new google.maps.LatLng(32, 34.7), zoom: 11, mapTypeId: google.maps.MapTypeId.ROADMAP }

    this.map = new google.maps.Map(document.getElementById("pathMap"), mapOptions);
    var self = this;
    console.log('DrawPath');
    var module = 'getContainerPathWeb2';
    //var request = { logInUserId: Util.getuserId(), securityString: Util.getSecurityString(), containerId: id, fromDate: self.filterFromDate(), toDate: self.filterToDate(), webRequest: true, showDetails: self.showDetails() }
    var params = {};

    if(this.pathType =="Alert"){
         module = 'getUnloadingPathWeb';
         params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), alertId: self.myid, stoppingTime: this.DB.LastStopTime }
        
    }else if(this.pathType =="Unloading"){
        module = 'getImeiUnloadingPathWeb';
        params = { logInUserId:this.aService.getUserId(), securityString: this.aService.getUserSS(), imeiUnloadingDataId: self.myid, stoppingTime: this.DB.LastStopTime }
    }
    else
    params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), containerId: this.DB.containerId, fromDate: fromD, toDate: toD };
    
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        this.DB.lastLat = mydata.lastLat;
        this.DB.lastLng = mydata.lastLng;
        this.DB.locationDate = mydata.locationDate;
        this.DB.mapIcon = mydata.mapIcon;
        this.DB.endLat=  mydata.lastLat;
        this.DB.endLong= mydata.lastLng;
        this.DB.endDate = mydata.locationDate;
       // var self = this;

        this.drawUnloadingPath_Succeeded(data);
        if (mydata == null) {
          this.displayErrorMsg("");
          return;
        }

        this.DB.lastLat =this.DB. endLat//mydata.lastLat;
        this.DB.lastLng =this.DB.endLong //mydata.lastLng;
        this.DB.locationDate = mydata.locationDate;
        this.DB.mapIcon = mydata.mapIcon;
        this.DB.endLat=  mydata.lastLat;
        this.DB.endLong= mydata.lastLng;
        this.DB.endDate = mydata.locationDate;
        var self = this;
      },
      err => this.displayErrorMsg(err)//,() => console.log('getRepos completed')
    );
  }
  private getdataAndDrawwMarkerInfo(): any {
    var self = this;
    google.maps.event.addListenerOnce(this.map, 'idle', function () {
      google.maps.event.trigger(self.map, 'resize');
      let latLng = new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng);
      self.map.panTo(new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng));
      var myIcon = 'assets/img/mapIcons/' + self.DB.mapIcon;
      self.myLocationMarker = new google.maps.Marker({ position: latLng, map: self.map, icon: myIcon });
      var contentString = '<div><p><b>' + self.DB.regNum + '</b></p>' + '<p>' + self.DB.locationDate + '</p>' + '</div>'
      self.infowindow = new google.maps.InfoWindow({ content: contentString });
      self.infowindow.open(self.map, self.myLocationMarker);
    });

    this.map.panTo(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
  }

  drawUnloadingPath_Succeeded = function (resultObject) {
      
    if (resultObject) {
        var self = this;
        this.initMapPlayBack();
        //var ObjData = JSON.stringify(resultObject);
        var obj = this.github.ParseResult(resultObject);

        this.DB.movingCompanyName=obj.movingCompanyName
        this.DB.regNum= obj.regNum ;
      //  this.DB.endLat = obj.lastLat;
      //  this.DB.endLong = obj.lastLng;
        if ((this.userRole == "Inspector") && obj["insideAuthorityArea"] == 0 && obj.webPathArray.length == 0) {
            this.displayErrorMsg ( "No Data For Map", "");
           // document.getElementById("btnPause").disabled = true;
            this.btnPauseEnable=false;
        }

       // var h = window.innerHeight;
       // h = h * 80 / 100 - 30;
        //document.getElementById('googleMapId004').setAttribute("style", "display:block;height:" + h + "px;width:100%");
       // document.getElementById('googleMapId004').style.height = h + 'px';
        var myLatLng1 = {
            lat: Number(this.DB.lastLat), lng: Number(this.DB.lastLng)
        };

        var mapOptions = {
            center: myLatLng1,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            gestureHandling: 'greedy'
        };
        window.setTimeout(function () {
           // this.map.setZoom(11);
        }, 300);
        this.map =new google.maps.Map(document.getElementById("pathMap"), mapOptions);

        google.maps.event.addListenerOnce(self.map, 'idle', function () {
            
            google.maps.event.trigger(self.map, 'resize');
            //draw last location
            var myLatLng1 = {
                lat: Number(self.DB.endLat), lng: Number(self.DB.endLong)
            };

            self.map.panTo(myLatLng1);
            if (!((self.userRole == "Inspector") && obj["insideAuthorityArea"] == 0)) {
                var myLocationMarker = new google.maps.Marker({
                    position: myLatLng1,
                    map:self. map,
                    icon: self.myUnloadingIcon 
                });
                var movingCompanyStr = "";
                if (self.userRole != "MovingCompany")
                    movingCompanyStr = '<p>' + decodeURIComponent(obj.movingCompanyName) + '</p>';
               
                var contentString = '<div><p><b>' + obj.regNum + '</b></p>' + '<p>' + self.DB.locationDate + '</p> ' + movingCompanyStr + '</div>'
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                myLocationMarker.addListener('click', function () {
                    infowindow.open(self.map, myLocationMarker);
                });
                infowindow.open(self.map, myLocationMarker);
            }

        });
        self.clearPathLines();
        for (var i = 0; i < obj.webPathArray.length - 1; i++) {
            var pointA = new google.maps.LatLng(obj.webPathArray[i].lat, obj.webPathArray[i].lng);
            var pointB = new google.maps.LatLng(obj.webPathArray[i + 1].lat, obj.webPathArray[i + 1].lng);
            var PathStyle = new google.maps.Polyline({
                path: [pointA, pointB],
                strokeColor: obj.pointsColor[i] == "" ? "#FF0000" : obj.pointsColor[i],
                strokeOpacity: obj.pointsColor[i] == "#FF0000" || obj.pointsColor[i] == "" ? 1.0 : 0.0,
                strokeWeight: 2,
                map: self.map
            });
            self.PathLines.push(PathStyle);
        }

        self.pathPoints = obj.webPathArray;
        self.pointColor = obj.pointsColor;
        self.insideAuthorityArea = obj["insideAuthorityArea"];
        // lastMarker = null;
        self.map.panTo(myLatLng1);// set new center
    }
    if (self.pathPoints.length == 0)
       this.btnPauseEnable=false;
    else {
       this.btnPauseEnable=true;

        var point = self.pathPoints[0];
        if (point) {
            if (self.pointColor[self.index] != "#FF00FF") {
                var latlng = new google.maps.LatLng(point.lat, point.lng);
                var myIcon = 'assets/img/mapIcons/stop.png?V=154545';
                var startMarker = new google.maps.Marker({
                    position: latlng, map: self.map, icon: myIcon
                });
                //////////////////////////////
                var time = Number(obj['lastStopTime']);
                var timeMsg = "";

                var stopTime = self.minuteToStr(time);
                timeMsg += ("<p><b>" +  this.mylang.Alert.stoppingTime + " :</b>" + stopTime + "<p/>");

                
                var content = '<div><p>' + obj["conatainerLastLocationDate"]  + '</p>' + timeMsg  + '</div>'
                ////////////////////////
                var startInfowindow = new google.maps.InfoWindow({
                    content: content
                });
                startMarker.addListener('click', function () {
                    startInfowindow.open(self.map, startMarker);
                });
                startInfowindow.open(self.map, startMarker);

            }
        }
    }
//this.loadMap();
   // $('#WindowMap2DateForm').modal('show');
}
loadMap() {
    let latLng = new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng);
    let mapOptions = {
      center: latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById("pathMap"), mapOptions);
    this.forTimer =this.PlaySpeed;
  }
  initMapPlayBack = function () {
    if (this.geocoder == null) {
        this.geocoder = new google.maps.Geocoder();
    }
    this.index = 0;
    if (this.forTime) {
        clearInterval(this.forTime);
    }
    this.forTime = null;
    this.zoomIn = true;
    this.lastMarker = null;
    this.clearMap(this.allMarker);
    this.clearMap(this.Lines);
    this.allMarker = [];
    //this.forTimer =this.PlaySpeed; //document.getElementById("PlaySpeed").value;
    //document.getElementById("btnNext").disabled = true;
    this.btnNextEnable = false;
}

  speedSliderChanged = function ( event:any) {
    var speed = event.detail.value
    this.PlaySpeed=speed;
    this.forTimer =speed;//this.PlaySpeed; ;// document.getElementById("PlaySpeed").value;
    var isPlay = !this.btnNextEnable ;
    var self = this;
    if (!isPlay) {
        if (this.forTime) {
            clearInterval(this.forTime);
            this.moveMarker(self);
            this.forTime = setInterval(self.moveMarker, self.forTimer,this);
        }
    }
}

  replay  () {
    this.initMapPlayBack();
   // if (self.DB.alertId() > 0) {
    this.index = 0;
    this.allDistance = 0, this.lastDistanceLat = null, this.lastDistanceLng = null;
        //document.getElementById("btnPause").disabled = false;
        this.btnPauseEnable=true;
    //document.getElementById("btnNext").disabled = true;
    this.btnNextEnable = false;
    if (this.DB.endLat == "") {
        clearInterval(this.forTime);
            //document.getElementById("btnPause").disabled = true;
            this.btnPauseEnable=false;
            //document.getElementById("btnNext").disabled = true;
            this.btnNextEnable = false;
            return;
        }
        if (this.pathPoints.length == 0) {

            this.displayErrorMsg("No Data For Map");
            //document.getElementById("btnPause").disa = true;
            this.btnPauseEnable=false;
            //document.getElementById("btnNext").disabled = true;
            this.btnNextEnable = false;
        }
        if (this.pathPoints.length > 0) {
           // document.getElementById("btnPause").disabled = true;
           this.btnPauseEnable=false;
           // document.getElementById("btnNext").disabled = false;
           this.btnNextEnable = true;
            this.startPlay();
        }
    //}
}

  clearMap = function (arrayObj) {
    if (this.map) {
        try {
            for (var i = 0; i < arrayObj.length; i++) {
                arrayObj[i].setMap(null);
            }
        } catch (err) {
            alert(err);
        }
    }
    arrayObj.length = 0;
}

  clearPathLines = function () {
    if (this.map) {
        try {
            for (var i = 0; i <this. PathLines.length; i++) {
                this.PathLines[i].setMap(null);
            }
        } catch (err) {
            alert(err);
        }
    }
    this.PathLines.length = 0;
    this.PathLines = [];
}

  startPlay  () {
      var self = this;
    this.clearPathLines();
    this.moveMarker(self);
    this.forTime = setInterval(self.moveMarker, self.forTimer,this);
}


  stopPlay(stop) {
    this.clearPathLines();
    var self = this;
    if (stop == 0) {
        this.moveMarker(self);
        this.forTime = setInterval(self.moveMarker, self.forTimer,this);
        this.btnPauseEnable = false;
        this.btnNextEnable = true;
    } else if (stop == 1) {
        clearInterval(self.forTime);
        this.btnPauseEnable = true;
        this.btnNextEnable = false;

    }
}

  moveMarker (self) {
      if (self==undefined)
      self =this;
    if (self.map == null) return;
    var point = self.pathPoints[self.index];
    if (point) {
        if ( self.pointColor[ self.index] != "#FF00FF") {
            var latlng = new google.maps.LatLng(point.lat, point.lng);
            if ( self.index > 0) {
                var pointB = new google.maps.LatLng( self.pathPoints[ self.index - 1].lat,  self.pathPoints[ self.index - 1].lng);
                var PathStyle = new google.maps.Polyline({
                    path: [latlng, pointB],
                    strokeColor:  self.pointColor[ self.index] == "" ? "#FF0000" :  self.pointColor[ self.index],
                    strokeOpacity:  self.pointColor[ self.index] == "#FF0000" ||  self.pointColor[ self.index] == "" ? 1.0 : 0.0,
                    strokeWeight: 2,
                    map:  self.map
                });
                self.Lines.push(PathStyle);
            }
            if ( self.zoomIn) {
                self.map.setCenter(latlng);
             // this.map.setZoom(12);
             self.zoomIn = false;
            } else {
                var LatLngBounds =  self.map.getBounds();
                if (latlng.lat() > LatLngBounds.getSouthWest().lat() && latlng.lng() > LatLngBounds.getSouthWest().lng() && latlng.lat() < LatLngBounds.getNorthEast().lat() && latlng.lng() < LatLngBounds.getNorthEast().lng()) {

                }
                else {
                    self.map.panTo(latlng);
                }
            }

            var isStop = 0;
            var stopMinite = 0;
            if ( self.lastMarker) {
                stopMinite =  self.DateDiff( self.pathPoints[ self.index - 1].cdate, point.cdate);
                if (stopMinite > 10) {
                    isStop = 1;
                }
                var html =  self.GetMarkerInfo(point);
                self.lastMarker.setPosition(latlng);
                self.infowindow.setContent(html);
                if (isStop == 1) {
                    var lastLatlng = new google.maps.LatLng( self.pathPoints[ self.index - 1].lat,  self.pathPoints[ self.index - 1].lng);
                    var stopIcon = 'assets/img/mapIcons/' + "stop.png";
                    var stopMarker = new google.maps.Marker({
                        id: "stop" +  self.index,
                        position: lastLatlng,
                        icon: stopIcon,
                        offset: { x: -5, y: -34 }
                    });
                    stopMarker.setMap(self.map);
                    self.addMarkerListener(stopMarker,  self.pathPoints[ self.index - 1], isStop, stopMinite, point.cdate);
                    self. allMarker.push(stopMarker);
                }
            }
            else {
                var html =  self.GetMarkerInfo(point);
                var icon = './Images/' + "green-ok-icon.png";
                self.lastMarker = new google.maps.Marker({
                    id: "lastMarker",
                    position: latlng,
                });
                self. lastMarker.setMap( self.map);
                self. allMarker.push( self.lastMarker);
                self.infowindow = new google.maps.InfoWindow({
                    content: html
                });
                self.lastMarker.addListener('click', function () {
                    var d = null;
                    if ( self.index >=  self.pathPoints.length)
                        d =  self.pathPoints[ self.pathPoints.length - 1];
                    else d =  self.pathPoints[ self.index];
                    var html =  self.GetMarkerInfo(d);
                    self. infowindow.setContent(html);
                    self.infowindow.open( self.map,  self.lastMarker);
                });
                if ( self.index == 0) {
                    var firstMarker = new google.maps.Marker({
                        id: "start",
                        position: latlng,
                        offset: { x: -5, y: -34 }
                    });
                    firstMarker.setMap( self.map);
                    self.allMarker.push(firstMarker);
                    self.addMarkerListener(firstMarker, point, isStop, stopMinite, point.cdate);
                }
            }
        } else {
            if ( self.index % 50 == 0)
            self.displayErrorMsg(  self.mylang.Container.OutOfAuthorityArea);
        }
        self.index++;
        if ( self.index >=  self.pathPoints.length) {
            clearInterval( self.forTime);
           // document.getElementById("btnPause").disabled = true;
           // document.getElementById("btnNext").disabled = true;
           self.btnPauseEnable = false;
           self.btnNextEnable = false;
           self.displayErrorMsg("סיים");
        }
    } else {
        if ( self.forTime) {
            clearInterval( self.forTime);
        }
    }

}

  addMarkerListener = function (marker, point, isStop, stopMinite, nowDeviceUtcDate) {
    try {
        var contentStr = "";
        contentStr += "<p><b>" +  this.DB.regNum+ "</b><p />";
        contentStr += ("<p>" + point.cdate + "<p/>");
        if (isStop == 1) {
            var stopTime = this.minuteToStr(stopMinite);
            contentStr += ("<p><b>" +  this.mylang.Alert.stoppingTime + " :</b>" + stopTime + "<p/>");
        }
        var inforWindow = new google.maps.InfoWindow({
            content: contentStr
        });
        marker.addListener('click', function () { inforWindow.open(this.map, marker); });
        this.inforwindowArr.push(inforWindow);
    } catch (ex) {
        alert(ex);
    }

}

  DateDiff = function (start, end) {
    try {
        var a :Date = new Date(start);
        var aa = a.getTime();
        var b = new Date(end);
        var bb = b.getTime();
        var ticksspan = bb - aa;
        return ticksspan / 60 / 1000;
    } catch (e) {
      return 0;
    }
}

  minuteToStr = function (  minute:number ) {
    var time = "";
    var day :number = Math.floor(minute / 60 / 24);
    var hour = Math.floor((minute / 60) - (day * 24));
    var minu = Math.floor((minute) - (day * 24 * 60) - (hour * 60));
    if (day > 0) {
        time = day + this.mylang.General.day + " ";
        time += hour + this.mylang.General.hours + " ";
        time += minu + this.mylang.General.minutes + " ";
    } else if (hour > 0) {
        time = hour + this.mylang.General.hours + " ";
        time += minu + this.mylang.General.minutes + " ";
    } else {
        time = minu + this.mylang.General.minutes;
    }
    return time;
}



  GetDirectionName = function (angle) {
    var name = "";
    angle = parseFloat(angle);
    if ((angle >= 0 && angle < 22.5) || (angle >= 337.5 && angle < 360)) // 0
    {
        name = this.mylang.Directions.North;
    }
    else if (angle >= 22.5 && angle < 67.5) {
        name = this.mylang.Directions.northeast;
    }
    else if (angle >= 67.5 && angle < 112.5) {
        name = this.mylang.Directions.East;
    }
    else if (angle >= 112.5 && angle < 157.5) {
        name = this.mylang.Directions.southeast;
    }
    else if (angle >= 157.5 && angle < 202.5) {
        name = this.mylang.Directions.South;
    }
    else if (angle >= 202.5 && angle < 247.5) {
        name = this.mylang.Directions.southwest;
    }
    else if (angle >= 247.5 && angle < 292.5) {
        name = this.mylang.Directions.West;
    }
    else if (angle >= 292.5 && angle < 337.5) {
        name = this.mylang.Directions.northwest;
    }
    else {
        name = "";
    }
    return name;
}



  GetMarkerInfo = function (point) {
    var self = this;
    var disStr = this.mylang.General.m;
    var showDistance = 0;
    var speedStr = "";
    if (point.speed != undefined && point.speed != "") {
        var speed = parseFloat(point.speed);

        speedStr = "<p>" + this.mylang.Container.speed + speed.toFixed(0) + " " + this.mylang.Container.speedUnit;
        if (point.direction != "") {
            var direction = parseFloat(point.direction);
            var dirStr = self.GetDirectionName(direction);
            speedStr += ", " + dirStr;
        }
        speedStr += "</p>";

    }

    if (this.lastDistanceLat) {
        var distance = parseFloat(self.GetDistance(this.lastDistanceLat, this.lastDistanceLng, point.lat, point.lng));
        this.allDistance += distance;
        if (this.allDistance < 1000) {
            disStr = self.mylang.General.m;
            showDistance = this.allDistance;
        } else {
            showDistance = (this.allDistance / 1000);
            disStr = self.mylang.General.km;
        }
        this.showDistance = showDistance.toFixed(2);
    }
    var contentString = "";
    if (!((this.userRole == "Inspector") && this.insideAuthorityArea == 0)) {
        var movingCompanyStr = "";
        if (this.userRole != "MovingCompany")
            movingCompanyStr = '<p>' + self.DB.movingCompanyName + '</p>';

        contentString = '<div><p><b>' + self.DB.regNum+ '</b></p>' + '<p>' + point.cdate + '</p>' + speedStr + movingCompanyStr + '</div>'
    }


    this.lastDistanceLat = point.lat;
    this.lastDistanceLng = point.lng;
    return contentString;
}

  closeMap = function () {
    this.clearMap(this.allMarker);
    this.allMarker = [];
    this.map = null;
    if (this.forTime) {
        clearInterval(this.forTime);
    }
    this.forTime = null;
}

  closeWindow = function () {
    for (var i = 0; i < this.inforwindowArr.length; i++) {
      this.inforwindowArr[i].close();
    }
    this.inforwindowArr.length = 0;
}

  GetDistance = function (lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 =  this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b =  this.Rad(lng1) -  this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 * 1000;
    return s;
}

  Rad(d) {
    return d * Math.PI / 180.0;
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

   //------General Funcations
   cancel(event) {
    // this.navCtrl.navigateBack('/alerts');
    this.stopPlay(1);
    this.modalController.dismiss(null);
  }
}
