import { Component, Input } from '@angular/core';
import { LayerConfig } from '../../models/layer-config.model';

@Component({
  selector: 'app-process-view',
  imports: [],
  templateUrl: './process-view.html',
    standalone: true,
  styleUrl: './process-view.css',
})
export class ProcessView {
 @Input() config!: LayerConfig;
}
