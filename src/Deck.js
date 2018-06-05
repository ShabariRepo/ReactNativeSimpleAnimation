import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Deck extends Component {

    // render card
    renderCards(){
        // pass in the list of data (array)
        // for each item in that array it calls renderCard()
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }

    render() {
        return(
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;