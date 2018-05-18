import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'inarts-error',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
    routeParams;

    constructor(
        private activatedRoute: ActivatedRoute,
        
    ) { }

    ngOnInit(): void {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
    }
}
