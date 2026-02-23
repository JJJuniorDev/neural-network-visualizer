import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayerConfig } from '../models/layer-config.model';
import { Point } from '../models/point.model';
import { DataService } from '../services/data.service';
import { MathService } from '../services/math.service';
import { ControlPanel } from '../features/control-panel/control-panel';
import { Visualization } from '../features/visualization/visualization';
import { ProcessView } from '../features/process-view/process-view';
import { TaskAdvisor } from '../task-advisor/task-advisor';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ControlPanel,
    Visualization,
    ProcessView,
    TaskAdvisor
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
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
    private mathService: MathService,
    private router: Router
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

  goToDatasetGuide() {
    this.router.navigate(['/dataset-guide']);
  }
}