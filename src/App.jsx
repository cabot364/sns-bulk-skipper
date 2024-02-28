import './App.css'
import ListItems from './Components/listItems.jsx'

function App() {

    return (
        <>
            <section className={"mb-auto"}>
                <h1>Subscribe and Save Bulk Skipper</h1>
                <h2>Because it's crazy a bulk solution doesn't exist.</h2>
            </section>
            <section>
                <ListItems/>
            </section>
        </>
    )
}

export default App
