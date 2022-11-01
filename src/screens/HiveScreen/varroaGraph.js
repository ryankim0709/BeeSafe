import {useEffect, useState} from 'react';
import Banner from '../../components/banner';
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import HiveGraph from '../../components/hiveGraph';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function VarroaGraph({route}) {
  const [option, setOption] = useState(0);
  const line = [
    {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          data: [0, 2, 5, 8, 3, 1],
          /* color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional */
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 10, // optional
        },
      ],
      legend: ['Varroa Mite Infestation Level in Hive'], // optional
    },
    {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          data: [0.5, 5, 3, 4, 2, 1],
          /* color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional */
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 10, // optional
        },
      ],
      legend: ['Varroa Mite Infestation Level in Apiary'], // optional
    },
  ];
  return (
    <View style={styles.container}>
      <Banner text="Hive Graph" />
      <View style={styles.graphContainer}>
        <HiveGraph data={line[option]} />
      </View>
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            {backgroundColor: option === 0 ? '#EEC746' : 'white'},
          ]}
          onPress={() => {
            setOption(0);
          }}>
          <Text
            style={[
              styles.optionText,
              {color: option === 0 ? 'white' : 'black'},
            ]}>
            Hive
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            {backgroundColor: option === 1 ? '#EEC746' : 'white'},
          ]}
          onPress={() => {
            setOption(1);
          }}>
          <Text
            style={[
              styles.optionText,
              {color: option === 1 ? 'white' : 'black'},
            ]}>
            Apiary
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  graphContainer: {
    width: '84.3457%',
    marginLeft: '6.542%%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
  },
  options: {
    width: '54.9065%',
    height: '4.21166%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '5.29157%',
    flexDirection: 'row',
  },
  optionButton: {
    height: '100%',
    width: Dimensions.get('window').width * 0.549065 * 0.4723,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#EEC746',
    borderWidth: 1,
  },
  optionText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
  },
});
