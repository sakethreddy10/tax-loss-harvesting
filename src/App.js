import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Link, TableSortLabel, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import HowItWorks from './components/HowItWorks';
import { fetchHoldings, fetchCapitalGains } from './services/api';

function App() {
  const [holdings, setHoldings] = useState([]);
  const [selectedHoldings, setSelectedHoldings] = useState([]);
  const [capitalGains, setCapitalGains] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('stcg.gain');
  const [order, setOrder] = useState('asc');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [holdingsData, gainsData] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains()
        ]);
        setHoldings(holdingsData);
        setCapitalGains(gainsData.capitalGains);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatValue = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    const aValue = orderBy.split('.').reduce((obj, key) => obj[key], a);
    const bValue = orderBy.split('.').reduce((obj, key) => obj[key], b);
    return (order === 'asc' ? 1 : -1) * (aValue - bValue);
  });

  const displayedHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 4);

  const calculateEffectiveGains = () => {
    if (!capitalGains) return null;

    // Start with initial capital gains
    const effectiveGains = {
      stcg: { ...capitalGains.stcg },
      ltcg: { ...capitalGains.ltcg }
    };

    // Update gains based on selected holdings
    selectedHoldings.forEach(holding => {
      // Handle short-term gains
      if (holding.stcg.gain > 0) {
        effectiveGains.stcg.profits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        effectiveGains.stcg.losses += Math.abs(holding.stcg.gain);
      }

      // Handle long-term gains
      if (holding.ltcg.gain > 0) {
        effectiveGains.ltcg.profits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        effectiveGains.ltcg.losses += Math.abs(holding.ltcg.gain);
      }
    });

    return effectiveGains;
  };

  const handleHoldingSelect = (holding) => {
    const isSelected = selectedHoldings.some(h => h.coin === holding.coin);
    if (isSelected) {
      setSelectedHoldings(selectedHoldings.filter(h => h.coin !== holding.coin));
    } else {
      setSelectedHoldings([...selectedHoldings, holding]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedHoldings([...holdings]);
    } else {
      setSelectedHoldings([]);
    }
  };

  const calculateNetGains = (gains) => {
    if (!gains) return { short: 0, long: 0 };
    return {
      short: gains.stcg.profits - gains.stcg.losses,
      long: gains.ltcg.profits - gains.ltcg.losses
    };
  };

  const preHarvestingGains = capitalGains ? calculateNetGains(capitalGains) : { short: 0, long: 0 };
  const effectiveGains = calculateEffectiveGains();
  const postHarvestingGains = effectiveGains ? calculateNetGains(effectiveGains) : preHarvestingGains;

  const realizedPreHarvesting = preHarvestingGains.short + preHarvestingGains.long;
  const realizedPostHarvesting = postHarvestingGains.short + postHarvestingGains.long;
  const savings = realizedPreHarvesting - realizedPostHarvesting;

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ bgcolor: '#121212', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            Tax Optimisation
          </Typography>
          <Link 
            href="#" 
            underline="always" 
            sx={{ color: '#2196f3', cursor: 'pointer' }}
            onClick={() => setHowItWorksOpen(true)}
          >
            How it works?
          </Link>
        </Box>

        {/* How it Works Modal */}
        <HowItWorks open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />

        {/* Important Notes Section */}
        <Accordion 
          sx={{ 
            mb: 3, 
            bgcolor: '#1a237e',
            color: 'white',
            '& .MuiAccordionSummary-root': {
              color: 'white'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="notes-content"
            id="notes-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon />
              <Typography>Important Notes And Disclaimers</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Price Source Disclaimer:
                </Typography>
                <Typography>
                  Please note that the current price of your coins may differ from the prices listed on specific exchanges. 
                  This is because we use CoinGecko as our default price source for certain exchanges, rather than fetching 
                  prices directly from the exchange.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Country-specific Availability:
                </Typography>
                <Typography>
                  Tax loss harvesting may <strong>not be supported in all countries</strong>. We strongly recommend consulting 
                  with your local tax advisor or accountant before performing any related actions on your exchange.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Utilization of Losses:
                </Typography>
                <Typography>
                  Tax loss harvesting typically allows you to offset capital gains. However, if you have <strong>zero or no 
                  applicable crypto capital gains</strong>, the usability of these harvested losses may be limited. Kindly 
                  confirm with your tax advisor how such losses can be applied in your situation.
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {/* Pre Harvesting Card */}
          <Paper sx={{ flex: 1, p: 3, bgcolor: '#1A1B1E', color: 'white' }}>
            <Typography variant="h6" gutterBottom>Pre Harvesting</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography>Short-term</Typography>
              <Typography>Long-term</Typography>
              
              <Typography>Profits: ₹{capitalGains?.stcg.profits.toFixed(2)}</Typography>
              <Typography>Profits: ₹{capitalGains?.ltcg.profits.toFixed(2)}</Typography>
              
              <Typography>Losses: ₹{capitalGains?.stcg.losses.toFixed(2)}</Typography>
              <Typography>Losses: ₹{capitalGains?.ltcg.losses.toFixed(2)}</Typography>
              
              <Typography>Net: ₹{preHarvestingGains.short.toFixed(2)}</Typography>
              <Typography>Net: ₹{preHarvestingGains.long.toFixed(2)}</Typography>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Realised Capital Gains: ₹{realizedPreHarvesting.toFixed(2)}
            </Typography>
          </Paper>

          {/* After Harvesting Card */}
          <Paper sx={{ flex: 1, p: 3, bgcolor: '#2196f3', color: 'white' }}>
            <Typography variant="h6" gutterBottom>After Harvesting</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography>Short-term</Typography>
              <Typography>Long-term</Typography>
              
              <Typography>Profits: ₹{effectiveGains?.stcg.profits.toFixed(2)}</Typography>
              <Typography>Profits: ₹{effectiveGains?.ltcg.profits.toFixed(2)}</Typography>
              
              <Typography>Losses: ₹{effectiveGains?.stcg.losses.toFixed(2)}</Typography>
              <Typography>Losses: ₹{effectiveGains?.ltcg.losses.toFixed(2)}</Typography>
              
              <Typography>Net: ₹{postHarvestingGains.short.toFixed(2)}</Typography>
              <Typography>Net: ₹{postHarvestingGains.long.toFixed(2)}</Typography>
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Effective Capital Gains: ₹{realizedPostHarvesting.toFixed(2)}
            </Typography>
            {savings > 0 && (
              <Typography sx={{ mt: 2, color: '#4caf50' }}>
                You're going to save ₹{savings.toFixed(2)}
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Holdings Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            bgcolor: '#1A1B1E',
            '& .MuiTableCell-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedHoldings.length === holdings.length}
                    indeterminate={selectedHoldings.length > 0 && selectedHoldings.length < holdings.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Holdings</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'currentPrice'}
                    direction={orderBy === 'currentPrice' ? order : 'asc'}
                    onClick={() => handleSort('currentPrice')}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: 'white !important',
                      },
                    }}
                  >
                    Current Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'stcg.gain'}
                    direction={orderBy === 'stcg.gain' ? order : 'asc'}
                    onClick={() => handleSort('stcg.gain')}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: 'white !important',
                      },
                    }}
                  >
                    Short-Term
                  </TableSortLabel>
                </TableCell>
                <TableCell>Long-Term</TableCell>
                <TableCell>Amount to Sell</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedHoldings.map((holding) => {
                const isSelected = selectedHoldings.some(h => h.coin === holding.coin);
                return (
                  <TableRow 
                    key={holding.coin}
                    selected={isSelected}
                    hover
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1) !important',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleHoldingSelect(holding)}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: '#2196f3',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img 
                          src={holding.logo} 
                          alt={holding.coin} 
                          className="coin-logo"
                          style={{ width: 24, height: 24 }} 
                        />
                        <Box>
                          <Typography variant="body1">{holding.coin}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {holding.coinName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{holding.totalHolding} {holding.coin}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{holding.averageBuyPrice.toFixed(2)}/ETH
                      </Typography>
                    </TableCell>
                    <TableCell>₹{holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography color={holding.stcg.gain >= 0 ? 'success.main' : 'error.main'}>
                        {holding.stcg.gain >= 0 ? '+' : '-'}₹{formatValue(Math.abs(holding.stcg.gain))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {holding.stcg.balance} {holding.coin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color={holding.ltcg.gain >= 0 ? 'success.main' : 'error.main'}>
                        {holding.ltcg.gain ? (holding.ltcg.gain >= 0 ? '+' : '-') : ''}₹{formatValue(Math.abs(holding.ltcg.gain))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {holding.ltcg.balance} {holding.coin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {isSelected ? holding.totalHolding : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {holdings.length > 4 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowAll(!showAll)}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              {showAll ? 'Show Less' : 'View All'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
