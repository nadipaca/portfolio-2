/**
 * Utility function to conditionally join classNames
 * @param {...(string|object|Array)} classes - Class names or objects
 * @returns {string} Joined class names
 */
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

