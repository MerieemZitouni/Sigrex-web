import React, { useState } from 'react';

export const useForm = (initialValues, validateOnChange = false, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (validateOnChange && validate) {
      validate({ [name]: value });
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    resetForm,
  };
};

export function Form(props) {
  const { children, onSubmit, ...other } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
    // You can add additional form submission logic here if needed
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit} {...other}>
      {children}
    </form>
  );
}
