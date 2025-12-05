import React from 'react'
import {NavigationContainer  } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack';

import FloorSelectScreen  from './src/screens/FloorSelectScreen';
import ToiletSelectScreen from './src/screens/ToiletSelectScreen';
import ToiletStatusScreen from './src/screens/ToiletStatusScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>           
      <Stack.Navigator  initialRouteName="FloorSelect">
         {/* 1️⃣ 층 선택 화면 */}
        <Stack.Screen
          name="FloorSelect" // navigation.navigate('FloorSelect') 에서 쓰는 이름
          component={FloorSelectScreen} // 실제 화면 컴포넌트
          options={{ title: '화장실 층 선택' }} // 상단 타이틀 고정
        />

        {/* 2️⃣ 남/여 선택 화면 */}
        <Stack.Screen
          name="ToiletSelect"
          component={ToiletSelectScreen}
          // 🔥 options를 함수로 쓰면 route에 접근할 수 있음
          // FloorSelectScreen에서 navigate('ToiletSelect', { floor }) 로 넘긴 값 사용
          options={({ route }: any) => ({
            title: `${route.params?.floor ?? ''}층 남/여 선택`,
          })}
        />

        {/* 3️⃣ 칸 상태 화면 */}
        <Stack.Screen
          name="ToiletStatus"
          component={ToiletStatusScreen}
          // ToiletSelectScreen에서 navigate('ToiletStatus', { floor, gender }) 로 넘긴 값 사용
          options={({ route }: any) => {
            const floor = route.params?.floor;
            const gender = route.params?.gender;

            // 🔥 gender 값에 따라 남/여 텍스트 분기
            const genderLabel =
              gender === 'male' ? '남자' : gender === 'female' ? '여자' : '';

            return {
              title: `${floor ?? ''}층 ${genderLabel} 화장실`,
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App