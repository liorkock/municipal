import { Component, OnInit,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.page.html',
 // styleUrls: ['./location-search.page.scss'],
})
export class LocationSearchPage implements OnInit {

  public mylang;
 
  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: Array<{}>;
  
  public userRole;
  

  public service;  
  public autocompleteItems;
  public autocomplete;
  geo: any;
  latitude: number = 0;
  longitude: number = 0;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController, private zone: NgZone) 
  {
    this.mylang= new Lang();
    this.items = [];
    this.myInput2='';
  
    this.userRole=this.aService.getUserRole();
    this.autocompleteItems = [];
    this.autocomplete = {query: '' };

  }

  ngOnInit() {
  }

  ionViewWillEnter() {     
    //this.getItems(null);
    this.service = new google.maps.places.AutocompleteService();
   }

  itemSelected(event, item) {     
    //
    var lat=0;
    var lng=0;
    var postalCode='';
    var postalTown='';
    let geocoder = new google.maps.Geocoder();           
    try {                  
        geocoder.geocode({ 'address': item.description}, (results, status) => {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();                      
            

            for(var k=0;k<results.length;k++){                 
            for (var i=0; i< results[k].address_components.length; i++)
            {   
                if (results[k].address_components[i].types[0] == "locality" || results[k].address_components[i].types[0] =="postal_town")
                    postalTown=results[k].address_components[i]["long_name"];                    
                if (results[k].address_components[i].types[0] == "postal_code")
                    postalCode=results[k].address_components[i]["long_name"];
            }                
            break;
          }

          var selectResult={description:item.description,lat:lat,lng:lng,postalCode:postalCode,postalTown:postalTown};
          this.modalController.dismiss(selectResult);

        });                 
            //console.log( data);                   
    }
    catch(err) {
        console.log( err);
    }
  }

  CanelNoSave(event) {        
    this.modalController.dismiss(null);
    //this.location.back();
  } 

  

   getItems(e)
  {    
    this.autocompleteItems=[];
    this.getItemsByFilter(this.myInput2);
  }

  


//General Functions

getItemsByFilter(ev) {      
  let val = ev.target.value;
  this.updateSearch(val);   
}


updateSearch(myInput) {
  if (myInput == '') {
    this.autocompleteItems = [];
    return;
  }
  let me = this;
  
  this.service.getPlacePredictions({ input: myInput,  componentRestrictions: {country: 'UK'} }, function (predictions, status) {
    me.autocompleteItems = []; 
    me.zone.run(function () {
      if(predictions!=null)
      predictions.forEach(function (prediction) {
        //me.autocompleteItems.push(prediction.description);
        me.autocompleteItems.push(prediction);
      });
    });

  });
}

cancel(event) {        
  //this.navCtrl.navigateBack('/alerts');    
  this.CanelNoSave(event);
}

cancelSelected(event) {    
  var item={}
  item['codeId']=-1;
  item['codeDesc']="";
  this.modalController.dismiss(item);
}

showAdvanceFilter(event) {      
  this.showFilterFlag='Y';
}

cancelAdvanceFilter(event) {      
  this.showFilterFlag='N';
}

selectAdvanceFilter(event) {
  
     this.showFilterFlag='N';
     this.getItems(null);
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

