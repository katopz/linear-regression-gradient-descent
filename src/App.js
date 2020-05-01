import React from 'react'
import './App.css'

// adjust training set size

const M = 10
const SIZE = 100
const ERROR = 10
const A = 1.5
const B = 3

// generate random training set

const DATA = []

const createRandomPortlandHouse = step => ({
  squareMeter: step * 10 + Math.max(0, ERROR * Math.random() - ERROR * Math.random()),
  price: Math.max(0, A * step * 10 + ERROR * Math.random() - ERROR * Math.random() + B)
})

for (let i = 0; i < M; i++) {
  DATA.push(createRandomPortlandHouse(i))
}
console.log(DATA)

const x = DATA.map(date => date.squareMeter)
const y = DATA.map(date => date.price)

// linear regression and gradient descent

const LEARNING_RATE = 0.0003

let thetaOne = 0
let thetaZero = 0

const hypothesis = x => thetaZero + thetaOne * x

const learn = alpha => {
  let thetaZeroSum = 0
  let thetaOneSum = 0

  for (let i = 0; i < M; i++) {
    thetaZeroSum += hypothesis(x[i]) - y[i]
    thetaOneSum += (hypothesis(x[i]) - y[i]) * x[i]
  }

  thetaZero = thetaZero - (alpha / M) * thetaZeroSum
  thetaOne = thetaOne - (alpha / M) * thetaOneSum
}

const cost = () => {
  let sum = 0

  for (let i = 0; i < M; i++) {
    sum += Math.pow(hypothesis(x[i]) - y[i], 2)
  }

  return sum / (2 * M)
}

// count iterations

let iteration = 0

// view

class App extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.onLearn, 1)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onLearn = () => {
    learn(LEARNING_RATE)

    iteration++

    this.forceUpdate()
  }

  render() {
    return (
      <div>
        <Plot x={'squareMeter'} y={'price'} />

        <div>
          <Iteration iteration={iteration} />
          <Hypothesis />
          <Cost />
        </div>
      </div>
    )
  }
}

const Plot = ({ x, y }) => (
  <svg width={SIZE} height={SIZE}>
    <line x1="0" y1={SIZE - hypothesis(0)} x2={SIZE} y2={SIZE - hypothesis(SIZE)} />

    {DATA.map((date, key) => (
      <circle key={key} cx={date[x]} cy={SIZE - date[y]} />
    ))}
  </svg>
)

const Iteration = ({ iteration }) => (
  <p>
    <strong>Iteration:</strong> {iteration}
  </p>
)

const Hypothesis = () => (
  <p>
    <strong>Hypothesis:</strong> f(x) = {thetaZero.toFixed(2)} + {thetaOne.toFixed(2)}x
  </p>
)

const Cost = () => (
  <p>
    <strong>Cost:</strong> {cost().toFixed(2)}
  </p>
)

export default App
