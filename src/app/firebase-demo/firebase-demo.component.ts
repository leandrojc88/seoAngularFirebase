import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import 'rxjs/add/operator/take';
import { SeoService } from '../servies/seo/seo.service';

@Component({
  selector: 'firebase-demo',
  templateUrl: './firebase-demo.component.html',
  styleUrls: ['./firebase-demo.component.scss']
})
export class FirebaseDemoComponent implements OnInit {

  ref: AngularFireObject<any>;
  data$: Observable<any>;

  constructor(private seo: SeoService, private db: AngularFireDatabase) { }

  ngOnInit() {
    const ref = this.db.object('demo')
    this.data$ = ref.valueChanges()

    this.data$.take(1).subscribe(data => {
      this.seo.generateTags({
        title: data.title,
        description: data.description,
        image: data.image,
        slug: 'firebase-page'
      })
    })
  }

}
