import React, {useEffect} from 'react';

export default function BackHome({navigation}) {
  useEffect(() => {
    // Navigate back home
    navigation.navigate('HomeBottomTabs');
  }, []);
  return null;
}
