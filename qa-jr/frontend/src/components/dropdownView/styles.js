import React from 'react';
import styled from 'styled-components';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';

export const DropdownContainer = styled.div``;

export const DropdownSelect = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
`;

export const DropdownBox = withStyles({
    paper: {
        width: '17%',
        maxWidth: '17%',
        marginTop: '3px',
        backgroundColor: '#fff',
        border: '1px solid #E5E5E5',
        borderRadius: '4px',
        padding: '10px',
        zIndex: '2',
    },
  })((props) => (
    <Menu
      elevation={2}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    />
));