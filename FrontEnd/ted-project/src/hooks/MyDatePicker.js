import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from 'date-fns/locale'; // Εισαγωγή του locale για Αγγλικά

const MyDatePicker = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <div>
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                locale={enUS} // Ορισμός της γλώσσας σε Αγγλικά
                dateFormat="MM/dd/yyyy" // Ορισμός του format σε Αγγλικό format
                placeholderText="Select Start Date"
                className="form-control"
            />
            <label htmlFor="endDate" className="form-label mt-3">End Date</label>
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                locale={enUS} // Ορισμός της γλώσσας σε Αγγλικά
                dateFormat="MM/dd/yyyy" // Ορισμός του format σε Αγγλικό format
                placeholderText="Select End Date"
                className="form-control"
            />
        </div>
    );
};

export default MyDatePicker;
