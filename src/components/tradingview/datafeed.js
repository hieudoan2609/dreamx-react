import axios from 'axios'

class Datafeed {
  constructor(apiHttpRoot, cable, config) {
    this.apiHttpRoot = apiHttpRoot
    this.cable = cable
    this.subscriptions = {}
    this.config = config
  }

  onReady = cb => {
    setTimeout(() => cb(this.config), 0)
  }

  searchSymbol = (userInput, exchange, symbolType, onResultReadyCallback) => {}

  resolveSymbol = (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    const [ exchange, symbol ] = symbolName.split(':')
    const symbolInfo = {
      name: symbol,
      ticker: symbol,
      type: 'crypto',
      session: '24x7',
      has_intraday: true,
      timezone: 'Etc/UTC',
      minmov: '1',
      pricescale: 100000000,
      intraday_multipliers: ['5', '15', '60', 'D'],
      supported_resolution:  this.config.supported_resolution,
      volume_precision: 2,
      data_status: 'streaming',
      exchange,
      has_empty_bars: true
    }
    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo);
    }, 0);
  }

  getBars = async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    const period = getPeriod(resolution)
    const marketSymbol = symbolInfo.name.replace('/', '_')
    try {
      const chartDataResponse = await axios.get(`${this.apiHttpRoot}/chart_data/${marketSymbol}?period=${period}&start=${from}&end=${to}`)

      const bars = chartDataResponse.data.map(b => {
        return {
          high: parseFloat(b.high),
          low: parseFloat(b.low),
          open: parseFloat(b.open),
          close: parseFloat(b.close),
          volume: parseFloat(b.volume),
          time: new Date(b.created_at).getTime()
        }
      })

      if (bars.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        onHistoryCallback(bars, { noData: false });
      }
    } catch {
      onErrorCallback('Chart is currently unavailable')
    }
  }

  subscribeBars = (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    const channel = "MarketChartDataChannel"
    const marketSymbol = symbolInfo.name.replace('/', '_')
    const period = getPeriod(resolution)
    this.subscriptions[subscriberUID] = this.cable.subscriptions.create({ channel, market_symbol: marketSymbol, period }, {
      connected: () => {},
      received: data => {
        const payload = data.payload[0]
        const bar = {
          high: parseFloat(payload.high),
          low: parseFloat(payload.low),
          open: parseFloat(payload.open),
          close: parseFloat(payload.close),
          volume: parseFloat(payload.volume),
          time: new Date(payload.created_at).getTime()
        }
        onRealtimeCallback(bar)
      }
    })
  }

  unsubscribeBars = subscriberUID => {
    this.subscriptions[subscriberUID].unsubscribe()
    delete this.subscriptions[subscriberUID]
  }

  // optional methods
  calculateHistoryDepth = (resolution, resolutionBack, intervalBack) => {}

  getMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}

  getTimeScaleMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}

  getServerTime = cb => {}
}

const getPeriod = (resolution) => {
  let period
  switch(resolution) {
    case '5':
      period = '300'
      break
    case '15':
      period = '900'
      break
    case '60':
      period = '3600'
      break
    case 'D':
      period = '86400'
      break
    default:
      throw new Error('unknown interval')
  }
  return period
}

export default Datafeed