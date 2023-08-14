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

//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
//import { DrawPathPage } from '../../draw-path/draw-path.page';


declare var google: any;
@Component({
  selector: 'app-container-map-form',
  templateUrl: './container-map-form.page.html',
  styleUrls: ['./container-map-form.page.scss'],
})
export class ContainerMapFormPage implements OnInit {

   @ViewChild('map',{ static: true }) mapElement: ElementRef;
  map: any;
  private markers = [];
  public mylang;
  public DB;

  public myLocationMarker = null;
  public infowindow;
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
  public showEmptyBatary;
public geocoder = null;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams,private geoloc: Geolocation, private launchNavigator:LaunchNavigator) {
  this.geocoder= new google.maps.Geocoder();
    this.mylang = new Lang();
    this.DB = {};
    this.DB.containerId = 0;
    this.DB.lastLat = -34.9290;
    this.DB.lastLng = 138.6010;
    this.DB.locationDate = "";
    this.DB.regNum = "";
    this.DB.mapIcon = "";
    this.DB.totalvolume ="";
    this.DB.movingCompanyName = "";
    this.DB.containerAddress = "";
    this.DB.clientName = "";
    this.DB.batarylevel="";
    if(this.mylang.currentLang=='Heb')
    {
      this.DB.lastLat = 32.0755;
      this.DB.lastLng = 34.788;
    }

    var d = new Date();
    d.setDate(d.getDate() - 1);
    this.fromDate = d.toISOString();
    this.toDate = new Date().toISOString();
    this.showFilterFlag = 'N';
    this.myid = navParams.get('myid');
    this.showFilterFlag = navParams.get('showFilterFlag');


    if (this.showFilterFlag == 'takeFromPrevPage') {
      this.showEmptyBatary= navParams.get('showEmptyBatary');
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
 //this.initMapDefintions();    
    setTimeout(() => {
      this.initMapDefintions();       
    }, 200);


 /*setTimeout(() => {
        this.loadMap();
        this.getdate(this.myid);       
      }, 200);*/
   
  }

  initMapDefintions()
  {
     //let options = {timeout: 10000, enableHighAccuracy: true};
   //this.geoloc.getCurrentPosition(options).then((resp) =>
   
    if (this.showFilterFlag == 'takeFromPrevPage') {
      this.loadMap_AllContainers();
      this.DrawAllContainers();
    //  this.geoloc.getCurrentPosition().then((resp) => {    
      Geolocation.getCurrentPosition().then((resp) => {   
        const pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        };   
        this.map.setCenter(pos);            
        this.map.panTo( new google.maps.LatLng( resp.coords.latitude, resp.coords.longitude ) );
        }).catch((error) => {
        console.log('Error getting location', error);
      });

    }
    else {
      this.loadMap();
      this.getdate(this.myid);
    }
    

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
          this.DB.batarylevel = mydata.batarylevel;
          
          this.DB.totalvolume = mydata.totalvolume;
          this.DB.movingCompanyName = mydata.movingCompanyName;
          this.DB.containerAddress = mydata.containerAddress;
          this.DB.clientName = mydata.clientName;
         // var projectAddress = mydata.projectAddress;

             this.DB.containerAddress =mydata.projectAddress;
                        if (this.DB.clientName!='')
                            this.DB.containerAddress = this.DB.clientName + ", " + this.DB.containerAddress;

        }
        setTimeout(() => {
        this.clearLocations();
          this.getdataAndDrawwMarkerInfo()
        }, 50);
      });
  }

  clearLocations() {
            for (var i = 0; i < this.markers.length; i++) {
               this.markers[i].setMap(null);
            }
            this.markers.length = 0;
        }

  loadMap() {
    let latLng = new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng);
    let mapOptions = {
      center: latLng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
        //this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
  }

  loadMap_AllContainers() {
    let latLng = new google.maps.LatLng(32.07, 34.78 );
    let mapOptions = { center: latLng, zoom: 12, mapTypeId: google.maps.MapTypeId.ROADMAP }
    if (this.findInArround)
      mapOptions = { center: latLng, zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP }
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  private getdataAndDrawwMarkerInfo(): any {
    var self = this;
    google.maps.event.addListenerOnce(this.map, 'idle', function () {
      google.maps.event.trigger(self.map, 'resize');
      let latLng = new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng);
      self.map.panTo(new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng));
      var myIcon = 'assets/img/mapIcons/' + self.DB.mapIcon;
     // self.myLocationMarker = new google.maps.Marker({ position: latLng, map: self.map, icon: myIcon });
    //  var contentString = '<div><p><b>' + self.DB.regNum + '</b></p>' + '<p>' + self.DB.locationDate + '</p>' + '</div>'
    //  self.infowindow = new google.maps.InfoWindow({ content: contentString });
    //  self.infowindow.open(self.map, self.myLocationMarker);
    var batarylevelIcon = "";
          if (self.DB.batarylevel > 90)//100,6
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery100_2x.png"/>';// + obj.batarylevel + '% </div>';
                    else if (self.DB.batarylevel > 70)//80,5
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery80_2x.png"/> ';// + obj.batarylevel + '%</div>';
                    else if (self.DB.batarylevel > 55)//60,4
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery60_2x.png"/> ';// + obj.batarylevel + '% </div>';
                    else if (self.DB.batarylevel > 30)//40,3
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery40_2x.png"/>';//+ obj.batarylevel + '% </div>';
                    else if (self.DB.batarylevel > 15)//20,2
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery20_2x.png"/> ';// + obj.batarylevel + '%</div>';
                    else if (self.DB.batarylevel > 5)//10,1
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery0_2x.png"/>';// + obj.batarylevel + '% </div>';
                    else //if (!self.DB.batarylevel) obj.batarylevel = "0";
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;" height="22" width="22" src="assets/img/battery/battery0_2x.png"/>';//+ obj.batarylevel + '%</div>';

            
          var movingCompanyStr = "";
                    if (self.aService.getUserRole() != "MovingCompany")
            movingCompanyStr = '<p>' + self.DB.movingCompanyName + '</p>';
            
            
          var newAddress = self.DB.containerAddress;
                    if (newAddress == "")
                        newAddress = "####";
            
            
          var direction = "ltr";
          if( self.mylang.currentLang=='Heb')
            direction = "rtl";
                    var m3 = self.mylang.General.M3 ;
                    var contentString = '<div style="margin-left: 10px;" dir="'+direction+'"><p><b style="vertical-align: super;">' + self.DB.regNum + ", <span  dir='" + direction + "'>" + self.DB.totalvolume + m3 + '</span></b>' + batarylevelIcon + '</p>' + '<p>' + self.DB.locationDate + '</p><p>' + newAddress + '</p>' + self.DB.movingCompanyName + '</div>';
                
           var lat = self.DB.lastLat;
                    var lng = self.DB.lastLng;
                    var content = {contentMsg:contentString,lat:lat,lng:lng,containerAddress:newAddress};

                         var infowindow = new google.maps.InfoWindow();
                    var marker = new google.maps.Marker({position: latLng,map: self.map,icon:myIcon});
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                        return function () {

                            if (content.containerAddress == "####") {
                                // self.getContainerAddress(content.lat, content.lng);
                                var reversLatlng = new google.maps.LatLng(content.lat, content.lng);
                                //  self.calculateDistance();
                               // var mapLang = Util.getLanguage();
                                self.geocoder.geocode({
                                    'latLng': reversLatlng, 'region': 'IL'
                                }, function (results, status) {
                                    var newAddress = "";
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        newAddress = results[0].formatted_address;
                                        newAddress.toString();
                                        //if (mapLang == "he")
                                            newAddress = newAddress.replace("ישראל", "");
                                       // else
                                         //   newAddress = newAddress.replace("UK", "");
                                        newAddress = newAddress.replace("ישראל", "");
                                        newAddress = newAddress.replace("  ", " ");
                                        newAddress = newAddress.replace("  ", " ");
                                        newAddress = newAddress.replace(",", "");
                                        newAddress = newAddress.replace(",", "");
                                        newAddress = newAddress.replace(",", "");

                                    }
                                    infowindow.setContent(content.contentMsg.replace("####", newAddress));
                                    infowindow.open(self.map, marker);
                                });
                            }
                            else {
                                infowindow.setContent(content.contentMsg.replace("####", ""));
                                infowindow.open(self.map, marker);
                            }
                        };
                    })(marker, content, infowindow));

                    self.markers.push(marker); 


    });

    this.map.panTo(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
  }


  private getIconImage() {
    return '';
  }


  wazeIt(event) {    
    let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
    this.launchNavigator.navigate([ this.DB.lastLat, this.DB.lastLng ])//,options
    .then(
        success => console.log('Launched navigator'),
        error =>   this.displayErrorMsg(error)  
    );
  }

 /* async DrawPath_2(fromD, toD) {

    const modal = await this.modalController.create({
      component: DrawPathPage,
      componentProps: {
        'myid': this.DB.containerId,'showFilterFlag':'Y'
      }
    });
    return await modal.present();
  }*/

  DrawPath(fromD, toD) {

    this.titleFromTo = fromD.substring(0, 10) + " => " + toD.substring(0, 10);
    //let mapOptions = {center: new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng), zoom: 11,mapTypeId: google.maps.MapTypeId.ROADMAP  }   
    //if(this.DB.lastLat==0||this.DB.lastLat=="0")
    let mapOptions = { center: new google.maps.LatLng(32, 34.7), zoom: 11, mapTypeId: google.maps.MapTypeId.ROADMAP }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    console.log('DrawPath');
    var module = 'getContainerPath';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), containerId: this.DB.containerId, fromDate: fromD, toDate: toD }
    this.github.getRepos(module, params).subscribe(
      data => {

        var mydata = this.github.ParseResult(data);
        if (mydata == null) {
          this.displayErrorMsg("");
          return;
        }

        this.DB.lastLat = mydata.lastLat;
        this.DB.lastLng = mydata.lastLng;
        this.DB.locationDate = mydata.locationDate;
        this.DB.mapIcon = mydata.mapIcon;
        var self = this;
        var direction = "ltr";
        if( self.mylang.currentLang=='Heb')
            direction = "rtl";
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
          google.maps.event.trigger(self.map, 'resize');
          if (self.DB.lastLat != 0) {
            let latLng = new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng);
            self.map.panTo(new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng));
            //var myIcon='assets/img/mapIcons/'+self.DB.mapIcon;

            self.myLocationMarker = new google.maps.Marker({ position: latLng, map: self.map });//, icon:myIcon
            var contentString = '<div  style="margin-left: 10px;" dir="'+direction+'"><p><b>' + self.DB.regNum + '</b></p>' + '<p>' + self.DB.locationDate + '</p>' + '</div>'
            self.infowindow = new google.maps.InfoWindow({ content: contentString });
            self.infowindow.open(self.map, self.myLocationMarker);
          }
        });

        /*
        var flightPath = new google.maps.Polyline({
            path: mydata.pathArray,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
         flightPath.setMap(this.map);  
        */

        for (var i = 0; i < mydata.pathArray.length - 1; i++) {
          var PathStyle = new google.maps.Polyline({
            path: [mydata.pathArray[i], mydata.pathArray[i + 1]],
            strokeColor: mydata.pointsColor[i] == "" ? "#FF0000" : mydata.pointsColor[i],
            strokeOpacity: mydata.pointsColor[i] == "#FF0000" || mydata.pointsColor[i] == "" ? 1.0 : 0.0,
            strokeWeight: 2,
            map: self.map
          });
        }



        //now we will draw the projects
        for (var myProject in mydata.pathProjectContainers) {
          if (mydata.pathProjectContainers[myProject].projectLat == "")
            continue;
          var myIcon = 'assets/img/mapIcons/onProjectIcon.png';
          
          var content = '<div style="margin-left: 10px;" dir="'+direction+'"><p>' + self.mylang.ProjectContainer.insertDate + ": " + mydata.pathProjectContainers[myProject].insertDate + " </p><p>" + self.mylang.ProjectContainer.existDate + ": " + mydata.pathProjectContainers[myProject].existDate + '</p>' + '<p>' + mydata.pathProjectContainers[myProject].clientName + '</p>' + '<p>' + mydata.pathProjectContainers[myProject].projectAddress + '</p>' + '</div>';

          //var content = '<div  style="margin-left: 10px;" dir="'+direction+'">' + mydata.pathProjectContainers[myProject].insertDate + '</p>' + '<p>' + mydata.pathProjectContainers[myProject].projectAddress + '</p>' + '</div>'
          var infowindow = new google.maps.InfoWindow();
          var myLatLng = { lat: Number(mydata.pathProjectContainers[myProject].projectLat), lng: Number(mydata.pathProjectContainers[myProject].projectLng) };
          var marker = new google.maps.Marker({ position: myLatLng, map: self.map, icon: myIcon });//pinImage
          infowindow.setContent(content);
          google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
              infowindow.setContent(content);
              infowindow.open(self.map, marker);
            };
          })(marker, content, infowindow));
        }


        //now we will draw the imeiUnloading
        for (var myunload in mydata.pathImeiUnloading) {
          if (mydata.pathImeiUnloading[myunload].latitude == "")
            continue;

          var myIcon = 'assets/img/mapIcons/legalicon.png';
          if (mydata.pathImeiUnloading[myunload].unloadingOnWasteSite == "N")
            myIcon = 'assets/img/mapIcons/illegalicon.png';

 var content = '<div style="margin-left: 10px;" dir="'+direction+'"><p>' + mydata.pathImeiUnloading[myunload].trigerDate + '</p><p>' + mydata.pathImeiUnloading[myunload].wasteSiteName + '</p><p>' + mydata.pathImeiUnloading[myunload].locationAsGoogle + '</p>' + '</div>';

 //         var content = '<div  style="margin-left: 10px;" dir="'+direction+'">' + mydata.pathImeiUnloading[myunload].trigerDate + '</p>' + '<p>' + mydata.pathImeiUnloading[myunload].locationAsGoogle + '</p>' + '</div>'
          var infowindow = new google.maps.InfoWindow();
          var myLatLng = { lat: Number(mydata.pathImeiUnloading[myunload].latitude), lng: Number(mydata.pathImeiUnloading[myunload].longitude) };
          var marker = new google.maps.Marker({ position: myLatLng, map: self.map, icon: myIcon });//pinImage
          infowindow.setContent(content);
          google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
              infowindow.setContent(content);
              infowindow.open(self.map, marker);
            };
          })(marker, content, infowindow));
        }



        //now we will draw the Alerts stops
        for (var stoAlert in mydata.stoppingAlerts) {
          if (mydata.stoppingAlerts[stoAlert].longitude == "")
            continue;
          var myIcon = 'assets/img/mapIcons/stop.png';
          var content = '<div  style="margin-left: 10px;" dir="'+direction+'">' + mydata.stoppingAlerts[stoAlert].alertDate + '</p>' + '<p>' + mydata.stoppingAlerts[stoAlert].address + '</p>' + '</div>'
          var infowindow = new google.maps.InfoWindow();
          var myLatLng = { lat: Number(mydata.stoppingAlerts[stoAlert].latitude), lng: Number(mydata.stoppingAlerts[stoAlert].longitude) };
          var marker = new google.maps.Marker({ position: myLatLng, map: self.map, icon: myIcon });//pinImage
          infowindow.setContent(content);
          google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            return function () {
              infowindow.setContent(content);
              infowindow.open(self.map, marker);
            };
          })(marker, content, infowindow));
        }

      self.map.panTo(new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng));

      },
      err => this.displayErrorMsg(err)//,() => console.log('getRepos completed')
    );
  }


  moveMarker() {
    this.map.panTo(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
    this.myLocationMarker.setPosition(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
    var contentString = '<div><p>*<b>' + this.DB.regNum + '</b></p>' + '<p>' + this.DB.locationDate + '</p>' + '</div>'
    this.infowindow.setContentHTML(contentString);
  };


  DrawAllContainers() {        
    
    var module='getContainerList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: this.filterInput,filterMovingCompanyId:this.filterMovingCompanyId,filterContainerState:this.filterContainerState,findInArround:this.findInArround,currentLocationLat:this.currentLocationLat , currentLocationLng:this.currentLocationLng ,showEmptyBatary: this.showEmptyBatary }       
    this.github.getRepos(module,params).subscribe(
            data => {

                var mydata=this.github.ParseResult(data);                   
                if(mydata==null)
                    {
                        this.displayErrorMsg("");
                        return;
                    }
                    this.clearLocations();
                    var self=this;
                    var arrayLength = mydata.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (mydata[i].lastLat != "" && mydata[i].lastLng != "") {
                            let latLng = new google.maps.LatLng(mydata[i].lastLat, mydata[i].lastLng);
                            //var myIcon='https://maps.google.com/mapfiles/kml/shapes/library_maps.png'
                            var myIcon='assets/img/mapIcons/'+mydata[i].mapIcon;
var batarylevelIcon = "";
          if (mydata[i].batarylevel > 90)//100,6
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery100_2x.png"/>';// + obj.batarylevel + '% </div>';
                    else if (mydata[i].batarylevel > 70)//80,5
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery80_2x.png"/> ';// + obj.batarylevel + '%</div>';
                    else if (mydata[i].batarylevel > 55)//60,4
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery60_2x.png"/> ';// + obj.batarylevel + '% </div>';
                    else if (mydata[i].batarylevel > 30)//40,3
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery40_2x.png"/>';//+ obj.batarylevel + '% </div>';
                    else if (mydata[i].batarylevel > 15)//20,2
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery20_2x.png"/> ';// + obj.batarylevel + '%</div>';
                    else if (mydata[i].batarylevel > 5)//10,1
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;"  height="22" width="22" src="assets/img/battery/battery0_2x.png"/>';// + obj.batarylevel + '% </div>';
                    else //if (!mydata[i].batarylevel) obj.batarylevel = "0";
                        batarylevelIcon = '<img style=" margin-right: 10px;margin-left:10px;" height="22" width="22" src="assets/img/battery/battery0_2x.png"/>';//+ obj.batarylevel + '%</div>';

            
          var movingCompanyStr = "";
                    if (self.aService.getUserRole() != "MovingCompany")
            movingCompanyStr = '<p>' + mydata[i].movingCompanyName + '</p>';
            
            
          var newAddress = mydata[i].containerAddress;
                    if (newAddress == "")
                        newAddress = "####";
            
            
          var direction = "rtl";
                    var m3 = this.mylang.General.M3 ;
                    var contentString = '<div style="margin-left: 10px;direction: rtl;"><p><b style="vertical-align: super;">' + mydata[i].regNum + ", <span  dir='" + direction + "'>" + mydata[i].totalvolume + m3 + '</span></b>' + batarylevelIcon + '</p>' + '<p>' + mydata[i].locationDate + '</p><p>' + newAddress + '</p>' + mydata[i].movingCompanyName + '</div>';
                
           var lat = mydata[i].lastLat;
                    var lng = mydata[i].lastLng;
                    var content = {contentMsg:contentString,lat:lat,lng:lng,containerAddress:newAddress};

                         var infowindow = new google.maps.InfoWindow();
                    var marker = new google.maps.Marker({position: latLng,map: self.map,icon:myIcon});
                    self.markers.push(marker); 
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                        return function () {

                            if (content.containerAddress == "####") {
                                // self.getContainerAddress(content.lat, content.lng);
                                var reversLatlng = new google.maps.LatLng(content.lat, content.lng);
                                //  self.calculateDistance();
                               // var mapLang = Util.getLanguage();
                                self.geocoder.geocode({
                                    'latLng': reversLatlng, 'region': 'IL'
                                }, function (results, status) {
                                    var newAddress = "";
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        newAddress = results[0].formatted_address;
                                        newAddress.toString();
                                        //if (mapLang == "he")
                                            newAddress = newAddress.replace("ישראל", "");
                                       // else
                                         //   newAddress = newAddress.replace("UK", "");
                                        newAddress = newAddress.replace("ישראל", "");
                                        newAddress = newAddress.replace("  ", " ");
                                        newAddress = newAddress.replace("  ", " ");
                                        newAddress = newAddress.replace(",", "");
                                        newAddress = newAddress.replace(",", "");
                                        newAddress = newAddress.replace(",", "");

                                    }
                                    infowindow.setContent(content.contentMsg.replace("####", newAddress));
                                    infowindow.open(self.map, marker);
                                });
                            }
                            else {
                                infowindow.setContent(content.contentMsg.replace("####", ""));
                                infowindow.open(self.map, marker);
                            }
                        };
                    })(marker, content, infowindow));
                    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //jamal 22012017 disable apnto last container
                            //https://ionicframework.com/docs/v2/native/geolocation/
                            //self.map.panTo( new google.maps.LatLng( mydata[i].lastLat, mydata[i].lastLng ) );
                         //   var marker = new google.maps.Marker({position: latLng,map: self.map,icon:myIcon});
                          //  var content='<div><p><b>'+mydata[i].regNum+'</b></p>'+'<p>'+mydata[i].locationDate+'</p>'+'</div>';
                           // if(this.userRole!="MovingCompany")
                             //   content='<div><p><b>'+mydata[i].regNum+'</b></p>'+'<p>'+mydata[i].locationDate+'</p>'+'<p>'+mydata[i].movingCompanyName+'</p>'+'</div>';
                            //var infowindow = new google.maps.InfoWindow({content: content });

                            //google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                              //                      return function () {
                                //                        infowindow.setContent(content);
                                  //                      infowindow.open(self.map, marker);
                                    //                };
                                      //          })(marker, content, infowindow));
                            //self.infowindow.open(self.map, self.myLocationMarker); 
                            //this.map.panTo(new google.maps.LatLng(mydata[i].lastLat, mydata[i].lastLng));
                        }
                    }
                    google.maps.event.addListenerOnce(this.map, 'idle', function () {
                        google.maps.event.trigger(self.map, 'resize');                            
                     });

                     //to be check why it is not working
                  
                    //Geolocation.getCurrentPosition().then((resp) => {
                /*    this.geoloc.getCurrentPosition().then((resp) => {    
                      const pos = {
                        lat: resp.coords.latitude,
                        lng: resp.coords.longitude,
                      };   
                      self.map.setCenter(pos);            
                      self.map.panTo( new google.maps.LatLng( resp.coords.latitude, resp.coords.longitude ) );
                      }).catch((error) => {
                      console.log('Error getting location', error);
                    });*/

            },
            err => this.displayErrorMsg(err)
    );
}


  showAdvanceFilter(event) {
    //this.showFilterFlag = 'Y';
    this.DrawPath(this.fromDate, this.toDate);
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
