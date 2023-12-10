import { Component, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HlmBadgeDirective } from "@spartan-ng/ui-badge-helm";
import {
	BrnTabsComponent,
	BrnTabsContentDirective,
	BrnTabsListComponent,
	BrnTabsTriggerDirective,
} from "@spartan-ng/ui-tabs-brain";
import {
	HlmTabsContentDirective,
	HlmTabsListDirective,
	HlmTabsTriggerDirective,
} from "@spartan-ng/ui-tabs-helm";
import { z } from "zod";

import { LoginFormComponent } from "~/app/components/login-form/login-form.component";
import { RegisterFormComponent } from "~/app/components/register-form/register-form.component";

const tabSchema = z.enum(["login", "register"]);
type Tab = z.infer<typeof tabSchema>;

@Component({
	selector: "auth-component",
	standalone: true,
	imports: [
		BrnTabsComponent,
		BrnTabsListComponent,
		BrnTabsTriggerDirective,
		BrnTabsContentDirective,

		HlmTabsListDirective,
		HlmTabsTriggerDirective,
		HlmTabsContentDirective,

		HlmBadgeDirective,

		LoginFormComponent,
		RegisterFormComponent,
	],
	templateUrl: "./auth.component.html",
})
export class AuthComponent {
	#route = inject(ActivatedRoute);
	#router = inject(Router);
	tab = signal<Tab>("login");

	constructor() {
		effect(() => {
			this.#router.navigate([], {
				relativeTo: this.#route,
				queryParams: { tab: this.tab() },
			});
		});
	}

	ngOnInit(): void {
		this.#route.queryParamMap.subscribe((params) => {
			const parsedTab = tabSchema.safeParse(params.get("tab"));

			if (parsedTab.success) this.tab.set(parsedTab.data);
		});
	}

	changeTab(tab: Tab) {
		this.tab.set(tab);
	}
}
