import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { NavController,NavParams } from '@ionic/angular';
import { ProjectFormPage } from '../projects/project-form/project-form.page'

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.page.html',
 // styleUrls: ['./project-search.page.scss'],
})
export class ProjectSearchPage implements OnInit {

  public mylang;
 
  selectedItem: any;
  myInput2:string;
  showFilterFlag:string;
  public fromDate;
  public toDate;
  icons: string[];
  items: any[];//Array<{}>;
  
  public userRole;
  public myMovingCompanyTz;
  public filterClientId;
  public filterServiceSupplierId;
  public selectedContainerItem;
  public linked_containerId=0;
  public filterShowArhive = false;
  public module ='';
  public client ;
  constructor(private aService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router,public actionSheetCtrl: ActionSheetController
    ,private storage: Storage,private navCtrl: NavController,public modalController: ModalController,private navParams:NavParams) 
  {
    this.mylang= new Lang();
    this.items = []; 
    this.myInput2='';
  
    this.userRole=this.aService.getUserRole();
    
    if(this.userRole=='Admin' || this.userRole=='Inspector')
      this.myMovingCompanyTz=navParams.get('movingCompanyTz');//used in Orders
    
    else this.myMovingCompanyTz=this.aService.getUserMovingCompanyTz();
    this.filterClientId=navParams.get('filterServiceSupplierId');
    if(this.filterServiceSupplierId==null)
    this.filterServiceSupplierId =-1;

    this.filterClientId=navParams.get('filterClientId');
    if(this.filterClientId==null)
    this.filterClientId =-1;

    this.selectedContainerItem = navParams.get('item');//container

    this.client = navParams.get('client');

    if(this.selectedContainerItem!=null && this.selectedContainerItem!=undefined) 
        this.linked_containerId = this.selectedContainerItem.containerId;

  }

  ngOnInit() {
  }

  ionViewWillEnter() {     
    this.getItems(null);
   }

  itemSelected(event, item) {     
    //this.navCtrl.navigateForward('/client-form/'+item.orderId+"/0");   
    
    if(this.linked_containerId==0 || this.module=='SupplierOrder')
      this.modalController.dismiss(item);
    else
      this.addProjectContainerDataByContainerId(item.projectId);
  }

  CanelNoSave(event) {        
    this.modalController.dismiss(null);
    //this.location.back();
  } 

  

   getItems(e)
  {    
    this.items=[];
    if(this.module=='SupplierOrder'){
      this.linked_containerId = -1;
      return this.getAvaliableProjectsForSupplierOrder(this.myInput2);
    }
    if(this.linked_containerId==0)
      this.getListFromDB(this.myInput2);
    else
      this.getListFromDB_ForContainer(this.myInput2);
  }

  getListFromDB(myfilter:string){
    var module = 'GetProjectsForNewOrder';//,showArhive:false
        var params = {  logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,movingCompanyTz:this.myMovingCompanyTz,filterClientId:this.filterClientId }
        this.github.getRepos(module, params).subscribe(
            data => {
                var mydata = this.github.ParseResult(data);
                this.items = [];                
                if (mydata != null)                   
                    this.items = mydata;
            },
            err => console.log('err getItems')            
        );
  }

