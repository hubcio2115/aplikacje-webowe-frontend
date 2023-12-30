import { NgOptimizedImage } from "@angular/common";
import { Component, HostBinding } from "@angular/core";
import { RouterLink } from "@angular/router";

import { HlmButtonModule } from "~/ui/ui-button-helm/src";

@Component({
	selector: "app-page-not-found",
	standalone: true,
	imports: [NgOptimizedImage, HlmButtonModule, RouterLink],
	templateUrl: "./page-not-found.component.html",
})
export class PageNotFoundComponent {
	@HostBinding("class") class =
		"flex min-h-full justify-center items-center w-full gap-4 flex-col";
}
