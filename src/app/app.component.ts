import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AngularQueryDevtools } from "@tanstack/angular-query-devtools-experimental";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, RouterOutlet, AngularQueryDevtools],
	templateUrl: "./app.component.html",
})
export class AppComponent {}
