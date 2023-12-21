import { Pipe, PipeTransform } from "@angular/core";

import { capitalize } from "../utils/capitalize";

@Pipe({
	name: "snakeCaseToSeparateCapitalized",
	standalone: true,
})
export class SnakeCaseToSeparateCapitalizedPipe implements PipeTransform {
	transform(value: string): string {
		return value
			.split("_")
			.map((word) => capitalize(word))
			.join(" ");
	}
}
