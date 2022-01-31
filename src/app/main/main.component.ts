import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member, Queue, User, Status } from '../models';
import { AuthenticationService, QueueService } from '../services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  members: Member[] = [];
  queue: Queue = null;
  user: User = null;
  status = Status.Guest;

  comment = ""
  loadinginfo = true;
  loadingmembers = true;

  constructor(private route: ActivatedRoute, private service: QueueService, private router: Router, private authenticate: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticate.user().subscribe(
      data => {
        this.user = data;
        if(this.route.snapshot.paramMap.get('code').length == 8 && !isNaN(+this.route.snapshot.paramMap.get('code'))) {
          let code = +this.route.snapshot.paramMap.get('code');
          this.service.getQueueInfo(code).subscribe(
            queue => {
              this.queue = queue;
              this.loadinginfo = false;
              if(data && queue) {
                if(data.id == queue.owner.id) {
                  this.status = Status.Admin;
                }
                else {
                  this.status = Status.User;
                }
              }
            }
          )
          this.service.getQueueMembers(code).subscribe(
            members => {
              this.members = members
              this.loadingmembers = false;
            }
          )
        }
        else {
          this.router.navigate([''])
        }
      }
    )
  }

  getisin(): boolean {
    for(let i = 0; i < this.members.length; i++) {
      if(this.members[i].user.id == this.user.id) {
        return true;
      }
    }
    return false;
  }

  getisactive(): boolean {
    if(this.getisin()) {
      for(let i = 0; i < this.members.length; i++) {
        if(this.members[i].user.id == this.user.id) {
          return this.members[i].active;
        }
      }
      return false;
    }
  }

  join() {
    if(!this.getisin()) {
      this.enable_disable(false, 'main')
      this.service.insertQueue(this.queue.code, this.comment).subscribe(
        data => {
          alert('Joined')
          location.reload()
        }
      )
    }
  }

  remove() {
    if(this.getisin()) {
      let conf = confirm("Do you want to remove yourself from this queue? It cannot be undone!")
      if(conf) {
        this.enable_disable(false, 'main')
        this.service.removefromQueue(this.queue.code).subscribe(
          data => {
            location.reload()
          }
        )
      }
    }
  }

  removeMember(id: number) {
    let conf = confirm("Remove from this queue? It cannot be undone!")
    if(conf) {
      this.service.removefromQueue(this.queue.code, true, id).subscribe(
        data => {
          alert("Ok")
          location.reload()
        }
      )
    }
  }
  
  delete() {
    let conf = confirm("Do you really want to delete this Queue permanently? It can not be undone!")
    if(conf) {
      this.service.deleteQueue(this.queue.code).subscribe(
        data => {
          alert("Ok");
          location.reload()
        }
      )
    }
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