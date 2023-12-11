import { View } from "react-native"
import { Stack } from "expo-router"
import SubmitButton from '../components/SubmitButton.jsx'
import { React, useState } from "react"
import { TextInput, StyleSheet } from "react-native"

const AddIncomePage = () => {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')

    return(
        <View>
            <Stack.Screen options={{
                headerTitle: 'New Income'
            }}/>
            <TextInput 
                style={styles.input}
                onChangeText={setAmount}
                value={amount.toString()}
                keyboardType={'numeric'}
                placeholder={'Amount'}
            />
            <TextInput 
                style={styles.input}
                onChangeText={setCategory}
                value={category.toString()}
                keyboardType={'default'}
                placeholder={'Category'}
            />
            <SubmitButton amount={amount} category={category} redirectType={'income'}/>
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

export default AddIncomePage