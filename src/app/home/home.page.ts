import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contacts, Contact, ContactField, ContactFieldType, ContactFindOptions, ContactName } from '@ionic-native/contacts/ngx';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public router: Router, private contacts: Contacts, public api: ApiService) { }

  SelectedMenu: any;
  myContacts: Contact[] = [];
  FirstLetters: { [key: string]: Contact[] } = {};
  InviteUser: boolean = false
  chatActive: boolean = false

  ionViewWillEnter() {
    this.InviteUser = false
    this.chatActive = false
    this.SelectedMenu = 2;

    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const used: any = estimate.usage;
        const total: any = estimate.quota;
        const free = total - used;

        console.log(`Used storage: ${(used / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`Total storage: ${(total / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`Free storage: ${(free / (1024 * 1024)).toFixed(2)} MB`);
      });
    } else {
      console.log('Storage API not supported');
    }
    this.getAllUsers();
  }

  getAllUsers() {
    const UserId = localStorage.getItem('userId');
    this.api.getAllUsers(UserId).subscribe({
      next: (res => {
        console.log(res);
      }), error: (err => {
        console.log(err);
      })
    })
  }


  doLogout(event: any) {
    event.preventDefault();
    localStorage.clear();
    this.router.navigate(['/Login']);
  }

  getContacts() {
    let fields: ContactFieldType[] = ['displayName', 'phoneNumbers'];
    let options: any = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    options.hasPhoneNumber = true;

    this.contacts.find(fields, options)?.then((contacts: Contact[]) => {
      let simplifiedContacts: any = contacts?.map(contact => {
        return {
          name: contact?.displayName || (contact?.name && contact?.name?.formatted) || 'No Name',
          phoneNumbers: contact?.phoneNumbers ? contact?.phoneNumbers?.map(phone => phone?.value) : []
        };
      });

      this.myContacts = simplifiedContacts;
      this.groupContacts(); // Call the grouping function here
      console.log(simplifiedContacts);
    });
  }

  groupContacts() {
    this.FirstLetters = this.myContacts.reduce((groups: any, contact: any) => {
      const letter = contact.name.charAt(0).toUpperCase();
      groups[letter] = groups[letter] || [];
      groups[letter].push(contact);
      return groups;
    }, {});
  }

  inviteUser() {
    this.InviteUser = true;
  }

  InviteUserClose() {
    this.InviteUser = false;
  }

  genrateCode(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async doInvite() {
    const Email: any = document.getElementById('InviteEmail');
    const Message: any = document.getElementById('InviteMessage');
    const Code: any = await this.genrateCode(10);
    let post = {
      "email": Email?.value,
      "message": Message?.value,
      "redirectLink": "http://localhost:8100/EnterWithCode",
      "author": {
        "inviteFrom": localStorage.getItem('userId'),
        "code": Code
      }
    };

    console.log(post);

    this.api.inviteUser(post).subscribe({
      next: (res => {
        console.log('Server response:', res);
        this.InviteUser = false;
      }),
      error: (err => {
        console.log('Error occurred:', err);
        this.InviteUser = false;
      })
    });
  }


  onSelectMenu(id: any) {
    this.SelectedMenu = id;
    if (id == 4) {
      this.getContacts();
    }
  }

  IndividualChat() {
    this.chatActive = !this.chatActive
  }

}
