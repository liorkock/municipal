
import { Component, OnInit,ViewChild,forwardRef,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

//import { SignaturePadModule } from 'angular2-signaturepad';
//import SignaturePad from 'signature_pad';
//import { SignaturePad } from 'angular2-signaturepad';
//import { SignaturePad } from 'angular2-signaturepad';
//import { SignaturePadModule } from 'angular2-signaturepad';
import { AfterViewInit} from '@angular/core';
import SignaturePad from 'signature_pad';


//import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage  implements AfterViewInit {

  signature = '';
  isDrawing = false;
  public mylang;
  //signaturePad: SignaturePad;
 
 
 // @ViewChild('canvas') canvasEl : ElementRef;
  //protected canvas: HTMLCanvasElement;
  //@ViewChild(SignaturePad) signaturePad:SignaturePad ; //,{ read: true }
  //@ViewChild(SignaturePad) signaturePad: SignaturePad;
  //@ViewChild(SignaturePad) signaturePad: SignaturePad;
  //@ViewChild("canvas", { static: true }) canvas: ElementRef;

  //public signaturePad: SignaturePad;
  protected canvas: HTMLCanvasElement;
  @ViewChild(SignaturePad, {static: false}) //,{ read: true }
  public signaturePad: SignaturePad;

  public signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 300,
    'backgroundColor': '#ffffff',
    'penColor': '#666a73'
  };

  constructor(private aService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router,  private navCtrl: NavController, public modalController: ModalController, public navParams: NavParams) {
    this.mylang = new Lang();    
    this.signature = navParams.get('signature');       
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
   
  }

  ionViewDidEnter() {
    var canvas =document.querySelector('canvas');
    this.signaturePad = new SignaturePad(canvas);
   }

  CanelNoSave(event) {        
    this.modalController.dismiss(null);
    //this.location.back();
  } 


  drawComplete() {
    this.isDrawing = false;
  }
 
  drawStart() {
    this.isDrawing = true;
  }
 
  savePad() {
    //todo
    
    this.signature = this.signaturePad.toDataURL();
    //this.storage.set('savedSignature', this.signature);
    this.signaturePad.clear();
    /*
      let toast = this.toastCtrl.create({
        message: 'New Signature saved.',
        duration: 3000
      });  
    */  
    this.modalController.dismiss(this.signature);
    
  }

  cancelPad(){
		this.CanelNoSave(event);
   }
   
  clearPad() {
    this.signaturePad.clear();
  }

}
