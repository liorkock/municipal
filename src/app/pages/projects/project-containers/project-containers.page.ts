import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication-service'
import { GitHubService } from '../../../services/git-hub-service';
import { Lang } from '../../../services/lang';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { ContainerSearchPage } from '../../container-search/container-search.page';

@Component({
  selector: 'app-project-containers',
  templateUrl: './project-containers.page.html',
 // styleUrls: ['./project-containers.page.scss'],
})
export class ProjectContainersPage implements OnInit {

  public mylang;

  selectedItem: any;
  myInput: string;
  icons: string[];
  currentItems:any[];// Array<{}>;
  historicalItems:any[];// Array<{}>;
  public myProjectid = 0;
  public myMovingCompanyTz = 0;
  public showHistoricalContainersFlag = true;

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router, public actionSheetCtrl: ActionSheetController, private storage: Storage, private navCtrl: NavController, public modalController: ModalController, private navParams: NavParams) {
    this.mylang = new Lang();
    this.currentItems = [];
    this.historicalItems = [];
    this.myInput = '';
    //this.getListFromDB('');
    var selectedItem = navParams.get('item');
    //this.MyCountainerList=navParams.get('MyCountainerList');

    if (selectedItem != null) {
      this.myProjectid = selectedItem.projectId;
      this.myMovingCompanyTz = selectedItem.movingCompanyTz;
    }
    else {
      this.myProjectid = 0;
      this.myMovingCompanyTz = 0;
    }


    if (navParams.get('addContainerFlag') == 'Y')
      setTimeout(() => { this.addNewProjectContainer(null); }, 150);

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //this.getItems(null);
    this.getCurrentItems(null);
    this.getHistoricalItems(null);
  }


  setExit(event, item) {
    this.alertController.create({
      message:this.mylang.ProjectContainer.exitConfirmation+"?",
      buttons: [{ text:this.mylang.General.yes, handler: data => { this.exitContainerById(item.projectContainerId) } },
        { text:this.mylang.General.no, handler: data => {  console.log('Disagree clicked'); } }
      ]
    }).then(alert => { alert.present(); });
   
}

  async addNewProjectContainer(event) {  

    const modal = await  this.modalController.create({
      component: ContainerSearchPage,
      componentProps: {category:'MyFreeCountainer',myMovingCompanyTz:this.myMovingCompanyTz,projectId:this.myProjectid }
    });
    await  modal.present();  
    var { data } = await modal.onWillDismiss();
        
   //  if(data == undefined || data==null)
   //   return;
   
    this.getCurrentItems(null);
  }

  itemSelected(event, item) {
    //this.navCtrl.navigateForward('/client-form/'+item.orderId+"/0");   
    this.modalController.dismiss(item);
  }

  CanelNoSave(event) {
    this.modalController.dismiss(null);
    //this.location.back();
  }


  getCurrentItems(e) {
    this.currentItems = [];
    this.getCurrentListFromDB('');//this.myInput
  }

  getHistoricalItems(e) {
    this.historicalItems = [];
    this.getHistoricalListFromDB('');//this.myInput
  }

  getCurrentListFromDB(myfilter: string) {
    var module = 'getProjectContainerListForProject';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, projectId: this.myProjectid, withExistDateFlag: false }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('');
        else
          this.currentItems = mydata;
      },
      err => this.displayMsg(err)

    );
  }

  getHistoricalListFromDB(myfilter: string) {
    var module = 'getProjectContainerListForProject';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter, projectId: this.myProjectid, withExistDateFlag: true }
    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null)
          this.displayErrorMsg('');
        else
          this.historicalItems = mydata;
      },
      err => this.displayMsg(err)

    );
  }


  exitContainerById(pcid: string) {
    var module = 'UpdateExitDate4ProjectContainer';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), projectContainerId: pcid, projectId: this.myProjectid }
    this.github.getRepos(module, params).subscribe(
      data => {
        //var mydata=this.github.ParseResult(data);
        this.getCurrentItems(null);
        this.getHistoricalItems(null);
      },
      err => this.displayMsg(err)

    );
  }



  cancel(event) {
    //this.navCtrl.navigateBack('/alerts');    
    this.CanelNoSave(event);
  }

  cancelSelected(event) {
    var item = {}
    item['codeId'] = -1;
    item['codeDesc'] = "";
    this.modalController.dismiss(item);
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

