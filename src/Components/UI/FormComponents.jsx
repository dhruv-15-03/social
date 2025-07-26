import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  CircularProgress,
  Zoom
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SecurityUtils } from '../utils/SecurityUtils';


export const EnhancedTextField = ({
  label,
  name,
  type = 'text',
  icon,
  validation,
  formik,
  autoComplete,
  placeholder,
  multiline = false,
  rows = 1,
  maxLength,
  ...props
}) => {
  const hasError = formik.touched[name] && formik.errors[name];
  const isValid = formik.touched[name] && !formik.errors[name] && formik.values[name];

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={formik.values[name] || ''}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={!!hasError}
      helperText={hasError || (maxLength && `${formik.values[name]?.length || 0}/${maxLength}`)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      multiline={multiline}
      rows={multiline ? rows : 1}
      inputProps={{
        maxLength: maxLength,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: hasError ? 'error.main' : isValid ? 'success.main' : 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: hasError ? 'error.main' : isValid ? 'success.main' : 'primary.main',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: hasError ? 'error.main' : isValid ? 'success.light' : 'grey.300',
        },
        '& .MuiInputLabel-root': {
          color: hasError ? 'error.main' : isValid ? 'success.main' : 'text.secondary',
        },
      }}
      InputProps={{
        startAdornment: icon && (
          <InputAdornment position="start">
            {React.cloneElement(icon, { 
              sx: { 
                color: hasError ? 'error.main' : isValid ? 'success.main' : 'text.secondary',
                fontSize: '20px'
              } 
            })}
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
      {...props}
    />
  );
};

export const PasswordTextField = ({ 
  name, 
  label = 'Password', 
  formik, 
  showStrength = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];
  const password = formik.values[name] || '';

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const getPasswordStrength = useCallback((password) => {
    if (!password) return { score: 0, label: '', color: 'grey.300' };
    
    const validation = SecurityUtils.validatePassword(password);
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const strengthMap = {
      0: { label: '', color: 'grey.300' },
      1: { label: 'Very Weak', color: 'error.main' },
      2: { label: 'Weak', color: 'warning.main' },
      3: { label: 'Fair', color: 'info.main' },
      4: { label: 'Good', color: 'success.light' },
      5: { label: 'Strong', color: 'success.main' }
    };

    return { score, ...strengthMap[score] };
  }, []);

  const strength = showStrength ? getPasswordStrength(password) : null;

  return (
    <FormControl fullWidth>
      <EnhancedTextField
        name={name}
        label={label}
        type={showPassword ? 'text' : 'password'}
        formik={formik}
        icon={<Lock />}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                size="small"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
      
      {showStrength && password && (
        <FormHelperText
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
            color: strength.color
          }}
        >
          <div
            style={{
              width: '100px',
              height: '4px',
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(strength.score / 5) * 100}%`,
                height: '100%',
                backgroundColor: strength.color === 'grey.300' ? '#e0e0e0' : strength.color,
                transition: 'all 0.3s ease',
                borderRadius: '2px'
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {strength.label}
          </span>
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const SubmitButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  variant = 'contained',
  size = 'large',
  fullWidth = true,
  startIcon,
  ...props 
}) => {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        borderRadius: '12px',
        py: 1.5,
        px: 3,
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        background: variant === 'contained' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'transparent',
        '&:hover': {
          transform: disabled || loading ? 'none' : 'translateY(-2px)',
          boxShadow: disabled || loading 
            ? 'none' 
            : '0 8px 25px rgba(102, 126, 234, 0.4)',
          background: variant === 'contained'
            ? 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
            : 'rgba(102, 126, 234, 0.08)',
        },
        '&:disabled': {
          background: variant === 'contained'
            ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
            : 'transparent',
          color: 'text.disabled',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const validationSchemas = {
  login: Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required')
      .test('email-security', 'Invalid email format', (value) => {
        return value ? SecurityUtils.isValidEmail(value) : false;
      }),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  }),

  register: Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required')
      .test('name-security', 'Invalid characters in name', (value) => {
        return value ? !/[<>\"'&]/.test(value) : false;
      }),
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required')
      .test('email-security', 'Invalid email format', (value) => {
        return value ? SecurityUtils.isValidEmail(value) : false;
      }),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .test('password-strength', 'Password does not meet requirements', (value) => {
        if (!value) return false;
        const validation = SecurityUtils.validatePassword(value);
        return validation.isValid;
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  }),

  profile: Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    bio: Yup.string()
      .max(160, 'Bio must be less than 160 characters'),
    website: Yup.string()
      .url('Enter a valid URL')
      .nullable(),
  }),
};

export default {
  EnhancedTextField,
  PasswordTextField,
  SubmitButton,
  validationSchemas
};
