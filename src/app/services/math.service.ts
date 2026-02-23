import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  linear(x: number, w: number, b: number): number {
    return w * x + b;
  }

  sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  relu(x: number): number {
    return Math.max(0, x);
  }

  tanh(x: number): number {
    return Math.tanh(x);
  }

  applyActivation(x: number, type: string): number {
    switch(type) {
      case 'sigmoid': return this.sigmoid(x);
      case 'relu': return this.relu(x);
      case 'tanh': return this.tanh(x);
      default: return x;
    }
  }
}
