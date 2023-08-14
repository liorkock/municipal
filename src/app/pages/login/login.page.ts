import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, User } from '../../services/authentication-service'
import { GitHubService } from '../../services/git-hub-service';
import { Lang } from '../../services/lang';
import { AlertController } from '@ionic/angular';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public mylang;
    public user = new User('', '', '');
    public errorMsg = '';

    constructor(private authenticationService: AuthenticationService, private github: GitHubService, public alertController: AlertController, private router: Router) {
        //this.authenticationService.logout();
        this.mylang = new Lang();
        var currentUserEmail = this.authenticationService.getUserEmail();
        var currentServer = this.authenticationService.getServer();

        //defaults to be change when test
        this.user.server = 'il';
        if (currentServer == null)
            currentServer = 'il';

        this.user.server = currentServer;

        if (currentUserEmail != null && currentUserEmail != undefined)
            this.user.email = currentUserEmail;


        if (this.user.email == "") {
            //this.user.email="jamalsleman"
            //this.user.password="123";   
        }

        

       
    }

    ngOnInit() {
        //localStorage.create()
    }

    ionViewWillEnter() {
     if (this.authenticationService.getUserSS() != "" && localStorage.getItem("user_securtystring") != null && localStorage.getItem("user_securtystring") != undefined && localStorage.getItem("user_securtystring") != "") {
            this.handleLanguage(this);
            this.router.navigateByUrl('/home');

        }
        this.user.password = '';  
    }


    login(event) {
        var module = 'checkLogIn';
        var mySelf = this;
        var params = { userName: this.user.email, password: this.user.password, dataCode: 'Mobile' + '#' + this.user.server }
        
        localStorage.setItem("user_server", this.user.server );  //set first the server so if we work with test we will chnage the whole url
        this.github.getRepos(module, params).subscribe(
            data => {

                var mydata = this.github.ParseResult(data);
                if (mydata == null) {
                    this.alertController.create({
                        message: 'Username/paswword is not correct', buttons: ['ok']
                    }).then(alert => { alert.present(); });

                }
                else {
                    this.authenticationService.saveLogInInfo(mydata, mySelf.user.server);
                    mySelf.handleLanguage(mySelf);
                    //this.navCtrl.push(HomePage);
                    this.router.navigateByUrl('/home')
                }


            },
            err => {
                console.error(err);
                this.alertController.create({
                    message: 'Error while try to login check internet: '+ err.code +" : "+err.message, buttons: ['ok']
                }).then(alert => { alert.present(); });

            }
        );
    }

    disableLogIn() {
        if (this.user.email != '' && this.user.password != '')
            return false;
        return true;
    }


    handleLanguage(mySelf) {
        mySelf.mylang.setAppLang('Heb');//define default global variable

        if (mySelf.authenticationService.getServer() == 'uk' || mySelf.authenticationService.getServer() == 'test2')
            mySelf.mylang.setAppLang('Eng');
            if(mySelf.mylang.currentLang=='Heb'){
             document.body.style.setProperty(`--HebDir`, 'right');
             document.body.style.setProperty(`--dir`, 'rtl');
             }
             else{
             document.body.style.setProperty(`--HebDir`, 'left');
             document.body.style.setProperty(`--dir`, 'ltr');
             }
        //if(mySelf.mylang.currentLang!='Heb')
           // mySelf.LoadGoogleMapJs(mySelf.mylang.currentLang);
    }


    LoadGoogleMapJs(currentLang) {

        try {
            var allsuspects = document.getElementsByTagName('script');
            for (var i = allsuspects.length; i >= 0; i--) {

                if (currentLang != 'Heb' && allsuspects[i] && allsuspects[i].getAttribute('src') != null && allsuspects[i].getAttribute('src').indexOf('language=en') != -1) {
                    console.log('en js exits, mylang' + currentLang);
                    return;
                }

                if (currentLang == 'Heb' && allsuspects[i] && allsuspects[i].getAttribute('src') != null && allsuspects[i].getAttribute('src').indexOf('language=he') != -1) {
                    console.log('he js exits, mylang' + currentLang);
                    return;
                }
            }
        }
        catch (err0) {
            //this.displayErrorMsg("we get a msg err0") ;
             this.alertController.create({
                        message: "1- "+err0, buttons: ['ok']
                    }).then(alert => { alert.present(); });
        }


        //remove Current JS Scripts 
        try {
            var allsuspects = document.getElementsByTagName('script');

            for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
                if (allsuspects[i] && allsuspects[i].getAttribute('src') != null && allsuspects[i].getAttribute('src').indexOf('maps.google.com') != -1){
                   // allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
                }
            }
        }
        catch (err0) {
            //this.displayErrorMsg("we get a msg err0") ;
             this.alertController.create({
                        message: err0, buttons: ['ok']
                    }).then(alert => { alert.present(); });
        }
        
       try{
        let script = document.createElement('script');
        script.type = 'text/javascript';
        if (currentLang != 'Heb')
            script.src = 'http://maps.google.com/maps/api/js?language=en&key=AIzaSyCAAE8HQNGBN5QD8v4DD3HbkUXS2nkcmVw&libraries=drawing,places';
        else
            script.src = 'http://maps.google.com/maps/api/js?language=he&key=AIzaSyCAAE8HQNGBN5QD8v4DD3HbkUXS2nkcmVw&libraries=drawing,places';

     
       // document.getElementsByTagName('body')[0].appendChild(script);
       
        document.querySelector('head').appendChild(script);
       // window.location.reload();
        }catch(err1){
    
            this.alertController.create({
                        message: "err1: "+ err1, buttons: ['ok']
                    }).then(alert => { alert.present(); });
        }
      
    }

}


//ionic g page pages/login


//Example of routeing
//https://angularfirebase.com/lessons/ionic-4-routing-and-navigation-guide/

//<ion-button expand="block" routerLink="/home" routerDirection="root">Login</ion-button>