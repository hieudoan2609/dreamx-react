import * as Web3Utils from 'web3-utils'

const oneEther = Web3Utils.toBN(Web3Utils.toWei('1'))

export const generateOrders = (orders) => {
  const baseAddress = "0x0000000000000000000000000000000000000000"
  const quoteAddress = "0xe62cc4212610289d7374f72c2390a40e78583350"
  orders = orders.map(order => {
    order.amount = Web3Utils.toBN(Web3Utils.toWei(order.amount))
    order.price = Web3Utils.toBN(Web3Utils.toWei(order.price))
    let giveTokenAddress, giveAmount, takeTokenAddress, takeAmount
    if (order.type === 'buy') {
      giveTokenAddress = baseAddress
      giveAmount = order.amount.mul(order.price).div(oneEther)
      takeTokenAddress = quoteAddress
      takeAmount = order.amount
    } else {
      giveTokenAddress = quoteAddress
      giveAmount = order.amount
      takeTokenAddress = baseAddress
      takeAmount = order.amount.mul(order.price).div(oneEther)
    }
    giveAmount = giveAmount.toString()
    takeAmount = takeAmount.toString()
    const createdAt = order.date
    order = { giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, createdAt }
    return order
  })
  return orders
}