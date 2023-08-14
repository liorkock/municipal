import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service'
import { GitHubService } from '../../services/git-hub-service';
import { Lang } from '../../services/lang';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
import { ContainerMapFormPage } from './container-map-form/container-map-form.page';
import { ContainerFormPage } from './container-form/container-form.page';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
//import { DrawPathPage } from '../draw-path/draw-path.page';
import { ProjectFormPage } from '../projects/project-form/project-form.page'
import { ProjectSearchPage } from '../project-search/project-search.page';
import { ProjectAddressMapPage } from '../projects/project-address-map/project-address-map.page';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.page.html',
  styleUrls: ['./containers.page.scss'],
})
export class ContainersPage implements OnInit {


  public mylang;
  selectedItem: any;
  myInput: string;
  icons: string[];
  items:any[];// Array<{}>;

  public containersCount: string;
  public showFilterFlag: string;
  public MovingCompanyList;
  public movingCompanyFilter;
  public userRole;
  public filterContainerState;
  public findInArround;
  public currentLocationLat;
  public currentLocationLng;
  public Opacity;
  public isRestrictedDriver;
  public start ="(";
  public end = ")";
  public showEmptyBatary;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private navCtrl: NavController, public modalController: ModalController
               ,private geoloc: Geolocation, private launchNavigator:LaunchNavigator,public loadingController: LoadingController) {
    this.mylang = new Lang();
    this.items = [];
    this.myInput = '';
    this.showFilterFlag = 'N';
    storage.get('MovingCompanyList').then((val) => { this.MovingCompanyList = val; });
    this.movingCompanyFilter = -1;
    this.userRole = this.aService.getUserRole();
    this.isRestrictedDriver = this.aService.isRestrictedDriverUser();
    this.filterContainerState = "";
    this.findInArround = false;
    this.currentLocationLat = 0;
    this.currentLocationLng = 0;
    this.containersCount = '';
    this.showEmptyBatary = false;
    this.Opacity =1;
  }

  ionViewWillEnter() {
    this.getItems(null);
  }


  ngOnInit() {
  }

  
  getItems(e) {
    this.items = [];
    this.currentLocationLat = 0;
    this.currentLocationLng = 0;  
   
    if(this.findInArround)
    {

     // this.geoloc.getCurrentPosition().then((resp) => {
      Geolocation.getCurrentPosition().then((resp) => {
        this.currentLocationLat=resp.coords.latitude;
        this.currentLocationLng=resp.coords.longitude;     
        this.getListFromDB(this.myInput);   
        }).catch((error) => {
          console.log('Error getting location', error);
          });
    }
    else    
      this.getListFromDB(this.myInput);
  }
