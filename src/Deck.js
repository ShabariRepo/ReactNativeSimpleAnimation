import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

// this is something that wont change over time so keep it outside
const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends Component {

    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
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
                // every time the user drags the finger take the the value and update current position
                position.setValue({ x: gesture.dx })//to also move up and down , y: gesture.dy })
            },
            onPanResponderRelease: () => {}
        });

        // a lot of official documentation will tell you to assign panResponder to the state (can apply to position too)
        // we will follow this convention but you can easily do just
        ////// this.panResponder = panResponder
        // you can create a panResponder to its own component (its outside of a state system)
        this.state = { panResponder, position };
    }

    // helper method to determine the styling for the top card
    getCardStyle(){
        // interpolation between the x location the card is dragged and rotation
        const { position } = this.state;  // get access to the position property
        // amount of input with the output of rotation
        const rotate = position.x.interpolate({
            // multiplying slows the rate of rotation(bigger value interpolated)
            inputRange: [-SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...this.state.position.getLayout(),
            //transform: [{ rotate: rotate }] old version belos is ES6 version
            transform: [{ rotate }]
        };
    }

    // render card
    renderCards() {

        // pass in the list of data (array)
        // for each item in that array it calls renderCard()
        return this.props.data.map((item, index) => {
            // only the first position card
            // whenever you are using a list you have to assign a key
            if(index === 0){
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View                
            >
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;