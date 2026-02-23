import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayerConfig } from './models/layer-config.model';
import { Point } from './models/point.model';
import { DataService } from './services/data.service';
import { MathService } from './services/math.service';
import { FormsModule } from '@angular/forms';
import { ControlPanel } from './features/control-panel/control-panel';
import { Visualization } from './features/visualization/visualization';
import { ProcessView } from './features/process-view/process-view';
import { TaskAdvisor } from './task-advisor/task-advisor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    FormsModule,
    ControlPanel,
    Visualization,
    ProcessView,
    TaskAdvisor
  ],
  providers: [DataService, MathService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ml-geometry-explorer');

points: Point[] = [];
  transformedPoints: Point[] = [];
linearPoints: Point[] = [];

  config: LayerConfig = {
    weight: 1,
    bias: 0,
    activation: 'linear'
  };

  constructor(
    private dataService: DataService,
    private mathService: MathService
  ) {}

  ngOnInit() {
    this.generateData(100);
  }

  generateData(n: number) {
    this.points = this.dataService.generateLinearPoints(n);
    this.applyTransformation();
  }

  updateConfig(config: LayerConfig) {
    this.config = config;
    this.applyTransformation();
  }

  applyTransformation() {
     this.linearPoints = this.points.map(p => {
    return { x: p.x, y: this.mathService.linear(p.x, this.config.weight, this.config.bias) };
  });
    this.transformedPoints = this.linearPoints.map(p => {
    return { x: p.x, y: this.mathService.applyActivation(p.y, this.config.activation) };
  });
}
}
