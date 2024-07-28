import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contacts, Contact, ContactField, ContactFieldType, ContactFindOptions, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public router: Router, private contacts: Contacts) { }

  SelectedMenu: any;
  myContacts: Contact[] = [];
  FirstLetters: { [key: string]: Contact[] } = {};
  InviteUser: boolean = false

  ionViewWillEnter() {
    this.InviteUser = false
    this.SelectedMenu = 2;
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

  onSelectMenu(id: any) {
    this.SelectedMenu = id;
    if (id == 4) {
      this.getContacts();
    }
  }

}
