import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userId: any;
  
  constructor(public router: Router) {
    if (localStorage.getItem('login') != 'true') {
      this.router.navigate(['/Login']);
    }
    this.userId = localStorage.getItem('userId')
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId')
  }

  navigate(data: any) {
    this.router.navigate(['/' + data]);
  }

}
