import {LineChart} from 'react-native-chart-kit';
import React from 'react';
import { View, Dimensions } from 'react-native'
export default function HiveGraph(props) {
    return (
      <View>
        <LineChart
          data={props.data}
          width={Dimensions.get('window').width * 0.843} // from react-native
          height={400}
          chartConfig={{
            backgroundColor: '#F09819',
            backgroundGradientFrom: '#F09819',
            backgroundGradientTo: '#EDDE5D',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
}