filterItems(e){
  var searchbar = document.querySelector('ion-searchbar');
  this.myInput= searchbar.value  ;
  return this.getItems(e) ;
}
  async getListFromDB(myfilter: string) {  
    // Util.CallWCF("getContainerListWeb", request, self.getContainersList_Succeeded);
    //Util.CallWCF("getContainerListCount", request, self.getContainerListCount_Succeeded);  
  try{
   const loading = await this.loadingController.create({message: this.mylang.General.Loading});
    loading.present();
    var module = 'getContainerListWeb';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, filterMovingCompanyId: this.movingCompanyFilter, filterContainerState: this.filterContainerState, findInArround: this.findInArround, currentLocationLat: this.currentLocationLat, currentLocationLng: this.currentLocationLng ,showEmptyBatary: this.showEmptyBatary }
    this.github.getRepos(module, params).subscribe(
      data => {        
        var mydata = this.github.ParseResult(data); 
         loading.dismiss();       
        if (mydata == null)
          this.displayErrorMsg('');
        else{
          this.items = mydata;
        //  this.containersCount = this.items.length +'';
        }
      },
      err => {loading.dismiss();this.displayMsg(err);}
      //, () => console.log('getRepos completed')
    );
    }catch (e) {}
    try{
      const loading = await this.loadingController.create({message: this.mylang.General.Loading});
       loading.present();
       var module = 'getContainerListCount';
       var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, filterMovingCompanyId: this.movingCompanyFilter, filterContainerState: this.filterContainerState, findInArround: this.findInArround, currentLocationLat: this.currentLocationLat, currentLocationLng: this.currentLocationLng ,showEmptyBatary: this.showEmptyBatary }
       this.github.getRepos(module, params).subscribe(
         data => {        
           var mydata = this.github.ParseResult(data); 
            loading.dismiss();       
           if (mydata == null)
             this.displayErrorMsg('');
           else{
             //this.items = mydata;
             this.containersCount = mydata +'';
           }
         },
         err => {loading.dismiss();this.displayMsg(err);}
         //, () => console.log('getRepos completed')
       );
       }catch (e) {}
  }



  showAdvanceFilter(event) {
    this.showFilterFlag = 'Y';
  }

  cancelAdvanceFilter(event) {
    this.showFilterFlag = 'N';
  }

  selectAdvanceFilter(event) {

    this.showFilterFlag = 'N';
    this.getItems(null);
  }

 

  showActions(event, item) {
    var styleClass = this.mylang.currentLang=='Heb'?"":"hebStyle";
    let buttons = [];
    if(this.isRestrictedDriver!='true')
    buttons.push({ text: this.mylang.Container.info,icon:'create', handler: () => { this.itemSelected(event, item); } });
    buttons.push({ text: this.mylang.General.currentMap,icon:'pin', handler: () => { this.openMap(event, item); } });
    if(this.userRole != "AdminStricted" && this.isRestrictedDriver!='true')
      buttons.push({ text: this.mylang.General.historicalMap,icon:'analytics', handler: () => { this.openHistoricalMap(event, item); } });
    buttons.push({ text: this.mylang.General.waseIt, icon:'compass',handler: () => { this.wazeIt(item); } });
    if ( (this.userRole != "AdminStricted")&&this.isRestrictedDriver!='true'&&item.projectId > 0 && (this.userRole != "Inspector" || item.insideAuthorityArea == 1)) {
      buttons.push({ text: this.mylang.Project.projectInfo,icon:'arrow-dropdown-circle', handler: () => { this.CreateProjectOrAdd2Project(item); } });
      buttons.push({ text: this.mylang.General.exitContainerFromProject,icon:'exit', handler: () => { this.exitContainer(item); } });
    }

    if (item.projectId < 1 && item.mapIcon.startsWith("onWareHouseIcon") == false && this.userRole != "AdminStricted"&&this.isRestrictedDriver!='true' && (this.userRole != "Inspector" || item.insideAuthorityArea == 1)) {
      buttons.push({ text: this.mylang.Project.form,icon:'arrow-dropdown-circle', handler: () => { this.AddContainer2Project(item); } });
    }

    buttons.push({ text: this.mylang.General.cancel , icon: 'close',role: 'cancel'});

    let actionSheet = this.actionSheetCtrl.create({ header: item.regNum,mode:'ios', buttons: buttons , cssClass:styleClass }).then(actionSheet => { actionSheet.present() });

  }

  async  itemSelected(event, item) {    
    const modal = await this.modalController.create({
      component: ContainerFormPage,
      componentProps: {
        'myid': item.containerId
      }
    });
    return await modal.present();
  }
  
  wazeIt(item) {    
        if(this.userRole=="Inspector" &&  item.insideAuthorityArea==0)
        {
              this.displayMsg(this.mylang.General.NotInsideAuthorityAreaMsg);
              return;
        }
         let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
         this.launchNavigator.navigate([ item.lastLat, item.lastLng ])//,options
         .then(
             success => console.log('Launched navigator'),
             error =>   this.displayErrorMsg(error)  
         );
  }

  async openMap(event, item)
  {
    //this.GoToContainerMap(event, item,'N');
    if (this.userRole == "Inspector" && item.insideAuthorityArea == 0) {
      this.displayMsg(this.mylang.General.NotInsideAuthorityAreaMsg);
      return;
    }

    if (item.lastLat == null || item.lastLat == undefined || item.lastLat == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }
    //this.navCtrl.navigateForward('/alert-map-form/'+item.alertId);
    const modal = await this.modalController.create({
      component: ContainerMapFormPage,
      componentProps: {
        'myid': item.containerId,'showFilterFlag':'N'
      }
    });
    return await modal.present();
  }

  openHistoricalMap(event, item) {
    this.GoToContainerMap(event, item,'Y');
  }

  async drawAllContainers(e) {
    //todo
    // this.navCtrl.push(AllContainersMap,{filterInput:this.myInput,filterMovingCompanyId:this.movingCompanyFilter,filterContainerState:this.filterContainerState,findInArround:this.findInArround,currentLocationLat:this.currentLocationLat , currentLocationLng:this.currentLocationLng });
    
    const modal = await this.modalController.create({
      component: ContainerMapFormPage,
      componentProps: { myid: 0,showFilterFlag:'takeFromPrevPage',filterInput:this.myInput,filterMovingCompanyId:this.movingCompanyFilter,filterContainerState:this.filterContainerState,findInArround:this.findInArround,currentLocationLat:this.currentLocationLat , currentLocationLng:this.currentLocationLng,showEmptyBatary: this.showEmptyBatary  }
    });
    return await modal.present();

  }


  async GoToContainerMap(event, item,showFilterFlag) {
    // That's right, we're pushing to ourselves!
    if (this.userRole == "Inspector" && item.insideAuthorityArea == 0) {
      this.displayMsg(this.mylang.General.NotInsideAuthorityAreaMsg);
      return;
    }

    if (item.lastLat == null || item.lastLat == undefined || item.lastLat == 0) {
      this.displayMsg(this.mylang.General.noGPSdata);
      return;
    }
    //this.navCtrl.navigateForward('/alert-map-form/'+item.alertId);
    const modal = await this.modalController.create({
      component: ContainerMapFormPage,
      componentProps: {
        'myid': item.containerId,'showFilterFlag':showFilterFlag
      }
    });
    
    /*const modal = await this.modalController.create({
      component: DrawPathPage,
      componentProps: {
        'myid': item.containerId,'showFilterFlag':showFilterFlag
      }
    });*/

     modal.onDidDismiss().then((dataReturned) => {
      console.log('Modal closedd');
       this.Opacity = 1;
    });

    
    this.Opacity = 0;
    return await modal.present();
  }

 

  createNew(e) {
  
  }

  
 async CreateProjectOrAdd2Project(item) {
    // this.navCtrl.push(ProjectForm, {  item: item  });  //todo
    const modal = await this.modalController.create({
      component: ProjectFormPage,
      componentProps: {
        'item': item
      }
    });
    await modal.present();
    var { data } = await modal.onWillDismiss();
    if(data!=null)
    this.getItems(null);
  }

  async AddContainer2Project(item) {
    //this.navCtrl.push(ProjectList, {  item: item  });  //todo
    const modal = await this.modalController.create({
      component: ProjectSearchPage,
      componentProps: {
        'item': item
      }
    });
     await modal.present();
    var { data } = await modal.onWillDismiss();
    if(data!=null)
    this.getItems(null);
  }


  exitContainer(item) {
    if (item.currentProjectId != "-1" && item.currentProjectId != "0") {
      let confirm = this.alertController.create({
        message: item.regNum + "<br>" + " ? " + this.mylang.ProjectContainer.exitConfirmation,
        buttons: [
          {
            text: this.mylang.General.yes,
            handler: () => {
              this.exitContainerById(item);
            }
          },
          {
            text: this.mylang.General.no,
            handler: () => {
              console.log('Disagree clicked');
            }
          }
        ]
      }).then(conf => { conf.present(); });
    }
  }

  exitContainerById(item) {
    var module = 'UpdateExitDate4Container';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), containerId: item.containerId, projectId: item.projectId }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == "1") {
          this.displayMsg(this.mylang.General.actionCompleted)
          this.getItems(null);
        }


      },
      err => this.displayMsg(err)

    );
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
}
