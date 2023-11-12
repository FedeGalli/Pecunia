import { React, useState } from "react"
import { Link } from "expo-router";
import { TextInput, StyleSheet} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import {AntDesign} from '@expo/vector-icons';

const AddExpenseButton = () => {
    return(
        <Link href={'/expense_list/AddExpensePage'} asChild>
            <TouchableOpacity style={styles.button}>
                <AntDesign name="plus" size={50} color="black" style={styles.icon}/>
            </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 80,
        marginTop: 400,
        marginLeft: 300,
        marginRight: 30,
        alignSelf: 'left',
        borderWidth: 0.4,
        backgroundColor: '#82C09A',
        borderRadius: 40,
        alignItem: 'center'
    },
    icon: {
        margin: 14
    }
})


export default AddExpenseButton