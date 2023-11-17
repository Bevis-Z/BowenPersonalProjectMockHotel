import React, { useCallback } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import FocusLock from 'react-focus-lock';
import './index.css';

const { RangePicker } = DatePicker;

interface SearchDropdownMenuProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  minBedrooms: number | null;
  setMinBedrooms: React.Dispatch<React.SetStateAction<number | null>>;
  maxBedrooms: number | null;
  setMaxBedrooms: React.Dispatch<React.SetStateAction<number | null>>;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  setDateRange: React.Dispatch<React.SetStateAction<[dayjs.Dayjs | null, dayjs.Dayjs | null]>>;
  minPrice: number | null;
  setMinPrice: React.Dispatch<React.SetStateAction<number | null>>;
  maxPrice: number | null;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | null>>;
  minRating: number | null;
  setMinRating: React.Dispatch<React.SetStateAction<number | null>>;
  maxRating: number | null;
  setMaxRating: React.Dispatch<React.SetStateAction<number | null>>;
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}

// This is the SearchDropdownMenu component that will be rendered in the Navbar component
const SearchDropdownMenu: React.FC<SearchDropdownMenuProps> = ({
  searchText,
  setSearchText,
  minBedrooms,
  setMinBedrooms,
  maxBedrooms,
  setMaxBedrooms,
  dateRange,
  setDateRange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  maxRating,
  setMaxRating,
  handleSearch,
  handleReset,
}) => {
  const handleBedroomsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<number | null>>) => {
    setState(e.target.value ? parseInt(e.target.value, 10) : null);
  }, []);
  return (
    <FocusLock>
      <div className={'dropDownList'}>
        <form className="d-flex" onSubmit={handleSearch} role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Where"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {/* Bedroom Inputs */}
          <div className={'bedSearch'}>
            <input
              className="form-control me-2"
              type="number"
              placeholder="Min Bedrooms"
              value={minBedrooms || ''}
              onChange={(e) => handleBedroomsChange(e, setMinBedrooms)}
            />
            <input
              className="form-control me-2"
              type="number"
              placeholder="Max Bedrooms"
              value={maxBedrooms || ''}
              onChange={(e) => handleBedroomsChange(e, setMaxBedrooms)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className={'priceSearch'}>
            <input className="form-control me-2" type="number" placeholder="Min Price" value={minPrice || ''} onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value, 10) : null)} />
            <input className="form-control me-2" type="number" placeholder="Max Price" value={maxPrice || ''} onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : null)} />
          </div>
          <div className={'ratingSearch'}>
            <input className="form-control me-2" type="number" placeholder="Min Rating" value={minRating || ''} onClick={(e) => e.stopPropagation()} onChange={(e) => setMinRating(e.target.value ? parseInt(e.target.value, 10) : null)} />
            <input className="form-control me-2" type="number" placeholder="Max Rating" value={maxRating || ''} onClick={(e) => e.stopPropagation()}
                   onChange={(e) => setMaxRating(e.target.value ? parseInt(e.target.value, 10) : null)} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <RangePicker
              format="YYYY-MM-DD"
              value={dateRange}
              onChange={(dates) => setDateRange(dates || [null, null])}
            />
          </div>
          <div className={'controlBox'}>
            <button className="btn btn-outline-success" type="submit">Search</button>
            <button className="btn btn-outline-secondary ml-2" type="button" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </FocusLock>
  );
};

export default SearchDropdownMenu;
