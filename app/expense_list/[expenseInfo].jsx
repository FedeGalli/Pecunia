import { Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

async function removeExpense(index) {
    maxLen = await SecureStore.getItemAsync('e0')

    await SecureStore.deleteItemAsync('e' + index.toString())

    if (index === maxLen) {
        for (i = maxLen - 1; i >= 0 ; i--) {
            if (i === 0) {
                await SecureStore.deleteItemAsync('e0')
            }

            const item = await SecureStore.getItemAsync('e' + i.toString())
            if (item) {
                await SecureStore.setItemAsync('e0', i.toString())
                break
            }
        }
    }
}

const ExpenseInfo = () => {
    const {index} = useLocalSearchParams()
    const {amount} = useLocalSearchParams()
    const {category} = useLocalSearchParams()
    const {timestamp} = useLocalSearchParams()

    return (
        <View>
            <Stack.Screen options={{
                headerTitle: `Expense detail ${index}`
            }} />
            <Text>{index} {amount} {category} {timestamp}</Text>
            <TouchableOpacity onPress={async () => {
                await removeExpense(index)
                alert('item deleted')
                router.back()
            }}>
                <Text>Remove item</Text>

            </TouchableOpacity>
        </View>
    )
}

export default ExpenseInfo