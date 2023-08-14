import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../services/authentication-service'
import {GitHubService} from '../../../services/git-hub-service';
import {Lang} from '../../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { ModalController,NavParams } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-alert-map-form',
  templateUrl: './alert-map-form.page.html',
  styleUrls: ['./alert-map-form.page.scss'],
})
export class AlertMapFormPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  public mylang;
  public DB;  
  public myLocationMarker=null;
  public infowindow;
  public flightPath=null;
  public myid=0;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private activatedRoute: ActivatedRoute,private location: Location,private navCtrl: NavController,public modalController: ModalController,public navParams: NavParams) {
    this.mylang= new Lang();
    //variable declration
    this.DB={};            
    this.DB.lastLat=-34.9290;
    this.DB.lastLng=138.6010;        
    this.DB.locationDate="";       
    this.DB.regNum="";  
    this.DB.alertTypeId
    this.DB.stoppingTime="";    


    if(this.mylang.currentLang=='Heb')
    {
      this.DB.lastLat = 32.0755;
      this.DB.lastLng = 34.788;
    }
    this.myid=navParams.get('myid')
    
  }

  ngOnInit() {
    
  }

  ionViewDidEnter()
  {   
      //console.log('ionViewDidEnter');
      //this.loadMap();        
      setTimeout(() => {
        this.loadMap();
        this.getdate(this.myid);       
      }, 200);
      
  } 
  

  getdate(id) {
    var module='getAlertData';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), alertId:id }
    this.github.getRepos(module,params).subscribe(
            data => {
                console.log('getAlertData data arrive');
                var mydata=this.github.ParseResult(data);
                if(mydata!=null)
                {
                    this.DB.lastLat=mydata.latitude;
                    this.DB.lastLng=mydata.longitude;
                    this.DB.regNum=mydata.regNum;
                    this.DB.locationDate=mydata.alertDate;
                    this.DB.alertTypeId=mydata.alertTypeId;     
                    this.DB.stoppingTime=mydata.stoppingTime; 
                }   
                setTimeout(() => {
                  this.getdataAndDrawwMarkerInfo()
                }, 50);
            });
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng);    
    let mapOptions = {
    center: latLng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }    
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);    
}



private getIconImage()
{
  var myIcon =  "http://maps.google.com/mapfiles/kml/pal3/icon33.png";

  if(this.DB.alertTypeId==1)
      myIcon='assets/img/mapIcons/mapBattaryAlarm.png';
  if(this.DB.alertTypeId==2)
      myIcon='assets/img/mapIcons/illegalicon.png';
  if(this.DB.alertTypeId==3)
      myIcon='assets/img/mapIcons/mapDropAlarm.png';
  if(this.DB.alertTypeId==4)
      myIcon='assets/img/mapIcons/mapLongParked.png';
  if(this.DB.alertTypeId==5)
      myIcon='assets/img/mapIcons/mapParkedOutsideProject.png';
 if(this.DB.alertTypeId==6)
      myIcon='assets/img/mapIcons/stop.png';
 if(this.DB.alertTypeId==7)
      myIcon='assets/img/mapIcons/mapoutOfBorder.png';
 if(this.DB.alertTypeId==8)
      myIcon='assets/img/mapIcons/outWorkTime.png';
    return myIcon;
}

private getStopTimeContent()
{
  var stopTimeContent="";
  var self=this;
  if(self.DB.alertTypeId==6)
        {
            if(self.DB.stoppingTime!=undefined && self.DB.stoppingTime!='')
                {
                    var time = Number(self.DB.stoppingTime);
                    if (time > 60)
                       {
                            var hours = Math.floor(time / 60);
                            var minutes = time % 60;
                            self.DB.stoppingTime=hours+":"+minutes + ' '+self.mylang.General.hours;
                       }
                    else
                        self.DB.stoppingTime=time +' '+ self.mylang.General.minutes;

                    stopTimeContent="<p>"+self.mylang.Alert.stoppingTime+" "+self.DB.stoppingTime+ "</p>"
                }
        }
    return stopTimeContent;
}

private getdataAndDrawwMarkerInfo():any {
        var self=this;

        var myIcon=this.getIconImage();
        var stopTimeContent=this.getStopTimeContent();
        let latLng = new google.maps.LatLng(self.DB.lastLat, self.DB.lastLng);
        
        
        //to be check instead of idle event
        //this.map.addListener('tilesloaded', () => {          console.log('accuracy',this.map);   
        
        google.maps.event.addListenerOnce(this.map, 'idle', function () {
          google.maps.event.trigger(self.map, 'resize');
          var direction = "ltr";
          if(self.mylang.currentLang=='Heb')
              direction = "rtl";
          self.map.panTo( new google.maps.LatLng( self.DB.lastLat, self.DB.lastLng ) );
          self.myLocationMarker = new google.maps.Marker({position: latLng,map: self.map,icon:myIcon});
          var contentString="<div style='margin-left: 15px;' dir='" + direction + "'><p><b>"+self.DB.regNum+'</b></p>'+'<p>'+self.DB.locationDate+'</p>'+stopTimeContent+'</div>'
          self.infowindow = new google.maps.InfoWindow({content: contentString });            
          self.infowindow.open(self.map, self.myLocationMarker); 
          });
          this.map.panTo(new google.maps.LatLng(this.DB.lastLat, this.DB.lastLng));
}

  //------General Funcations
  cancel(event) {      
   // this.navCtrl.navigateBack('/alerts');
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



//helper web sites
//https://www.freakyjolly.com/ionic-4-add-google-maps-geolocation-and-geocoder-in-ionic-4-native-application/