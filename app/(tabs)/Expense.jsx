import { Link, Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddExpenseButton from '../components/AddExpenseButton.jsx'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'

const Expense = () => {
    const { expense } = useLocalSearchParams();

    useEffect(() => {
        if (expense) {
          console.log(expense)
        }
      }, [expense]);

    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
            }} />
            <Text>{expense}</Text>
            <Link href={'/expense_list/1'}>Ciao</Link>
            <AddExpenseButton />
        </View>
    )
}

export default Expense