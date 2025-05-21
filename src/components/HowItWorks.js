import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

export default function HowItWorks({ open, onClose }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1A1B1E',
          color: 'white',
        }
      }}
    >
      <DialogTitle>How Tax Loss Harvesting Works?</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography>
            Tax-loss harvesting is a strategy that helps you reduce your tax liability by selling investments at a loss to offset capital gains tax on other investments.
          </Typography>
          
          <Typography variant="h6">The Process:</Typography>
          <Typography component="div">
            <ol>
              <li>Identify investments that have declined in value</li>
              <li>Sell these investments to realize the loss</li>
              <li>Use these losses to offset capital gains from other investments</li>
              <li>Reinvest in similar (but not identical) assets after 30 days to maintain market exposure</li>
            </ol>
          </Typography>

          <Typography variant="h6">Benefits:</Typography>
          <Typography component="div">
            <ul>
              <li>Reduce your taxable income</li>
              <li>Offset capital gains from other investments</li>
              <li>Potentially improve your portfolio's tax efficiency</li>
              <li>Maintain your long-term investment strategy while capturing tax benefits</li>
            </ul>
          </Typography>

          <Typography variant="h6">Important Considerations:</Typography>
          <Typography component="div">
            <ul>
              <li>Wash sale rules: Avoid buying substantially identical securities within 30 days</li>
              <li>Transaction costs: Consider fees when executing trades</li>
              <li>Tax implications: Consult with a tax advisor for your specific situation</li>
            </ul>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 