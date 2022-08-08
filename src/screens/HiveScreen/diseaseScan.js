import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Banner from '../../components/banner';
import Feather from 'react-native-vector-icons/Feather';

export default function DiseaseScan({navigation, route}) {
  const [frames, setFrames] = useState();
  const [frameCheck, setFrameCheck] = useState([]);
  useEffect(() => {
    var numFrames = route['data']['frames'];
    setFrames(numFrames);

    if (numFrames === 8) {
      setFrameCheck([false, true, false, true, false, true, false, true]);
    } else {
      setFrameCheck([
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
      ]);
    }

    console.log('here');
    console.log(frameCheck);
  }, []);

  if (!frameCheck) return null;
  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Banner text="Disease Scan" />
      </View>

      <ScrollView style={{width: '100%', height: '100%'}}>
        {frameCheck.map((status, key) => (
          <View style={styles.imageBoxContainer}>
            <View key={key} style={styles.imageBox}></View>
            {status ? (
              <Feather name="check-square" color={'green'} size={30} />
            ) : (
              <Feather name="x-square" color={'red'} size={30} />
            )}
          </View>
        ))}
      </ScrollView>
      {/* View for padding at the bottom of ScrollView */}
      <View style={{width: '100%', height: '7.1923%', borderRadius: 10}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '78.9719%',
    height: '4.8596%',
    marginLeft: '6.542%',
    marginTop: '6.6954%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignSelf: 'flex-start',
  },
  imageBoxContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.12526,
    marginTop: '2.3758%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageBox: {
    width: '64.95%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
});
