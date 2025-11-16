import Calculator from './components/Calculator';
import './styles.css';

function App() {
  return (
    <main className="app-shell">
      <header>
        <h1>Calculator PWA</h1>
        <p>Basic operations with offline support and clipboard tools.</p>
      </header>
      <Calculator />
    </main>
  );
}

export default App;
