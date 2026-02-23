import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerConfig } from '../../models/layer-config.model';

@Component({
  selector: 'app-process-view',
  imports: [CommonModule],
  templateUrl: './process-view.html',
  standalone: true,
  styleUrls: ['./process-view.css']
})
export class ProcessView {
  @Input() config!: LayerConfig;

  // Colori per i parametri
  getWeightColor(): string {
    if (this.config.weight > 0) return '#06d6a0';
    if (this.config.weight < 0) return '#ef476f';
    return '#6c757d';
  }

  getBiasColor(): string {
    if (this.config.bias > 0) return '#4361ee';
    if (this.config.bias < 0) return '#f72585';
    return '#6c757d';
  }

  getActivationColor(): string {
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
    return colors[this.config.activation] || '#6c757d';
  }

  getActivationColorLight(): string {
    const colors: {[key: string]: string} = {
      'linear': '#494c50',
      'sigmoid': '#d60e72',
      'relu': '#169e4a',
      'tanh': '#005a9a',
      'leaky_relu': '#2a0570',
      'prelu': '#52058a',
      'elu': '#850a70',
      'selu': '#d60e72',
      'swish': '#1f8fa5',
      'mish': '#b8600a',
      'gelu': '#b02124',
      'softplus': '#2d455a',
      'softmax': '#b05a2a'
    };
    return colors[this.config.activation] || '#f8f9fa';
  }

  getActivationIcon(): string {
    const icons: {[key: string]: string} = {
      'linear': '📏',
      'sigmoid': 'S',
      'relu': 'R',
      'tanh': 'T',
      'leaky_relu': 'L',
      'prelu': 'P',
      'elu': 'E',
      'selu': '⚡',
      'swish': '🐍',
      'mish': '〽️',
      'gelu': '🧠',
      'softplus': '🫧',
      'softmax': '🎯'
    };
    return icons[this.config.activation] || '⚡';
  }

