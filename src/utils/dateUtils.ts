import { format, parseISO } from 'date-fns';

/**
 * Formats a date string into a human-readable format.
 * @param dateString - The date string to format (expected to be in ISO 8601 format).
 * @param formatString - The desired output format (default: 'MMMM d, yyyy').
 * @returns A formatted date string, or 'N/A' if the input is invalid.
 */
export const formatDate = (dateString: string | undefined, formatString: string = 'MMMM d, yyyy'): string => {
    if (!dateString) return 'N/A';
    
    try {
        const date = parseISO(dateString);
        return format(date, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
};

/**
 * Formats a date string into a relative time format (e.g., "2 days ago").
 * @param dateString - The date string to format (expected to be in ISO 8601 format).
 * @returns A relative time string, or 'N/A' if the input is invalid.
 */
export const formatRelativeDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
        const date = parseISO(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 30) return `${diffInDays} days ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    } catch (error) {
        console.error('Error formatting relative date:', error);
        return 'N/A';
    }
};