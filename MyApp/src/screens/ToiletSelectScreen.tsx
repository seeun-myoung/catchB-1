import { View, Text, Button } from 'react-native'
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';


const ToiletSelectScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const params = route.params || {};
  const floor  = params.floor;
  return (
    <View>
      <Text>성별을 선택하세요</Text>
      <Button title='여자' onPress={() => {
        navigation.navigate('ToiletStatus',{floor, gender: 'female'});
      }}/>
      <Button title='남자' onPress={() => {
        navigation.navigate('ToiletStatus',{floor, gender: 'male'});
      }}/>
    </View>
  )
}

export default ToiletSelectScreen