  getActivationName(): string {
    const names: {[key: string]: string} = {
      'linear': 'Linear Activation',
      'sigmoid': 'Sigmoid Activation',
      'relu': 'ReLU Activation',
      'tanh': 'Tanh Activation',
      'leaky_relu': 'Leaky ReLU Activation',
      'prelu': 'PReLU Activation',
      'elu': 'ELU Activation',
      'selu': 'SELU Activation',
      'swish': 'Swish Activation',
      'mish': 'Mish Activation',
      'gelu': 'GELU Activation',
      'softplus': 'Softplus Activation',
      'softmax': 'Softmax Activation'
    };
    return names[this.config.activation] || this.config.activation;
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
      case 'selu': return 'f(x) = λ·ELU(x, α) con λ≈1.05, α≈1.67';
      case 'swish': return 'f(x) = x · sigmoid(x)';
      case 'mish': return 'f(x) = x · tanh(ln(1+eˣ))';
      case 'gelu': return 'f(x) = x · Φ(x)';
      case 'softplus': return 'f(x) = ln(1+eˣ)';
      case 'softmax': return 'σ(zᵢ) = eᶻⁱ/∑ⱼeᶻʲ';
      default: return '';
    }
  }

  getActivationExplanation(): string {
    switch(this.config.activation) {
      case 'linear':
        return `📚 **SPIEGAZIONE DUMMY**:
La funzione lineare è come un copia e incolla: qualunque valore entra, lo stesso valore esce. 
Ciò che vedi da un lato è identico dall'altro. Il peso (w) decide quanto 
inclinare la linea, il bias (b) decide dove la linea incrocia l'asse verticale.

📐 **EXTRA**:
Questo tipo di attivazione è fondamentale nei layer di output per problemi di regressione, dove si richiedono valori reali non limitati. 
Tuttavia, l'assenza di non-linearità limita la capacità della rete di apprendere relazioni complesse, 
rendendo una rete con solo attivazioni lineari equivalente a un modello lineare, indipendentemente 
dal numero di layer (composizione di funzioni lineari = funzione lineare).`;
      
      case 'sigmoid':
        return `📚 **SPIEGAZIONE DUMMY**:
La sigmoide è come un compressore che prende qualsiasi numero e lo schiaccia tra 0 e 1. 
Numeri grandi positivi diventano quasi 1, numeri grandi negativi diventano quasi 0. 
È perfetta quando vuoi esprimere una probabilità: "quanto sono sicuro che questo sia un gatto?" 
(0 = non lo è, 1 = lo è sicuramente). La curva a S trasforma valori lineari in decisioni graduali.

📐 **SPIEGAZIONE ACCADEMICA**:
La funzione sigmoide mappa l'intero asse reale nell'intervallo (0, 1), e  può causare il problema del vanishing gradient nelle reti profonde. 
Storicamente utilizzata nei perceptron e nei layer di output per classificazione binaria, la sigmoide 
fornisce output interpretabili come probabilità posteriori P(y=1|x). Tuttavia, l'output non centrato a zero 
può causare oscillazioni durante la discesa del gradiente e la saturazione dei neuroni.`;
      
      case 'relu':
        return `📚 **SPIEGAZIONE DUMMY**:
ReLU è come un "butta via i negativi": se il numero è positivo, lo lascia passare tale e quale; 
se è negativo, lo trasforma in zero. Immagina un rubinetto che lascia scorrere l'acqua solo in una direzione. 
È semplice, veloce e permette alla rete di concentrarsi solo su ciò che è "attivo". I neuroni negativi 
vengono spenti, creando una rappresentazione "sparsa" (pochi neuroni attivi contemporaneamente).

📐 **SPIEGAZIONE ACCADEMICA**:
La Rectified Linear Unit (ReLU) introduce non-linearità mantenendo il gradiente costante (1) per z > 0, mitigando il problema del vanishing gradient rispetto alle funzioni 
saturanti. La sua derivata è f'(z) = 1 per z > 0, 0 per z < 0.
 ReLU produce rappresentazioni sparse (attivazione di ≈50% dei neuroni), 
migliorando l'efficienza computazionale. Tuttavia, soffre del problema "dying ReLU" quando i gradienti 
negativi azzerano permanentemente i neuroni. Varianti come LeakyReLU mitigano questo problema permettendo gradienti negativi non nulli.`;
      
      case 'tanh':
        return `📚 **SPIEGAZIONE DUMMY**:
Tanh è come una sigmoide "bilanciata": invece di schiacciare tra 0 e 1, schiaccia tra -1 e 1. 
Numeri grandi positivi diventano +1, numeri grandi negativi diventano -1, e zero rimane zero. 
È utile quando vuoi rappresentare valori che possono essere sia positivi che negativi, 
come le differenze o i bilanciamenti. La curva è centrata a zero, il che aiuta l'apprendimento.

📐 **SPIEGAZIONE ACCADEMICA**:
La tangente iperbolica è una funzione dispari che mappa l'input nell'intervallo (-1, 1), con tanh(0) = 0. 
Rispetto alla sigmoide, tanh è centrata a zero (output medio zero), proprietà che favorisce la convergenza durante la backpropagation riducendo lo shift dei gradienti. 
Tanh combina la non-linearità con output simmetrici, rendendola preferibile alla sigmoide nei layer nascosti quando i dati hanno media zero. 
Tuttavia, soffre anch'essa di saturazione per |z| grandi, con conseguente vanishing gradient nelle reti profonde.`;

      case 'leaky_relu':
        return `📚 **SPIEGAZIONE DUMMY**:
Leaky ReLU è come ReLU ma con un "rubinetto che perde": invece di azzerare completamente i valori negativi, 
lascia passare una piccola quantità (1%). I neuroni negativi non muoiono mai completamente, 
mantenendo sempre un piccolo flusso di informazioni.

📐 **SPIEGAZIONE ACCADEMICA**:
Leaky ReLU introduce una pendenza piccola ma non nulla per x<0, garantendo gradienti non nulli anche per input negativi.
Risolve il problema "dying ReLU" mantenendo l'efficienza computazionale. Il parametro α è tipicamente fissato a 0.01, 
ma può essere ottimizzato.`;
      
      case 'prelu':
        return `📚 **SPIEGAZIONE DUMMY**:
PReLU è come Leaky ReLU ma con un superpotere: impara da sola qual è il miglior valore per la pendenza negativa 
durante l'addestramento. È come se il neurone potesse regolare la sua "perdita" in base ai dati.

📐 **SPIEGAZIONE ACCADEMICA**:
Parametric ReLU (PReLU) generalizza Leaky ReLU rendendo il coefficiente α un parametro apprendibile 
durante la backpropagation. Questo permette a ogni neurone di adattare la sua risposta ai valori negativi 
in modo ottimale per il task specifico, aumentando la flessibilità del modello.`;
      
      case 'elu':
        return `📚 **SPIEGAZIONE DUMMY**:
ELU è come ReLU ma con una transizione morbida per i valori negativi: invece di uno scalino netto, 
c'è una curva liscia che tende gradualmente a -α. Questo rende l'apprendimento più stabile.

📐 **SPIEGAZIONE ACCADEMICA**:
Exponential Linear Unit (ELU). La transizione liscia in x=0 e la saturazione verso -α per x→ -∞ producono output medi più vicini a zero, accelerando la convergenza 
e riducendo il bias shift.`;
      
      case 'selu':
        return `📚 **SPIEGAZIONE DUMMY**:
SELU è una versione "magica" di ELU che mantiene automaticamente i dati bilanciati: dopo ogni layer, 
la media dei valori resta vicina a 0 e la varianza vicina a 1. Non serve la normalizzazione!

📐 **SPIEGAZIONE ACCADEMICA**:
Scaled ELU (SELU) con λ≈1.0507 e α≈1.67326 possiede la proprietà di auto-normalizzazione: 
per una rete profonda, la media e varianza degli output convergono a 0 e 1 rispettivamente, 
eliminando la necessità di batch normalization.`;
      
      case 'swish':
        return `📚 **SPIEGAZIONE DUMMY**:
Swish è come una ReLU "morbida" con una gobba: per valori negativi piccoli, invece di essere zero, 
ha un leggero "rimbalzo" negativo prima di salire. Questo piccolo trucco aiuta l'apprendimento.

📐 **SPIEGAZIONE ACCADEMICA**:
Swish (f(x) = x·sigmoid(x)) è una funzione liscia, non monotona, che permette un miglior flusso del gradiente. 
Studi dimostrano che supera ReLU in reti profonde (>40 layer) grazie alla sua capacità di preservare 
piccoli gradienti negativi.`;
      
      case 'mish':
        return `📚 **SPIEGAZIONE DUMMY**:
Mish è come Swish ma ancora più raffinato: crea una curva più dolce e continua, 
permettendo alle informazioni di fluire meglio attraverso la rete.

📐 **SPIEGAZIONE ACCADEMICA**:
Mish è auto-regularizzante e mantiene piccole quantità di informazioni negative, 
migliorando la propagazione del gradiente. In benchmark recenti, Mish ha superato Swish e ReLU 
in diverse architetture profonde.`;
      
      case 'gelu':
        return `📚 **SPIEGAZIONE DUMMY**:
GELU decide se attivare un neurone in base a "quanto è probabilmente positivo". 
È come un semaforo intelligente che valuta le probabilità prima di decidere.

📐 **SPIEGAZIONE ACCADEMICA**:
GELU (Gaussian Error Linear Unit) pesa l'input per la sua probabilità di essere positivo 
secondo la distribuzione gaussiana. È la funzione standard nei Transformer (BERT, GPT) 
perché fornisce una transizione più naturale tra attivazione e non-attivazione.`;
      
      case 'softplus':
        return `📚 **SPIEGAZIONE DUMMY**:
Softplus è come una ReLU "morbida": invece di uno scalino netto a zero, la curva si piega dolcemente, 
non diventando mai completamente zero.

📐 **SPIEGAZIONE ACCADEMICA**:
Softplus è un'approssimazione liscia e differenziabile di ReLU. 
Mantiene la proprietà di essere sempre positiva ma con gradienti definiti ovunque, 
utile in contesti dove serve differenziabilità stretta.`;
      
      case 'softmax':
        return `📚 **SPIEGAZIONE DUMMY**:
Softmax trasforma un vettore di numeri in probabilità che sommano a 1. Vince il più grande, 
ma gli altri hanno comunque la loro "piccola chance". È come una gara dove tutti ricevono 
una fetta della torta, ma il vincitore prende la fetta più grande.

📐 **SPIEGAZIONE ACCADEMICA**:
Softmax normalizza un vettore in distribuzione di probabilità, enfatizzando il massimo. 
È l'attivazione standard per il layer di output in problemi di classificazione multi-classe, 
producendo output interpretabili come probabilità P(y=i|x). La funzione esponenziale enfatizza 
le differenze tra i valori, rendendo il massimo più pronunciato.`;
      
      default:
        return '';
    }
  }

  getActivationTags(): string[] {
    switch(this.config.activation) {
      case 'linear':
        return [
          '📈 Regressione',
          '⚖️ Proporzionale',
          '🔷 Output layer',
          '📉 Nessuna non-linearità',
          '🧮 w = pendenza, b = intercetta'
        ];
      
      case 'sigmoid':
        return [
          '🎲 Probabilità [0,1]',
          '⚪ Classificazione binaria',
          '📉 Vanishing gradient',
          '🔄 σ(-z) = 1-σ(z)',
          '🧠 Neuroni saturi per |z| > 4',
          '🎯 Output interpretabile'
        ];
      
      case 'relu':
        return [
          '⚡ Efficienza computazionale',
          '🧠 Reti profonde',
          '0️⃣ Sparsità (50% neuroni spenti)',
          '📈 Gradiente costante per z>0',
          '💀 Dying ReLU per z<0',
          '🚀 Non saturazione'
        ];
      
      case 'tanh':
        return [
          '🔄 Centrato a zero',
          '📊 Gradienti forti',
          '➕ Valori negativi/positivi',
          '📉 Saturazione a ±1',
          '⚖️ Output simmetrico',
          '🧠 Preferita a sigmoide in hidden layer'
        ];

      case 'leaky_relu':
        return [
          '💧 Evita neuroni morti',
          '📉 Pendenza 0.01 per x<0',
          '⚡ Efficiente come ReLU',
          '🔄 Gradiente sempre presente',
          '🧠 α=0.01 (tipico)'
        ];
      
      case 'prelu':
        return [
          '📚 Parametro apprendibile',
          '🔄 Adattivo per ogni neurone',
          '⚡ Massima flessibilità',
          '🧠 α ottimizzato in training'
        ];
      
      case 'elu':
        return [
          '📉 Transizione liscia',
          '🎯 Output medio ≈ 0',
          '🧠 Convergenza veloce',
          '⚡ α tipico = 1.0',
          '🔄 Saturazione negativa'
        ];
      
      case 'selu':
        return [
          '✨ Auto-normalizzante',
          '📊 Media=0, Varianza=1',
          '🧠 Nessuna batch norm',
          '⚡ λ≈1.05, α≈1.67',
          '🚀 Reti molto profonde'
        ];
      
      case 'swish':
        return [
          '🐍 Non monotona',
          '📈 Gradiente fluido',
          '🧠 Superiore a ReLU in reti profonde',
          '⚡ x·sigmoid(x)',
          '🚀 Usata in YOLO'
        ];
      
      case 'mish':
        return [
          '〽️ Auto-regularizzante',
          '📊 Superiore a Swish',
          '🧠 Gradiente continuo',
          '⚡ x·tanh(softplus(x))',
          '🚀 Benchmark leader'
        ];
      
      case 'gelu':
        return [
          '🧠 Standard nei Transformer',
          '📊 BERT, GPT, LLM',
          '⚡ Ponderazione probabilistica',
          '📈 Transizione naturale',
          '🚀 NLP moderno'
        ];
      
      case 'softplus':
        return [
          '🫧 ReLU morbida',
          '📈 Sempre differenziabile',
          '⚡ Mai zero',
          '🧠 f(x) = ln(1+eˣ)'
        ];
      
      case 'softmax':
        return [
          '🎯 Distribuzione probabilità',
          '📊 Somma = 1',
          '⚡ Multi-class output',
          '🧠 Enfatizza il massimo',
          '🚀 Classificazione'
        ];
      
      default:
        return [];
    }
  }

  getActivationExample(): string {
    const x = 2;
    const z = this.config.weight * x + this.config.bias;
    
    switch(this.config.activation) {
      case 'linear':
        return `f(${z.toFixed(2)}) = ${z.toFixed(2)} (nessuna trasformazione)`;
      
      case 'sigmoid': {
        const result = 1 / (1 + Math.exp(-z));
        const confidence = (result * 100).toFixed(1);
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} → probabilità del ${confidence}%`;
      }
      
      case 'relu': {
        const result = Math.max(0, z);
        const status = z < 0 ? 'neurone spento (0)' : `neurone attivo (${result.toFixed(2)})`;
        return `f(${z.toFixed(2)}) = ${result.toFixed(2)} → ${status}`;
      }
      
      case 'tanh': {
        const result = Math.tanh(z);
        const interpretation = result > 0 ? 'positivo' : result < 0 ? 'negativo' : 'neutro';
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} → valore ${interpretation}`;
      }

      case 'leaky_relu': {
        const result = z > 0 ? z : 0.01 * z;
        return `f(${z.toFixed(2)}) = ${result.toFixed(2)} (pendenza 0.01 per negativi)`;
      }
      
      case 'prelu': {
        const result = z > 0 ? z : 0.01 * z; // Semplificato
        return `f(${z.toFixed(2)}) = ${result.toFixed(2)} (α appreso)`;
      }
      
      case 'elu': {
        const alpha = 1.0;
        const result = z > 0 ? z : alpha * (Math.exp(z) - 1);
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (transizione liscia)`;
      }
      
      case 'selu': {
        const alpha = 1.67326;
        const lambda = 1.0507;
        const elu = z > 0 ? z : alpha * (Math.exp(z) - 1);
        const result = lambda * elu;
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (auto-normalizzante)`;
      }
      
      case 'swish': {
        const result = z / (1 + Math.exp(-z));
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (x·sigmoid(x))`;
      }
      
      case 'mish': {
        const softplus = Math.log(1 + Math.exp(z));
        const result = z * Math.tanh(softplus);
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (x·tanh(softplus(x)))`;
      }
      
      case 'gelu': {
        const result = 0.5 * z * (1 + Math.tanh(Math.sqrt(2/Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (approssimazione GELU)`;
      }
      
      case 'softplus': {
        const result = Math.log(1 + Math.exp(z));
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (ReLU morbida)`;
      }
      
      case 'softmax': {
        const result = Math.exp(z) / (Math.exp(z) + 1);
        return `f(${z.toFixed(2)}) = ${result.toFixed(3)} (probabilità per 2 classi)`;
      }
      
      default:
        return '';
    }
  }
}