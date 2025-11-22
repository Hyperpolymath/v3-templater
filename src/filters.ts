/**
 * Built-in filters for v3-templater
 */

import { FilterFunction } from './types';
import { SafeString } from './utils/escape';

/**
 * Built-in filter functions
 */
export const builtinFilters: Record<string, FilterFunction> = {
  /**
   * Convert value to uppercase
   */
  upper: (value: any): string => {
    return String(value).toUpperCase();
  },

  /**
   * Convert value to lowercase
   */
  lower: (value: any): string => {
    return String(value).toLowerCase();
  },

  /**
   * Capitalize first letter
   */
  capitalize: (value: any): string => {
    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Capitalize first letter of each word
   */
  title: (value: any): string => {
    return String(value).replace(/\b\w/g, (char) => char.toUpperCase());
  },

  /**
   * Trim whitespace
   */
  trim: (value: any): string => {
    return String(value).trim();
  },

  /**
   * Get length of value
   */
  length: (value: any): number => {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length;
    }
    return 0;
  },

  /**
   * Reverse a string or array
   */
  reverse: (value: any): any => {
    if (typeof value === 'string') {
      return value.split('').reverse().join('');
    }
    if (Array.isArray(value)) {
      return [...value].reverse();
    }
    return value;
  },

  /**
   * Join array elements
   */
  join: (value: any, separator = ', '): string => {
    if (Array.isArray(value)) {
      return value.join(separator);
    }
    return String(value);
  },

  /**
   * Replace substring
   */
  replace: (value: any, search: string, replacement: string): string => {
    return String(value).replace(new RegExp(search, 'g'), replacement);
  },

  /**
   * Split string into array
   */
  split: (value: any, separator = ' '): string[] => {
    return String(value).split(separator);
  },

  /**
   * Get default value if empty
   */
  default: (value: any, defaultValue: any): any => {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    return value;
  },

  /**
   * Format as JSON
   */
  json: (value: any, indent = 2): string => {
    return JSON.stringify(value, null, indent);
  },

  /**
   * Get first element
   */
  first: (value: any): any => {
    if (Array.isArray(value)) {
      return value[0];
    }
    if (typeof value === 'string') {
      return value[0];
    }
    return value;
  },

  /**
   * Get last element
   */
  last: (value: any): any => {
    if (Array.isArray(value)) {
      return value[value.length - 1];
    }
    if (typeof value === 'string') {
      return value[value.length - 1];
    }
    return value;
  },

  /**
   * Format number with fixed decimals
   */
  fixed: (value: any, decimals = 2): string => {
    return Number(value).toFixed(decimals);
  },

  /**
   * Format as percentage
   */
  percent: (value: any, decimals = 0): string => {
    return (Number(value) * 100).toFixed(decimals) + '%';
  },

  /**
   * Absolute value
   */
  abs: (value: any): number => {
    return Math.abs(Number(value));
  },

  /**
   * Round number
   */
  round: (value: any): number => {
    return Math.round(Number(value));
  },

  /**
   * Floor number
   */
  floor: (value: any): number => {
    return Math.floor(Number(value));
  },

  /**
   * Ceil number
   */
  ceil: (value: any): number => {
    return Math.ceil(Number(value));
  },

  /**
   * URL encode
   */
  urlencode: (value: any): string => {
    return encodeURIComponent(String(value));
  },

  /**
   * URL decode
   */
  urldecode: (value: any): string => {
    return decodeURIComponent(String(value));
  },

  /**
   * Mark string as safe (won't be escaped)
   */
  safe: (value: any): SafeString => {
    return new SafeString(String(value));
  },

  /**
   * Escape HTML entities (explicit)
   */
  escape: (value: any): string => {
    const str = String(value);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },

  /**
   * Truncate string
   */
  truncate: (value: any, length = 100, suffix = '...'): string => {
    const str = String(value);
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length - suffix.length) + suffix;
  },

  /**
   * Slice array or string
   */
  slice: (value: any, start = 0, end?: number): any => {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.slice(start, end);
    }
    return value;
  },

  /**
   * Sort array
   */
  sort: (value: any, key?: string): any => {
    if (!Array.isArray(value)) {
      return value;
    }

    const arr = [...value];
    if (key) {
      return arr.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    }

    return arr.sort();
  },

  /**
   * Unique values
   */
  unique: (value: any): any => {
    if (!Array.isArray(value)) {
      return value;
    }
    return [...new Set(value)];
  },

  /**
   * Date formatting (basic ISO)
   */
  date: (value: any, format = 'iso'): string => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return String(value);
    }

    if (format === 'iso') {
      return date.toISOString();
    }
    if (format === 'date') {
      return date.toDateString();
    }
    if (format === 'time') {
      return date.toTimeString();
    }
    if (format === 'locale') {
      return date.toLocaleString();
    }

    return date.toISOString();
  },
};
