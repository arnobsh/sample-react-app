import React from 'react';
import ReactDOM from 'react-dom';
import './Github.css';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';


const CardList = (props) => (
    <div>
        {props.profiles.map(profile => <Card key={profile.id} {...profile}/>)}
    </div>
);

class Card extends React.Component {
    render() {
        const profile = this.props;
        return (
            <div className="github-profile">
                <img style={{width: 75, height:125}} alt={profile.name} src={profile.avatar_url} />
                <div className="info">
                    <div className="name">{profile.name}</div>
                    <div className="company">{profile.company}</div>
                </div>
            </div>
        );
    }
}

class Form extends React.Component {
    state = { userName: '' };
    handleSubmit = async (event) => {
        event.preventDefault();
        const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
        this.props.onSubmit(resp.data);
        this.setState({ userName: '' });
    };
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    value={this.state.userName}
                    onChange={event => this.setState({ userName: event.target.value })}
                    placeholder="GitHub username"
                    required
                />
                <button>Add card</button>
            </form>
        );
    }
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div>
                    <h2>Something went wrong</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Render children if there's no error
        return this.props.children;
    }
}

class App extends React.Component {
    state = {
        profiles: [],
    };
    addNewProfile = (profileData) => {
        this.setState(prevState => ({
            profiles: [...prevState.profiles, profileData],
        }));
    };
    render() {
        return (
            <div>
                <div className="header">{this.props.title}</div>
                <ErrorBoundary>
                    <Form onSubmit={this.addNewProfile} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <CardList profiles={this.state.profiles} />
                </ErrorBoundary>

            </div>
        );
    }
}

ReactDOM.render(
    <App title="The GitHub Cards App" />,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
