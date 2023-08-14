import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//import { IonicStorageModule } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {AlertFormPage} from '../alerts/alert-form/alert-form.page'
import {AlertMapFormPage} from '../alerts/alert-map-form/alert-map-form.page'
//import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
import { ProjectFormPage } from '../projects/project-form/project-form.page'
import { ProjectSearchPage } from '../project-search/project-search.page';
//import { DrawPathPage } from '../draw-path/draw-path.page';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {


  public mylang;
  public WasteSiteList ;

  selectedItem: any;
  showLoading:any;
  myInput:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];//Array<{}>;
  
  public AlertTypeList;
  public AlertClearReasonList;  
  public alertTypeFilter;
  public clearReasonFilter;

  public MovingCompanyList;
  public movingCompanyFilter;
  public userRole;

  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController,private storage: Storage,private navCtrl: NavController,public modalController: ModalController, private launchNavigator:LaunchNavigator
    ,public loadingController: LoadingController, private activatedRoute: ActivatedRoute) {

    this.mylang= new Lang();
    this.items = [];
    this.myInput='';

    this.showFilterFlag='N';
    var d = new Date();
    d.setDate(d.getDate()-8);
    this.fromDate= d.toISOString();
    this.toDate= new Date().toISOString();

    storage.get('AlertClearReasonList').then(
    (val) => {this.AlertClearReasonList=val;});
    storage.get('AlertTypeList').then((val) => {this.AlertTypeList=val;});
    storage.get('MovingCompanyList').then((val) => {this.MovingCompanyList=val;});

    this.alertTypeFilter=-1;
    this.clearReasonFilter=1;
    
    this.movingCompanyFilter=-1;
    this.userRole=this.aService.getUserRole();

    var openAlertId=0;
    var id1 ="";
    try{
      id1=this.activatedRoute.snapshot.paramMap.get('id');
      this.showLoading = true;
      if( id1!=undefined && id1!=null && id1!="0")
      {
        this.showLoading = false;
        var alertItem={alertId:id1};
        if(this.AlertClearReasonList == undefined){
          var params = { logInUserId:  this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: "", category: "ClearReason", activeOnly: 1 }
          this.github.getRepos('getCodesList', params).subscribe(
              data => {
                  var mydata = this.github.ParseResult(data);
                  this.AlertClearReasonList = [];
                  this.AlertClearReasonList.push({ codeId: -1, codeDesc: '' })
                  if (mydata == null)
                      console.log('no records on getAlertClearReasons')
                  else{
                      this.AlertClearReasonList = mydata;
                      this.AlertClearReasonList.push({ codeId: -1, codeDesc: this.mylang.ContainerState.statusAll })
                      }

                  this.storage.set("AlertClearReasonList",  this.AlertClearReasonList);
                  this.itemSelected(null,alertItem);
              },
              err => console.log('err getAlertClearReasons')
          );
       }
      }
    }
    catch(e)
    {
    this.displayMsg(e);

    }
    

   }

  ionViewWillEnter() {     
    this.getItems(null);
   }


  ngOnInit() {
  }

  async  itemSelected(event, item) {              
    //this.navCtrl.navigateForward('/alert-form/'+item.alertId);
    const modal = await this.modalController.create({
      component: AlertFormPage,
      componentProps: {
        'myid': item.alertId,AlertClearReasonList:this.AlertClearReasonList
      }
    });
  //  return await modal.present();

      await modal.present();
    var { data } = await modal.onWillDismiss();
    if(data!=null)
    this.getItems(null);


  }


  async openMap(event, item) {
    // That's right, we're pushing to ourselves!

    if (item.latitude == null || item.latitude == undefined || item.latitude == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }

    //this.navCtrl.navigateForward('/alert-map-form/'+item.alertId);

    const modal = await this.modalController.create({
      component: AlertMapFormPage,
      componentProps: {
        'myid': item.alertId
      }
    });
    return await modal.present();

  }

  /*async DrawPath(event, item) {
    // That's right, we're pushing to ourselves!

    if (item.latitude == null || item.latitude == undefined || item.latitude == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }

  
    const modal = await this.modalController.create({
      component: DrawPathPage,
      componentProps: {
        'myid': item.alertId,'showFilterFlag':'N','endDate':item.alertDate,'endLat':item.latitude,'endLong':item.longitude,'pathType':'Alert'
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
    if(this.showLoading==true)
    loading.present();
    var module='getAlertList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, fromDate: this.fromDate, toDate:this.toDate, alertTypeId: this.alertTypeFilter, filterType: 'ALL', filterMovingCompanyId: this.movingCompanyFilter, clearReasonId:this.clearReasonFilter}
    
    this.github.getRepos(module,params).subscribe(
                data => {
                    var mydata=this.github.ParseResult(data);
                    loading.dismiss();
                    if(mydata==null)
                        this.displayErrorMsg('Error while geting data');
                    else
                        this.items=mydata;
                },
                err => {loading.dismiss(); this.displayMsg(err)}
               
        );

    }catch (e) {}
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
  
  showActions(event, item) {   
    let buttons = [];
    buttons.push({text: this.mylang.General.update,icon:'create',handler: () => {this.itemSelected(event, item); }});
    buttons.push({text: this.mylang.General.map,icon:'pin',handler: () => {this.openMap(event, item); }});
    buttons.push({text: this.mylang.General.waseIt,icon:'compass',handler: () => {this.wazeIt(item); }});
    
    if(item.alertTypeId==5)
        buttons.push({text: this.mylang.Project.form,icon:'arrow-dropdown-circle',handler: () => {this.CreateNewProject(item); }});
    
   // if(item.alertTypeId==2)
   //     buttons.push({text: this.mylang.Alert.UnloadingPath,icon:'analytics',handler: () => {this.DrawPath(event, item); }});
        
    buttons.push({ text: this.mylang.General.cancel , icon: 'close',role: 'cancel'});
    let actionSheet = this.actionSheetCtrl.create({  header: item.regNum , mode:'ios', buttons: buttons }).then(actionSheet=>{actionSheet.present()});

  }


  async CreateNewProject(item) {    
    var obj:any = {};
    obj.movingCompanyName=item.movingCompanyName;
    obj.movingCompanyTz=item.movingCompanyTz;
    obj.lastLat=item.latitude;
    obj.lastLng=item.longitude;
    obj.containerId=item.containerId;
    //this.navCtrl.push(ProjectForm, {  item: obj  });  
    //this.navCtrl.push(ProjectList, {  item: obj  });  

    //this.navCtrl.push(ProjectList, {  item: item  });  //todo
    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        'item': obj
      }
    });
     await modal.present();
     var { data } = await modal.onWillDismiss();
    if(data!=null && data>0)
    {
      //update alert clear reason
      var module = 'UpdateClearReasonId';
      var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), alertId: item.alertId };

      this.github.getRepos(module, params).subscribe(
        data => {
          var mydata = this.github.ParseResult(data);
          if (mydata == null || mydata == "-10" || mydata < -10 || mydata.indexOf('Err') > -1) {
            this.displayErrorMsg(mydata);
            //return;
          }else{
          this.getItems(null);
          }
          return;
          //this.displaySubmitCompletedAndClose(mydata);
        },
        err => this.displayErrorMsg(err)
      );
    }
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
