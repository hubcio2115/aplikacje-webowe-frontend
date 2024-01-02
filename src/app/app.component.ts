import { CommonModule } from "@angular/common";
import { Component, HostBinding } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AngularQueryDevtools } from "@tanstack/angular-query-devtools-experimental";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, RouterOutlet, AngularQueryDevtools],
	template: `
		<router-outlet />
		<angular-query-devtools />
	`,
})
export class AppComponent {
	@HostBinding("class") class = "flex";
}
