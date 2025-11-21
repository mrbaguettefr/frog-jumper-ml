import Synaptic from 'synaptic';
const { Architect, Trainer } = Synaptic;

const myNetwork = new Architect.Perceptron(2, 3, 1)
const trainer = new Trainer(myNetwork)

var trainingSet = [
  {
    input: [0,0],
    output: [0]
  },
  {
    input: [0,1],
    output: [1]
  },
  {
    input: [1,0],
    output: [1]
  },
  {
    input: [1,1],
    output: [0]
  },
]

console.log(trainer.train(trainingSet, {
  rate: .1,
	iterations: 20000,
	error: .0005,
	shuffle: true,
}))

console.log(myNetwork.activate([0,0]))
console.log(myNetwork.activate([0,1]))
console.log(myNetwork.activate([1,0]))
console.log(myNetwork.activate([1,1]))