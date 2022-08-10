import React, {Component} from 'react';

import { BrowserRouter as Router, Route,Switch ,Redirect} from "react-router-dom";
import Home from './lib/components/Home';
import Push from './lib/components/Push';
import Pull from './lib/components/Pull';
import Client from './lib/components/RoomClient';
class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path={`${process.env.PUBLIC_URL}/home`}  component={Home}></Route>
                    <Route path={`${process.env.PUBLIC_URL}/push`}  component={Push}></Route>
                    <Route path={`${process.env.PUBLIC_URL}/pull`}  component={Pull}></Route>
                    <Route exact path={`${process.env.PUBLIC_URL}/room`}  component={Client}></Route>
                    <Redirect to={`${process.env.PUBLIC_URL}/push`} from={process.env.PUBLIC_URL} />
                </Switch>
            </Router>
        );
    }
}

export default App;
