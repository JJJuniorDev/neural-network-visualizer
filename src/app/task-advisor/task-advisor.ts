import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayerConfig } from '../models/layer-config.model';
interface DataPattern {
  value: string;
  name: string;
  icon: string;
  description: string;
}

interface TaskType {
  value: string;
  name: string;
  icon: string;
  description: string;
}

interface Suggestion {
  task: string;
  dataPattern: string;
  activation: string;
  weightHint: string;
  biasHint: string;
  explanation: string;
  whyThisWorks: string;
  architecture: string[];
  pros: string[];
  cons: string[];
}

@Component({
  selector: 'app-task-advisor',
  standalone: true,
  templateUrl: './task-advisor.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./task-advisor.css']
})
export class TaskAdvisor {
  @Input() config!: LayerConfig;
  @Output() configChange = new EventEmitter<LayerConfig>();
  @Output() suggestionApplied = new EventEmitter<void>();

  expanded = true;
  
  selectedTask: string = '';
  selectedPattern: string = '';

  tasks: TaskType[] = [
    { value: 'binary', name: 'Binary Classification', icon: '⚪', description: '2 classi (es. gatto/cane)' },
    { value: 'multiclass', name: 'Multi-class', icon: '🔴🟡🔵', description: '3+ classi' },
    { value: 'regression', name: 'Regression', icon: '📈', description: 'Valori continui' },
    { value: 'forecast', name: 'Time Series', icon: '📊', description: 'Previsione temporale' }
  ];

  dataPatterns: DataPattern[] = [
    { value: 'linear', name: 'Linear', icon: '📏', description: 'Separabile linearmente' },
    { value: 'spiral', name: 'Spiral', icon: '🌀', description: 'Pattern a spirale' },
    { value: 'circles', name: 'Concentric', icon: '⭕', description: 'Cerchi concentrici' },
    { value: 'xor', name: 'XOR', icon: '✖️', description: 'Pattern XOR' },
    { value: 'clusters', name: 'Clusters', icon: '🔴🔵', description: 'Gruppi distinti' },
    { value: 'nonlinear', name: 'Non-linear', icon: '📉', description: 'Relazione complessa' }
  ];

  suggestions: Suggestion[] = [
    // Binary Classification
    {
      task: 'binary',
      dataPattern: 'linear',
      activation: 'sigmoid',
      weightHint: '~1.0',
      biasHint: '~0.0',
      explanation: 'Dati linearmente separabili: una sigmoide nell\'output layer è sufficiente',
      whyThisWorks: 'La sigmoide produce probabilità tra 0 e 1, perfetta per classificazione binaria. Con dati lineari, pochi neuroni bastano.',
      architecture: ['Input layer', 'Dense layer (4-8 neuroni, ReLU)', 'Output layer (1 neurone, Sigmoid)'],
      pros: ['Semplice', 'Veloce da addestrare', 'Poco rischio di overfitting'],
      cons: ['Potrebbe underfittare pattern complessi', 'Solo per problemi linearmente separabili']
    },
    {
      task: 'binary',
      dataPattern: 'spiral',
      activation: 'tanh',
      weightHint: 'valori medi (±2)',
      biasHint: 'leggero bias positivo',
      explanation: 'Pattern a spirale richiede non-linearità: tanh nei layer nascosti',
      whyThisWorks: 'Tanh ha output centrato a zero e gradienti più forti, aiuta a modellare curvature complesse come le spirali',
      architecture: ['Input layer', 'Dense (16-32, Tanh)', 'Dense (8-16, Tanh)', 'Output (1, Sigmoid)'],
      pros: ['Gestisce bene pattern complessi', 'Gradienti forti'],
      cons: ['Più lento da addestrare', 'Richiede più dati']
    },
    {
      task: 'binary',
      dataPattern: 'xor',
      activation: 'relu',
      weightHint: 'alternanza ±',
      biasHint: 'bias importanti',
      explanation: 'XOR richiede almeno un layer nascosto con ReLU',
      whyThisWorks: 'ReLU permette di creare regioni di attivazione discontinue, essenziali per risolvere XOR',
      architecture: ['Input', 'Dense (4, ReLU)', 'Dense (4, ReLU)', 'Output (1, Sigmoid)'],
      pros: ['ReLU evita vanishing gradient', 'Architettura comprovata'],
      cons: ['Morte dei neuroni con learning rate alto']
    },

    // Multi-class Classification
    {
      task: 'multiclass',
      dataPattern: 'clusters',
      activation: 'softmax',
      weightHint: 'uniformi',
      biasHint: 'piccoli bias',
      explanation: 'Per classificazione multi-classe con cluster distinti, softmax nell\'output',
      whyThisWorks: 'Softmax normalizza le uscite in probabilità che sommano a 1, perfetto per K classi',
      architecture: ['Input', 'Dense (n_clusters * 4, ReLU)', 'Output (K neuroni, Softmax)'],
      pros: ['Interpretabile probabilisticamente', 'Semplice'],
      cons: ['Assume cluster ben separati']
    },
    {
      task: 'multiclass',
      dataPattern: 'circles',
      activation: 'tanh',
      weightHint: 'medi',
      biasHint: 'medi',
      explanation: 'Cerchi concentrici richiedono decision boundaries circolari',
      whyThisWorks: 'Tanh con layer multipli può creare regioni di decisione sferiche',
      architecture: ['Input', 'Dense (32, Tanh)', 'Dense (16, Tanh)', 'Output (K, Softmax)'],
      pros: ['Cattura bene geometrie radiali'],
      cons: ['Sensibile all\'inizializzazione']
    },

    // Regression
    {
      task: 'regression',
      dataPattern: 'linear',
      activation: 'linear',
      weightHint: 'direttamente proporzionale',
      biasHint: 'intercetta',
      explanation: 'Regressione lineare: nessuna attivazione nell\'output',
      whyThisWorks: 'Output lineare permette di predire qualsiasi valore continuo senza limiti',
      architecture: ['Input', 'Dense (1, Linear)'],
      pros: ['Semplicissimo', 'Interpretabile'],
      cons: ['Solo relazioni lineari']
    },
    {
      task: 'regression',
      dataPattern: 'nonlinear',
      activation: 'relu',
      weightHint: 'vari',
      biasHint: 'piccoli',
      explanation: 'Regressione non-lineare: ReLU nei layer nascosti',
      whyThisWorks: 'ReLU permette di approssimare qualsiasi funzione continua con abbastanza neuroni',
      architecture: ['Input', 'Dense (64, ReLU)', 'Dense (32, ReLU)', 'Dense (1, Linear)'],
      pros: ['Universal approximator', 'Efficiente'],
      cons: ['Rischio overfitting']
    },

    // Time Series
    {
      task: 'forecast',
      dataPattern: 'linear',
      activation: 'linear',
      weightHint: 'trend',
      biasHint: 'seasonal',
      explanation: 'Serie temporali lineari: output lineare con pesi che catturano trend',
      whyThisWorks: 'La linearità nell\'output mantiene la tendenza temporale',
      architecture: ['Input (finestra temporale)', 'Dense (1, Linear)'],
      pros: ['Cattura trend', 'Semplice'],
      cons: ['No stagionalità complessa']
    },
    {
      task: 'forecast',
      dataPattern: 'nonlinear',
      activation: 'tanh',
      weightHint: 'combinazioni',
      biasHint: 'cicliche',
      explanation: 'Serie non-lineari: tanh per pattern stagionali complessi',
      whyThisWorks: 'Tanh può modellare cicli e oscillazioni grazie alla sua natura periodica',
      architecture: ['Input (window)', 'Dense (32, Tanh)', 'Dense (16, Tanh)', 'Dense (1, Linear)'],
      pros: ['Cattura stagionalità', 'Pattern complessi'],
      cons: ['Difficile da addestrare']
    }
  ];

