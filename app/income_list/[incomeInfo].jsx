import { Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

async function removeIncome(index) {
    maxLen = await SecureStore.getItemAsync('i0')

    await SecureStore.deleteItemAsync('i' + index.toString())

    if (index === maxLen) {
        for (i = maxLen - 1; i >= 0 ; i--) {
            if (i === 0) {
                await SecureStore.deleteItemAsync('i0')
            }

            const item = await SecureStore.getItemAsync('i' + i.toString())
            if (item) {
                console.log(item)
                await SecureStore.setItemAsync('i0', i.toString())
                break
            }
        }
    }
}

const IncomeInfo = () => {
    const {index} = useLocalSearchParams()
    const {amount} = useLocalSearchParams()
    const {category} = useLocalSearchParams()
    const {timestamp} = useLocalSearchParams()

    return (
        <View>
            <Stack.Screen options={{
                headerTitle: `Income detail ${index}`
            }} />
            <Text>{index} {amount} {category} {timestamp}</Text>
            <TouchableOpacity onPress={async () => {
                await removeIncome(index)
                alert('item deleted')
                router.back()
            }}>
                <Text>Remove item</Text>

            </TouchableOpacity>
        </View>
    )
}

export default IncomeInfo