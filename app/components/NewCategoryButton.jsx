import { React, useState } from "react"
import { Link } from "expo-router";
import { TextInput, StyleSheet} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import {AntDesign} from '@expo/vector-icons';

const NewCategoryButton = ({redirectType, onPress}) => {
    href = ''
    if (redirectType === 'expense') {
        href = '/expense_list/NewCategoryExpensePage'
    } else if (redirectType === 'income') {
        href = '/income_list/NewCategoryIncomePage'
    }
    return(
        <Link href={href} asChild>
            <TouchableOpacity onPress={ () => {
                onPress()
            }}>
                <AntDesign name="plus" size={50} color="black" />
            </TouchableOpacity>
        </Link>
    )
}


export default NewCategoryButton