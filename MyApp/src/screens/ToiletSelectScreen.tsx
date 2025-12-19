import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ToiletAPI } from '../api/toilet';

const ToiletSelectScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const params = route.params || {};
  const floor = params.floor;
  const floorId = params.id;
  const [bathrooms, setBathroomList] = useState<any[]>([]);
  useEffect(() => {
    async function bathRoomSet() {
      const bathroomList = await ToiletAPI.fetchBathroomByFloor(floorId);

      setBathroomList(bathroomList);
    }
    if (floorId) {
      bathRoomSet();
    }
  }, [floorId]);
  return (
    <View>
      <Text>성별을 선택하세요</Text>
      {bathrooms.map(bathroom => (
        <Button
          title={bathroom.name}
          key={bathroom.id}
          onPress={() => {
            navigation.navigate('ToiletStatus', {
              floor,
              id: bathroom.id,
              gender: bathroom.gender,
            });
          }}
        />
      ))}
    </View>
  );
};

export default ToiletSelectScreen;
