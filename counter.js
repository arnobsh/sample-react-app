function Button() {
    const [counter, setCounter] = useState(0);
    return <button onclick={()=> setCounter(counter+1)}>{counter}</button>;
}

ReactDOM.render(
    <Button />,
    document.getElementById('mountNode'),
);