import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { Point } from '../../models/point.model';
import { Chart, ChartConfiguration, ScatterController, LinearScale, PointElement, Tooltip, Legend, Title, CategoryScale, Filler } from 'chart.js';
import { DecimalPipe } from '@angular/common';
Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend, Title, CategoryScale, Filler);

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.html',
  imports: [DecimalPipe],
  styleUrls: ['./visualization.css'],
  standalone: true
})
export class Visualization implements AfterViewInit, OnChanges {
  @Input() originalPoints!: Point[];
  @Input() transformedPoints!: Point[];

  @ViewChild('chartBeforeCanvas') chartBeforeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAfterCanvas') chartAfterCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAnimatedCanvas') chartAnimatedCanvas!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  private viewInitialized = false;
  private animationId: number | null = null;
   animationProgress = 0;
  private readonly MAX_POINTS = 100;
  private readonly ANIMATION_SPEED = 0.005; // Lento e fluido
  
  // Colori semplici ed eleganti
  private readonly COLORS = {
    before: '#3a86ff',    // Blu brillante
    after: '#ff006e',     // Rosa/fucsia
    background: '#f8f9fa',
    grid: '#dee2e6',
    connection: 'rgba(108, 117, 125, 0.3)'
  };

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.initializeCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewInitialized) {
      if (changes['originalPoints'] || changes['transformedPoints']) {
        this.updateCharts();
        this.resetAndStartAnimation();
      }
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.charts.forEach(chart => chart.destroy());
  }

  private initializeCharts() {
    this.createChart('before', this.chartBeforeCanvas, this.originalPoints, this.COLORS.before, '📥 Input Space');
    this.createChart('after', this.chartAfterCanvas, this.transformedPoints, this.COLORS.after, '🎯 After Activation');
    this.startAnimation();
  }

  private createChart(type: string, canvasRef: ElementRef<HTMLCanvasElement>, data: Point[], color: string, title: string) {
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [{
          label: title,
          data: this.getLimitedPoints(data),
          backgroundColor: color,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointStyle: 'circle'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' },
              color: '#212529',
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: '#212529',
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => {
                const point = context.raw as Point;
                return [`(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`];
              }
            }
          },
          title: {
            display: true,
            text: title,
            font: { size: 18, weight: 600 },
            padding: { top: 15, bottom: 15 },
            color: '#212529'
          }
        },
        scales: {
          x: {
            grid: { color: this.COLORS.grid },
            title: { display: true, text: 'X Coordinate', font: { weight: 500 } }
          },
          y: {
            grid: { color: this.COLORS.grid },
            title: { display: true, text: 'Y Coordinate', font: { weight: 500 } }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private startAnimation() {
    const canvas = this.chartAnimatedCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Imposta dimensioni canvas
    canvas.width = canvas.clientWidth || 800;
    canvas.height = canvas.clientHeight || 500;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Disegna sfondo e griglia
      this.drawBackground(ctx, canvas);
      
      // Disegna la trasformazione
      this.drawTransformation(ctx, canvas);
      
      // Avanza lentamente
      if (this.animationProgress < 1) {
        this.animationProgress += this.ANIMATION_SPEED;
      } else {
        this.animationProgress = 1; // Fermati alla fine
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Sfondo pulito
    ctx.fillStyle = this.COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Griglia leggera
    ctx.strokeStyle = this.COLORS.grid;
    ctx.lineWidth = 0.5;
    
    // Linee verticali
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.stroke();
    }
    
    // Linee orizzontali
    for (let i = 0; i <= 8; i++) {
      const y = (i / 8) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  private drawTransformation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const count = Math.min(this.originalPoints?.length || 0, this.transformedPoints?.length || 0, this.MAX_POINTS);
    
    // Mostra connessioni solo per alcuni punti (per non appesantire)
    const showConnectionsFor = Math.min(15, count);
    
    for (let i = 0; i < count; i++) {
      const original = this.mapToCanvas(this.originalPoints[i], canvas);
      const transformed = this.mapToCanvas(this.transformedPoints[i], canvas);
      
      // Posizione interpolata
      const x = original.x + (transformed.x - original.x) * this.animationProgress;
      const y = original.y + (transformed.y - original.y) * this.animationProgress;
      
      // Disegna linea di connessione (solo per i primi punti)
      if (i < showConnectionsFor) {
        ctx.beginPath();
        ctx.moveTo(original.x, original.y);
        ctx.lineTo(transformed.x, transformed.y);
        ctx.strokeStyle = this.COLORS.connection;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Calcola colore in base al progresso
      const color = this.interpolateColor(this.animationProgress);
      
      // Disegna punto con glow leggero
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Bordo bianco
      ctx.shadowBlur = 5;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Aggiungi etichetta per i primi punti
      if (i < showConnectionsFor && this.animationProgress < 0.95) {
        ctx.shadowBlur = 0;
        ctx.font = 'bold 12px "Segoe UI"';
        ctx.fillStyle = '#495057';
        ctx.fillText(`P${i+1}`, x + 12, y - 8);
      }
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Mostra stato della trasformazione
    ctx.font = 'bold 16px "Segoe UI"';
    ctx.fillStyle = '#212529';
    ctx.shadowBlur = 0;
    
    if (this.animationProgress < 0.1) {
      ctx.fillText('🔵 Stato iniziale', 20, 40);
    } else if (this.animationProgress > 0.9) {
      ctx.fillText('🔴 Trasformazione completata', 20, 40);
    } else {
      const percent = Math.round(this.animationProgress * 100);
      ctx.fillText(`Trasformazione in corso... ${percent}%`, 20, 40);
    }
    
    // Legenda semplice
    ctx.font = '12px "Segoe UI"';
    ctx.fillStyle = this.COLORS.before;
    ctx.fillText('● Punto originale', 20, canvas.height - 40);
    
    ctx.fillStyle = this.COLORS.after;
    ctx.fillText('● Punto trasformato', 20, canvas.height - 20);
    
    ctx.fillStyle = this.COLORS.connection;
    ctx.fillText('┅ Percorso della trasformazione', 20, canvas.height - 60);
  }

  private interpolateColor(progress: number): string {
    // Interpolazione graduale da blu a rosa
    if (progress < 0.5) {
      return this.COLORS.before;
    } else {
      return this.COLORS.after;
    }
  }

  private mapToCanvas(point: Point, canvas: HTMLCanvasElement): { x: number, y: number } {
    const padding = 60;
    // Adatta il range in base ai tuoi dati
    const xRange = { min: -5, max: 5 };
    const yRange = { min: -5, max: 5 };
    
    const x = padding + ((point.x - xRange.min) / (xRange.max - xRange.min)) * (canvas.width - 2 * padding);
    const y = canvas.height - (padding + ((point.y - yRange.min) / (yRange.max - yRange.min)) * (canvas.height - 2 * padding));
    
    return { x, y };
  }

  private getLimitedPoints(points: Point[]): Point[] {
    return points.slice(0, this.MAX_POINTS);
  }

  private updateCharts() {
    this.charts.forEach(chart => {
      if (chart.config.data?.datasets[0]?.label?.includes('Input')) {
        chart.data.datasets[0].data = this.getLimitedPoints(this.originalPoints);
      } else if (chart.config.data?.datasets[0]?.label?.includes('Activation')) {
        chart.data.datasets[0].data = this.getLimitedPoints(this.transformedPoints);
      }
      chart.update();
    });
  }

  private resetAndStartAnimation() {
    this.animationProgress = 0;
    if (!this.animationId) {
      this.startAnimation();
    }
  }

  // Metodi pubblici per i controlli
  public playAnimation() {
    this.animationProgress = 0;
    if (!this.animationId) {
      this.startAnimation();
    }
  }

  public resetAnimation() {
    this.animationProgress = 0;
  }

  public showBefore() {
    this.animationProgress = 0;
  }

  public showAfter() {
    this.animationProgress = 1;
  }
}