import { Link, Stack } from 'expo-router'
import {View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../components/Input.jsx'
import AddExpenseButton from '../components/AddExpenseButton.jsx'

const Expense = () => {
    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
            }} />
            <Input keyboardType={'numeric'}/>
            <Input keyboardType={'default'}/>
            <Link href={'/expense_list/1'}>Item 1</Link>
            <Link href={'/expense_list/2'}>Item 2</Link>
            <Link href={'/expense_list/3'}>Item 3</Link>
            <AddExpenseButton />
        </View>
    )
}

export default Expense