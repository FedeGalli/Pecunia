import { React } from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { router } from "expo-router"

const ExpenseRenderer = ({index, amount, category, timestamp}) => {

    return(
        <View>
            <TouchableOpacity onPress={() => {
                router.push({ pathname: '/expense_list/[expenseInfo]', params: { index: index, amount: amount, category: category, timestamp: timestamp }})
            }}>
                <Text style={{fontSize: 16}}>{index} {amount} {category}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ExpenseRenderer