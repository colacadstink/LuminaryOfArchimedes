import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LorcanaAPI} from "lorcana-api";
import {MushuWikiService} from "./services/mushu-wiki.service";
import {CardPickerComponent} from "./components/card-picker/card-picker.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CardPickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    {provide: LorcanaAPI, useValue: new LorcanaAPI()},
  ],
})
export class AppComponent implements OnInit {
  loaded = false;
  error: any | undefined;

  constructor(
    private api: LorcanaAPI,
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
}
