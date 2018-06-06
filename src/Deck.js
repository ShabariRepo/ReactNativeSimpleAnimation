import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

// this is something that wont change over time so keep it outside
const SCREEN_WIDTH = Dimensions.get('window').width;
// thresh hold for swiping 1/4 of the screen
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
// duration of swipe out card
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    // if user of the component does not pass in the given props than it will use the ones here as default
    // always do a default as a practice, when writing re-usable components (to avoid type checking like if(onSwipeRight) do.. and avoid errors)
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

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
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD){
                    // swipe right
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    // swipe left (negative to indicate left)
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        // a lot of official documentation will tell you to assign panResponder to the state (can apply to position too)
        // we will follow this convention but you can easily do just
        ////// this.panResponder = panResponder
        // you can create a panResponder to its own component (its outside of a state system)
        this.state = { panResponder, position, index: 0 };
    }

    forceSwipe(direction){
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        // timing is same as spring but timing is more linear
        // timing is used anytime there needs to be updates to NEW position (difference is you have to specify duration of animation)
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
        // callback once animation is complete and pass direction
    }

    // reset the position of the card to default (0, 0)
    resetPosition(){        
        Animated.spring(this.state.position, {
            toValue: { x:0, y:0 }
        }).start();
    }

    // after swiped card animation is complete (off the page)
    onSwipeComplete(direction){
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

        // get the next card ready for swiping
        // reset the position x y
        // if didnt take the bottom step then when position attached to next card then the next card will go where card before goes
        // below is weird goes back to the need to not set it in state as the setState isnt called
        // can do this as just this.position...
        // if you do this then you have to completely remove position from state (constructor)
        this.state.position.setValue({ x: 0, y: 0 });
        // NOT doing just this.state.index ++;
        // not modifying the existing value just resetting it using setState
        this.setState({ index: this.state.index + 1 })
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