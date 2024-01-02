import {
	Component,
	HostBinding,
	OnInit,
	effect,
	inject,
	signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BrnTabsModule } from "@spartan-ng/ui-tabs-brain";
import { z } from "zod";

import { LoginFormComponent } from "~/app/components/login-form/login-form.component";
import { RegisterFormComponent } from "~/app/components/register-form/register-form.component";
import { HlmBadgeModule } from "~/ui/ui-badge-helm/src";
import { HlmTabsModule } from "~/ui/ui-tabs-helm/src";

const tabSchema = z.enum(["login", "register"]);
type Tab = z.infer<typeof tabSchema>;

@Component({
	selector: "app-auth-component",
	standalone: true,
	imports: [
		BrnTabsModule,

		HlmTabsModule,
		HlmBadgeModule,

		LoginFormComponent,
		RegisterFormComponent,
	],
	templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnInit {
	@HostBinding("class") class = "flex justify-center pt-12 md:pt-36 w-full";

	#route = inject(ActivatedRoute);
	#router = inject(Router);
	tab = signal<Tab>("login");

	constructor() {
		effect(() => {
			void this.#router.navigate([], {
				relativeTo: this.#route,
				queryParams: { tab: this.tab() },
			});
		});
	}

	ngOnInit(): void {
		this.#route.queryParamMap.subscribe((params) => {
			const parsedTab = tabSchema.safeParse(params.get("tab"));

			if (parsedTab.success) this.changeTab(parsedTab.data);
		});
	}

	changeTab(tab: Tab) {
		this.tab.set(tab);
	}
}
