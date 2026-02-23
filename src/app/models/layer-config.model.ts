export interface LayerConfig {
  weight: number;
  bias: number;
  activation: 'linear' | 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu' | 'prelu' | 'elu' | 'selu' | 'swish' | 'mish' | 'gelu' | 'softplus' | 'softmax';
}
