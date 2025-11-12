'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useAuth } from '@/lib/hooks/useAuth';
import { RegisterRequest } from '@/types/auth';
import styles from './RegistrationForm.module.css';
import { registrationSchema } from '@/lib/validation/authSchemas';

const RegistrationForm = () => {
  const { register, isSubmitting } = useAuth();

  const initialValues: RegisterRequest = {
    name: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: RegisterRequest,
    { setFieldError }: FormikHelpers<RegisterRequest>
  ) => {
    try {
      await register(values);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message.includes('email') ||
          error.message.includes('пошта')
        ) {
          setFieldError('email', error.message);
        } else if (
          error.message.includes('password') ||
          error.message.includes('пароль')
        ) {
          setFieldError('password', error.message);
        } else if (
          error.message.includes('name') ||
          error.message.includes('ім')
        ) {
          setFieldError('name', error.message);
        } else {
          // General error
          setFieldError('email', error.message);
        }
      }
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Реєстрація</h1>
      <p className={styles.subtitle}>
        Раді вас бачити у спільноті мандрівників!
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ errors, touched, values }) => (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Ім&apos;я та Прізвище*
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Ваше ім'я та прізвище"
                className={`${styles.input} ${
                  errors.name && touched.name ? styles.inputError : ''
                } ${!errors.name && touched.name && values.name ? styles.inputValid : ''}`}
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Пошта*
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="hello@podorozhnyky.ua"
                className={`${styles.input} ${
                  errors.email && touched.email ? styles.inputError : ''
                } ${!errors.email && touched.email && values.email ? styles.inputValid : ''}`}
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Пароль*
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className={`${styles.input} ${
                  errors.password && touched.password ? styles.inputError : ''
                } ${!errors.password && touched.password && values.password ? styles.inputValid : ''}`}
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Реєструємо...' : 'Зареєструватися'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;
