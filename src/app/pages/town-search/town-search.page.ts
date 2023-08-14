import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController, NavParams} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-town-search',
  templateUrl: './town-search.page.html',
  //styleUrls: ['./town-search.page.scss'],
})
export class TownSearchPage implements OnInit {

  public mylang;
 
  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: Array<{codeDesc,codeId}>;
  
  public userRole;
  public myMovingCompanyTz;
public filterCouncilId
  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController,private navParams:NavParams) 
  {
    this.mylang= new Lang();
    this.items = [];
    this.myInput2='';
    //products:any[];
    this.userRole=this.aService.getUserRole();
    
    //this.myMovingCompanyTz=navParams.get('movingCompanyTz');//todo check what is the use
    this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();
    this.filterCouncilId=navParams.get('filterCouncilId');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {     
    this.getItems(null);
   }

  itemSelected(event, item) {     
    //this.navCtrl.navigateForward('/client-form/'+item.orderId+"/0");   
    this.modalController.dismiss(item);
  }

  CanelNoSave(event) {        
    this.modalController.dismiss(null);
    //this.location.back();
  } 

  

   getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput2);
  }

  getListFromDB(myfilter:string){
    var module = 'getCodesList';
    var category = "TownForMobile";
    if(this.filterCouncilId == null || this.filterCouncilId =="" || Number(this.filterCouncilId)<=0)
    category = "TownForMobile";
    else
    category = "Town";
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, category:category, activeOnly: 1 }
    
    this.github.getRepos(module, params).subscribe(
        data => {
            var mydata = this.github.ParseResult(data);
            this.items = [];                
            if (mydata != null)  {                 
              if(this.filterCouncilId == null || this.filterCouncilId =="" || Number(this.filterCouncilId)<=0)
                this.items = mydata;
                else{
                  for(var i=0;i<mydata.length;i++){
                    if(mydata[i].attribute1==this.filterCouncilId)
                    this.items.push(mydata[i]);
                  }
                }
            }
        },
        err => console.log('err getItems')            
    );
  }


//General Functions

getItemsByFilter(ev) {      
  let val = ev.target.value;
  this.getItems(val);  
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