  get currentSuggestion(): Suggestion | undefined {
    if (!this.selectedTask || !this.selectedPattern) return undefined;
    return this.suggestions.find(s => 
      s.task === this.selectedTask && s.dataPattern === this.selectedPattern
    );
  }

  selectTask(task: string) {
    this.selectedTask = task;
  }

  selectPattern(pattern: string) {
    this.selectedPattern = pattern;
  }

  getTaskName(value: string): string {
    return this.tasks.find(t => t.value === value)?.name || value;
  }

  getPatternName(value: string): string {
    return this.dataPatterns.find(p => p.value === value)?.name || value;
  }

  getActivationName(value: string): string {
    const names: {[key: string]: string} = {
      'linear': 'Linear',
      'sigmoid': 'Sigmoid',
      'relu': 'ReLU',
      'tanh': 'Tanh',
      'softmax': 'Softmax'
    };
    return names[value] || value;
  }

  getActivationColor(activation: string): string {
    const colors: {[key: string]: string} = {
      'linear': '#6c757d',
      'sigmoid': '#f72585',
      'relu': '#06d6a0',
      'tanh': '#4361ee',
      'softmax': '#7209b7'
    };
    return colors[activation] || '#6c757d';
  }

  applySuggestion() {
    if (this.currentSuggestion) {
      // Applica la configurazione suggerita
      let weight = 1.0;
      let bias = 0.0;
      
      // Interpreta i suggerimenti testuali
      if (this.currentSuggestion.weightHint.includes('~1')) weight = 1.0;
      if (this.currentSuggestion.weightHint.includes('±2')) weight = 2.0;
      if (this.currentSuggestion.biasHint.includes('positivo')) bias = 0.5;
      if (this.currentSuggestion.biasHint.includes('importanti')) bias = 1.0;

      this.config = {
        ...this.config,
        weight: weight,
        bias: bias,
        activation: this.currentSuggestion.activation as any
      };
      
      this.configChange.emit(this.config);
      this.suggestionApplied.emit();
    }
  }

  applyWeightRange() {
    // Applica range suggerito (esempio)
    if (this.currentSuggestion) {
      // Qui puoi implementare logica più sofisticata
    //  console.log('Apply weight range:', this.currentSuggestion.suggestedWeightRange);
    }
  }

  applyBiasRange() {
    if (this.currentSuggestion) {
    //  console.log('Apply bias range:', this.currentSuggestion.suggestedBiasRange);
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}