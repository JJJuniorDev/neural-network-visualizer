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
    // Funzioni base
    { 
      value: 'linear', 
      name: 'Linear', 
      icon: '📈',
      category: 'base',
      description: 'Nessuna trasformazione',
      detailedDescription: 'Mantiene i valori invariati. Utile per problemi di regressione lineare.',
      formula: 'f(x) = x',
      properties: ['Range: (-∞, ∞)', 'Derivata costante', 'Nessuna non-linearità']
    },
    { 
      value: 'sigmoid', 
      name: 'Sigmoid', 
      icon: 'S',
      category: 'base',
      description: 'Comprime in [0, 1]',
      detailedDescription: 'Ideale per probabilità e classificazione binaria. Soffre di vanishing gradient.',
      formula: 'f(x) = 1/(1+e⁻ˣ)',
      properties: ['Range: (0, 1)', 'Derivata: f(x)(1-f(x))', 'Output interpretabile come probabilità']
    },
    { 
      value: 'relu', 
      name: 'ReLU', 
      icon: 'R',
      category: 'base',
      description: 'Attiva solo valori positivi',
      detailedDescription: 'La più usata nelle reti profonde. Efficiente ma può morire con gradienti negativi.',
      formula: 'f(x) = max(0, x)',
      properties: ['Range: [0, ∞)', 'Sparsità', 'Nessun vanishing gradient per x>0']
    },
    { 
      value: 'tanh', 
      name: 'Tanh', 
      icon: 'T',
      category: 'base',
      description: 'Comprime in [-1, 1]',
      detailedDescription: 'Simile a sigmoid ma centrato a zero. Output negativo possibile.',
      formula: 'f(x) = tanh(x)',
      properties: ['Range: (-1, 1)', 'Output centrato', 'Utile per dati con valori negativi']
    },

    // Famiglia ReLU
    { 
      value: 'leaky_relu', 
      name: 'Leaky ReLU', 
      icon: 'L',
      category: 'relu_family',
      description: 'ReLU con pendenza per negativi',
      detailedDescription: 'Permette un piccolo gradiente anche per x<0 (di solito α=0.01). Risolve il problema "dying ReLU".',
      formula: 'f(x) = max(0.01x, x)',
      properties: ['Range: (-∞, ∞)', 'Previene la morte dei neuroni', 'α spesso 0.01']
    },
    { 
      value: 'prelu', 
      name: 'PReLU', 
      icon: 'P',
      category: 'relu_family',
      description: 'Parametric ReLU',
      detailedDescription: 'Come Leaky ReLU ma il coefficiente α viene appreso durante l\'addestramento.',
      formula: 'f(x) = max(ax, x) con a appreso',
      properties: ['Range: (-∞, ∞)', 'Parametro apprendibile', 'Massima flessibilità']
    },
    { 
      value: 'elu', 
      name: 'ELU', 
      icon: 'E',
      category: 'relu_family',
      description: 'Exponential LU',
      detailedDescription: 'Transizione liscia verso zero per valori negativi. Output medio più vicino a zero.',
      formula: 'f(x) = x per x>0, α(eˣ-1) per x≤0',
      properties: ['Range: (-α, ∞)', 'Transizione liscia', 'Output centrato']
    },
    { 
      value: 'selu', 
      name: 'SELU', 
      icon: '⚡',
      category: 'relu_family',
      description: 'Scaled ELU',
      detailedDescription: 'Auto-normalizzante - mantiene media e varianza costanti attraverso i layer.',
      formula: 'f(x) = λ·ELU(x, α) con λ≈1.05, α≈1.67',
      properties: ['Auto-normalizzante', 'Media=0, Varianza=1', 'Evita batch norm']
    },

    // Funzioni moderne
    { 
      value: 'swish', 
      name: 'Swish', 
      icon: '🐍',
      category: 'modern',
      description: 'x·sigmoid(x)',
      detailedDescription: 'Funzione liscia e non monotona. Spesso supera ReLU in reti molto profonde.',
      formula: 'f(x) = x · sigmoid(x)',
      properties: ['Range: (-∞, ∞)', 'Liscia', 'Non monotona']
    },
    { 
      value: 'mish', 
      name: 'Mish', 
      icon: '〽️',
      category: 'modern',
      description: 'x·tanh(softplus(x))',
      detailedDescription: 'Auto-regularizzante, liscia, non monotona. Spesso migliore di Swish.',
      formula: 'f(x) = x · tanh(ln(1+eˣ))',
      properties: ['Range: (-∞, ∞)', 'Auto-regularizzante', 'Superiore a Swish']
    },
    { 
      value: 'gelu', 
      name: 'GELU', 
      icon: '🧠',
      category: 'modern',
      description: 'Gaussian Error LU',
      detailedDescription: 'Usata nei Transformer (BERT, GPT). Pesa l\'input per la probabilità di essere positivo.',
      formula: 'f(x) = x · Φ(x)',
      properties: ['Range: (-∞, ∞)', 'Usata in NLP', 'Transformer']
    },
    { 
      value: 'softplus', 
      name: 'Softplus', 
      icon: '🫧',
      category: 'modern',
      description: 'Versione liscia di ReLU',
      detailedDescription: 'Approssimazione liscia e differenziabile di ReLU.',
      formula: 'f(x) = ln(1+eˣ)',
      properties: ['Range: (0, ∞)', 'Liscia', 'Mai zero']
    },

    // Funzioni speciali
    { 
      value: 'softmax', 
      name: 'Softmax', 
      icon: '🎯',
      category: 'special',
      description: 'Normalizza in probabilità',
      detailedDescription: 'Converte un vettore in distribuzione di probabilità (somma=1). Per classificazione multi-classe.',
      formula: 'σ(zᵢ) = eᶻⁱ/∑ⱼeᶻʲ',
      properties: ['Output: (0,1)', 'Somma = 1', 'Multi-class output']
    }
  ];

  // Getter per categorie
  getBaseActivations() {
    return this.activationFunctions.filter(act => act.category === 'base');
  }

  getReLUFamilies() {
    return this.activationFunctions.filter(act => act.category === 'relu_family');
  }

  getModernActivations() {
    return this.activationFunctions.filter(act => act.category === 'modern');
  }

  getSpecialActivations() {
    return this.activationFunctions.filter(act => act.category === 'special');
  }

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
    this.config.activation = value as any; // Type assertion per gestire i nuovi valori
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
      case 'leaky_relu': return 'f(x) = max(0.01x, x)';
      case 'prelu': return 'f(x) = max(ax, x) con a appreso';
      case 'elu': return 'f(x) = x (x>0), α(eˣ-1) (x≤0)';
      case 'selu': return 'f(x) = λ·ELU(x, α)';
      case 'swish': return 'f(x) = x · sigmoid(x)';
      case 'mish': return 'f(x) = x · tanh(ln(1+eˣ))';
      case 'gelu': return 'f(x) = x · Φ(x)';
      case 'softplus': return 'f(x) = ln(1+eˣ)';
      case 'softmax': return 'σ(zᵢ) = eᶻⁱ/∑ⱼeᶻʲ';
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
      case 'leaky_relu': return linear > 0 ? linear : 0.01 * linear;
      case 'prelu': return linear > 0 ? linear : 0.01 * linear; // Semplificato
      case 'elu': {
        const alpha = 1.0;
        return linear > 0 ? linear : alpha * (Math.exp(linear) - 1);
      }
      case 'selu': {
        const alpha = 1.67326;
        const lambda = 1.0507;
        const elu = linear > 0 ? linear : alpha * (Math.exp(linear) - 1);
        return lambda * elu;
      }
      case 'swish': return linear / (1 + Math.exp(-linear));
      case 'mish': {
        const softplus = Math.log(1 + Math.exp(linear));
        return linear * Math.tanh(softplus);
      }
      case 'gelu': {
        // Approssimazione di GELU
        return 0.5 * linear * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (linear + 0.044715 * Math.pow(linear, 3))));
      }
      case 'softplus': return Math.log(1 + Math.exp(linear));
      case 'softmax': return Math.exp(linear) / (Math.exp(linear) + 1); // Per 2 classi
      default: return linear;
    }
  }

  // Per il colore nel process-view
  getActivationColor(value: string): string {
    const colors: {[key: string]: string} = {
      'linear': '#6c757d',
      'sigmoid': '#f72585',
      'relu': '#06d6a0',
      'tanh': '#4361ee',
      'leaky_relu': '#3a0ca3',
      'prelu': '#7209b7',
      'elu': '#b5179e',
      'selu': '#f72585',
      'swish': '#4cc9f0',
      'mish': '#f8961e',
      'gelu': '#f94144',
      'softplus': '#577590',
      'softmax': '#f9844a'
    };
    return colors[value] || '#6c757d';
  }


  activeCategory: string = 'base'; // Categoria attiva: base, relu, modern, special

// Aggiungi questi metodi nella classe ControlPanel
setActiveCategory(category: string) {
  this.activeCategory = category;
}
}