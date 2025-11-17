import { useState } from 'react';

const OPERATORS = ['+', '-', '×', '÷', '%'] as const;
type Operator = (typeof OPERATORS)[number];

function calculate(a: number, b: number, operator: Operator): number {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? Infinity : a / b;
    case '%':
      return b === 0 ? a : a % b;
  }
}

const buttons = [
  '7',
  '8',
  '9',
  '÷',
  '4',
  '5',
  '6',
  '×',
  '1',
  '2',
  '3',
  '-',
  '+/-',
  '0',
  '.',
  '+',
  '%',
  'C',
  '=',
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [status, setStatus] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleNumber = (value: string) => {
    setStatus('');
    if (justEvaluated) {
      setJustEvaluated(false);
      setDisplay(value === '.' ? '0.' : value);
      return;
    }

    setDisplay((prev) => {
      if (prev === '0' && value !== '.') return value;
      if (value === '.' && prev.includes('.')) return prev;
      return prev + value;
    });
  };

  const handleOperator = (next: Operator) => {
    setStatus('');
    setJustEvaluated(false);
    if (operator && pendingValue !== null) {
      if ((operator === '÷' || operator === '%') && Number(display) === 0) {
        setStatus(`Cannot ${operator === '÷' ? 'divide' : 'modulo'} by zero`);
        return;
      }
      const result = calculate(pendingValue, Number(display), operator);
      setPendingValue(result);
      setDisplay('0');
      setOperator(next);
    } else {
      setPendingValue(Number(display));
      setDisplay('0');
      setOperator(next);
    }
  };

  const handleEquals = () => {
    if (operator && pendingValue !== null) {
      if ((operator === '÷' || operator === '%') && Number(display) === 0) {
        setStatus(`Cannot ${operator === '÷' ? 'divide' : 'modulo'} by zero`);
        return;
      }
      const result = calculate(pendingValue, Number(display), operator);
      setDisplay(String(result));
      setPendingValue(null);
      setOperator(null);
      setJustEvaluated(true);
    }
  };

  const toggleSign = () => {
    if (display === '0') return;
    if (display === 'Error') {
      setDisplay('0');
      return;
    }
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  };

  const clear = () => {
    setDisplay('0');
    setPendingValue(null);
    setOperator(null);
    setStatus('Cleared');
    setJustEvaluated(false);
  };

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      setStatus('Clipboard not supported');
      return;
    }
    try {
      await navigator.clipboard.writeText(display);
      setStatus('Copied to clipboard');
    } catch (error) {
      console.error(error);
      setStatus('Copy failed');
    }
  };

  const handlePaste = async () => {
    if (!navigator.clipboard) {
      setStatus('Clipboard not supported');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setStatus('Clipboard empty');
        return;
      }
      const numeric = Number(text);
      if (Number.isNaN(numeric)) {
        setStatus('Clipboard does not contain a number');
        return;
      }
      setDisplay(String(numeric));
      setStatus('Pasted');
      setPendingValue(null);
      setOperator(null);
      setJustEvaluated(false);
    } catch (error) {
      console.error(error);
      setStatus('Paste failed');
    }
  };

  const onButtonPress = (value: string) => {
    if (!Number.isNaN(Number(value)) && value !== '0') {
      handleNumber(value);
      return;
    }

    if (value === '0') {
      setStatus('');
      setDisplay((prev) => (prev === '0' ? '0' : prev + '0'));
      return;
    }

    if (value === '.') {
      handleNumber(value);
      return;
    }

    if (value === '+/-') {
      toggleSign();
      return;
    }

    if (value === 'C') {
      clear();
      return;
    }

    if (value === '=') {
      handleEquals();
      return;
    }

    if (OPERATORS.includes(value as Operator)) {
      handleOperator(value as Operator);
    }
  };

  return (
    <section className="calculator" aria-label="Calculator">
      <div className="display" aria-live="polite" aria-atomic="true">
        {display}
      </div>
      <div className="keypad">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={OPERATORS.includes(btn as Operator) || btn === '=' ? 'operator' : ''}
            onClick={() => onButtonPress(btn)}
          >
            {btn}
          </button>
        ))}
        <button className="button-wide" onClick={handleCopy}>
          Copy
        </button>
        <button className="button-wide" onClick={handlePaste}>
          Paste
        </button>
      </div>
      <div className="utility-buttons">
        <button onClick={clear}>Clear</button>
        <button onClick={toggleSign}>±</button>
      </div>
      <div className="status" aria-live="polite">
        {status}
      </div>
    </section>
  );
}
