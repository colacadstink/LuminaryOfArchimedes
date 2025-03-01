import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MushuWikiService} from "./services/mushu-wiki.service";
import {CardPickerComponent} from "./components/card-picker/card-picker.component";
import {DefaultViewComponent} from "./components/default-view/default-view.component";
import {LorcanaAPIService} from "./services/lorcana-api.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SwUpdate} from "@angular/service-worker";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterLink, CardPickerComponent, DefaultViewComponent, MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  loaded = false;
  error: any | undefined;

  constructor(
    private api: LorcanaAPIService,
    private mushuWiki: MushuWikiService,
    private swUpdate: SwUpdate,
  ) {}

  async ngOnInit() {
    try {
      await this.mushuWiki.initPromise;
      await this.api.getCardsList();
    } catch (e) {
      console.error(e);
      this.error = e;
    }
    this.loaded = true;

    this.swUpdate.versionUpdates.subscribe((event) => {
      if(event.type === 'VERSION_READY') {
        location.reload();
      }
    });
    this.swUpdate.unrecoverable.subscribe((event) => {
      console.error(event);
      location.reload();
    })
  }

  clearCacheAndReload() {
    localStorage.clear();
    location.reload();
  }
}
