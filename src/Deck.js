import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

class Deck extends Component {

    constructor(props) {
        super(props);

        const panResponder = PanResponder.create({
            // always TRIPLE check the spelling here if its bad it wont fail but it wont work at ALL
            /*
            onStartShouldSetPanResponder: () => {}, ========= executed anytime a user taps on the screen
            if returned true, we want this instance of the panResponder (const) to handle that gesture
            
            onPanResponderMove: () => {},  ============= anytime that the user starts to drag their finger across the screen
            first argument is always called event (convention) works similar to the event in reactJS (what element is pressed down on)
            second argument is always called gesture (convention) what the user is doing with their finger on the screen (what pixel value pressed, how quickly finger is moved on screen)
                    -- most important usually

            onPanResponderRelease: () => {}  =========== anytime the user removes their finger from the press screen
             */
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                console.log(gesture);
            },
            onPanResponderRelease: () => {}
        });

        // a lot of official documentation will tell you to assign panResponder to the state
        // we will follow this convention but you can easily do just
        ////// this.panResponder = panResponder
        // you can create a panResponder to its own component (its outside of a state system)
        this.state = { panResponder };
    }

    // render card
    renderCards() {

        // pass in the list of data (array)
        // for each item in that array it calls renderCard()
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;