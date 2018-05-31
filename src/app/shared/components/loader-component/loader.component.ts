import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'inarts-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    show: boolean;

    constructor(
      private loaderService: LoaderService
    ) { }

    ngOnInit(): void {
      this.loaderService.status.subscribe(val => this.show = val);
    }
}
