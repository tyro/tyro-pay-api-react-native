// Global JSX namespace shim for @types/react@19 compatibility.
// React 19 moved JSX to React.JSX; this restores the global JSX.Element alias.
declare namespace JSX {
  type Element = import('react').JSX.Element;
}
