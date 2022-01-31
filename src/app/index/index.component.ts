import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Queue } from '../models';
import { QueueService } from '../services';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  queues: Queue[] = [];
  title = ""

  authorized = false;

  loading = true;

  adding = false;
  
  constructor(private service: QueueService, private router: Router) { }

  ngOnInit(): void {
    this.service.getQueues().subscribe(
      (data) => {
        if(data) {
          this.authorized = true
          this.queues = data;
        }
        this.loading = false;
      }
    )
  }

  addQueue(): void {
    this.adding = true;
    this.enable_disable(false, 'queues')
  }

  cancel(){
    this.adding = false;
    this.enable_disable(true, 'queues')
  }

  go(code){
    this.router.navigate([`/${code}`])
  }
  
  send() {
    if(this.title.length < 4) {
      alert("Title is short!")
      return
    }
    this.enable_disable(false, 'add-queue')
    this.service.addQueue(this.title).subscribe(
      data => {
        location.reload();
      }
    )
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
