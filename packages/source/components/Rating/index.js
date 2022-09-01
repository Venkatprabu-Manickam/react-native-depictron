import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {Rating} from 'react-native-ratings';

import LabelError from '../LabelError';

import styles from './styles';

export default class Ratings extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    onStarRatingChange: PropTypes.func,
    starCount: PropTypes.number,
    config: PropTypes.object,
    maxStars: PropTypes.number,
    error: PropTypes.bool,
    type: PropTypes.string,
    required : PropTypes.bool
  };

  static defaultProps = {
    label: '',
    onStarRatingChange: () => {},
    starCount: 0,
    config: {
      iconSet: 'MaterialIcons',
      emptyStar: 'star-border',
      fullStar: 'star',
      halfStar: 'star-half',
      enableHalfStar: false,
      ratingRemark: this.ratingRemark,
    },
    maxStars: 5,
    error: false,
    type: 'star',
    ratingImage: null,
    imageSize: 30,
    required : false
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.ratingRemark = {
      1: 'Very Bad',
      2: 'Bad',
      3: 'Average',
      4: 'Good',
      5: 'Excellent',
    };
  }

  onStarRatingPress = starCount => {
    const {onStarRatingChange} = this.props;
    onStarRatingChange(starCount);
  };

  getRatingRemark = () => {
    const {starCount, config} = this.props;
    const ratingRemark = config.ratingRemark || this.ratingRemark;
    return ratingRemark[starCount] || '';
  };

  render() {
    const {
      label,
      starCount,
      error,
      type = 'star',
      imageSize = 30,
      ratingImage = null,
      ratingCount = 5,
    } = this.props;
    const {theme} = this.context;
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <View style={styles.ratingContainer}>
          <Rating
            style={styles.containerStyle}
            type={type}
            startingValue={starCount}
            ratingCount={ratingCount}
            imageSize={imageSize}
            ratingImage={ratingImage}
            onFinishRating={this.onStarRatingPress}
          />

          <Text style={theme.rating.remarkStyle}>{this.getRatingRemark()}</Text>
        </View>
      </View>
    );
  }
}
