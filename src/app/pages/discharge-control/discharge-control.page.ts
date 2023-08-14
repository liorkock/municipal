
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
//import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {DischargeControlMapPage} from './discharge-control-map/discharge-control-map.page'
import { LoadingController } from '@ionic/angular';
//import { DrawPathPage } from '../draw-path/draw-path.page';

@Component({
  selector: 'app-discharge-control',
  templateUrl: './discharge-control.page.html',
//  styleUrls: ['./discharge-control.page.scss'],
})
export class DischargeControlPage implements OnInit {


  public mylang;
  public WasteSiteList ;

  selectedItem: any;
  myInput:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];//Array<{}>;
  

  public MovingCompanyList;
  public movingCompanyFilter;
  public userRole;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController,public loadingController: LoadingController) {

    this.mylang= new Lang();
    this.items = [];
    this.myInput='';

    this.showFilterFlag='N';
    var d = new Date();
    d.setDate(d.getDate()-30);
    this.fromDate= d.toISOString();
    this.toDate= new Date().toISOString();

   
    storage.get('MovingCompanyList').then((val) => {this.MovingCompanyList=val;});
    
    this.movingCompanyFilter=-1;
    this.userRole=this.aService.getUserRole();
    
   }

  ionViewWillEnter() {     
    this.getItems(null);
   }


  ngOnInit() {
  }

  async  itemSelected(event, item) {              
   /*
    const modal = await this.modalController.create({
      component: AlertFormPage,
      componentProps: {
        'myid': item.alertId
      }
    });
    return await modal.present();
    */
  }


  async openMap(event, item) {
    // That's right, we're pushing to ourselves!

    if (item.latitude == null || item.latitude == undefined || item.latitude == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }

    const modal = await this.modalController.create({
      component: DischargeControlMapPage,
      componentProps: {
        'item': item
      }
    });
    return await modal.present();

  }

 /* async DrawPath(event, item) {
    if (item.latitude == null || item.latitude == undefined || item.latitude == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }

  
    const modal = await this.modalController.create({
      component: DrawPathPage,
      componentProps: {
        'myid': item.imeiUnloadingDataId,'showFilterFlag':'N','endDate':item.trigerDate,'endLat':item.latitude,'endLong':item.longitude,'pathType':'Unloading','unloadingOnWasteSite':item.unloadingOnWasteSite
      }
    });
    return await modal.present();

  }*/

  getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput);
  }

 async getListFromDB(myfilter:string){
  try{
  const loading = await this.loadingController.create({message: this.mylang.General.Loading});
    loading.present();
    var module='getImeiUnloadingDataList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,containerId: 0, projectId: 0, fromDate: this.fromDate, toDate:this.toDate,filterMovingCompanyId:this.movingCompanyFilter }        
    
    this.github.getRepos(module,params).subscribe(
                data => {
                    var mydata=this.github.ParseResult(data);
                        loading.dismiss();
                    if(mydata==null)
                        this.displayErrorMsg('Error while geting data');
                    else
                        this.items=mydata;
                },
                err =>  {loading.dismiss();this.displayMsg(err)}
               
        );
    }catch(e){}
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

  wazeIt(item) {    
   /*
    let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
    this.launchNavigator.navigate([ item.latitude, item.longitude ])
    .then(
        success => console.log('Launched navigator'),
        error =>   this.displayErrorMsg(error)  
    );
    */    
  }
  
  //showActions not on use on this module
  showActions(event, item) {   

    let buttons = [];
    //buttons.push({text: this.mylang.General.update,handler: () => {this.itemSelected(event, item); }});
    buttons.push({text: this.mylang.General.map,icon:'pin',handler: () => {this.openMap(event, item); }});
   // buttons.push({text: this.mylang.Alert.UnloadingPath,icon:'analytics',handler: () => {this.DrawPath(event, item); }});
   // buttons.push({text: this.mylang.General.waseIt,handler: () => {this.wazeIt(item); }});  
   // buttons.push({text:this.mylang.General.cancel});
    buttons.push({ text: this.mylang.General.cancel , icon: 'close',role: 'cancel'});
    let actionSheet = this.actionSheetCtrl.create({  header: item.regNum ,mode:'ios', buttons: buttons }).then(actionSheet=>{actionSheet.present()});
  }

  async DrawMapOfAllRecords(e) {
   
    const modal = await this.modalController.create({
      component: DischargeControlMapPage,
      componentProps: { myid: 0,showFilterFlag:'takeFromPrevPage',filterInput:this.myInput,filterMovingCompanyId:this.movingCompanyFilter ,unloadingItems:this.items}
    });
    return await modal.present();

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
}

