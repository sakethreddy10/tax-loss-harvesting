const mockHoldings = [
  {
    "coin": "ETH",
    "coinName": "Ethereum",
    "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    "currentPrice": 2531.06,
    "totalHolding": 20028.05,
    "averageBuyPrice": 3367.78,
    "stcg": {
      "balance": 20028.05,
      "gain": -16760000 // -$16.76M
    },
    "ltcg": {
      "balance": 0,
      "gain": 0
    }
  },
  {
    "coin": "SOL",
    "coinName": "Solana",
    "logo": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    "currentPrice": 174.37,
    "totalHolding": 20277.78,
    "averageBuyPrice": 192.15,
    "stcg": {
      "balance": 20277.78,
      "gain": -360410 // -$360.41K
    },
    "ltcg": {
      "balance": 0,
      "gain": 0
    }
  },
  {
    "coin": "BNB",
    "coinName": "BNB",
    "logo": "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    "currentPrice": 665.55,
    "totalHolding": 7020.16,
    "averageBuyPrice": 708.72,
    "stcg": {
      "balance": 7020.16,
      "gain": -303050 // -$303.05K
    },
    "ltcg": {
      "balance": 0,
      "gain": 0
    }
  },
  {
    "coin": "AAVE",
    "coinName": "Aave",
    "logo": "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
    "currentPrice": 224.33,
    "totalHolding": 2615.93,
    "averageBuyPrice": 321.51,
    "stcg": {
      "balance": 2615.93,
      "gain": -254220 // -$254.22K
    },
    "ltcg": {
      "balance": 0,
      "gain": 0
    }
  }
];

const mockCapitalGains = {
  capitalGains: {
    stcg: {
      profits: 4049.48,
      losses: 32127.03
    },
    ltcg: {
      profits: 0,
      losses: 0
    }
  }
};

export const fetchHoldings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHoldings);
    }, 500);
  });
};

export const fetchCapitalGains = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCapitalGains);
    }, 500);
  });
}; 