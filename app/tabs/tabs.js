import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from './tabpanel';
import LinkTab from './linktab';
import ClientContainer from '../client/client';
import AdminContainer from '../admin/admin';

import {TAB_CLIENT, TAB_ADMIN} from './tabs.constants';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export function TabsContainer() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                >
                    <LinkTab label="Calculator" href={'/'+TAB_CLIENT} />
{/*
                    <LinkTab label="Admin" href={'/'+TAB_ADMIN} />
*/}
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ClientContainer />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AdminContainer />
            </TabPanel>
        </div>
    );
}

export default TabsContainer;
