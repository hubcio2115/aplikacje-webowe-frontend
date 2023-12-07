import { Component } from "@angular/core";
import { HlmBadgeDirective } from "@spartan-ng/ui-badge-helm";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from "@spartan-ng/ui-card-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
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

		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,

		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,
		HlmBadgeDirective,
	],
	templateUrl: "./login.component.html",
})
export class AuthComponent {}
