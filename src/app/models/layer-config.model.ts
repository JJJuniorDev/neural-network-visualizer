export interface LayerConfig {
  weight: number;
  bias: number;
  activation: 'linear' | 'sigmoid' | 'tanh' | 'relu';
}
