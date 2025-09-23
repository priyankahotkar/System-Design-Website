import { forwardRef, useState, useMemo } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  const isPasswordField = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const inputType = useMemo(() => (isPasswordField && showPassword ? 'text' : type), [isPasswordField, showPassword, type]);
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className={`relative`}>
        <input
          ref={ref}
          type={inputType}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${isPasswordField ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.26 2.26A11.52 11.52 0 0 0 1.5 12s3.75 7.5 10.5 7.5c2.13 0 3.97-.6 5.5-1.5l2.97 2.97a.75.75 0 1 0 1.06-1.06l-18-18ZM12 6.75c.63 0 1.24.1 1.8.3l-1.37 1.37A3 3 0 0 0 9.58 11.9l-1.45 1.45A4.5 4.5 0 0 1 12 6.75Zm0 10.5a3.73 3.73 0 0 1-1.8-.46l1.71-1.71a3 3 0 0 0 1.84-1.84l2.64-2.64A4.5 4.5 0 0 1 12 17.25Z"/>
                <path d="M15.75 12c0 .18-.01.35-.04.52l4.52-4.52C18.5 5.33 15.85 4.5 12 4.5 7.03 4.5 3.55 7.41 1.79 9.47a4.62 4.62 0 0 0-.29.36l-.01.01a2 2 0 0 0 0 2.33l.01.01c.07.1.17.24.29.36.28.32.63.7 1.05 1.09l1.09-1.09A11.52 11.52 0 0 1 1.5 12c0 0 3.75-7.5 10.5-7.5 2.63 0 4.74.66 6.41 1.67l-2.62 2.62c-.67-.48-1.5-.76-2.39-.76A4.5 4.5 0 0 0 8.25 12c0 .89.28 1.72.76 2.39l-1.06 1.06A6 6 0 0 1 6.75 12 6.75 6.75 0 0 1 12 5.25c.89 0 1.72.28 2.39.76l1.36-1.36C14.88 4.86 13.51 4.5 12 4.5c-6.75 0-10.5 7.5-10.5 7.5s3.75 7.5 10.5 7.5c3.85 0 6.5-.83 8.23-2.5l-1.91-1.91A11.18 11.18 0 0 1 12 19.5a11.18 11.18 0 0 1-5.39-1.44l1.78-1.78c.17.03.34.04.52.04a4.5 4.5 0 0 0 4.5-4.5Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 4.5c-6.75 0-10.5 7.5-10.5 7.5s3.75 7.5 10.5 7.5 10.5-7.5 10.5-7.5S18.75 4.5 12 4.5Zm0 12A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9Z"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-600">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;