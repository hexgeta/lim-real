import logo from './logo.svg';
import './App.css';
import DiscountChart from './components/chartcomponent';

const number_id = '@Hexgeta';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi, my name is {number_id}.
        </p>

        <div><DiscountChart /></div>
        <a
          className="App-link"
          href="https://lookintomaxi.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit my Site
        </a>
        
  
        
      </header>
    </div>
  );
}

export default App;
