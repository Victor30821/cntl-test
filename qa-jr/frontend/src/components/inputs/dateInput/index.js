import React, { forwardRef, useState, useEffect } from "react";
import { DateRangePickerStyle, DateLabel, DateDiv } from "./style.js";
import { InputLabel } from "components/card/cardInput/style"
import { Icon } from 'components';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Calendar from 'react-calendar'
import { format, sub, startOfMonth, endOfMonth, subDays, parseISO, isBefore, endOfYesterday, isDate } from 'date-fns';

import './styles.css';

function DateInput(
  {
    error,
    onChange,
    placeholder,
    name,
    label,
    id = 'input-date',
    value,
    required,
    isMulti,
    isMonth,
    style,
    type = 'calendar',
    hasDefaultValue = true,
    monthDefault = false,
    buttonsSelections = true,
    divStyles = {},
    defaultValue,
    ...option
  }
) {
  const [valueInputDate, setValueInputDate] = useState(value || [new Date(), new Date()]);
  const [valueInputDateCalendar, setValueInputDateCalendar] = useState([new Date(), new Date()]);
  const [valueCalendar, setValueCalendar] = useState([type === 'calendar' && value ? value : new Date()]);
  const [isMultiMonth, setIsMultiMonth] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const [dateStart, setDateStart] = useState(format(new Date(), 'dd/MM/yyyy'));

  const [dateEnd, setDateEnd] = useState(format(new Date(), 'dd/MM/yyyy'));

  const [date, setDate] = useState(format(type === 'calendar' && value ? value : new Date(), 'dd/MM/yyyy'));

  const [buttons] = useState({
    today: format(new Date(), 'yyyy-MM-dd'),
    yesterday: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    sevenDays: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    thirtyDays: format(subDays(new Date(), 30), 'yyyy-MM-dd')
  });

  const onChangeCalendar = (val) => {
    if (val === null) return;
    setValueCalendar(val);
    setDate(format(val, 'dd/MM/yyyy'));
    const data = { target: { value: format(val, 'yyyy-MM-dd') } };
    onChange('', data);
    setIsOpen(isOpen => isOpen = !isOpen);
  };
  
  const onChangeDate = (val) => {
    if (val === null) return;
    const hasTarget = (val && val.target && parseISO(val.target.value)) || null;
    
    const has_yerterday = String(val?.target?.outerHTML)?.includes("yesterday");

    if(hasTarget && has_yerterday) {
      const yesterday = endOfYesterday();
      val = [hasTarget, yesterday];
    }

    if (hasTarget && !has_yerterday) val = [hasTarget, new Date()];
    
    setValueInputDate(val);
    const [startDate = new Date(), endDate = new Date()] = val;
    const data = { startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(endDate, 'yyyy-MM-dd') };
    onChange('', data);
  }

  const onChangeDateCalendar = (val) => {
    if (val === null) return;
    if (isMulti) {
      setValueInputDateCalendar(val);
      isMultiMonth.length <= 1 && isMultiMonth.push(val);
      isMultiMonth.length <= 1 && setIsMultiMonth(isMultiMonth);
      if (isMultiMonth.length === 2) {
        const [startOfMonthSelected, endOfMonthSelected] = isMultiMonth;

        let startOfMonthFormattedToPicker;
        let endOfMonthFormattedToPicker;

        let startOfMonthFormattedToReturn;
        let endOfMonthFormattedToReturn;
        
        if (isBefore(startOfMonthSelected, endOfMonthSelected)) {
          startOfMonthFormattedToReturn = format(startOfMonth(startOfMonthSelected), 'yyyy-MM-dd');
          endOfMonthFormattedToReturn = format(endOfMonth(endOfMonthSelected), 'yyyy-MM-dd');

          startOfMonthFormattedToPicker = format(startOfMonth(startOfMonthSelected), 'dd/MM/yyyy');
          endOfMonthFormattedToPicker = format(endOfMonth(endOfMonthSelected), 'dd/MM/yyyy');

        } else {
          endOfMonthFormattedToReturn = format(endOfMonth(startOfMonthSelected), 'yyyy-MM-dd');
          startOfMonthFormattedToReturn = format(startOfMonth(endOfMonthSelected), 'yyyy-MM-dd');

          endOfMonthFormattedToPicker = format(endOfMonth(startOfMonthSelected), 'dd/MM/yyyy');
          startOfMonthFormattedToPicker = format(startOfMonth(endOfMonthSelected), 'dd/MM/yyyy');
        };

        setDateStart(startOfMonthFormattedToPicker)
        setDateEnd(endOfMonthFormattedToPicker);
        setIsOpen(isOpen => isOpen = !isOpen);
        const data = { startDate: startOfMonthFormattedToReturn, endDate: endOfMonthFormattedToReturn };
        onChange('', data);
        setIsMultiMonth([]);
      }
      return;
    }
    setValueInputDateCalendar(val);
    setIsOpen(isOpen => isOpen = !isOpen);
    const startOfMonthFormated = format(startOfMonth(val), 'yyyy-MM-dd');
    setDateStart(format(startOfMonth(val), 'dd/MM/yyyy'))
    const endOfMonthFormated = format(endOfMonth(val), 'yyyy-MM-dd');
    setDateEnd(format(endOfMonth(val), 'dd/MM/yyyy'));
    const data = { startDate: startOfMonthFormated, endDate: endOfMonthFormated };
    onChange('', data);
  }

  const setDefaultDate = () => {
    try {
      if (!hasDefaultValue) return;

      if (!type) throw new Error('No caledar type given');

      const today = new Date();
      const currentMonthBegin = startOfMonth(today);

      const oneWeekBefore = sub(today, { weeks: 1 });

      const threeMonthsBefore = sub(currentMonthBegin, { months: 2 });

      const oneMonthBefore = subDays(currentMonthBegin, 30)

      const inputs = {
        dateRangePicker: () => {
          onChangeDate(defaultValue || 
            [
              monthDefault ? oneMonthBefore : oneWeekBefore,
              today,
            ]
          );
          return true;
        },
        monthRangePicker: () => {
          onChangeDateCalendar(startOfMonth(threeMonthsBefore));
          onChangeDateCalendar(endOfMonth(today));
          setIsOpen(false);
          return true
        },
        calendar: () => {
          onChangeCalendar(today);
          setIsOpen(false);
          return true
        },
      };

      return inputs?.[type]?.();

    } catch (error) {
      console.log(error);
    }

    return false;
  }

  useEffect(() => {
    const hasValue = !Array.isArray(value) && !!valueCalendar && isDate(value);
    
    if(hasValue){
      setValueCalendar(value);
      setDate(format(value, 'dd/MM/yyyy'));
    }
  }, [value]);

  useEffect(() => {
    const inputs = document.querySelectorAll('.calendar-input .react-daterange-picker__inputGroup__input');
    if (inputs) inputs.forEach(elem => elem.setAttribute('disabled', true));
    setDefaultDate();

    if (buttonsSelections) {
      const caledar = document.querySelectorAll('.react-calendar');
      const hasSubMenu = document.getElementById('subButtons');
      const element = document.createElement('div');
      element.innerHTML =
        '<div id="subButtons" style="display:flex;flex-direction:column;background:#f3f3f3;">'
        + '<button id="today" type="button" value=' + buttons.today + ' class="subButtons">Hoje</button>'
        + '<button id="yesterday" type="button" value=' + buttons.yesterday + '  class="subButtons">Ontem</button>'
        + '<button type="button" value=' + buttons.sevenDays + '  class="subButtons">Últimos 7 Dias</button>'
        + '<button type="button" value=' + buttons.thirtyDays + '  class="subButtons">Últimos 30 Dias</button>'
        + '</div>';

      if (caledar) caledar.forEach(elem => {
        !hasSubMenu && type === 'dateRangePicker' && elem.prepend(element.firstChild)
        !hasSubMenu && type === 'dateRangePicker' && elem.firstChild.childNodes.forEach(element => element.onclick = onChangeDate)
      });
    }
    // eslint-disable-next-line
  }, [])

  const handleDateRangePicker = (e) => {
    
    if (e?.target?.className === "subButtons") {
      const [element] = document.getElementsByClassName('subButtonsActive');
      element && (element.className = "subButtons");
      e.target.className = "subButtons subButtonsActive";
      return setIsOpen(false)
    }
    setIsOpen(true);
  };
  
  const input = {
    monthRangePicker: () => (
      <div style={{ height: '70px' }}>
        {
          label &&
          <InputLabel required={required}>
            {label} <span>*</span>{" "}
          </InputLabel>
        }
        <div style={{ display: 'flex' }}>
          <DateLabel
            error={error}
            htmlFor={id}
            onClick={() => setIsOpen(isOpen => isOpen = !isOpen)}
          >
            <DateDiv>
              <Icon id={"date-svg"} icon={"calendar"} width={'16px'} height={'16px'} color='#868E96' />
            </DateDiv>
            {`${dateStart} até ${dateEnd}`}
          </DateLabel>
          <div style={{ display: isOpen ? 'block' : 'none', marginTop: '6.5%', ...option.calendarStyle }}>
            <Calendar
              allowPartialRange={isMulti}
              selectRange={isMulti}
              className={['react-calendar-component', 'calendar-input']}
              view='year'
              returnValue={isMulti && "range"}
              onClickMonth={onChangeDateCalendar}
              value={valueInputDateCalendar}
              defaultValue={valueInputDateCalendar}
            />
          </div>
        </div>
      </div>
    ),
    dateRangePicker: () => (
      <DateRangePickerStyle id="input-date-range-picker" {...divStyles} onClick={handleDateRangePicker}>
        {
          label &&
          <InputLabel required={required}>
            {label} <span>*</span>{" "}
          </InputLabel>
        }
        <DateRangePicker
          onCalendarClose={() => setIsOpen(false)}
          isOpen={isOpen}
          rangeDivider={'até'}
          clearIcon={null}
          calendarIcon={<Icon icon={'calendar'} width={'16px'} height={'16px'} color='hsl(0,0%,60%)' />}
          className={['react-calendar-input', 'calendar-input']}
          dayPlaceholder={'--'}
          monthPlaceholder={'--'}
          yearPlaceholder={'--'}
          required
          onChange={val => onChangeDate(val)}
          value={valueInputDate}
          format={"dd/MM/yyyy"}
          {...option.calendar}
        />
      </DateRangePickerStyle>
    ),
    calendar: () => (
      <div style={{ height: '70px', ...option.divStyle }}>
        {
          label &&
          <InputLabel required={required}>
            {label} <span>*</span>{" "}
          </InputLabel>
        }
        <div style={{ display: 'flex' }}>
          <DateLabel
            style={style}
            error={error}
            htmlFor={id}
            onClick={() => setIsOpen(isOpen => isOpen = !isOpen)}
          >
            <DateDiv>
              <Icon id={"date-svg"} icon={"calendar"} width={'16px'} height={'16px'} color='#868E96' />
            </DateDiv>
            {`${date}`}
          </DateLabel>
          <div style={{ display: isOpen ? 'block' : 'none', marginTop: '6.5%', ...option.calendarStyle }}>
            <Calendar
              className={['react-calendar-component', 'calendar-input']}
              onChange={val => onChangeCalendar(val)}
              value={valueCalendar}
              defaultValue={valueCalendar}
              {...option.calendar}
            />
          </div>
        </div>
      </div>
    )
  }

  return input[type]();
}

const forwardInput = forwardRef(DateInput);
export default forwardInput;
