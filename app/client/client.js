import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import {calculateTotal} from '../calc/calc.service';

import {FORM, BASIS, TYPE, LAMINATION, PRINT_TIME, DESIGN} from './client.constants';
import {MIN_STICKER_SIZE} from '../admin/admin.constants';

const INITIAL_TOTAL_PRICE = '0.00';
const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(3),
        display: 'block'
    },
    row:{
        display: 'flex',
        flexWrap: 'wrap'
    },
    priceTotal: {
        position: 'fixed',
        right: '0.5em',
        top: '45%',
        background: '#eaff5c',
        fontSize: '3em',
        padding: '0.5em'
    }
}));

function RowRadio({label, list, value, onChange, noInitial = false}){
    const classes = useStyles();
    const LIST_ARR = Object.values(list);
    const initialValue = noInitial ? undefined : value;

    return (
        <FormControl className={classes.formControl}>
            <FormLabel>{label}:</FormLabel>
            <RadioGroup name="form-type" value={initialValue} onChange={onChange} row>
                {LIST_ARR.map( item => <FormControlLabel value={item} control={<Radio />} label={item} />)}
            </RadioGroup>
        </FormControl>
    );
}

export function ClientContainer() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        form: Object.values(FORM)[0],
        quantity: 1,
        stickerWidth: MIN_STICKER_SIZE,
        stickerHeight: MIN_STICKER_SIZE,
        basis: Object.values(BASIS)[0],
        type: Object.values(TYPE)[0],
        lamination: '',
        printTime: Object.values(PRINT_TIME)[2],
        design: Object.values(DESIGN)[2],
    });
    const handleChange = prop => event => {
            const newState = { ...values, [prop]: event.target.value };
            setValues(newState);
            setTotal(safelyCalculateTotal(newState));
    };
    const safelyCalculateTotal = (values) => {
        try {
            const total = calculateTotal(values);
            console.log(total);
            return total;
        } catch (e) {
            return INITIAL_TOTAL_PRICE;
        }
    };
    const [totalPrice, setTotal] = React.useState(safelyCalculateTotal(values));

    return (
        <>
            <RowRadio label='Выберите форму' list={FORM} value={values.form} onChange={handleChange('form')}/>
            <div className={classes.row}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-width">Ширина, мм:</InputLabel>
                    <Input id="size-width" value={values.stickerWidth} placeholder={'50'} onChange={handleChange('stickerWidth')} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="size-width">Высота, мм:</InputLabel>
                    <Input id="size-height" value={values.stickerHeight} placeholder={'50'} onChange={handleChange('stickerHeight')} />
                </FormControl>
            </div>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="quantity">Кол-во:</InputLabel>
                <Input id="quantity" value={values.quantity} onChange={handleChange('quantity')} />
            </FormControl>
            <RowRadio label='Основа' list={BASIS} value={values.basis} onChange={handleChange('basis')}/>
            <RowRadio label='Тип печати' list={TYPE} value={values.type} onChange={handleChange('type')}/>
            <RowRadio label='Ламинация' list={LAMINATION} value={values.lamination} onChange={handleChange('lamination')} noInitial={true}/>
            <RowRadio label='Время печати' list={PRINT_TIME} value={values.printTime} onChange={handleChange('printTime')}/>
            <RowRadio label='Дизайн' list={DESIGN} value={values.design} onChange={handleChange('design')}/>

            <div id="price-total" className={classes.priceTotal}>{totalPrice}грн</div>
        </>
    );
}

export default ClientContainer;
