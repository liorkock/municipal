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

import { ProjectFormPage } from './project-form/project-form.page'
import { ProjectContainersPage } from './project-containers/project-containers.page'
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
 // styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  public mylang;

  selectedItem: any;
  myInput: string;
  icons: string[];
  items: any[];

  showFilterFlag: string;
  public fromDate;
  public toDate;
  public showArhive;
  public MovingCompanyList;
  public movingCompanyFilter;
  public AutorityInspectorList;
  //public MyCountainerList;
  public userRole;


  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private navCtrl: NavController, public modalController: ModalController, private launchNavigator:LaunchNavigator,public loadingController: LoadingController) {

    this.mylang = new Lang();
    this.items = [];
    this.myInput = '';

    this.showFilterFlag = 'N';
    var d = new Date();
    d.setDate(d.getDate() - 120);
    this.fromDate = d.toISOString();
    this.toDate = new Date().toISOString();


    storage.get('MovingCompanyList').then((val) => { this.MovingCompanyList = val; });
    storage.get('AutorityInspectorList').then((val) => { this.AutorityInspectorList = val; });

    this.movingCompanyFilter = -1;
    this.userRole = this.aService.getUserRole();

  }

  ionViewWillEnter() {
    this.getItems(null);
  }


  ngOnInit() {
  }

  async  itemSelected(event, item) {
    const modal = await this.modalController.create({
      component: ProjectFormPage,
      componentProps: {
        item: item, AutorityInspectorList: this.AutorityInspectorList
      }
    });
   
     await modal.present();
    var { data } = await modal.onWillDismiss();
    return data;
  }

  async createNew(e) {
    var item = await this.itemSelected(event, null);
    if(item != null)
      return this.getItems(e);
  }


 async  itemSelected_openContainersList(event, item) {    
    const modal = await  this.modalController.create({
      component: ProjectContainersPage,
      componentProps: { item: item,addContainerFlag:'N'}
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
  }

 async itemSelected_openContainersListAndSelectContainer(event, item) {
    const modal = await  this.modalController.create({
      component: ProjectContainersPage,
      componentProps: { item: item,addContainerFlag:'Y'}
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
  }



  getItems(e) {
    this.items = [];
    this.getListFromDB(this.myInput);
    
  }

 async getListFromDB(myfilter: string) {
 try{
  const loading = await this.loadingController.create({message: this.mylang.General.Loading});
    loading.present();
    var module = 'getProjectList';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, showArhive: this.showArhive, fromDate: this.fromDate, toDate: this.toDate, filterMovingCompanyId: this.movingCompanyFilter }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        loading.dismiss();
        if (mydata == null)
          this.displayErrorMsg('Error while geting data');
        else
          this.items = mydata;
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

  //not on use
  wazeIt(item) {
    
     let options: LaunchNavigatorOptions = {app: 'LaunchNavigator.APPS.WAZE'};
     this.launchNavigator.navigate([ item.latitude, item.longitude ])//,options
     .then(
         success => console.log('Launched navigator'),
         error =>   this.displayErrorMsg(error)  
     );
     
  }

  //not on use
  async openMap(event, item) {
    /*
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
    */
  }



  //not on use on this module
  showActions(event, item) {
//<img _ngcontent-qor-c1="" height="69" src="assets/img/containers_2x.png" width="88">
    var styleClass = this.mylang.currentLang=='Heb'?"":"hebStyle";
    let buttons = [];
    buttons.push({ text: this.mylang.General.view, icon:'create',handler: () => { this.itemSelected(event, item); } });
    buttons.push({ text: this.mylang.Project.containers,icon:'cube', handler: () => { this.itemSelected_openContainersList(event, item); } });
    buttons.push({ text: this.mylang.General.Insert2ProjectMainList,icon:'add-circle', handler: () => { this.itemSelected_openContainersListAndSelectContainer(event, item); } });
    //buttons.push({ text: this.mylang.General.map, handler: () => { this.openMap(event, item); } });
    //buttons.push({ text: this.mylang.General.waseIt, handler: () => { this.wazeIt(item); } });
    //buttons.push({ text: this.mylang.General.cancel });
     buttons.push({ text: this.mylang.General.cancel , icon: 'close',role: 'cancel'});
    let actionSheet = this.actionSheetCtrl.create({ header: item.regNum,mode:'ios', buttons: buttons ,cssClass:styleClass}).then(actionSheet => { actionSheet.present() });
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


