import { Component, OnInit } from '@angular/core';
import { Contacts, Contact, ContactField, ContactFieldType, ContactFindOptions, ContactName } from '@ionic-native/contacts/ngx';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {

  allContacts: Contact[] = [];

  constructor(private contacts: Contacts) { }

  getContacts() {
    let fields: ContactFieldType[] = ['displayName', 'phoneNumbers'];
    let options: any = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    options.hasPhoneNumber = true;

    this.contacts.find(fields, options)?.then((contacts: Contact[]) => {
      let simplifiedContacts = contacts?.map(contact => {
        return {
          name: contact?.displayName || (contact?.name && contact?.name?.formatted) || 'No Name',
          phoneNumbers: contact?.phoneNumbers ? contact?.phoneNumbers?.map(phone => phone?.value) : []
        };
      });

      console.log(simplifiedContacts);
    });
  }

}


// {
//   "_objectInstance": {
//     "id": "143",
//       "rawId": null,
//         "displayName": "Appa 💫",
//           "name": {
//       "familyName": "💫",
//         "givenName": "Appa",
//           "formatted": "Appa 💫"
//     },
//     "nickname": null,
//       "phoneNumbers": [
//         {
//           "id": "493",
//           "pref": false,
//           "value": "9842313473",
//           "type": "mobile"
//         }
//       ],
//         "emails": null,
//           "addresses": null,
//             "ims": null,
//               "organizations": null,
//                 "birthday": null,
//                   "note": null,
//                     "photos": [
//                       {
//                         "id": "806",
//                         "pref": false,
//                         "type": "url",
//                         "value": "content://com.android.contacts/contacts/143/photo"
//                       }
//                     ],
//                       "categories": null,
//                         "urls": null
//   },
//   "rawId": "143"
// }