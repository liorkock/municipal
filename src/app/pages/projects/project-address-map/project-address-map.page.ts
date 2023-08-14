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
//import { debugOutputAstAsTypeScript } from '@angular/compiler';

declare var google: any;


@Component({
  selector: 'app-project-address-map',
  templateUrl: './project-address-map.page.html',
  styleUrls: ['./project-address-map.page.scss'],
})
export class ProjectAddressMapPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  public mylang;
  public DB;
  public myLocationMarker = null;
  public infowindow;
  public flightPath = null;
  public  geocoder = null;
  public geoMarker;

  public  townAndAddress = null;
  public  townWithOutAddress = null;
  //public myid=0;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private activatedRoute: ActivatedRoute, private location: Location, private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();
    //variable declration
   //variable declration
        this.DB={};            
        this.DB.projectLat=0;
        this.DB.projectLng=0;     
        this.DB.townDesc ="";
        this.DB.projectAddress="";
        this.DB.projectOrginalFullAddress="";

        this.townAndAddress="";
        this.townWithOutAddress="";
        

        this.DB.projectLat= navParams.get('projectLat');
        this.DB.projectLng= navParams.get('projectLng');
        this.DB.townDesc= navParams.get('townDesc');
        this.DB.projectAddress= navParams.get('projectAddress');    
        this.DB.projectOrginalFullAddress= navParams.get('projectOrginalFullAddress');  

            

        this.townAndAddress = "ישראל" + " , " + "ישוב" + " " +  this.DB.townDesc+ ", " + this.DB.projectAddress;
        this.townWithOutAddress = "ישראל" + " , " + "ישוב" + " " +  this.DB.townDesc;


        this.DB.postalCode='';
        this.DB.postalTown='';

        this.DB.postalCode= navParams.get('postalCode');
        this.DB.postalTown= navParams.get('postalTown');

        if( this.mylang.currentLang!='Heb')
        {
             this.townAndAddress = this.DB.projectAddress;
             this.townWithOutAddress =  this.DB.townDesc;    
                        
        }
        

        this.geoMarker=null;
        this.geocoder= new google.maps.Geocoder();

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.loadMap();
      this.openMapAddress();
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

  private openMapAddress(): any {
    var self = this;
    if (this.DB.townDesc=="" && this.mylang.currentLang=='Heb')
        {
            this.displayErrorMsg( this.mylang.Validation.TownIsMandatory);
            this.cancel(null);
            return;
        }


       
        var self= this;

        if(this.DB.projectLat != ""  && this.DB.projectOrginalFullAddress!='' && (this.DB.projectOrginalFullAddress==(this.DB.townDesc+this.DB.projectAddress)))
        {
            self.openMapAddressDrawMarker(self);
            return;
        }

         
        if(this.DB.projectLat != ""  && this.DB.projectOrginalFullAddress=='')
        {
            self.openMapAddressDrawMarker(self);
            return;
        }

        var defaultTown=self.townAndAddress;
        if (this.DB.townDesc=="" && this.mylang.currentLang!='Heb')
        {
               defaultTown='London';
        }

         //option 2 new Project
       this.geocoder.geocode({ 'address': defaultTown }, function (results, status) {
           if (status == google.maps.GeocoderStatus.OK) {
               self.DB.projectLat=results[0].geometry.location.lat();
               self.DB.projectLng=results[0].geometry.location.lng();

               self.openMapAddressDrawMarker(self);

           } else
           {
               
               self.geocoder.geocode({ 'address': self.townWithOutAddress }, function (results, status) {
                   if (status == google.maps.GeocoderStatus.OK) {
                        self.DB.projectLat=results[0].geometry.location.lat();
                        self.DB.projectLng=results[0].geometry.location.lng();
                        self.openMapAddressDrawMarker(self);
                   } else {
                       self.displayErrorMsg("google map Error" + status);
                   }
               });
           }
       });
  }


  openMapAddressDrawMarker(self) {                
    if (self.geoMarker!=null)
         self.geoMarker.setMap(null); 
    //google.maps.event.addListenerOnce(this.map, 'idle', function () {           
        let latLng = new google.maps.LatLng(self.DB.projectLat, self.DB.projectLng);
        google.maps.event.trigger(self.map, 'resize');            
        self.map.panTo( new google.maps.LatLng( self.DB.projectLat, self.DB.projectLng));           
        var myIcon = "assets/img/mapIcons/projectAddressIcon.png";
        self.geoMarker = new google.maps.Marker({position:latLng, map:self.map, icon:myIcon});
   // });  

    google.maps.event.addListener(self.map, 'click', function (event) {               
        self.geoMarker.setPosition(event.latLng);
        self.reverseAddress(self);
    });
}

gotoLocation(event) {
    var self=this;
    //option 2 new Project
    this.geocoder.geocode({ 'address': self.townAndAddress }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            self.DB.projectLat=results[0].geometry.location.lat();
            self.DB.projectLng=results[0].geometry.location.lng();                
            self.openMapAddressDrawMarker(self);
            self.setProjectAddress(self);

        } else
             self.displayErrorMsg("google map Error" + status);
    });       
}

reverseAddress = function (self) {
    self.DB.projectLat=self.geoMarker.getPosition().lat();
    self.DB.projectLng=self.geoMarker.getPosition().lng();        
    self.setProjectAddress(self);
}


setProjectAddress = function(self){

    var my_region="he";
    if( this.mylang.currentLang!='Heb')
        my_region="en";

    var reversLatlng = new google.maps.LatLng(self.DB.projectLat, self.DB.projectLng);
    self.geocoder.geocode({ 'latLng': reversLatlng, 'region': my_region }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var newAddress = results[0].formatted_address;
            newAddress = newAddress.replace("ישראל", "");
            newAddress = newAddress.replace(self.DB.townDesc, "");
            newAddress = newAddress.replace("  ", " ");
            newAddress = newAddress.replace("  ", " ");
            newAddress = newAddress.replace(",", "");
            newAddress = newAddress.replace(",", "");
            newAddress = newAddress.replace(",", "");
            if (newAddress.includes("Unnamed") || newAddress.includes("Unnamed"))
                newAddress = "";
            self.DB.projectAddress=newAddress;

            self.DB.postalCode='';
            self.DB.postalTown='';

            for (var i=0; i< results[0].address_components.length; i++)
            {   
                if (results[0].address_components[i].types[0] == "locality" || results[0].address_components[i].types[0] =="postal_town")
                    self.DB.postalTown=results[0].address_components[i]["long_name"];                    
                if (results[0].address_components[i].types[0] == "postal_code")
                    self.DB.postalCode=results[0].address_components[i]["long_name"];
            }


        } else
            self.DB.projectAddress="";
    });
}

  //------General Funcations
  cancel(event) {
    // this.navCtrl.navigateBack('/alerts');
    this.modalController.dismiss(null);
  }

  closeForm(event) {  
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

}

