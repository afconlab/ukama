/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

import { CenterContainer } from '@/styles/global';
import colors from '@/styles/theme/colors';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { ReactEventHandler } from 'react';
import LoadingWrapper from '../../../molecules/LoadingWrapper';
import EditableTextField from '../../EditableTextField';

type BasicDialogProps = {
  type: string;
  user: any;
  isOpen: boolean;
  setUserForm: any;
  loading: boolean;
  roamingLoading: boolean;
  closeBtnLabel?: string;
  saveBtnLabel?: string;
  userDetailsTitle: string;
  simDetailsTitle: string;
  userStatusLoading: boolean;
  handleSubmitAction: Function;
  handleServiceAction: Function;
  handleDeactivateAction: Function;
  handleUserRoamingAction: Function;
  handleClose: ReactEventHandler;
  serviceStatusIndicator: boolean;
};

const UserDetailsDialog = ({
  type,
  user = { id: '', name: '', email: '' },
  isOpen,
  setUserForm,
  handleClose,
  saveBtnLabel,
  closeBtnLabel,
  loading = true,
  roamingLoading,
  simDetailsTitle,
  userStatusLoading,
  userDetailsTitle,
  handleSubmitAction,
  handleServiceAction,
  handleDeactivateAction,
  handleUserRoamingAction,
  serviceStatusIndicator,
}: BasicDialogProps) => {
  const { id, name, email } = user;
  const getTitle = (userName: string) => {
    const title = type === 'add' ? 'Add User' : `${userName}`;
    return title;
  };

  const statusAction = serviceStatusIndicator
    ? 'PAUSE SERVICE'
    : 'RESUME SERVICE';

  const statusButtonColor = serviceStatusIndicator ? 'error' : 'primary';
  return (
    <Dialog
      key={id}
      open={isOpen}
      onBackdropClick={handleClose}
      maxWidth="sm"
      fullWidth
    >
      {loading ? (
        <CenterContainer>
          <CircularProgress />
        </CenterContainer>
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <DialogTitle>
              <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
                <Typography variant="h6">{getTitle(name)}</Typography>
                <Typography variant="h6" sx={{ color: colors.black70 }}>
                  - eSim
                </Typography>
              </Stack>
            </DialogTitle>
            <IconButton
              onClick={handleClose}
              sx={{ position: 'relative', right: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <DialogContent sx={{ overflowX: 'hidden' }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">{userDetailsTitle}</Typography>
                <Divider />
              </Grid>
              <Grid item container spacing={1.5}>
                <Grid item xs={12}>
                  {/* <Typography variant="body1">
                    {`${formatBytes(
                      parseInt(dataUsage),
                    )}  data used, 1 network, ${formatBytesToMB(
                      parseInt(dataPlan),
                    )} roaming`}
                  </Typography> */}
                </Grid>
                <Grid item xs={12}>
                  <EditableTextField
                    value={name}
                    label={'NAME'}
                    handleOnChange={(value: string) =>
                      setUserForm({
                        ...user,
                        name: value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <EditableTextField
                    value={email}
                    label={'EMAIL'}
                    handleOnChange={(value: string) =>
                      setUserForm({
                        ...user,
                        email: value?.toLowerCase(),
                      })
                    }
                  />
                </Grid>

                <Grid item container>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      USER STATUS
                    </Typography>
                  </Grid>

                  <Grid item xs={12} container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Users with paused service will not incur any fees,
                        [insert other policy].
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container justifyContent="flex-end">
                      <LoadingWrapper
                        isLoading={userStatusLoading}
                        width={'150px'}
                        height={'30px'}
                      >
                        {/* <Button
                          color={statusButtonColor}
                          variant="outlined"
                          size="small"
                          sx={{ height: '36px' }}
                          onClick={() => {
                            if (id && iccid)
                              handleServiceAction(id, iccid, !status);
                          }}
                        >
                          {statusAction}
                        </Button> */}
                      </LoadingWrapper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      USER REMOVAL
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Once you deactivate a user, [xyz].
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container justifyContent="flex-end">
                      <Button
                        color={'error'}
                        variant="outlined"
                        size="small"
                        onClick={() => id && handleDeactivateAction(id)}
                      >
                        {'deactivate user'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      ENABLE ROAMING
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Roaming allows users to connect to networks outside
                        their networks for a fee.
                      </Typography>
                    </Grid>
                    <Grid item xs={6} container justifyContent="flex-end">
                      <LoadingWrapper
                        isLoading={roamingLoading}
                        width={'72px'}
                        height={'24px'}
                      >
                        <Switch
                          size="small"
                          value="active"
                          sx={{
                            position: 'relative',
                            left: 30,
                          }}
                          checked={false}
                          disabled={!serviceStatusIndicator}
                          onClick={(e: any) => {
                            setUserForm({
                              ...user,
                              roaming: e.target.checked,
                            });
                            handleUserRoamingAction &&
                              handleUserRoamingAction(e.target.checked);
                          }}
                        />
                      </LoadingWrapper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container spacing={1.5}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">{simDetailsTitle}</Typography>
                  <Divider />
                </Grid>

                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      IMEI NUMBER
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Typography variant="body2">{}</Typography>
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      ICCID
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Typography variant="body2">{}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{
                mr: 2,
                justifyItems: 'center',
              }}
            >
              {closeBtnLabel}
            </Button>
            <Button onClick={() => handleSubmitAction()} variant="contained">
              {saveBtnLabel}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default UserDetailsDialog;
