import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DataPoint {
  x: number;
  y: number;
  class: number;
}

@Component({
  selector: 'app-dataset-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dataset-guide.html',
  styleUrls: ['./dataset-guide.css']
})
export class DatasetGuide implements OnInit {
  @Output() shapeSelected = new EventEmitter<any>();

  expanded = true;
  selectedShape: any = null;
  
  // Canvas references
  canvasElements: { [key: string]: HTMLCanvasElement } = {};

  constructor(private router: Router) {}

  ngOnInit() {
    // Aspetta che il DOM sia pronto
    setTimeout(() => this.drawAllShapes(), 100);
  }

  // Genera dataset lineare
  generateLinear(): DataPoint[] {
    const points: DataPoint[] = [];
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 10 - 5;
      // Linea con pendenza 1, intercetta 0, più rumore
      const y = x + (Math.random() - 0.5) * 2;
      const class_ = y > x ? 1 : 0;
      points.push({ x, y, class: class_ });
    }
    return points;
  }

  // Genera dataset a spirale
  generateSpiral(): DataPoint[] {
    const points: DataPoint[] = [];
    const n = 100; // punti per classe
    for (let i = 0; i < 2; i++) { // 2 classi
      for (let j = 0; j < n; j++) {
        const r = j / n * 5;
        const t = i * Math.PI * 4 + (j / n) * Math.PI * 4 + (Math.random() - 0.5) * 0.3;
        const x = r * Math.sin(t);
        const y = r * Math.cos(t);
        points.push({ x, y, class: i });
      }
    }
    return points;
  }

  // Genera cerchi concentrici
  generateCircles(): DataPoint[] {
    const points: DataPoint[] = [];
    for (let i = 0; i < 200; i++) {
      const radius = Math.random() > 0.5 ? 3 : 5;
      const angle = Math.random() * Math.PI * 2;
      const x = radius * Math.cos(angle) + (Math.random() - 0.5) * 0.5;
      const y = radius * Math.sin(angle) + (Math.random() - 0.5) * 0.5;
      const class_ = radius > 4 ? 1 : 0;
      points.push({ x, y, class: class_ });
    }
    return points;
  }

  // Genera XOR
  generateXOR(): DataPoint[] {
    const points: DataPoint[] = [];
    const quadrants = [
      { x: -2, y: -2, class: 0 },
      { x: -2, y: 2, class: 1 },
      { x: 2, y: -2, class: 1 },
      { x: 2, y: 2, class: 0 }
    ];
    
    for (let i = 0; i < 200; i++) {
      const q = quadrants[Math.floor(Math.random() * 4)];
      const x = q.x + (Math.random() - 0.5) * 1.5;
      const y = q.y + (Math.random() - 0.5) * 1.5;
      points.push({ x, y, class: q.class });
    }
    return points;
  }

  // Genera blob (cluster)
  generateBlobs(): DataPoint[] {
    const points: DataPoint[] = [];
    const centers = [
      { x: -3, y: -3, class: 0 },
      { x: 3, y: -3, class: 1 },
      { x: 0, y: 3, class: 2 }
    ];
    
    for (let i = 0; i < 200; i++) {
      const center = centers[Math.floor(Math.random() * centers.length)];
      const x = center.x + (Math.random() - 0.5) * 2;
      const y = center.y + (Math.random() - 0.5) * 2;
      points.push({ x, y, class: center.class });
    }
    return points;
  }

  // Genera lune (moons)
  generateMoons(): DataPoint[] {
    const points: DataPoint[] = [];
    for (let i = 0; i < 200; i++) {
      const t = Math.random() * Math.PI;
      if (i < 100) {
        // Prima luna
        const x = Math.cos(t) * 2 - 1;
        const y = Math.sin(t) * 2;
        points.push({ x, y, class: 0 });
      } else {
        // Seconda luna
        const x = Math.cos(t) * 2 + 1;
        const y = Math.sin(t) * 2 - 1;
        points.push({ x, y, class: 1 });
      }
    }
    return points;
  }

  // Disegna una shape su canvas
  drawShape(shapeId: string, points: DataPoint[]) {
    const canvas = document.getElementById(`canvas-${shapeId}`) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Sfondo bianco
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Griglia leggera
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(i * width/5, 0);
      ctx.lineTo(i * width/5, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * height/5);
      ctx.lineTo(width, i * height/5);
      ctx.stroke();
    }
    
    // Trova min/max per normalizzare
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    // Mappa punti su canvas
    points.forEach(p => {
      const x = ((p.x - minX) / (maxX - minX)) * (width - 40) + 20;
      const y = height - (((p.y - minY) / (maxY - minY)) * (height - 40) + 20);
      
      // Colore in base alla classe
      const colors = ['#4361ee', '#f72585', '#06d6a0', '#f77f00'];
      ctx.fillStyle = colors[p.class % colors.length];
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // Disegna tutte le shapes
  drawAllShapes() {
    this.drawShape('linear', this.generateLinear());
    this.drawShape('spiral', this.generateSpiral());
    this.drawShape('circles', this.generateCircles());
    this.drawShape('xor', this.generateXOR());
    this.drawShape('blobs', this.generateBlobs());
    this.drawShape('moons', this.generateMoons());
  }

  allShapes = [
    {
      id: 'linear',
      name: 'Lineare',
      icon: '📏',
      color: '#4361ee',
      generate: () => this.generateLinear(),
      characteristics: ['Relazione rettilinea', 'Separabile linearmente', 'Bassa complessità'],
      approach: 'Modelli lineari o reti con pochi neuroni. Una regressione lineare o un layer denso con attivazione lineare possono bastare.',
      architecture: ['Input layer', 'Dense(1, linear)'],
      pros: ['Semplice', 'Veloce', 'Interpretabile'],
      cons: ['Non cattura pattern complessi', 'Underfitting su dati non lineari']
    },
    {
      id: 'spiral',
      name: 'Spirale',
      icon: '🌀',
      color: '#f72585',
      generate: () => this.generateSpiral(),
      characteristics: ['Pattern curvo', 'Non linearmente separabile', 'Richiede profondità'],
      approach: 'Reti profonde con attivazioni non lineari. Servono almeno 2-3 layer nascosti con ReLU o tanh.',
      architecture: ['Input layer', 'Dense(32, relu)', 'Dense(16, relu)', 'Output layer (sigmoid/softmax)'],
      pros: ['Cattura complessità', 'Funziona bene'],
      cons: ['Rischio overfitting', 'Richiede più dati']
    },
    {
      id: 'circles',
      name: 'Cerchi concentrici',
      icon: '⭕',
      color: '#06d6a0',
      generate: () => this.generateCircles(),
      characteristics: ['Classi annidate', 'Decision boundary circolare', 'Non lineare'],
      approach: 'Architettura con 2-3 layer nascosti. Tanh funziona bene per geometrie circolari.',
      architecture: ['Input', 'Dense(16, tanh)', 'Dense(8, tanh)', 'Output (sigmoid)'],
      pros: ['Adatto a geometrie radiali', 'Convergenza stabile'],
      cons: ['Sensibile all\'inizializzazione']
    },
    {
      id: 'xor',
      name: 'XOR',
      icon: '✖️',
      color: '#f77f00',
      generate: () => this.generateXOR(),
      characteristics: ['Pattern a scacchiera', 'Richiede almeno 1 layer nascosto', 'Classico problema'],
      approach: 'Serve un layer nascosto con almeno 4 neuroni. ReLU o tanh, output sigmoid.',
      architecture: ['Input (2)', 'Dense(4, relu)', 'Output (1, sigmoid)'],
      pros: ['Architettura comprovata', 'Didattico'],
      cons: ['Solo per problemi semplici']
    },
    {
      id: 'blobs',
      name: 'Blobs',
      icon: '🔴',
      color: '#7209b7',
      generate: () => this.generateBlobs(),
      characteristics: ['Gruppi distinti', 'Multi-classe', 'Potrebbe essere lineare'],
      approach: 'Se separabili: softmax diretto. Altrimenti aggiungi layer nascosti con ReLU.',
      architecture: ['Input', 'Dense(centri*4, relu)', 'Output (K, softmax)'],
      pros: ['Semplice se separabile', 'Interpretabile'],
      cons: ['Assume cluster ben separati']
    },
    {
      id: 'moons',
      name: 'Lune',
      icon: '🌙',
      color: '#9c89b8',
      generate: () => this.generateMoons(),
      characteristics: ['Forma a mezzaluna', 'Non lineare', 'Interlacciato'],
      approach: 'Simile a spirale: servono layer nascosti. ReLU o tanh con 2-3 layer.',
      architecture: ['Input', 'Dense(16, relu)', 'Dense(8, relu)', 'Output (sigmoid)'],
      pros: ['Benchmark comune', 'Ben studiato'],
      cons: ['Richiede tuning']
    }
  ];

  selectShape(shape: any) {
    this.selectedShape = shape;
    // Ridisegna la shape selezionata nel dettaglio
    setTimeout(() => {
      if (this.selectedShape) {
        const points = shape.generate();
        this.drawShape(`detail-${shape.id}`, points);
      }
    }, 50);
    this.shapeSelected.emit(shape);
  }

  applyApproach(shape: any) {
    this.shapeSelected.emit({
      ...shape,
      action: 'apply'
    });
    alert(`✅ Approccio per dati ${shape.name} selezionato! Ora puoi configurarlo nel pannello.`);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      setTimeout(() => this.drawAllShapes(), 50);
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(`import numpy as np
import matplotlib.pyplot as plt

# I TUOI DATI
X = np.random.randn(100, 2)
y = np.random.randint(0, 2, 100)

plt.figure(figsize=(8, 6))
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='coolwarm', alpha=0.7)
plt.colorbar()
plt.title('I tuoi dati')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.grid(True, alpha=0.3)
plt.show()`);
    alert('📋 Codice copiato! Incollalo nel tuo notebook Python.');
  }


  goToDashboard(){
    this.router.navigate(['/']);
  }
}