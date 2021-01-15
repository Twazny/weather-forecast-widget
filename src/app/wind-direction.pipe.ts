import { Pipe, PipeTransform } from '@angular/core';
import { WindDirection } from './forecast.service'

@Pipe({
  name: 'windDirection'
})
export class WindDirectionPipe implements PipeTransform {

  transform(value: WindDirection): string {
    switch (value) {
      case WindDirection.N:
        return "Północny"
      case WindDirection.NE:
        return "Pn.-Wsch."
      case WindDirection.E:
        return "Wschodni"
      case WindDirection.SE:
        return "Pd.-Wsch."
      case WindDirection.S:
        return "Południowy"
      case WindDirection.SW:
        return "Pd.-Zach."
      case WindDirection.W:
        return "Zachodni"
      case WindDirection.NW:
        return "Pn.-Zach."
    }
  }
}
