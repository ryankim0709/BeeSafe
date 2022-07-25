import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function Banner(props) {
  return (
    <LinearGradient
      style={styles.container}
      colors={['#F09819', '#EDDE5D']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      {/* Banner Name */}
      <Text style={styles.bannerText}>{props.text}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  // Banner text
  bannerText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.94,
    marginLeft: '3.84615%',
  },
});
