

import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useCallback } from 'react';
import React from 'react';

export const validationSchemas = {
  login: yup.object({
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  }),

  register: yup.object({
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    userName: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  }),

  createPost: yup.object({
    content: yup
      .string()
      .max(500, 'Post content must be less than 500 characters')
      .required('Post content is required'),
    image: yup
      .mixed()
      .test('fileSize', 'File size must be less than 5MB', (value) => {
        if (!value || !value[0]) return true;
        return value[0].size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only image files are allowed', (value) => {
        if (!value || !value[0]) return true;
        return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value[0].type);
      }),
  }),

  comment: yup.object({
    comment: yup
      .string()
      .max(200, 'Comment must be less than 200 characters')
      .required('Comment is required'),
  }),

  profileUpdate: yup.object({
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    bio: yup
      .string()
      .max(150, 'Bio must be less than 150 characters'),
    website: yup
      .string()
      .url('Please enter a valid URL')
      .nullable(),
  }),
};

export const useLoginForm = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(validationSchemas.login),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      if (error.response?.status === 401) {
        form.setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: error.message || 'Login failed. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, form]);

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
};

export const useRegisterForm = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(validationSchemas.register),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = data;
      await onSubmit(submitData);
    } catch (error) {
      if (error.response?.status === 409) {
        form.setError('email', {
          type: 'manual',
          message: 'An account with this email already exists',
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: error.message || 'Registration failed. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, form]);

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
};

export const useCreatePostForm = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: yupResolver(validationSchemas.createPost),
    defaultValues: {
      content: '',
      image: null,
    },
    mode: 'onChange',
  });

  const watchImage = form.watch('image');

  React.useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchImage]);

  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }
      await onSubmit(formData);
      
      form.reset();
      setImagePreview(null);
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, form]);

  const removeImage = useCallback(() => {
    form.setValue('image', null);
    setImagePreview(null);
  }, [form]);

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    imagePreview,
    removeImage,
  };
};

export const useCommentForm = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(validationSchemas.comment),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data.comment);
      form.reset(); 
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error.message || 'Failed to post comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, form]);

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
};

export const useFormField = (name, control, rules = {}) => {
  const {
    field,
    fieldState: { error, invalid },
    formState: { isSubmitting }
  } = useController({
    name,
    control,
    rules,
  });

  return {
    ...field,
    error: invalid,
    helperText: error?.message,
    disabled: isSubmitting,
  };
};

export const useFileUpload = (onFileSelect, options = {}) => {
  const {
    accept = 'image/*',
    multiple = false,
    maxSize = 5 * 1024 * 1024,
  } = options;

  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateFile = useCallback((file) => {
    const errors = [];
    
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }
    
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      errors.push('Invalid file type');
    }
    
    return errors;
  }, [accept, maxSize]);

  const handleFiles = useCallback((files) => {
    const fileList = Array.from(files);
    const validFiles = [];
    const allErrors = [];

    fileList.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        allErrors.push(...fileErrors);
      }
    });

    setErrors(allErrors);
    
    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  }, [validateFile, multiple, onFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  return {
    isDragOver,
    errors,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    clearErrors: () => setErrors([]),
  };
};
