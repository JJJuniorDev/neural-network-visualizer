import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { Point } from '../../models/point.model';
import { Chart, ChartConfiguration, ScatterController, LinearScale, PointElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend, Title);

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.html',
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
  private readonly ANIMATION_SPEED = 0.005;
  
  private readonly COLORS = {
    before: '#3a86ff',
    after: '#ff006e',
    background: '#f8f9fa',
    grid: 'rgba(222, 226, 230, 0.3)',
    connection: 'rgba(108, 117, 125, 0.2)'
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
    this.createChart('before', this.chartBeforeCanvas, this.originalPoints, this.COLORS.before, '📥 Input');
    this.createChart('after', this.chartAfterCanvas, this.transformedPoints, this.COLORS.after, '🎯 Output');
    this.startAnimation();
  }

  private createChart(type: string, canvasRef: ElementRef<HTMLCanvasElement>, data: Point[], color: string, label: string) {
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [{
          label: label,
          data: this.getLimitedPoints(data),
          backgroundColor: color,
          pointRadius: 8,
          pointHoverRadius: 14,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointStyle: 'circle',
          hoverBackgroundColor: color,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#212529',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const point = context.raw as Point;
                return [`x: ${point.x.toFixed(2)}`, `y: ${point.y.toFixed(2)}`];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: this.COLORS.grid },
            ticks: { display: true, color: '#adb5bd' }
          },
          y: {
            grid: { color: this.COLORS.grid },
            ticks: { display: true, color: '#adb5bd' }
          }
        },
        elements: {
          point: {
            hoverRadius: 14,
            hoverBorderWidth: 3
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

    canvas.width = canvas.clientWidth || 800;
    canvas.height = canvas.clientHeight || 550;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBackground(ctx, canvas);
      this.drawTransformation(ctx, canvas);
      
      if (this.animationProgress < 1) {
        this.animationProgress += this.ANIMATION_SPEED;
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = this.COLORS.grid;
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
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
    const showConnectionsFor = Math.min(15, count);
    
    for (let i = 0; i < count; i++) {
      const original = this.mapToCanvas(this.originalPoints[i], canvas);
      const transformed = this.mapToCanvas(this.transformedPoints[i], canvas);
      
      const x = original.x + (transformed.x - original.x) * this.animationProgress;
      const y = original.y + (transformed.y - original.y) * this.animationProgress;
      
      if (i < showConnectionsFor) {
        ctx.beginPath();
        ctx.moveTo(original.x, original.y);
        ctx.lineTo(transformed.x, transformed.y);
        ctx.strokeStyle = this.COLORS.connection;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      const color = this.animationProgress < 0.5 ? this.COLORS.before : this.COLORS.after;
      
      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Punto principale con gradiente
      const gradient = ctx.createRadialGradient(x-2, y-2, 2, x, y, 12);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255,255,255,0.8)');
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Bordo bianco
      ctx.shadowBlur = 5;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Reset ombra
      ctx.shadowBlur = 0;
    }
  }

  private mapToCanvas(point: Point, canvas: HTMLCanvasElement): { x: number, y: number } {
    const padding = 60;
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
    this.charts.forEach((chart, index) => {
      if (index === 0) {
        chart.data.datasets[0].data = this.getLimitedPoints(this.originalPoints);
      } else if (index === 1) {
        chart.data.datasets[0].data = this.getLimitedPoints(this.transformedPoints);
      }
      chart.update();
    });
  }

  private resetAndStartAnimation() {
    this.animationProgress = 0;
  }

  public playAnimation() {
    this.animationProgress = 0;
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