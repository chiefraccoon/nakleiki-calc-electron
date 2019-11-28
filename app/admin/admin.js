import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import {RECT_LIST_PARAMS, CIRCUIT_LIST_PARAMS, EXCHANGE_RATE, DEFECTIVE_SHEETS} from './admin.constants';
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
        display: 'block'
    },
    row:{
        display: 'flex',
        flexWrap: 'wrap'
    },
    rowLabel: {
        padding: '2em 0'
    }
}));

function RangeInput(){
    return (
        <>

        </>
    );
}

export function AdminContainer() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        sizeRectWidth: RECT_LIST_PARAMS.width,
        sizeRectHeight: RECT_LIST_PARAMS.height,
        sizeCircWidth: CIRCUIT_LIST_PARAMS.width,
        sizeCircHeight: CIRCUIT_LIST_PARAMS.height,
        exchangeRate: EXCHANGE_RATE
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (
        <>
            <div className={classes.row}>
                <FormLabel className={classes.rowLabel}>Размер листа (прямоугольная порезка):</FormLabel>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-rect-width">Ширина, мм:</InputLabel>
                    <Input id="size-rect-width" value={values.sizeRectWidth} onChange={handleChange('sizeRectWidth')} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-rect-height">Высота, мм:</InputLabel>
                    <Input id="size-rect-height" value={values.sizeRectHeight} onChange={handleChange('sizeRectHeight')} />
                </FormControl>
            </div>
            <div className={classes.row}>
                <FormLabel className={classes.rowLabel}>Размер листа (круглая порезка):</FormLabel>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-circ-width">Ширина, мм:</InputLabel>
                    <Input id="size-circ-width" value={values.sizeCircWidth} onChange={handleChange('sizeCircWidth')} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-circ-height">Высота, мм:</InputLabel>
                    <Input id="size-circ-height" value={values.sizeCircHeight} onChange={handleChange('sizeCircHeight')} />
                </FormControl>
            </div>
            <div className={classes.row}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="currency-rate">Курс:</InputLabel>
                    <Input id="currency-rate" value={values.exchangeRate} onChange={handleChange('exchangeRate')} />
                </FormControl>
            </div>
            <div className={classes.row}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="defects">Брак:</InputLabel>
                    <Input id="defects" value={values.exchangeRate} onChange={handleChange('exchangeRate')} />
                </FormControl>
            </div>
        </>
    );
}

export default AdminContainer;
