import { View, Text } from "react-native"
import { Stack } from "expo-router"
import SubmitButton from '../components/SubmitButton.jsx'
import { React, useState } from "react"
import { TextInput, StyleSheet } from "react-native"
import * as SecureStore from 'expo-secure-store';


async function getNumberOfItems() {
    console.log(await this.getAllData())
    let result = await SecureStore.getItemAsync('1')
    return result
  }


const AddExpensePage = () => {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')

    return(
        <View>
            <Stack.Screen options={{
                headerTitle: `New Expense`
            }}/>
            <TextInput 
                style={styles.input}
                onChangeText={setAmount}
                value={amount.toString()}
                keyboardType={'numeric'}
                placeholder={'amount'}
            />
            <TextInput 
                style={styles.input}
                onChangeText={setCategory}
                value={category.toString()}
                keyboardType={'default'}
                placeholder={'category'}
            />
            <SubmitButton amount={amount} category={category}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
})

export default AddExpensePage