import React, {useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
//import DateTimePicker from "@mui/lab/DateTimePicker";
import Stack from "@mui/material/Stack";
import {dateOptions} from './GBTimeTreeHelper/date-options';
import {ClickAwayListener, Popper} from '@mui/material';
import BPTextInput from './GBTimeTreeHelper/text-input';
import {BPDimens, BPStandards} from './GBTimeTreeHelper/standards';
import {parseDate} from './GBTimeTreeHelper/date-picker-processor';
import {BPDatePickerConflictResolver} from './GBTimeTreeHelper/date-picker-conflict-resolver';
import StaticDateTimePicker from '@mui/lab/StaticDateTimePicker';
import {Button, FormControl} from "@mui/material";

/* Author: @wilsonnexus
 * Customizable MUI Date Time Range Picker 
 * Implmented some code based off Team Indigo from Track 2.
 * 
 */

export default function CustomDateTimePicker({id = 'bp-datepicker', label, onChange, Time, value, setValue, minValue, maxValue}) {
// Date picker value.
  //const [value, setValue] = useState(Time);
  // Input field value.
  const [inputValue, setInputValue] = useState('');
  // Date picker open state.
  const [isOpen, setIsOpen] = useState(false);
  // Date picker hint state.
  const [hintState, setHintState] = useState(null);

  // Date picker input field error state.
  const [errorState, setErrorState] = useState(null);

  // Date picker anchor element.
  const boxRef = useRef(null);
  const handlePopoverClose = () => {
    setIsOpen(false);
  };
   // Process the datepicker value into input value.
  useEffect(() => {
    if (value) {
      setHintState(null);
      setErrorState(null);
      setInputValue(value.toLocaleString('en-US', dateOptions));
      if (onChange) {
        // Call the onChange callback with Date object.
        // It will always be called nevertheless it is inputted by typing or selecting.
        onChange(value);
      }
    }
  }, [value]);
   const onInputFinish = (text) => {
    try {
      const parsedDate = parseDate(text, Time || new Date());
      setValue(parsedDate);
    } catch (e) {
      setErrorState(e.message); // Set error message to the error state.
    }
  };

  const isValidOnBlur = () => {
    return (
      inputValue.length > 0 &&
      !inputValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}(?::\d{2})? (?:AM|PM)?$/)
    );
  };

  return (
  <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
  <ClickAwayListener
        onClickAway={handlePopoverClose}
      >
      <div
          style={{
            width: '100%',
          }}
        >
        <BPTextInput
            id={id}
            style={{
              width: '100%',
            }}
            label={(
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
               {label}
                
              </div>
            )}
             boxRef={(ref) => {
              boxRef.current = ref;
            }}
            hint={hintState}
            error={errorState}
            placeholder={'mm/dd/yyyy hh:mm:ss'}
            value={inputValue}
            /*onTextChange={(newValue) => {
              setHintState(null);
              setErrorState(null);
              setInputValue(newValue);
            }}*/
            onEnterPress={(e) => {
              handlePopoverClose();
              setHintState(null);
              onInputFinish(e.target.value);
            }}
            onEscPress={() => {
              handlePopoverClose();
            }}
            onBlur={() => {
              if (isValidOnBlur()) {
                setHintState('You are not finalizing it. Hit "Enter" after typing.');
              }
            }}
            onClick={() => setIsOpen(true)}
            />
            <BPDatePickerConflictResolver
            date={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
          <Popper
            id={isOpen ? `${id}-popper` : undefined}
            open={isOpen}
            anchorEl={boxRef.current}
            onClose={handlePopoverClose}
            popperOptions={{
              placement: 'bottom-start',
            }}
            style={{
              zIndex: 100,
            }}
          >

          <div
              style={{
                borderRadius: BPDimens.cornerRadius,
                border: BPStandards.border,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0px 20px 50px 0px rgba(0,0,0,0.10)',
                marginTop: 6,
                transform: 'translateX(-5px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
            >
              <div
                style={{
                  overflowY: 'auto',
                }}
              >

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3} sx={{ width: 0.9}} sy={{ height: 2}} >
        <StaticDateTimePicker
                    displayStaticWrapperAs="desktop"
                    openTo="day"
                    ampm={false}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    minDate={minValue}
                    maxDate={maxValue}
                    onAccept={() => {
                      handlePopoverClose();
                    }}
                    renderInput={(params) => <TextField {...params}/>}
                  />
            
        {/*<DateTimePicker
          value={endTime}
          onChange={endChangeHandler}
          type="datetime-local"
          ampm={false}
          label="End Time"
          onError={console.log}
          minDate={startTime}
          inputFormat="MM/dd/yyyy HH:mm"
          mask="___/__/__ __:__"
          renderInput={(params) => <TextField {...params} />}
        />*/}
        
      </Stack>
    </LocalizationProvider>
     </div>
     </div>
    </Popper>
    </div>
    </ClickAwayListener>
    </div>
  );
}
