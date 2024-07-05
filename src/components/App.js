import DynamicTable from './DynamicTable';
import data from './example.json'

function App() {
  return (
    <div className="dynamic-table">
      <DynamicTable data={data} />
      <p>Developed by <b>Medina Hasanzade</b></p>
      <a href="mailto:madina.hszd@gmail.com">madina.hszd@gmail.com</a>
      <a href="https://www.linkedin.com/in/mhasanzade/">linkedin.com/in/mhasanzade</a>
    </div>
  );
}

export default App;
