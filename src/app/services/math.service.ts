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
leakyRelu(x: number, alpha: number = 0.01): number {
    return x > 0 ? x : alpha * x;
  }

  elu(x: number, alpha: number = 1.0): number {
    return x > 0 ? x : alpha * (Math.exp(x) - 1);
  }

  selu(x: number): number {
    const alpha = 1.6732632423543772848170429916717;
    const scale = 1.0507009873554804934193349852946;
    return scale * (x > 0 ? x : alpha * (Math.exp(x) - 1));
  }

  swish(x: number): number {
    return x * this.sigmoid(x);
  }

  mish(x: number): number {
    return x * Math.tanh(Math.log(1 + Math.exp(x)));
  }

  gelu(x: number): number {
    // Approssimazione di GELU
    return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
  }

  softplus(x: number): number {
    return Math.log(1 + Math.exp(x));
  }

  softmax(x: number, allOutputs?: number[]): number {
    // Per un singolo valore in contesto binario
    if (!allOutputs) {
      return Math.exp(x) / (Math.exp(x) + 1);
    }
    // Per array di valori (softmax completo)
    const max = Math.max(...allOutputs);
    const exps = allOutputs.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return Math.exp(x - max) / sum;
  }

  prelu(x: number, alpha: number = 0.01): number {
    // In una implementazione reale, alpha sarebbe appreso
    // Qui usiamo un valore fisso per demo
    return x > 0 ? x : alpha * x;
  }

  applyActivation(x: number, type: string): number {
    switch(type) {
      // Base
      case 'linear': return x;
      case 'sigmoid': return this.sigmoid(x);
      case 'relu': return this.relu(x);
      case 'tanh': return this.tanh(x);
      
      // ReLU Family
      case 'leaky_relu': return this.leakyRelu(x);
      case 'prelu': return this.prelu(x);
      case 'elu': return this.elu(x);
      case 'selu': return this.selu(x);
      
      // Modern
      case 'swish': return this.swish(x);
      case 'mish': return this.mish(x);
      case 'gelu': return this.gelu(x);
      case 'softplus': return this.softplus(x);
      
      // Special
      case 'softmax': return this.softmax(x);
      
      default: return x;
    }
  }
}
