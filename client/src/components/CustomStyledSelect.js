import React, { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
const CustomSelect = ({
  className = "border rounded-md w-full bg-white focus:shadow-none text-sm border-gray-400 font-normal",
  placeholder,
  field,
  form,
  options,
  onCreateOption,
  isMulti = false,
  hideDropdown = false,
  hideOptions = false,
  isSearchable = false,
  isLoading = false,
  isDisabled = false,
  isCreatable = false,
  isSearchableOnly = false,
  isClearable = true,
  // hideOptionUntilType = false,
  clearIndicatorVisible = false,
  padded = false,
  icon: Icon,
  theme = "light",
}) => {
  const [inputValue, setInputValue] = useState("");
  const components = {
    IndicatorSeparator: () => null,
    SingleValue: (props) => <span>{props.children}</span>,
    [!clearIndicatorVisible ? "ClearIndicator" : null]: () => null,
    [hideDropdown || isCreatable || isSearchableOnly
      ? "DropdownIndicator"
      : null]: () => null,
    [hideOptions ? "Option" : null]: () => null,
  };
  const themeMap = {
    dark: {
      control: (provided, state) => ({
        ...provided,
        // backgroundColor: state.isFocused ? "#fff" : "#f7fafc",
        // height: "35px",
        [Icon ? "paddingLeft" : null]: "32px",
        border: "none",
        backgroundColor: isDisabled ? "#292929" : "#333",
        borderWidth: 0,
        paddingTop: "2px",
        paddingBottom: "2px",
        whiteSpace: "nowrap",
        boxShadow: "none",
        borderRadius: "0.5rem",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1F4BEC" : "#fff",
        ":active": {
          backgroundColor: "#DEEBFF",
        },
        ":hover": {
          backgroundColor: state.isSelected ? "#1F4BEC" : "#DEEBFF",
        },
      }),

      placeholder: (provided, state) => ({
        ...provided,
        // color: "#a0aec0",
        color: "#D2D2D2",
        margin: 0,
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        display: "flex",
        flexWrap: isMulti ? "wrap" : "nowrap",
        borderRadius: "0.5rem",
        backgroundColor: isDisabled ? "#292929" : "#333",
        color: "white",
        paddingLeft: "1.25rem",
      }),
      menu: (provided, state) => ({
        ...provided,
        [isCreatable && !inputValue ? "display" : null]: "none",
      }),
    },

    light: {
      control: (provided, state) => ({
        ...provided,
        paddingTop: "1px",
        paddingBottom: "1px",
        // backgroundColor: state.isFocused ? "#fff" : "#f7fafc",
        whiteSpace: "nowrap",
        // height: "35px",

        [padded ? "paddingTop" : null]: "7px",
        [padded ? "paddingBottom" : null]: "7px",
        [padded ? "paddingRight" : null]: "1rem",
        [padded ? "paddingLeft" : null]: "1.5rem",
        [Icon ? "paddingLeft" : null]: "32px",
        border: "none",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1F4BEC" : "#fff",
        ":active": {
          backgroundColor: "#DEEBFF",
        },
        ":hover": {
          backgroundColor: state.isSelected ? "#1F4BEC" : "#DEEBFF",
        },
      }),

      placeholder: (provided, state) => ({
        ...provided,
        // color: "#a0aec0",
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        display: "flex",
        flexWrap: isMulti ? "wrap" : "nowrap",
      }),
      menu: (provided, state) => ({
        ...provided,
        [isCreatable && !inputValue ? "display" : null]: "none",
      }),
    },
  };

  const onChange = (option) => {
    console.log("option", option);
    if (option)
      form.setFieldValue(
        field.name,
        isMulti
          ? option
            ? option.map((item) => item.value)
            : []
          : option.value
      );
    else form.setFieldValue(field.name, option);
  };

  return (
    <div className={`w-full ${Icon ? "relative" : ""}`}>
      {isCreatable ? (
        <CreatableSelect
          className={`flex-auto lg:inline-block text-black focus:outline-none ${className}`}
          styles={themeMap[theme]}
          inputValue={inputValue}
          onInputChange={(value) => {
            setInputValue(value);
          }}
          components={components}
          name={field.name}
          value={
            isMulti
              ? options && field.value
                ? options.filter(
                    (option) => field.value.indexOf(option.value) >= 0
                  )
                : []
              : options && field.value
              ? options.find((option) => option.value === field.value)
              : null
          }
          onChange={onChange}
          formatCreateLabel={(value) => {
            return <div>{`Add "${value}"`}</div>;
          }}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isSearchable={true}
          isClearable={isClearable}
          createOptionPosition="last"
          onCreateOption={(value) => {
            if (onCreateOption)
              onCreateOption(value).then((data) => {
                console.log(data);
                return form.setFieldValue(
                  field.name,
                  isMulti
                    ? options
                      ? [...field.value, value]
                      : []
                    : options
                    ? value
                    : ""
                );
              });
          }}
        />
      ) : (
        <Select
          className={`flex-auto lg:inline-block text-black focus:outline-none ${className}`}
          styles={themeMap[theme]}
          components={components}
          name={field.name}
          value={
            isMulti
              ? options && field.value
                ? options.filter(
                    (option) => field.value.indexOf(option.value) >= 0
                  )
                : []
              : options && field.value
              ? options.find((option) => option.value === field.value)
              : ""
          }
          onChange={onChange}
          formatCreateLabel={(value) => {
            return <div>{`Add "${value}"`}</div>;
          }}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isSearchable={isSearchable}
        />
      )}
      {Icon ? (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Icon className="w-6 h-6 mx-3 text-gray-500" />
        </div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
