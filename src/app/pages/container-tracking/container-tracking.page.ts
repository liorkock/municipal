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

import {ContainerTrackingMapPage} from './container-tracking-map/container-tracking-map.page'
import {ContainerTrackingFormPage} from './container-tracking-form/container-tracking-form.page'
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-container-tracking',
  templateUrl: './container-tracking.page.html',
 // styleUrls: ['./container-tracking.page.scss'],
})
export class ContainerTrackingPage implements OnInit {


  public mylang;
  public WasteSiteList ;

  selectedItem: any;
  myInput:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items:any[];// Array<{}>;
  
  
  public filterWeightNotFilled;
  public filterUnloaded;

  public MovingCompanyList;
  public movingCompanyFilter;
  public userRole;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController, private launchNavigator:LaunchNavigator, public loadingController: LoadingController) {

    this.mylang= new Lang();
    this.items = [];
    this.myInput='';

    this.showFilterFlag='N';
    var d = new Date();
    d.setDate(d.getDate()-30);
    this.fromDate= d.toISOString();
    this.toDate= new Date().toISOString();

   
    storage.get('MovingCompanyList').then((val) => {this.MovingCompanyList=val;});
    storage.get('WasteSiteList').then((val) => {this.WasteSiteList=val;});
    
    this.movingCompanyFilter=-1;
    this.userRole=this.aService.getUserRole();
    
   }

  ionViewWillEnter() {     
    this.getItems(null);
   }


  ngOnInit() {
  }

  async  itemSelected(event, item) {              
   
    const modal = await this.modalController.create({
      component: ContainerTrackingFormPage,
      componentProps: {
        item: item,WasteSiteList:this.WasteSiteList
      }
    });
    return await modal.present();
    
  }


  async openMap(event, item) {    
    if(item.projectLat==null||item.projectLng==undefined||item.projectLat==0)
    {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }
    const modal = await this.modalController.create({
      component: ContainerTrackingMapPage,
      componentProps: {
        'item': item
      }
    });
    return await modal.present();

  }


  getItems(e)
  {    
    this.items=[];
    this.getListFromDB(this.myInput);
  }

  async getListFromDB(myfilter:string){
  try{
  const loading = await this.loadingController.create({message: this.mylang.General.Loading});
    loading.present();
    var module='getProjectContainerList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,containerId: 0, projectId: 0, fromDate: this.fromDate, toDate:this.toDate,filterMovingCompanyId: this.movingCompanyFilter,filterWeightNotFilled:this.filterWeightNotFilled,filterUnloaded:this.filterUnloaded}        

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
       } catch(e){}
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
   
    let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
    this.launchNavigator.navigate([ item.latitude, item.longitude ])//,options
    .then(
        success => console.log('Launched navigator'),
        error =>   this.displayErrorMsg(error)  
    );
       
  }
  
  //showActions not on use on this module
 /* showActions(event, item) {   
    var styleClass = this.mylang.currentLang=='Heb'?"":"hebStyle";
    let buttons = [];
    buttons.push({text: this.mylang.General.update,handler: () => {this.itemSelected(event, item); }});
    buttons.push({text: this.mylang.General.map,handler: () => {this.openMap(event, item); }});
    buttons.push({text: this.mylang.General.waseIt,handler: () => {this.wazeIt(item); }});  
    buttons.push({text:this.mylang.General.cancel});
    let actionSheet = this.actionSheetCtrl.create({  header: item.regNum , buttons: buttons ,cssClass:styleClass}).then(actionSheet=>{actionSheet.present()});
  }*/



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

   showActions(event, item) {

    let buttons = [];
   
    buttons.push({ text: this.mylang.General.update,icon:'create', handler: () => { this.itemSelected(event, item); } });
    buttons.push({ text: this.mylang.General.map,icon:'pin', handler: () => { this.openMap(event, item); } });
   
    buttons.push({ text: this.mylang.General.cancel , icon: 'close',role: 'cancel'});

    let actionSheet = this.actionSheetCtrl.create({ header: item.regNum,mode:'ios', buttons: buttons }).then(actionSheet => { actionSheet.present() });

  }
}


