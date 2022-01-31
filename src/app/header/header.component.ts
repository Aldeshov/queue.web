import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { debounceTime, first } from 'rxjs/operators';

import { AuthenticationService } from '../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user = null;
  issignup = false;

  loading = true;

  lusername: string = "";
  lpassword: string = "";

  username: string = "";
  password: string = "";
  first_name: string = "";
  last_name: string = "";

  constructor(private router: Router, private authenticate: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticate.user()
    .subscribe(
      user => {
        this.user = user;
        this.loading = false;
      }
    )
  }

  home(): void {
    this.router.navigate(['']);
  }

  signup(): void {
    this.issignup = true;
    this.enable_disable(false, 'header')
  }

  cancel(){
    this.issignup = false;
    this.enable_disable(true, 'header')
  }

  // Sending Data

  onSubmit() {
    if (this.lusername.length < 4 || this.lpassword.length < 4) {
      alert("Username & Password length must be more than 4!")
      return 0;
    }

    this.enable_disable(false, 'header')
    this.authenticate.login(this.lusername, this.lpassword)
        .pipe(first())
        .subscribe(
            data => {
              if (data) {
                location.reload();
              }
            },
            error => {
                alert(error)
                this.enable_disable(true, 'header')
              });
  }

  send() {
    if (this.username.length < 4) {
      alert("Username length must be more than 4!")
      return
    }
    if(this.password.length < 4){
      alert("Password length must be more than 4!")
      return
    }
    if(this.first_name.length < 1) {
      alert("First name is short!")
      return
    }
    if(this.last_name.length < 1) {
      alert("Last name is short!")
      return
    }
    this.enable_disable(false, 'registration')
    this.authenticate.registrate(this.username, this.password, this.first_name, this.last_name).subscribe(
      data => {
        data.subscribe(data => {
          location.reload();
        })
      },
      error => {
        alert(error)
        this.enable_disable(true, 'registration')
      }
    )
  }

  logout(){
    this.authenticate.logout();
  }

  enable_disable(type: boolean, content: string) {
    if(type) {
      document.getElementById(content).classList.remove('disabled');
    }
    else {
      document.getElementById(content).classList.add('disabled');
    }
  }
}
