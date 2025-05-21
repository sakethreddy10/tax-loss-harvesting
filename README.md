# Tax Loss Harvesting Calculator

A React-based tax loss harvesting tool that helps users identify and calculate potential tax savings opportunities in their cryptocurrency portfolio.

## Features

- Real-time calculation of capital gains (pre and post harvesting)
- Interactive holdings table with sorting functionality
- Detailed view of short-term and long-term gains/losses
- User-friendly interface with dark theme
- Responsive design

## Screenshots

![Tax Loss Harvesting Tool](./screenshots/main.png)

## Tech Stack

- React
- Material-UI (MUI)
- JavaScript
- CSS

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/sakethreddy10/tax-loss-harvesting.git
```

2. Navigate to the project directory:
```bash
cd tax-loss-harvesting
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
tax-loss-harvesting/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── HowItWorks.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── README.md
```

## Assumptions

1. Price Source: Using CoinGecko as the default price source for cryptocurrency prices
2. Tax Regulations: Tax loss harvesting rules may vary by country
3. Data Freshness: Prices and portfolio data are mock data for demonstration purposes
4. Currency: All monetary values are in Indian Rupees (₹)

## Deployment

The application is deployed and can be accessed at: [Live Demo URL]

## Future Improvements

1. Add real-time price updates
2. Implement user authentication
3. Add portfolio import functionality
4. Integrate with multiple exchanges
5. Add more detailed tax analysis reports

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
