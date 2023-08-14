import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication-service'
import {GitHubService} from '../../services/git-hub-service';
import {Lang} from '../../services/lang';
import {AlertController} from '@ionic/angular';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  public mylang;
  constructor(private authenticationService:AuthenticationService,private github: GitHubService,public alertController: AlertController,private router: Router) { 
    this.mylang= new Lang();
  }

  ngOnInit() {
  }

}
