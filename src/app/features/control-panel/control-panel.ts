import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LayerConfig } from '../../models/layer-config.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-panel',
  imports: [FormsModule, CommonModule],
  templateUrl: './control-panel.html',
  standalone: true,
  styleUrls: ['./control-panel.css']
})
export class ControlPanel {
  @Input() config!: LayerConfig;
  @Output() configChange = new EventEmitter<LayerConfig>();
  @Output() generate = new EventEmitter<number>();

  numberOfPoints = 100;
  showHelp = false;
  
  minWeight = -5;
  maxWeight = 5;
  weightStep = 0.1;
  
  minBias = -5;
  maxBias = 5;
  biasStep = 0.1;

  // Stato delle sezioni dell'accordion
  expandedSections: { [key: string]: boolean } = {
    'weights': false,
    'activation': false,
    'dataset': false
  };

  activationFunctions = [
    { 
      value: 'linear', 
      name: 'Linear', 
      icon: '📈',
      description: 'Nessuna trasformazione',
      detailedDescription: 'Mantiene i valori invariati. Utile per problemi di regressione lineare.',
      formula: 'f(x) = x',
      properties: ['Range: (-∞, ∞)', 'Derivata costante', 'Nessuna non-linearità']
    },
    { 
      value: 'sigmoid', 
      name: 'Sigmoid', 
      icon: 'S',
      description: 'Comprime in [0, 1]',
      detailedDescription: 'Ideale per probabilità e classificazione binaria. Soffre di vanishing gradient.',
      formula: 'f(x) = 1/(1+e⁻ˣ)',
      properties: ['Range: (0, 1)', 'Derivata: f(x)(1-f(x))', 'Output interpretabile come probabilità']
    },
    { 
      value: 'relu', 
      name: 'ReLU', 
      icon: 'R',
      description: 'Attiva solo valori positivi',
      detailedDescription: 'La più usata nelle reti profonde. Efficiente ma può morire con gradienti negativi.',
      formula: 'f(x) = max(0, x)',
      properties: ['Range: [0, ∞)', 'Sparsità', 'Nessun vanishing gradient per x>0']
    },
    { 
      value: 'tanh', 
      name: 'Tanh', 
      icon: 'T',
      description: 'Comprime in [-1, 1]',
      detailedDescription: 'Simile a sigmoid ma centrato a zero. Output negativo possibile.',
      formula: 'f(x) = tanh(x)',
      properties: ['Range: (-1, 1)', 'Output centrato', 'Utile per dati con valori negativi']
    }
  ];

  get selectedActivation() {
    return this.activationFunctions.find(act => act.value === this.config.activation);
  }

  update() {
    this.configChange.emit(this.config);
  }

  regenerate() {
    this.generate.emit(this.numberOfPoints);
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  resetToDefault() {
    this.config = {
      weight: 1,
      bias: 0,
      activation: 'relu'
    };
    this.numberOfPoints = 100;
    this.update();
  }

  selectActivation(value: string) {
    this.config.activation = value as 'linear' | 'sigmoid' | 'relu' | 'tanh';
    this.update();
  }

  getWeightEffect(): string {
    if (this.config.weight > 0) return 'Crescente ↑';
    if (this.config.weight < 0) return 'Decrescente ↓';
    return 'Costante';
  }

  getBiasEffect(): string {
    if (this.config.bias > 0) return 'Su ↑';
    if (this.config.bias < 0) return 'Giù ↓';
    return 'Centrato';
  }

  getSliderPosition(value: number, min: number, max: number): string {
    const percentage = ((value - min) / (max - min)) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  }

  getActivationName(value: string): string {
    return this.activationFunctions.find(act => act.value === value)?.name || value;
  }

  getActivationFormula(): string {
    switch(this.config.activation) {
      case 'linear': return 'f(x) = x';
      case 'sigmoid': return 'f(x) = 1/(1+e⁻ˣ)';
      case 'relu': return 'f(x) = max(0, x)';
      case 'tanh': return 'f(x) = tanh(x)';
      default: return '';
    }
  }

  calculateExample(x: number): number {
    const linear = this.config.weight * x + this.config.bias;
    
    switch(this.config.activation) {
      case 'linear': return linear;
      case 'sigmoid': return 1 / (1 + Math.exp(-linear));
      case 'relu': return Math.max(0, linear);
      case 'tanh': return Math.tanh(linear);
      default: return linear;
    }
  }
}