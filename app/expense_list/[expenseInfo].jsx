import { Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'


const ExpenseInfo = () => {
    const {id} = useLocalSearchParams()

    return (
        <View>
            <Stack.Screen options={{
                headerTitle: `Detail ${id}`
            }} />
            <Text>Ciao {id}</Text>
        </View>
    )
}

export default ExpenseInfo