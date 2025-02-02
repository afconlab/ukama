/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

import { ROAMING_SELECT } from '@/constants';
import {
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function NetworkSettings() {
  const [esim, setEsim] = useState('all');
  const [networkSettings, setNetworkSettings] = useState<any>({
    networkType: localStorage['networkType'] || 'private',
    roamingOption: localStorage['roamingOption'] || false,
  });

  const handleTimezoneChange = (event: any) => {
    setEsim(event.target.value);
  };
  return (
    <Paper
      sx={{
        py: 3,
        px: 4,
        width: '100%',
        borderRadius: '4px',
        height: 'calc(100vh - 200px)',
      }}
    >
      <Grid container spacing={2}>
        <Grid item container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Network Name</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid item xs={12} sm={10} md={8}>
              <Typography
                variant="body2"
                sx={{
                  mb: '18px',
                  lineHeight: '19px',
                }}
              >
                This is the name that shows up on xyz. You can edit this again
                at any point.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <TextField
                fullWidth
                id="name"
                name="name"
                disabled={true}
                variant="standard"
                value={'Network X'}
                label={'NETWORK NAME'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ width: '100%' }} />
        <Grid item container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Network Type</Typography>
          </Grid>
          <Grid item container xs={12} md={8}>
            <Grid item xs={12} sm={10} md={8}>
              <Typography
                variant="body2"
                sx={{
                  mb: '18px',
                  lineHeight: '19px',
                }}
              >
                Policy regarding network switching & explain how it’ll change
                after hardware is actually shipped.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <RadioGroup
                aria-label="networkType"
                defaultValue={networkSettings.networkType}
                name="radio-buttons-group"
                onChange={(event: any) => {
                  setNetworkSettings({
                    networkType: event.target.value,
                  });
                  localStorage.setItem('networkType', event.target.value);
                }}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public Network"
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private Network"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ width: '100%' }} />
        <Grid item container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Roaming Options</Typography>
          </Grid>
          <Grid item container xs={12} md={8}>
            <Grid item xs={12} sm={10} md={8}>
              <Typography
                variant="body2"
                sx={{
                  mb: '18px',
                  lineHeight: '19px',
                }}
              >
                Explanation of roaming & its rates. Your temporary eSIM has
                roaming enabled by default, and cannot be disabled.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <FormControlLabel
                control={
                  <Switch
                    checked={networkSettings.roamingOption}
                    onChange={(e: any) => {
                      setNetworkSettings({
                        roamingOption: e.target.checked,
                      });
                      localStorage.setItem('roamingOption', e.target.checked);
                    }}
                  />
                }
                label="Enable roaming for all"
                sx={{ typography: 'body1' }}
              />
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <TextField
                select
                id="eSims"
                InputProps={{
                  disabled: !networkSettings.roamingOption,
                  disableUnderline: true,
                }}
                value={esim}
                variant={'standard'}
                sx={{ mt: '18px' }}
                onChange={handleTimezoneChange}
              >
                {ROAMING_SELECT.map(({ value, text }: any) => (
                  <MenuItem key={value} value={value}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {text}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
