import React, {useCallback} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Dashboard: React.FC = () => {
  const signOut = useCallback(() => {
    async function sign() {
      await AsyncStorage.clear();
      console.log('desloguei');
    }

    sign();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={signOut}
        style={{width: 150, backgroundColor: '#fff'}}>
        <Text style={{fontSize: 20}}>Deslogar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
