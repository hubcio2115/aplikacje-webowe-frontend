import { Component, HostBinding, computed, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { provideIcons } from "@ng-icons/core";
import {
	radixEnter,
	radixExit,
	radixGear,
	radixPerson,
} from "@ng-icons/radix-icons";
import { BrnMenuModule } from "@spartan-ng/ui-menu-brain";

import { AuthService } from "~/app/shared/services/auth.service";
import { HlmAvatarModule } from "~/ui/ui-avatar-helm/src";
import { HlmButtonModule } from "~/ui/ui-button-helm/src";
import { HlmIconModule } from "~/ui/ui-icon-helm/src";
import { HlmMenuModule } from "~/ui/ui-menu-helm/src";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,

		HlmAvatarModule,

		HlmButtonModule,
		HlmIconModule,

		BrnMenuModule,
		HlmMenuModule,
	],
	templateUrl: "./navbar.component.html",
	providers: [
		provideIcons({
			radixPerson,
			radixEnter,
			radixExit,
			radixGear,
		}),
	],
})
export class NavbarComponent {
	@HostBinding("class") class = "flex flex-col w-full min-h-screen";

	readonly authService = inject(AuthService);

	readonly userInitials = computed(() => {
		const firstName = this.authService.getAuthStore().user()?.firstName ?? "";
		const lastName = this.authService.getAuthStore().user()?.lastName ?? "";

		if (!firstName.length || !lastName.length) return "";

		return firstName[0].toUpperCase() + lastName[0].toUpperCase();
	});

	handleLogout() {
		this.authService.logout();
	}
}
