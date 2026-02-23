import { Injectable } from '@angular/core';
import { Point } from '../models/point.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  generateLinearPoints(n: number): Point[] {
    const points: Point[] = [];

    for (let i = 0; i < n; i++) {
      const x = Math.random() * 10 - 5;
      const y = 2 * x + 1 + (Math.random() - 0.5); // rumore
      points.push({ x, y });
    }

    return points;
  }
}
