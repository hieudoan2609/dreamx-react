const Web3Utils = require('web3-utils')

function calculateTakeAmount(giveAmount, totalGive, totalTake) {
  return giveAmount.mul(totalTake).div(totalGive)
}

function calculateGiveAmount(takeAmount, totalGive, totalTake) {
  return takeAmount.mul(totalGive).div(totalTake)
}

const totalGive = Web3Utils.toBN("195738239776775570")
const totalTake = Web3Utils.toBN("59744193591648150")
const takeAmount = Web3Utils.toBN('50000000000000000')

const calculatedGiveAmount = calculateGiveAmount(takeAmount, totalGive, totalTake)
const calculatedTakeAmount = calculateTakeAmount(calculatedGiveAmount, totalGive, totalTake)

console.log(calculatedGiveAmount.toString())
console.log(calculatedTakeAmount.toString())
