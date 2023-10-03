import { ReactNode, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Controller } from 'react-hook-form';

const MyDatePicker = ({ control, name }) => {

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={selectedDate}
      render={({ field }: any) => (
        <DatePicker
          className="custom-datepicker"
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          showTimeSelect // Habilita a seleção de hora
          timeFormat="HH:mm" // Formato da hora
          timeIntervals={15} // Intervalos de tempo em minutos
          dateFormat="dd/MM/yyyy HH:mm" // Formato da data e hora
          placeholderText="Selecione data e hora"
          isClearable
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={10}
          popperPlacement="auto"
          locale="pt-BR"
        />
      )}
    />
  );
};

export default MyDatePicker;