  getListFromDB_ForContainer(myfilter:string){
    var module = 'getProjectListByContainerId';//,showArhive:false
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,showArhive: false, filterMovingCompanyId: -1, containerId:  this.linked_containerId}
        this.github.getRepos(module, params).subscribe(
            data => {
                var mydata = this.github.ParseResult(data);
                this.items = [];                
                if (mydata != null)                   
                    this.items = mydata;
            },
            err => console.log('err getItems')            
        );
  }
  getAvaliableProjectsForSupplierOrder(myfilter:string){
    var module = 'getAvaliableProjectsForOrder';//,showArhive:false
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), filterInput: myfilter,showArhive: this.filterShowArhive, filterServiceSupplierId: this.filterServiceSupplierId, filterClientId: this.filterClientId  }
        this.github.getRepos(module, params).subscribe(
            data => {
                var mydata = this.github.ParseResult(data);
                this.items = [];                
                if (mydata != null)                   
                    this.items = mydata;
            },
            err => console.log('err getItems')            
        );
  }


  addProjectContainerDataByContainerId(selectedProjectId)  {   
    console.log('addProjectContainerDataByContainerId'); 
      let confirm = this.alertController.create({
        message:  " ? " + this.mylang.ProjectContainer.insertConfirmation,
        buttons: [
          {
            text: this.mylang.General.yes,
            handler: () => {
              this.addProjectContainerDataByContainerId_AfterConfirm(selectedProjectId);
            }
          },
          {
            text: this.mylang.General.no,
            handler: () => {
              console.log('Disagree clicked');
            }
          }
        ]
      }).then(confirm => { confirm.present(); });    
  }

  addProjectContainerDataByContainerId_AfterConfirm(selectedProjectId) {
    var module = 'addProjectContainerDataByContainerId';
    var params = { logInUserId: this.aService.getUserId(), securityString: this.aService.getUserSS(), projectId:selectedProjectId,containerId:this.linked_containerId};

    this.github.getRepos(module, params).subscribe(
      data => {
        var mydata = this.github.ParseResult(data);
        if (mydata == null || mydata == "-10" || mydata == "-5" || mydata < -10 || mydata.indexOf('Err') > -1) {
          this.displayResultError(mydata);
          return;
        }
        this.displaySubmitCompletedAndClose(mydata);
      },
      err => this.displayErrorMsg(err)
    );

  }


  async createNewProject()
    {
        //this.navCtrl.push(ProjectForm, {  item: this.selectedContainerItem  });  
        const modal = await this.modalController.create({
          component: ProjectFormPage,
          componentProps: {
            'item': this.selectedContainerItem
          }
        });
        await modal.present();
        var { data } = await modal.onWillDismiss();
        //this.displaySubmitCompletedAndClose(data);
       // this.itemSelected(null,data);
       if(data !=null)
        this.addProjectContainerDataByContainerId_AfterConfirm(data);
    }

    async createNewSupplierOrderProject()
    {
        
        var project;
         project ={};
        project.movingCompanyTz = this.myMovingCompanyTz;
        project.clientId = this.filterClientId;

        if(this.client!=null && this.client!=undefined) {
          project.clientName = this.client.clientName;
          project.clientAddress = this.client.clientAddress;
          project.clientPhone = this.client.clientPhone;
          project.clientTz = this.client.clientTz;
          project.clientId = this.client.clientId;

        }


        const modal = await this.modalController.create({
          component: ProjectFormPage,
          componentProps: {
            'module':'SupplierOrder',
            'item': project,
            'filterServiceSupplierId':this.filterServiceSupplierId
          }
        });
        await modal.present();
        var { data } = await modal.onWillDismiss();
       
      //  this.modalController.dismiss(data);
       // this.itemSelected(null,data);
        this.alertController.create({
          message: this.mylang.General.saveComplete+ " #"+data.projectId,
        buttons: [ {text: 'OK', handler: ()=> { this.itemSelected(null,data) }}]
        }).then(alert=>{alert.present();});
      
    }
    //clientId


//General Functions

getItemsByFilter(ev) {      
  let val = ev.target.value;
  this.getItems(val);  
}


cancel(event) {        
  //this.navCtrl.navigateBack('/alerts');    
 // this.CanelNoSave(event);
    this.modalController.dismiss(event);
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
  buttons: [ {text: 'OK', handler: data => { this.cancel(msg) }}]
  }).then(alert=>{alert.present();});

}

displayResultError(result) {
    var msg=this.mylang.Validation.submitFail ;
    if(result=="-10")
    msg=this.mylang.Validation.submitFailObjectExist;

  if(result=="-11")
    msg=this.mylang.Validation.containerExsitOnThisSite;

  if(result=="-12")
    msg=this.mylang.Validation.containerExsitOnOtherProject;

  if(result=="-913")
    msg=this.mylang.Validation.containerNotBelong2u;

  if(result=="-912")
    msg=this.mylang.Validation.containerNotExist;
    this.displayMsg(msg);
}


}

