import { Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

async function removeExpense(index) {
    index = await SecureStore.getItemAsync('0')
    //think about the index, do i really need that correspond to the expense array length? Do i just need the MAX ? 
    //Think about because is causing a null array and exploding the app
    await SecureStore.setItemAsync('0',(parseInt(index) - 1).toString())
    await SecureStore.deleteItemAsync(index.toString())
}

const ExpenseInfo = () => {
    const {index} = useLocalSearchParams()
    const {amount} = useLocalSearchParams()
    const {category} = useLocalSearchParams()

    return (
        <View>
            <Stack.Screen options={{
                headerTitle: `Expense detail ${index}`
            }} />
            <Text>{index} {amount} {category}</Text>
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