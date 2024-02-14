import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet'

const SwitchSelector = ({ setSelectedCategory }: any) => {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setSelectedCategory(isEnabled ? 'e' : 'i')
    setIsEnabled(!isEnabled)
  };

  return (
    <View style={{ flexDirection: 'row', paddingTop: 30 }}>
      <Text>Expense     </Text>
      <Switch
        trackColor={{ false: '#e83535', true: '#4ede2a' }}
        thumbColor={'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
      />
      <Text>     Income</Text>
    </View>
  )
};

export default SwitchSelector;