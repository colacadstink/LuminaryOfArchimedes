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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CardPickerComponent, DefaultViewComponent, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  loaded = false;
  error: any | undefined;

  constructor(
    private api: LorcanaAPIService,
    private mushuWiki: MushuWikiService,
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
  }

  clearCacheAndReload() {
    localStorage.clear();
    location.reload();
  }
}
